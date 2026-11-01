// Liste « Animes saison 2 ne pas oublier » (note du 21 juillet 2026), résolue sur AniList le 1er novembre 2026.
// - status "waiting" : une suite est sortie, en diffusion ou annoncée (détail dans news)
// - status "watched" : aucune suite connue pour l'instant
// Proposée une fois par appareil via <SeedBanner />. Les anime déjà présents sont ignorés.
import type { Anime } from '../types'

export const SEED_NAME = 'Animes saison 2'
export const SEED_KEY = 'animo.seed.saison2'

export const SEED_LIST: Omit<Anime, 'id' | 'addedAt' | 'updatedAt' | 'rating' | 'notes'>[] = [
  {
    "anilistId": 144553,
    "malId": 50932,
    "title": "Saikyou Onmyouji no Isekai Tenseiki",
    "titleAlt": "The Reincarnation of the Strongest Exorcist in Another World",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx144553-Q5M7iNLHMuCl.jpg",
    "type": "TV",
    "episodes": 13,
    "year": 2023,
    "url": "https://anilist.co/anime/144553",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 129898,
    "malId": 47790,
    "title": "Sekai Saikou no Ansatsusha, Isekai Kizoku ni Tensei suru",
    "titleAlt": "The World's Finest Assassin Gets Reincarnated in Another World as an Aristocrat",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx129898-FRUzDtPhRigt.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2021,
    "url": "https://anilist.co/anime/129898",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 169579,
          "title": "Sekai Saikou no Ansatsusha, Isekai Kizoku ni Tensei suru 2nd Season",
          "status": "NOT_YET_RELEASED",
          "date": "janv. 2027",
          "url": "https://anilist.co/anime/169579"
        }
      ]
    }
  },
  {
    "anilistId": 151801,
    "malId": 52211,
    "title": "MASHLE",
    "titleAlt": "MASHLE: MAGIC AND MUSCLES",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151801-XxVf22Le6C8o.png",
    "type": "TV",
    "episodes": 12,
    "year": 2023,
    "url": "https://anilist.co/anime/151801",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 166610,
          "title": "MASHLE: MAGIC AND MUSCLES Season 2",
          "status": "FINISHED",
          "date": "6 janv. 2024",
          "url": "https://anilist.co/anime/166610"
        },
        {
          "id": 177704,
          "title": "MASHLE: MAGIC AND MUSCLES The Tri-Magicathlon Divine Visionary Final Exam Arc",
          "status": "NOT_YET_RELEASED",
          "date": "janv. 2027",
          "url": "https://anilist.co/anime/177704"
        }
      ]
    }
  },
  {
    "anilistId": 128893,
    "malId": 46569,
    "title": "Jigokuraku",
    "titleAlt": "Hell’s Paradise",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx128893-Gc2t8b8M0mVu.jpg",
    "type": "TV",
    "episodes": 13,
    "year": 2023,
    "url": "https://anilist.co/anime/128893",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 166613,
          "title": "Hell’s Paradise Season 2",
          "status": "FINISHED",
          "date": "11 janv. 2026",
          "url": "https://anilist.co/anime/166613"
        }
      ]
    }
  },
  {
    "anilistId": 151847,
    "malId": 52308,
    "title": "Kanojo ga Koushaku-tei ni Itta Riyuu",
    "titleAlt": "Why Raeliana Ended Up at the Duke’s Mansion",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151847-OnTYbvb4y4mp.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2023,
    "url": "https://anilist.co/anime/151847",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 162983,
    "malId": 54790,
    "title": "Undead Girl Murder Farce",
    "titleAlt": "Undead Murder Farce",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx162983-T3nZyk6sUlEj.jpg",
    "type": "TV",
    "episodes": 13,
    "year": 2023,
    "url": "https://anilist.co/anime/162983",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 157198,
    "malId": 53613,
    "title": "Dead Mount Death Play",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx157198-LVZ7PgxWwc6v.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2023,
    "url": "https://anilist.co/anime/157198",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 162803,
          "title": "Dead Mount Death Play Part 2",
          "status": "FINISHED",
          "date": "10 oct. 2023",
          "url": "https://anilist.co/anime/162803"
        }
      ]
    }
  },
  {
    "anilistId": 154116,
    "malId": 52741,
    "title": "Undead Unluck",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx154116-3ydDI9hhvPgw.png",
    "type": "TV",
    "episodes": 24,
    "year": 2023,
    "url": "https://anilist.co/anime/154116",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 179930,
          "title": "Undead Unluck: Winter Arc",
          "status": "FINISHED",
          "date": "26 déc. 2025",
          "url": "https://anilist.co/anime/179930"
        },
        {
          "id": 204604,
          "title": "Undead Unluck 2nd Season",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/204604"
        }
      ]
    }
  },
  {
    "anilistId": 21613,
    "malId": 32615,
    "title": "Youjo Senki",
    "titleAlt": "Saga of Tanya the Evil",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21613-qT3NiwYP5dYc.png",
    "type": "TV",
    "episodes": 12,
    "year": 2017,
    "url": "https://anilist.co/anime/21613",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 100878,
          "title": "Saga of Tanya the Evil - the Movie -",
          "status": "FINISHED",
          "date": "8 févr. 2019",
          "url": "https://anilist.co/anime/100878"
        },
        {
          "id": 135865,
          "title": "Saga of Tanya the Evil Season 2",
          "status": "FINISHED",
          "date": "8 juil. 2026",
          "url": "https://anilist.co/anime/135865"
        }
      ]
    }
  },
  {
    "anilistId": 130298,
    "malId": 48316,
    "title": "Kage no Jitsuryokusha ni Naritakute!",
    "titleAlt": "The Eminence in Shadow",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx130298-YMdcKHytpWNH.jpg",
    "type": "TV",
    "episodes": 20,
    "year": 2022,
    "url": "https://anilist.co/anime/130298",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 161964,
          "title": "The Eminence in Shadow Season 2",
          "status": "FINISHED",
          "date": "4 oct. 2023",
          "url": "https://anilist.co/anime/161964"
        },
        {
          "id": 171952,
          "title": "Kage no Jitsuryokusha ni Naritakute!: Zankyou-hen",
          "status": "NOT_YET_RELEASED",
          "date": "2027",
          "url": "https://anilist.co/anime/171952"
        }
      ]
    }
  },
  {
    "anilistId": 161645,
    "malId": 54492,
    "title": "Kusuriya no Hitorigoto",
    "titleAlt": "The Apothecary Diaries",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx161645-QLbzHXiYRgV2.jpg",
    "type": "TV",
    "episodes": 24,
    "year": 2023,
    "url": "https://anilist.co/anime/161645",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 176301,
          "title": "The Apothecary Diaries Season 2",
          "status": "FINISHED",
          "date": "10 janv. 2025",
          "url": "https://anilist.co/anime/176301"
        },
        {
          "id": 195516,
          "title": "The Apothecary Diaries Season 3",
          "status": "RELEASING",
          "date": "2 oct. 2026",
          "nextEpisode": {
            "episode": 6,
            "airingAt": 1793973600
          },
          "url": "https://anilist.co/anime/195516"
        },
        {
          "id": 200927,
          "title": "Kusuriya no Hitorigoto 3rd Season Part 2",
          "status": "NOT_YET_RELEASED",
          "date": "avr. 2027",
          "url": "https://anilist.co/anime/200927"
        }
      ]
    }
  },
  {
    "anilistId": 98659,
    "malId": 35507,
    "title": "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e",
    "titleAlt": "Classroom of the Elite",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx98659-WNyPLIZDpGGY.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2017,
    "url": "https://anilist.co/anime/98659",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 145545,
          "title": "Classroom of the Elite Season 2",
          "status": "FINISHED",
          "date": "4 juil. 2022",
          "url": "https://anilist.co/anime/145545"
        },
        {
          "id": 146066,
          "title": "Classroom of the Elite Season 3",
          "status": "FINISHED",
          "date": "3 janv. 2024",
          "url": "https://anilist.co/anime/146066"
        },
        {
          "id": 180745,
          "title": "Classroom of the Elite 4th Season: Second Year, First Semester",
          "status": "FINISHED",
          "date": "1 avr. 2026",
          "url": "https://anilist.co/anime/180745"
        },
        {
          "id": 213477,
          "title": "Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 5th Season",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/213477"
        }
      ]
    }
  },
  {
    "anilistId": 127230,
    "malId": 44511,
    "title": "Chainsaw Man",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx127230-DdP4vAdssLoz.png",
    "type": "TV",
    "episodes": 12,
    "year": 2022,
    "url": "https://anilist.co/anime/127230",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 171627,
          "title": "Chainsaw Man – The Movie: Reze Arc",
          "status": "FINISHED",
          "date": "19 sept. 2025",
          "url": "https://anilist.co/anime/171627"
        },
        {
          "id": 204429,
          "title": "Chainsaw Man: Shikaku-hen",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/204429"
        }
      ]
    }
  },
  {
    "anilistId": 131646,
    "malId": 48580,
    "title": "Vanitas no Carte",
    "titleAlt": "The Case Study of Vanitas",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx131646-cuyGfKcekZ62.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2021,
    "url": "https://anilist.co/anime/131646",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 135136,
          "title": "The Case Study of Vanitas Part 2",
          "status": "FINISHED",
          "date": "15 janv. 2022",
          "url": "https://anilist.co/anime/135136"
        }
      ]
    }
  },
  {
    "anilistId": 153818,
    "malId": 52816,
    "title": "Majo to Yajuu",
    "titleAlt": "The Witch and the Beast",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153818-FWvl0RL6vDbq.png",
    "type": "TV",
    "episodes": 12,
    "year": 2024,
    "url": "https://anilist.co/anime/153818",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 9919,
    "malId": 9919,
    "title": "Ao no Exorcist",
    "titleAlt": "Blue Exorcist",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx9919-nXS7JOZrWHfS.jpg",
    "type": "TV",
    "episodes": 25,
    "year": 2011,
    "url": "https://anilist.co/anime/9919",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 21861,
          "title": "Blue Exorcist: Kyoto Saga",
          "status": "FINISHED",
          "date": "7 janv. 2017",
          "url": "https://anilist.co/anime/21861"
        },
        {
          "id": 158931,
          "title": "Blue Exorcist -Shimane Illuminati Saga-",
          "status": "FINISHED",
          "date": "7 janv. 2024",
          "url": "https://anilist.co/anime/158931"
        },
        {
          "id": 176311,
          "title": "Blue Exorcist -Beyond the Snow Saga-",
          "status": "FINISHED",
          "date": "6 oct. 2024",
          "url": "https://anilist.co/anime/176311"
        },
        {
          "id": 185880,
          "title": "Blue Exorcist -The Blue Night Saga-",
          "status": "FINISHED",
          "date": "5 janv. 2025",
          "url": "https://anilist.co/anime/185880"
        }
      ]
    }
  },
  {
    "anilistId": 146493,
    "malId": 51297,
    "title": "Ragna Crimson",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx146493-bThyDJ4ZmbfV.jpg",
    "type": "TV",
    "episodes": 24,
    "year": 2023,
    "url": "https://anilist.co/anime/146493",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 151639,
    "malId": 56285,
    "title": "Ninja Kamui",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151639-7KqJ7BgaM9Mx.png",
    "type": "TV",
    "episodes": 13,
    "year": 2024,
    "url": "https://anilist.co/anime/151639",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 194453,
          "title": "Ninja Kamui: Red Vendetta",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/194453"
        },
        {
          "id": 194456,
          "title": "Ninja Kamui Season 3",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/194456"
        }
      ]
    }
  },
  {
    "anilistId": 148862,
    "malId": 51794,
    "title": "Nanatsu no Taizai: Mokushiroku no Yonkishi",
    "titleAlt": "The Seven Deadly Sins: Four Knights of the Apocalypse",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx148862-ctw1sn45I4ZX.png",
    "type": "TV",
    "episodes": 24,
    "year": 2023,
    "url": "https://anilist.co/anime/148862",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 176292,
          "title": "The Seven Deadly Sins: Four Knights of the Apocalypse Season 2",
          "status": "FINISHED",
          "date": "6 oct. 2024",
          "url": "https://anilist.co/anime/176292"
        }
      ]
    }
  },
  {
    "anilistId": 151807,
    "malId": 52299,
    "title": "Ore dake Level Up na Ken",
    "titleAlt": "Solo Leveling",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx151807-it355ZgzquUd.png",
    "type": "TV",
    "episodes": 12,
    "year": 2024,
    "url": "https://anilist.co/anime/151807",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 176496,
          "title": "Solo Leveling Season 2 -Arise from the Shadow-",
          "status": "FINISHED",
          "date": "5 janv. 2025",
          "url": "https://anilist.co/anime/176496"
        },
        {
          "id": 213846,
          "title": "Solo Leveling: Beyond the System",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/213846"
        }
      ]
    }
  },
  {
    "anilistId": 161476,
    "malId": 54449,
    "title": "Ishura",
    "titleAlt": "ISHURA",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx161476-ukTxAPHib1Fg.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2024,
    "url": "https://anilist.co/anime/161476",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 176234,
          "title": "ISHURA Season 2",
          "status": "FINISHED",
          "date": "8 janv. 2025",
          "url": "https://anilist.co/anime/176234"
        }
      ]
    }
  },
  {
    "anilistId": 115230,
    "malId": 40221,
    "title": "Kami no Tou: Tower of God",
    "titleAlt": "Tower of God",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx115230-QHOdSN7yt8ab.jpg",
    "type": "TV",
    "episodes": 13,
    "year": 2020,
    "url": "https://anilist.co/anime/115230",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 153406,
          "title": "Tower of God Season 2",
          "status": "FINISHED",
          "date": "7 juil. 2024",
          "url": "https://anilist.co/anime/153406"
        }
      ]
    }
  },
  {
    "anilistId": 108465,
    "malId": 39535,
    "title": "Mushoku Tensei: Isekai Ittara Honki Dasu",
    "titleAlt": "Mushoku Tensei: Jobless Reincarnation",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108465-1ANspF1EWyFx.jpg",
    "type": "TV",
    "episodes": 11,
    "year": 2021,
    "url": "https://anilist.co/anime/108465",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 127720,
          "title": "Mushoku Tensei: Jobless Reincarnation Cour 2",
          "status": "FINISHED",
          "date": "4 oct. 2021",
          "url": "https://anilist.co/anime/127720"
        },
        {
          "id": 146065,
          "title": "Mushoku Tensei: Jobless Reincarnation Season 2",
          "status": "FINISHED",
          "date": "3 juil. 2023",
          "url": "https://anilist.co/anime/146065"
        },
        {
          "id": 166873,
          "title": "Mushoku Tensei: Jobless Reincarnation Season 2 Part 2",
          "status": "FINISHED",
          "date": "8 avr. 2024",
          "url": "https://anilist.co/anime/166873"
        },
        {
          "id": 178789,
          "title": "Mushoku Tensei: Jobless Reincarnation Season 3",
          "status": "FINISHED",
          "date": "4 juil. 2026",
          "url": "https://anilist.co/anime/178789"
        },
        {
          "id": 217434,
          "title": "Mushoku Tensei III: Isekai Ittara Honki Dasu Part 2",
          "status": "NOT_YET_RELEASED",
          "date": "2027",
          "url": "https://anilist.co/anime/217434"
        }
      ]
    }
  },
  {
    "anilistId": 153288,
    "malId": 52588,
    "title": "Kaijuu 8-gou",
    "titleAlt": "Kaiju No. 8",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx153288-25FBfFJzEQ5O.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2024,
    "url": "https://anilist.co/anime/153288",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 178754,
          "title": "Kaiju No. 8 Season 2",
          "status": "FINISHED",
          "date": "19 juil. 2025",
          "url": "https://anilist.co/anime/178754"
        },
        {
          "id": 204362,
          "title": "Kaijuu 8-gou: Kanketsu-hen",
          "status": "NOT_YET_RELEASED",
          "date": "2027",
          "url": "https://anilist.co/anime/204362"
        }
      ]
    }
  },
  {
    "anilistId": 122511,
    "malId": 44408,
    "title": "Long Zu",
    "titleAlt": "Dragon Raja -The Blazing Dawn-",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx122511-h6FpxJGfKx3I.jpg",
    "type": "ONA",
    "episodes": 17,
    "year": 2022,
    "url": "https://anilist.co/anime/122511",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 157692,
          "title": "Dragon Raja II -The Mourner's Eyes-",
          "status": "FINISHED",
          "date": "18 juil. 2025",
          "url": "https://anilist.co/anime/157692"
        },
        {
          "id": 205375,
          "title": "Long Zu 3",
          "status": "NOT_YET_RELEASED",
          "date": "2028",
          "url": "https://anilist.co/anime/205375"
        }
      ]
    }
  },
  {
    "anilistId": 156415,
    "malId": 53516,
    "title": "Tensei Shitara Dai Nana Ouji Datta node, Kimamani Majutsu wo Kiwamemasu",
    "titleAlt": "I Was Reincarnated as the 7th Prince so I Can Take My Time Perfecting My Magical Ability",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx156415-zwP9deA786S1.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2024,
    "url": "https://anilist.co/anime/156415",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 178090,
          "title": "I Was Reincarnated as the 7th Prince so I Can Take My Time Perfecting My Magical Ability Season 2",
          "status": "FINISHED",
          "date": "10 juil. 2025",
          "url": "https://anilist.co/anime/178090"
        }
      ]
    }
  },
  {
    "anilistId": 170503,
    "malId": 56980,
    "title": "Karasu wa Aruji wo Erabanai",
    "titleAlt": "YATAGARASU: The Raven Does Not Choose Its Master",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx170503-PCr24JL8F8f9.jpg",
    "type": "TV",
    "episodes": 20,
    "year": 2024,
    "url": "https://anilist.co/anime/170503",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 164299,
    "malId": 55150,
    "title": "Yarinaoshi Reijou wa Ryuutei Heika wo Kouryaku-chuu",
    "titleAlt": "The Do-Over Damsel Conquers the Dragon Emperor",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx164299-j4yHiK4j1ON7.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2024,
    "url": "https://anilist.co/anime/164299",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 177104,
    "malId": 58714,
    "title": "Saikyou no Shien-shoku [Wajutsushi] Dearu Ore wa Sekai Saikyou Clan wo Shitagaeru",
    "titleAlt": "The Most Notorious \"Talker\" Runs the World's Greatest Clan",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx177104-8fQUQdXGZG8j.jpg",
    "type": "ONA",
    "episodes": 12,
    "year": 2024,
    "url": "https://anilist.co/anime/177104",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 108353,
    "malId": 39489,
    "title": "SPRIGGAN (ONA)",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx108353-f43dOeHJ84r4.jpg",
    "type": "ONA",
    "episodes": 6,
    "year": 2022,
    "url": "https://anilist.co/anime/108353",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 177709,
    "malId": 58939,
    "title": "SAKAMOTO DAYS",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx177709-e5Qx6RlsBgD5.png",
    "type": "ONA",
    "episodes": 11,
    "year": 2025,
    "url": "https://anilist.co/anime/177709",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 184237,
          "title": "SAKAMOTO DAYS Part 2",
          "status": "FINISHED",
          "date": "15 juil. 2025",
          "url": "https://anilist.co/anime/184237"
        },
        {
          "id": 204363,
          "title": "SAKAMOTO DAYS Season 2",
          "status": "NOT_YET_RELEASED",
          "date": "janv. 2027",
          "url": "https://anilist.co/anime/204363"
        }
      ]
    }
  },
  {
    "anilistId": 178025,
    "malId": 59062,
    "title": "Gachiakuta",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx178025-cWJKEsZynkil.jpg",
    "type": "TV",
    "episodes": 24,
    "year": 2025,
    "url": "https://anilist.co/anime/178025",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 204436,
          "title": "Gachiakuta Season 2",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/204436"
        }
      ]
    }
  },
  {
    "anilistId": 137667,
    "malId": 49818,
    "title": "Guimi Zhi Zhu: Xiaochou Pian",
    "titleAlt": "Lord of Mysteries",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx137667-xQxzQRAerw53.jpg",
    "type": "ONA",
    "episodes": 13,
    "year": 2025,
    "url": "https://anilist.co/anime/137667",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 206874,
          "title": "Guimi Zhi Zhu: Wu Mian Ren Pian",
          "status": "NOT_YET_RELEASED",
          "date": "2027",
          "url": "https://anilist.co/anime/206874"
        }
      ]
    }
  },
  {
    "anilistId": 177474,
    "malId": 58811,
    "title": "Tougen Anki",
    "titleAlt": "TOUGEN ANKI",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx177474-oHil1yLWldfl.jpg",
    "type": "TV",
    "episodes": 24,
    "year": 2025,
    "url": "https://anilist.co/anime/177474",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 204650,
          "title": "TOUGEN ANKI: Nikko Kegon Falls Arc",
          "status": "RELEASING",
          "date": "2 oct. 2026",
          "nextEpisode": {
            "episode": 6,
            "airingAt": 1793975400
          },
          "url": "https://anilist.co/anime/204650"
        }
      ]
    }
  },
  {
    "anilistId": 179966,
    "malId": 59459,
    "title": "Silent Witch: Chinmoku no Majo no Kakushigoto",
    "titleAlt": "Secrets of the Silent Witch",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx179966-g0EU7rVe2Og7.jpg",
    "type": "TV",
    "episodes": 13,
    "year": 2025,
    "url": "https://anilist.co/anime/179966",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 192507,
    "malId": 61663,
    "title": "Uruwashi no Yoi no Tsuki",
    "titleAlt": "In the Clear Moonlit Dusk",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx192507-SCmImUlUnpAD.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2026,
    "url": "https://anilist.co/anime/192507",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 166794,
    "malId": 55866,
    "title": "Yubisaki to Renren",
    "titleAlt": "A Sign of Affection",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx166794-1MAXFMgND6qS.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2024,
    "url": "https://anilist.co/anime/166794",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 167152,
    "malId": 56009,
    "title": "Yuusha Kei ni Shosu: Choubatsu Yuusha 9004-tai Keimu Kiroku",
    "titleAlt": "Sentenced to Be a Hero",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx167152-O1pm6DWwifBD.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2026,
    "url": "https://anilist.co/anime/167152",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 209963,
          "title": "Sentenced to Be a Hero Season 2",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/209963"
        }
      ]
    }
  },
  {
    "anilistId": 178005,
    "malId": 59047,
    "title": "Tamon-kun Ima Docchi!?",
    "titleAlt": "Tamon's B-Side",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx178005-pCEReATswrup.jpg",
    "type": "ONA",
    "episodes": 13,
    "year": 2026,
    "url": "https://anilist.co/anime/178005",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 166617,
    "malId": 55830,
    "title": "Fate/strange Fake",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx166617-34fpC9y47tTx.png",
    "type": "TV",
    "episodes": 13,
    "year": 2026,
    "url": "https://anilist.co/anime/166617",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 209984,
          "title": "Fate/strange Fake (Zoku-hen)",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/209984"
        }
      ]
    }
  },
  {
    "anilistId": 113415,
    "malId": 40748,
    "title": "Jujutsu Kaisen",
    "titleAlt": "JUJUTSU KAISEN",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113415-LHBAeoZDIsnF.jpg",
    "type": "TV",
    "episodes": 24,
    "year": 2020,
    "url": "https://anilist.co/anime/113415",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 145064,
          "title": "JUJUTSU KAISEN Season 2",
          "status": "FINISHED",
          "date": "6 juil. 2023",
          "url": "https://anilist.co/anime/145064"
        },
        {
          "id": 172463,
          "title": "JUJUTSU KAISEN Season 3: The Culling Game Part 1",
          "status": "FINISHED",
          "date": "9 janv. 2026",
          "url": "https://anilist.co/anime/172463"
        },
        {
          "id": 209895,
          "title": "Jujutsu Kaisen: Shimetsu Kaiyuu - Kouhen",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/209895"
        }
      ]
    }
  },
  {
    "anilistId": 182483,
    "malId": 60028,
    "title": "Hime Kishi wa Barbaroi no Yome",
    "titleAlt": "The Warrior Princess and the Barbaric King",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx182483-La7chs6htDWr.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2026,
    "url": "https://anilist.co/anime/182483",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 195600,
    "malId": 62001,
    "title": "Yomi no Tsugai",
    "titleAlt": "Daemons of the Shadow Realm",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx195600-moI0UFArtOme.jpg",
    "type": "TV",
    "episodes": 24,
    "year": 2026,
    "url": "https://anilist.co/anime/195600",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 217013,
          "title": "Yomi no Tsugai 2nd Season",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/217013"
        }
      ]
    }
  },
  {
    "anilistId": 199547,
    "malId": 62601,
    "title": "MARRIAGETOXIN",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx199547-LAaG3cmKCGhr.jpg",
    "type": "TV",
    "episodes": 13,
    "year": 2026,
    "url": "https://anilist.co/anime/199547",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 213752,
          "title": "MARRIAGETOXIN 2nd Season",
          "status": "NOT_YET_RELEASED",
          "date": "janv. 2027",
          "url": "https://anilist.co/anime/213752"
        }
      ]
    }
  },
  {
    "anilistId": 174576,
    "malId": 58059,
    "title": "Tsue to Tsurugi no Wistoria",
    "titleAlt": "Wistoria: Wand and Sword",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx174576-tpKcHG0eO6CS.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2024,
    "url": "https://anilist.co/anime/174576",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 182300,
          "title": "Wistoria: Wand and Sword Season 2",
          "status": "FINISHED",
          "date": "12 avr. 2026",
          "url": "https://anilist.co/anime/182300"
        },
        {
          "id": 213656,
          "title": "Tsue to Tsurugi no Wistoria Season 3",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/213656"
        }
      ]
    }
  },
  {
    "anilistId": 190143,
    "malId": 61443,
    "title": "Shunkashuutou Daikousha: Haru no Mai",
    "titleAlt": "Agents of the Four Seasons: Dance of Spring",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx190143-IqqbkMAF0GOo.jpg",
    "type": "TV",
    "episodes": 14,
    "year": 2026,
    "url": "https://anilist.co/anime/190143",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 113813,
    "malId": 40839,
    "title": "Kanojo, Okarishimasu",
    "titleAlt": "Rent-a-Girlfriend",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113813-SnljeXpU3Pw7.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2020,
    "url": "https://anilist.co/anime/113813",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 124410,
          "title": "Rent-a-Girlfriend Season 2",
          "status": "FINISHED",
          "date": "2 juil. 2022",
          "url": "https://anilist.co/anime/124410"
        },
        {
          "id": 154745,
          "title": "Rent-a-Girlfriend Season 3",
          "status": "FINISHED",
          "date": "8 juil. 2023",
          "url": "https://anilist.co/anime/154745"
        },
        {
          "id": 179344,
          "title": "Rent-a-Girlfriend Season 4",
          "status": "FINISHED",
          "date": "1 juil. 2025",
          "url": "https://anilist.co/anime/179344"
        },
        {
          "id": 199029,
          "title": "Rent-a-Girlfriend Season 5",
          "status": "FINISHED",
          "date": "8 avr. 2026",
          "url": "https://anilist.co/anime/199029"
        },
        {
          "id": 213581,
          "title": "Kanojo, Okarishimasu 6th Season",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/213581"
        }
      ]
    }
  },
  {
    "anilistId": 147105,
    "malId": 51553,
    "title": "Tongari Boushi no Atelier",
    "titleAlt": "Witch Hat Atelier",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx147105-rwOX8qyUy8gV.jpg",
    "type": "ONA",
    "episodes": 13,
    "year": 2026,
    "url": "https://anilist.co/anime/147105",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 213702,
          "title": "Witch Hat Atelier Season 2",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/213702"
        }
      ]
    }
  },
  {
    "anilistId": 201817,
    "malId": 62893,
    "title": "Nigashita Sakana wa Ookikatta ga Tsuriageta Sakana ga Ookisugita Ken",
    "titleAlt": "Always a Catch!",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx201817-pyfL9F8muPeq.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2026,
    "url": "https://anilist.co/anime/201817",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  },
  {
    "anilistId": 198113,
    "malId": 62391,
    "title": "Kill Ao",
    "titleAlt": "KILL BLUE",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx198113-NRa47idWSlnx.jpg",
    "type": "TV",
    "episodes": 12,
    "year": 2026,
    "url": "https://anilist.co/anime/198113",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 213628,
          "title": "Kill Ao 2nd Season",
          "status": "NOT_YET_RELEASED",
          "url": "https://anilist.co/anime/213628"
        }
      ]
    }
  },
  {
    "anilistId": 186497,
    "malId": 60852,
    "title": "Koori no Jouheki",
    "titleAlt": "The Ramparts of Ice",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx186497-uwPrNPphXvjP.jpg",
    "type": "TV",
    "episodes": 14,
    "year": 2026,
    "url": "https://anilist.co/anime/186497",
    "status": "waiting",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": [
        {
          "id": 213805,
          "title": "The Ramparts of Ice Season 2",
          "status": "RELEASING",
          "date": "1 oct. 2026",
          "nextEpisode": {
            "episode": 6,
            "airingAt": 1793890560
          },
          "url": "https://anilist.co/anime/213805"
        }
      ]
    }
  },
  {
    "anilistId": 124080,
    "malId": 42897,
    "title": "Horimiya",
    "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx124080-3i22mRVPBS0T.jpg",
    "type": "TV",
    "episodes": 13,
    "year": 2021,
    "url": "https://anilist.co/anime/124080",
    "status": "watched",
    "news": {
      "checkedAt": "2026-11-01T12:06:36.734Z",
      "items": []
    }
  }
]
