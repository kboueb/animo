-- ANIMO : schéma Supabase
-- À exécuter une seule fois (Supabase > SQL Editor > New query > Run, ou tout autre client SQL).
-- Tout est regroupé dans un seul bloc DO : certains clients (extensions VS Code, DBeaver…) envoient
-- le script comme une « requête préparée », qui refuse plusieurs commandes à la suite.
-- Le script peut être relancé sans risque (il ne recrée pas ce qui existe déjà, ne supprime aucune donnée).
--
-- Chaque ligne de la table = un anime de la liste d'un utilisateur. L'objet complet est stocké en JSON
-- (colonne data), ce qui permet de faire évoluer l'app sans migration de colonnes.

do $setup$
begin
  create table if not exists public.animes (
    id          uuid primary key,
    user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
    data        jsonb not null,
    deleted     boolean not null default false,       -- suppression synchronisée (« pierre tombale »)
    modified_at timestamptz not null,                  -- heure de la modification sur l'appareil (le plus récent gagne)
    updated_at  timestamptz not null default now()     -- heure serveur, pour ne récupérer que les nouveautés
  );

  create index if not exists animes_user_updated_idx on public.animes (user_id, updated_at);

  -- Sécurité : chacun ne voit et ne modifie que ses propres lignes
  alter table public.animes enable row level security;

  drop policy if exists "animes_select_own" on public.animes;
  drop policy if exists "animes_insert_own" on public.animes;
  drop policy if exists "animes_update_own" on public.animes;
  drop policy if exists "animes_delete_own" on public.animes;

  create policy "animes_select_own" on public.animes for select to authenticated
    using (user_id = auth.uid());
  create policy "animes_insert_own" on public.animes for insert to authenticated
    with check (user_id = auth.uid());
  create policy "animes_update_own" on public.animes for update to authenticated
    using (user_id = auth.uid()) with check (user_id = auth.uid());
  create policy "animes_delete_own" on public.animes for delete to authenticated
    using (user_id = auth.uid());

  -- Envoi groupé avec la règle « la modification la plus récente gagne » :
  -- une ligne n'est écrasée que si la version envoyée est plus récente que celle du serveur.
  create or replace function public.sync_animes(rows jsonb)
  returns void
  language sql
  security invoker
  set search_path = public
  as $body$
    insert into public.animes (id, user_id, data, deleted, modified_at, updated_at)
    select (r ->> 'id')::uuid,
           auth.uid(),
           r -> 'data',
           coalesce((r ->> 'deleted')::boolean, false),
           (r ->> 'modified_at')::timestamptz,
           now()
    from jsonb_array_elements(rows) as r
    on conflict (id) do update
      set data = excluded.data,
          deleted = excluded.deleted,
          modified_at = excluded.modified_at,
          updated_at = now()
      where public.animes.modified_at < excluded.modified_at
        and public.animes.user_id = auth.uid();
  $body$;

  revoke all on function public.sync_animes(jsonb) from public, anon;
  grant execute on function public.sync_animes(jsonb) to authenticated;
end
$setup$;
