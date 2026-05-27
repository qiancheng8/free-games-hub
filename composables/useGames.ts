import gamesData from '~/data/games.json'
import historyData from '~/data/history.json'
import steamGamesData from '~/data/steam-games.json'

export interface Game {
  id: string
  title: string
  description: string
  image: string
  originalPrice: string
  startDate: string
  endDate: string
  slug: string
  url: string
  isCurrent: boolean
  seller: string
  fetchedAt: string
  platform?: 'Epic' | 'Steam'
}

export interface HistoryGame {
  id: string
  title: string
  image: string
  originalPrice: string
  startDate: string
  endDate: string
  slug: string
  url: string
}

export const useGames = () => {
  const epicGames = (gamesData || []) as Game[]
  const steamGames = (steamGamesData || []) as Game[]
  
  const games = [...epicGames, ...steamGames]
  const history = (historyData || []) as HistoryGame[]

  return {
    current: games.filter(g => g?.isCurrent),
    upcoming: games.filter(g => !g?.isCurrent),
    history: [...history].sort((a, b) =>
      new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
    ),
    all: games,
    epicGames,
    steamGames,
    currentEpic: epicGames.filter(g => g?.isCurrent),
    currentSteam: steamGames.filter(g => g?.isCurrent),
    findBySlug: (slug: string): Game | undefined =>
      games.find(g => g?.slug === slug),
  }
}
