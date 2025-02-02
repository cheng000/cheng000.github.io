import { defineConfig } from 'vitepress'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';
import timeline from "vitepress-markdown-timeline"; 
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { withMagicMove } from 'vitepress-plugin-magic-move'
import { AnnouncementPlugin } from 'vitepress-plugin-announcement'

// https://vitepress.dev/reference/site-config
export default withMagicMove(defineConfig({
  title: "开发者",
  description: "blog",
  lastUpdated: true,
  // 对 markdown 的配置
  markdown:{
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },

    toc: {
      level: [1,2,3,4,5], // 指定标题的层级
    },
    //行号显示
    lineNumbers: true, 

    //时间线
    config: (md) => {
      md.use(timeline);
      md.use(tabsMarkdownPlugin);
    },

    image: {
      // 开启图片懒加载
      lazyLoading: true
    },
  },
  vite: {
    plugins: [
      AutoSidebar(
        {collapsed: true}
      ),
      AnnouncementPlugin({
        title: '公告',
        body: [
          { type: 'text', content: '👇公众号👇 ---👇 赞赏 👇' },
          {
            type: 'image',
            src: 'https://cdn.upyun.sugarat.top/mdImg/sugar/85c9554d023be2fcc5aab94effeef033',
            style: 'display: inline-block;width:46%;padding-right:6px'
          },
          {
            type: 'image',
            src: 'https://cdn.upyun.sugarat.top/mdImg/sugar/54eacf3e730af9c1e3542a4800a422ea',
            style: 'display: inline-block;width:46%;padding-left:6px'
          }
        ],
        footer: [
          {
            type: 'text',
            content: 'footer content'
          },
          {
            type: 'button',
            content: '作者博客',
            link: 'https://sugarat.top'
          },
          {
            type: 'button',
            content: '博客主题',
            link: 'https://theme.sugarat.top',
            props: {
              type: 'success'
            }
          },
        ],
      })
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
      { text: 'DevSummary', link: '/05_DevSummary/01_Work/001_人机密码分离' },
      { text: 'Cabin&Backpack', link: '/06_Cabin&Backpack/01_Books/001_明朝那些事儿 与 当年明月（石悦）' },
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

    outline: { 
      // level: [2,4], // 显示2-4级标题
      level: 'deep', // 显示2-6级标题
      label: 'TOC' // 文字显示
    },
  },
  
   

}))

