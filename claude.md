# Epic 免费游戏 - 项目文档

## 项目介绍

这是一个用于展示 Epic Games 商店每周免费游戏的 Nuxt 3 应用，帮助用户及时了解和领取限时免费游戏。

## 技术栈

- **框架**: Nuxt 3.14.1592
- **语言**: TypeScript
- **UI**: Vue 3 + Tailwind CSS
- **模块**: 
  - @nuxtjs/tailwindcss
  - @nuxt/icon
  - @vueuse/nuxt

## 项目结构

```
epic-free-games/
├── .github/workflows/    # GitHub Actions 工作流
├── assets/css/           # 样式文件
├── components/           # Vue 组件
│   ├── Countdown.vue
│   ├── GameCard.vue
│   ├── SiteFooter.vue
│   └── SiteHeader.vue
├── composables/          # 组合式函数
│   └── useGames.ts
├── data/                 # 数据文件
│   ├── games.json
│   └── history.json
├── pages/                # 页面
│   ├── game/[slug].vue
│   ├── history.vue
│   ├── index.vue
│   └── upcoming.vue
├── public/               # 静态资源
├── scripts/              # 脚本文件
│   └── fetch-epic.mjs
├── app.vue
├── nuxt.config.ts
├── package.json
└── tailwind.config.ts
```

## 功能特性

- 展示本周免费游戏
- 显示即将免费游戏
- 历史游戏记录
- 游戏详情页
- 响应式设计
- SEO 优化（JSON-LD 结构化数据）
- 每周四自动更新

## 脚本命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 生成静态站点
npm run generate

# 预览构建结果
npm run preview

# 抓取 Epic 游戏数据
npm run fetch
```

## 数据更新

游戏数据通过 `scripts/fetch-epic.mjs` 脚本从 Epic Games Store API 获取，结果保存到 `data/games.json` 和 `data/history.json`。

## 配置说明

在 `nuxt.config.ts` 中配置：
- 站点 URL 和名称
- 预渲染路由
- SEO 元信息
