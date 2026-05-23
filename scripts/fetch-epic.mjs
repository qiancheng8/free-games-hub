// 抓取 Epic Games 当前 / 即将免费游戏
// 用法：node scripts/fetch-epic.mjs
import fs from 'node:fs/promises'
import path from 'node:path'

const API = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=CN&allowCountries=CN'

const DATA_DIR = path.resolve('data')
const GAMES_FILE = path.join(DATA_DIR, 'games.json')
const HISTORY_FILE = path.join(DATA_DIR, 'history.json')

function pickImage(keyImages = []) {
  const order = ['OfferImageWide', 'DieselStoreFrontWide', 'VaultClosed', 'Thumbnail', 'OfferImageTall']
  for (const type of order) {
    const hit = keyImages.find(i => i.type === type)
    if (hit?.url) return hit.url
  }
  return keyImages[0]?.url || ''
}

function pickSlug(item) {
  const mapping = item.catalogNs?.mappings?.find(m => m.pageType === 'productHome')
  return mapping?.pageSlug
    || item.catalogNs?.mappings?.[0]?.pageSlug
    || item.productSlug?.replace(/\/home$/, '')
    || item.urlSlug
    || item.id
}

function parse(item) {
  const promo = item.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0]
  const upcoming = item.promotions?.upcomingPromotionalOffers?.[0]?.promotionalOffers?.[0]
  const offer = promo || upcoming
  if (!offer) return null
  if (offer.discountSetting?.discountPercentage !== 0) return null // 必须是 100% off（免费）

  const slug = pickSlug(item)
  return {
    id: item.id,
    title: item.title,
    description: (item.description || '').trim(),
    image: pickImage(item.keyImages),
    originalPrice: item.price?.totalPrice?.fmtPrice?.originalPrice || '',
    startDate: offer.startDate,
    endDate: offer.endDate,
    slug,
    url: `https://store.epicgames.com/zh-CN/p/${slug}`,
    isCurrent: !!promo,
    seller: item.seller?.name || '',
    fetchedAt: new Date().toISOString(),
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf-8'))
  } catch {
    return fallback
  }
}

async function main() {
  console.log('fetching:', API)
  const res = await fetch(API, {
    headers: { 'User-Agent': 'free-games-hub/1.0 (+https://github.com)' },
  })
  if (!res.ok) throw new Error(`Epic API ${res.status}: ${res.statusText}`)
  const json = await res.json()

  const elements = json?.data?.Catalog?.searchStore?.elements || []
  const games = elements.map(parse).filter(Boolean)

  // 合并历史：仅记录"曾经免费过"的游戏
  const history = await readJson(HISTORY_FILE, [])
  const histIds = new Set(history.map(g => g.id))
  for (const g of games) {
    if (g.isCurrent && !histIds.has(g.id)) {
      history.push({
        id: g.id,
        title: g.title,
        image: g.image,
        originalPrice: g.originalPrice,
        endDate: g.endDate,
        startDate: g.startDate,
        slug: g.slug,
        url: g.url,
      })
    }
  }

  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(GAMES_FILE, JSON.stringify(games, null, 2) + '\n')
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2) + '\n')

  const cur = games.filter(g => g.isCurrent).length
  const up = games.length - cur
  console.log(`OK: current=${cur}, upcoming=${up}, history=${history.length}`)
}

main().catch(err => {
  console.error('FAILED:', err)
  process.exit(1)
})
