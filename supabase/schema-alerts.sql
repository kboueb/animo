-- ANIMO : alertes de sortie + abonnements aux notifications push
-- À exécuter une seule fois APRÈS schema.sql (Supabase > SQL Editor > New query > Run).
-- Un seul bloc DO (compatible avec tous les clients SQL) ; relançable sans risque.

do $setup$
begin
  -- Appareils abonnés aux notifications push
  create table if not exists public.push_subscriptions (
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
    endpoint   text not null unique,
    p256dh     text not null,
    auth       text not null,
    user_agent text,
    created_at timestamptz not null default now()
  );
  create index if not exists push_subscriptions_user_idx on public.push_subscriptions (user_id);
  alter table public.push_subscriptions enable row level security;

  drop policy if exists "push_select_own" on public.push_subscriptions;
  drop policy if exists "push_insert_own" on public.push_subscriptions;
  drop policy if exists "push_update_own" on public.push_subscriptions;
  drop policy if exists "push_delete_own" on public.push_subscriptions;
  create policy "push_select_own" on public.push_subscriptions for select to authenticated using (user_id = auth.uid());
  create policy "push_insert_own" on public.push_subscriptions for insert to authenticated with check (user_id = auth.uid());
  create policy "push_update_own" on public.push_subscriptions for update to authenticated
    using (user_id = auth.uid()) with check (user_id = auth.uid());
  create policy "push_delete_own" on public.push_subscriptions for delete to authenticated using (user_id = auth.uid());

  -- Alertes (créées par l'app ou par la tâche quotidienne). « key » évite les doublons :
  -- une même sortie n'est signalée qu'une fois par utilisateur.
  create table if not exists public.alerts (
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
    key        text not null,
    kind       text not null check (kind in ('released', 'announced')),
    anime_id   uuid,
    title      text not null,
    body       text not null default '',
    url        text,
    created_at timestamptz not null default now(),
    read_at    timestamptz,
    unique (user_id, key)
  );
  create index if not exists alerts_user_created_idx on public.alerts (user_id, created_at desc);
  alter table public.alerts enable row level security;

  drop policy if exists "alerts_select_own" on public.alerts;
  drop policy if exists "alerts_insert_own" on public.alerts;
  drop policy if exists "alerts_update_own" on public.alerts;
  drop policy if exists "alerts_delete_own" on public.alerts;
  create policy "alerts_select_own" on public.alerts for select to authenticated using (user_id = auth.uid());
  create policy "alerts_insert_own" on public.alerts for insert to authenticated with check (user_id = auth.uid());
  create policy "alerts_update_own" on public.alerts for update to authenticated
    using (user_id = auth.uid()) with check (user_id = auth.uid());
  create policy "alerts_delete_own" on public.alerts for delete to authenticated using (user_id = auth.uid());
end
$setup$;
