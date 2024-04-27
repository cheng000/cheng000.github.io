import { defineConfig } from 'vitepress'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "开发者",
  description: "blog",
  lastUpdated: true,
  // 对 markdown 的配置
  markdown:{
    toc: {
      level: [1,2,3,4,5], // 指定标题的层级
    }
  },
  vite: {
    plugins: [
      AutoSidebar(),
    ],
  },
  themeConfig: {
    logo: '/cool.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Programmer', link: '/01_Programmer/01_Language/01_Java/01_Java-Basic' },
      { text: 'Architecture', link: '/02_Architecture/01_Architecture-Basic/01_架构知识体系' },
      { text: 'Tools', link: '/03_Tools/01_Development-Tools/01_Development-List' },
      { text: 'Projects', link: '/04_Projects/01_Learn-Project/01_项目基础' },
    ],


    socialLinks: [
      { icon: 'github', link: 'https://github.com/cheng000' }
    ],


    editLink: {
      pattern: 'https://github.com/cheng000/cheng000.github.io/tree/master/docs/:path',
      text: 'Edit this page on GitHub'
    },

    search: {
      provider: 'local'
    },

    footer: {
      message: 'lucky you',
      copyright: 'Copyright © 2024-present'
    },

    lastUpdatedText: "最后更新", // string
  }
  
})