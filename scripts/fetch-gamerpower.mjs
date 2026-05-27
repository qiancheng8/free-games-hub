#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * GamerPower API 抓取脚本
 * 从 GamerPower API 获取多平台免费游戏数据
 */

const GAMERPOWER_API_BASE = 'https://www.gamerpower.com/api'

/**
 * 支持的平台映射
 */
const PLATFORM_MAP = {
  'steam': 'Steam',
  'epic-games-store': 'Epic Games Store',
  'gog': 'GOG',
  'itchio': 'Itch.io',
  'ubisoft': 'Ubisoft',
  'origin': 'Origin',
  'battlenet': 'Battle.net',
  'drm-free': 'DRM-Free'
}

/**
 * 从 GamerPower API 获取免费游戏
 * @param {string} platform - 平台筛选 (可选)
 * @param {string} type - 类型筛选 (可选)
 */
async function fetchGiveaways(platform = null, type = 'game') {
  let url = `${GAMERPOWER_API_BASE}/giveaways`
  const params = []
  
  if (platform) {
    params.push(`platform=${platform}`)
  }
  
  if (type) {
    params.push(`type=${type}`)
  }
  
  if (params.length > 0) {
    url += `?${params.join('&')}`
  }

  console.log(`🔍 正在获取数据: ${url}`)

  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`API 请求失败: ${response.status}`)
  }

  const data = await response.json()
  console.log(`✅ 获取到 ${data.length} 个免费游戏`)
  
  return data
}

/**
 * 转换 GamerPower 数据格式为我们项目的格式
 */
function transformGamerPowerData(giveaway) {
  return {
    id: giveaway.id,
    title: giveaway.title,
    description: giveaway.description,
    image: giveaway.image,
    thumbnail: giveaway.thumbnail,
    url: giveaway.open_giveaway_url || giveaway.giveaway_url,
    platform: PLATFORM_MAP[giveaway.platforms] || giveaway.platforms,
    worth: giveaway.worth,
    users: giveaway.users,
    type: giveaway.type,
    publishedDate: giveaway.published_date,
    endDate: giveaway.end_date,
    instructions: giveaway.instructions,
    slug: generateSlug(giveaway.title)
  }
}

/**
 * 生成 slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🎮 开始从 GamerPower API 获取免费游戏...\n')

    // 获取所有平台的游戏
    const allGiveaways = await fetchGiveaways(null, 'game')
    
    // 转换数据格式
    const transformedData = allGiveaways.map(transformGamerPowerData)
    
    // 按平台分组
    const groupedByPlatform = {}
    transformedData.forEach(game => {
      const platform = game.platform
      if (!groupedByPlatform[platform]) {
        groupedByPlatform[platform] = []
      }
      groupedByPlatform[platform].push(game)
    })

    // 保存所有数据
    const allOutputPath = join(__dirname, '..', 'data', 'gamerpower-giveaways.json')
    writeFileSync(allOutputPath, JSON.stringify(transformedData, null, 2))
    console.log(`\n💾 已保存所有数据到: ${allOutputPath}`)

    // 保存按平台分组的数据
    const groupedOutputPath = join(__dirname, '..', 'data', 'gamerpower-by-platform.json')
    writeFileSync(groupedOutputPath, JSON.stringify(groupedByPlatform, null, 2))
    console.log(`💾 已保存按平台分组数据到: ${groupedOutputPath}`)

    // 打印统计信息
    console.log('\n📊 统计信息:')
    Object.entries(groupedByPlatform).forEach(([platform, games]) => {
      console.log(`  - ${platform}: ${games.length} 个免费游戏`)
    })
    console.log(`  - 总计: ${transformedData.length} 个免费游戏`)

    console.log('\n✅ 完成！')
  } catch (error) {
    console.error('❌ 出错:', error.message)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { fetchGiveaways, transformGamerPowerData, PLATFORM_MAP }
