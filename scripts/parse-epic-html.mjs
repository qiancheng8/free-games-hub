#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DATA_DIR = path.join(__dirname, '..', 'doc', 'data')
const OUTPUT_FILE = path.join(__dirname, '..', 'doc', 'data', 'epic-game-details.json')

function parseEpicHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf-8')

  const result = {}

  const titleMatch = html.match(/<title>([^<]+)<\/title>/)
  if (titleMatch) {
    result.pageTitle = titleMatch[1]
  }

  const reactQueryMatch = html.match(/window\.__REACT_QUERY_INITIAL_QUERIES__\s*=\s*(\{.+?\});/s)
  if (reactQueryMatch) {
    try {
      const jsonStr = reactQueryMatch[1]
      const safeJsonStr = jsonStr.replace(/undefined/g, 'null')
      result.reactQuery = JSON.parse(safeJsonStr)
    } catch (e) {
      console.error('Error parsing REACT_QUERY_INITIAL_QUERIES:', e.message)
    }
  }

  const ctxMatch = html.match(/window\.EGStoreCtx\s*=\s*(\{.+?\});/s)
  if (ctxMatch) {
    try {
      const jsonStr = ctxMatch[1]
      const safeJsonStr = jsonStr.replace(/undefined/g, 'null')
      result.egStoreCtx = JSON.parse(safeJsonStr)
    } catch (e) {
      console.error('Error parsing EGStoreCtx:', e.message)
    }
  }

  return result
}

function extractGameData(parsedData, fileName) {
  const game = {}

  if (parsedData.reactQuery?.queries) {
    for (const query of parsedData.reactQuery.queries) {
      const queryKeyStr = JSON.stringify(query.queryKey || '')
      
      if (queryKeyStr.includes('getCatalogOffer')) {
        try {
          const catalogOffer = query.state?.data?.Catalog?.catalogOffer
          if (catalogOffer) {
            game.title = catalogOffer.title
            game.id = catalogOffer.id
            game.namespace = catalogOffer.namespace
            game.developer = catalogOffer.developerDisplayName
            game.publisher = catalogOffer.publisherDisplayName
            game.description = catalogOffer.description
            game.longDescription = catalogOffer.longDescription
            game.effectiveDate = catalogOffer.effectiveDate
            game.expiryDate = catalogOffer.expiryDate
            game.viewableDate = catalogOffer.viewableDate
            game.categories = catalogOffer.categories || []
            game.keyImages = catalogOffer.keyImages || []
            game.tags = catalogOffer.tags || []
            game.ageRating = catalogOffer.ageRating
            game.requirements = catalogOffer.requirements || {}
            game.languageInfo = catalogOffer.languageInfo || {}
            game.pcReleaseDate = catalogOffer.pcReleaseDate
            game.releaseDate = catalogOffer.releaseDate
            game.price = catalogOffer.price
          }
        } catch (e) {
          console.error('Error extracting catalog offer:', e.message)
        }
      }

      if (queryKeyStr.includes('getMappingByPageSlug')) {
        try {
          const mapping = query.state?.data?.StorePageMapping?.mapping
          if (mapping) {
            game.slug = mapping.pageSlug
            game.sandboxId = mapping.sandboxId
            game.productId = mapping.productId
            game.offerId = mapping.mappings?.offerId
          }
        } catch (e) {
          console.error('Error extracting mapping:', e.message)
        }
      }
    }
  }

  game._sourceFile = fileName

  return game
}

async function main() {
  console.log('📂 Reading HTML files from:', DATA_DIR)

  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.html'))

  if (files.length === 0) {
    console.log('❌ No HTML files found in', DATA_DIR)
    process.exit(1)
  }

  const games = []

  for (const file of files) {
    console.log(`🔍 Parsing: ${file}`)
    const htmlPath = path.join(DATA_DIR, file)
    const parsed = parseEpicHtml(htmlPath)
    const gameData = extractGameData(parsed, file)
    games.push(gameData)
  }

  console.log(`✅ Extracted data for ${games.length} games`)

  const output = {
    extractedAt: new Date().toISOString(),
    games
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`💾 Saved to: ${OUTPUT_FILE}`)

  const simplified = {
    extractedAt: output.extractedAt,
    games: games.map(g => ({
      title: g.title,
      slug: g.slug,
      id: g.id,
      developer: g.developer,
      publisher: g.publisher,
      description: g.description,
      longDescription: g.longDescription,
      categories: g.categories,
      keyImages: g.keyImages?.map(img => ({
        type: img.type,
        url: img.url
      })),
      tags: g.tags,
      requirements: g.requirements,
      releaseDate: g.releaseDate,
      price: g.price
    }))
  }

  const SIMPLE_OUTPUT = path.join(__dirname, '..', 'doc', 'data', 'epic-game-details-simple.json')
  fs.writeFileSync(SIMPLE_OUTPUT, JSON.stringify(simplified, null, 2), 'utf-8')
  console.log(`💾 Saved simplified version to: ${SIMPLE_OUTPUT}`)
}

main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
