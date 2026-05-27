# Steam 免费游戏获取指南

## 📋 目录
- [最佳方案：GamerPower API](#最佳方案gamerpower-api)
- [API 详细信息](#api-详细信息)
- [数据字段说明](#数据字段说明)
- [示例代码](#示例代码)
- [其他数据源](#其他数据源)

---

## 最佳方案：GamerPower API

**推荐使用 GamerPower API，原因：

| 特性 | 说明 |
|------|------|
| ✅ 完全免费 | 无任何费用 |
| ✅ 无需 API Key | 无需认证 |
| ✅ 多平台支持 | Steam、Epic、GOG、Itch.io 等 |
| ✅ 数据丰富 | 标题、截止时间、价格、链接、图片等 |
| ✅ 有 CORS 支持 | 通过 RapidAPI |
| ✅ 无限制 | 4 请求/秒 速率限制 |

---

## API 详细信息

### Base URL
```
https://www.gamerpower.com/api
```

### 主要 Endpoints

| 端点 | 用途 | 示例 |
|-----|------|------|
| `/giveaways` | 获取所有免费游戏 | `GET /giveaways` |
| `/giveaways?platform=steam` | 只获取 Steam 游戏 | `GET /giveaways?platform=steam` |
| `/giveaways?type=game` | 只获取完整游戏（不含 DLC/Loot | `GET /giveaways?type=game` |
| `/giveaway?id={id}` | 获取单个游戏详情 | `GET /giveaway?id=525` |
| `/worth` | 获取总价值估算 | `GET /worth` |

### 平台参数值

| 参数值 | 平台 |
|-------|------|
| `steam` | Steam |
| `epic-games-store` | Epic Games Store |
| `gog` | GOG |
| `itchio` | Itch.io |
| `ubisoft` | Ubisoft |
| `origin` | Origin |
| `battlenet` | Battle.net |
| `drm-free` | DRM-Free |
| `pc` | 所有 PC 平台 |

### 类型参数值

| 参数值 | 说明 |
|-------|------|
| `game` | 完整游戏 |
| `loot` | 游戏内物品/DLC |
| `beta` | Beta 测试 |

### 排序参数

| 参数值 | 说明 |
|-------|------|
| `date` | 按日期排序 |
| `value` | 按价格排序 |
| `popularity` | 按热度排序 |

---

## 数据字段说明

### 单个 Giveaway 对象包含以下字段：

```json
{
  "id": 3654,
  "title": "Bunny Guys! (Steam) Giveaway",
  "worth": "$4.99",
  "thumbnail": "https://...",
  "image": "https://...",
  "description": "游戏描述...",
  "instructions": "领取说明...",
  "open_giveaway_url": "https://...",
  "published_date": "2026-05-22 13:20:03",
  "type": "Game",
  "platforms": "PC, Steam",
  "end_date": "2026-05-29 23:59:00",
  "users": 26530,
  "status": "Active",
  "gamerpower_url": "https://...",
  "open_giveaway": "https://..."
}
```

| 字段 | 说明 |
|------|------|
| `id` | 唯一 ID |
| `title` | 游戏标题 |
| `worth` | 价值（美元） |
| `thumbnail` | 缩略图 URL |
| `image` | 大图 URL |
| `description` | 描述 |
| `instructions` | 领取步骤说明 |
| `open_giveaway_url` | 跳转链接 |
| `published_date` | 发布日期 |
| `type` | 类型（Game/Loot/Beta |
| `platforms` | 平台 |
| `end_date` | 截止日期 |
| `users` | 已领取人数 |
| `status` | 状态（Active/Expired） |

---

## 示例代码

### 1. 简单获取（浏览器）

```javascript
// 获取所有 Steam 免费游戏
fetch('https://www.gamerpower.com/api/giveaways?platform=steam&type=game')
  .then(res => res.json())
  .then(games => {
    console.log('获取到', games.length, '个 Steam 免费游戏');
    games.forEach(game => {
      console.log(`- ${game.title} (截止: ${game.end_date})`);
    });
  })
  .catch(err => console.error(err));
```

### 2. Node.js 脚本

项目中已提供完整脚本：`scripts/fetch-gamerpower.mjs`

运行方式：
```bash
node scripts/fetch-gamerpower.mjs
```

### 3. 获取多平台筛选

```javascript
// 获取 Steam + Epic 游戏
const url = 'https://www.gamerpower.com/api/filter?platform=steam.epic-games-store&type=game';
```

---

## 其他数据源

### 1. SteamDB
- **网址：https://steamdb.info/upcoming/free/
- **特点**：Steam 专属，数据精准
- **API**：没有公开 API，需要自己爬取

### 2. IsThereAnyDeal
- **网址**：https://isthereanydeal.com/giveaways/
- **特点**：多平台聚合，历史价格数据
- **API**：需要 API Key

### 3. GG.deals
- **网址**：https://gg.deals/news/?tags=24,56,72
- **特点**：历史价格追踪

---

## 注意事项

1. **数据来源标注：使用 GamerPower API 时，需要标注来源为 GamerPower.com
2. **速率限制**：建议不要超过 4 请求/秒
3. **CORS**：浏览器直接请求可能有跨域问题，建议通过后端代理或使用 RapidAPI
4. **数据更新**：建议每天更新数据时，检查 `end_date` 判断是否过期

---

## 相关链接

- GamerPower API 文档：https://www.gamerpower.com/api-read
- GamerPower 官网：https://www.gamerpower.com/
