import { defineConfig } from 'vitepress'
import AutoSidebar from 'vite-plugin-vitepress-auto-sidebar';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "cheng000's blog",
  description: "blog",
  lastUpdated: true,
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

    // sidebar: [
    //   {
    //     text: '导航',
    //     items: [
    //       { 
    //         text: '01_Language',
    //         items: [
    //           { 
    //             text: '01_Java',
    //             items: [
    //               { text: '01_Java-Basic', link: '/01_Language/01_Java/01_Java-Basic' },
    //               { text: '02_Java-OOP', link: '/01_Language/01_Java/02_Java-OOP' },
    //             ]
    //           },
    //         ]
    //       },

    //       { 
    //         text: '02_Algorithm',
    //         items: [
    //           { 
    //             text: '01_Java',
    //             items: [
    //               { text: '01_Java-Basic', link: '/01_Language/01_Java/01_Java-Basic' },
    //               { text: '02_Java-OOP', link: '/01_Language/01_Java/02_Java-OOP' },
    //             ]
    //           },
    //         ]
    //       },

    //       { 
    //         text: '03_Database',
    //         items: [
    //           { 
    //             text: '01_Java',
    //             items: [
    //               { text: '01_Java-Basic', link: '/01_Language/01_Java/01_Java-Basic' },
    //               { text: '02_Java-OOP', link: '/01_Language/01_Java/02_Java-OOP' },
    //             ]
    //           },
    //         ]
    //       },

    //       { 
    //         text: '04_Frontend',
    //         items: [
    //           { 
    //             text: '01_Java',
    //             items: [
    //               { text: '01_Java-Basic', link: '/01_Language/01_Java/01_Java-Basic' },
    //               { text: '02_Java-OOP', link: '/01_Language/01_Java/02_Java-OOP' },
    //             ]
    //           },
    //         ]
    //       },

    //       { 
    //         text: '05_Backend',
    //         items: [
    //           { 
    //             text: '01_Java',
    //             items: [
    //               { text: '01_Java-Basic', link: '/01_Language/01_Java/01_Java-Basic' },
    //               { text: '02_Java-OOP', link: '/01_Language/01_Java/02_Java-OOP' },
    //             ]
    //           },
    //         ]
    //       },

    //       { 
    //         text: '06_Framework',
    //         items: [
    //           { 
    //             text: '01_Java',
    //             items: [
    //               { text: '01_Java-Basic', link: '/01_Language/01_Java/01_Java-Basic' },
    //               { text: '02_Java-OOP', link: '/01_Language/01_Java/02_Java-OOP' },
    //             ]
    //           },
    //         ]
    //       },

    //       { 
    //         text: '07_Framwork-middleware',
    //         items: [
    //           { 
    //             text: '01_Java',
    //             items: [
    //               { text: '01_Java-Basic', link: '/01_Language/01_Java/01_Java-Basic' },
    //               { text: '02_Java-OOP', link: '/01_Language/01_Java/02_Java-OOP' },
    //             ]
    //           },
    //         ]
    //       },

    //       { 
    //         text: '08_Architecture',
    //         items: [
    //           { 
    //             text: '01_Java',
    //             items: [
    //               { text: '01_Java-Basic', link: '/01_Language/01_Java/01_Java-Basic' },
    //               { text: '02_Java-OOP', link: '/01_Language/01_Java/02_Java-OOP' },
    //             ]
    //           },
    //         ]
    //       },

    //       { 
    //         text: '09_Tools',
    //         items: [
    //           { 
    //             text: '01_Java',
    //             items: [
    //               { text: '01_Java-Basic', link: '/01_Language/01_Java/01_Java-Basic' },
    //               { text: '02_Java-OOP', link: '/01_Language/01_Java/02_Java-OOP' },
    //             ]
    //           },
    //         ]
    //       },

    //       { 
    //         text: '10_Projects',
    //         items: [
    //           { 
    //             text: '01_Java',
    //             items: [
    //               { text: '01_Java-Basic', link: '/01_Language/01_Java/01_Java-Basic' },
    //               { text: '02_Java-OOP', link: '/01_Language/01_Java/02_Java-OOP' },
    //             ]
    //           },
    //         ]
    //       },
    //     ]
    //   }
    // ],

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