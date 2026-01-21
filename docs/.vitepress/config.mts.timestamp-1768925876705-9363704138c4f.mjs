// docs/.vitepress/config.mts
import { defineConfig } from "file:///Users/mikec/Documents/project/blog-vitepress/cheng000.github.io/node_modules/vitepress/dist/node/index.js";
import AutoSidebar from "file:///Users/mikec/Documents/project/blog-vitepress/cheng000.github.io/node_modules/vite-plugin-vitepress-auto-sidebar/dist/index.mjs";
import timeline from "file:///Users/mikec/Documents/project/blog-vitepress/cheng000.github.io/node_modules/vitepress-markdown-timeline/dist/cjs/index.cjs.js";
import { tabsMarkdownPlugin } from "file:///Users/mikec/Documents/project/blog-vitepress/cheng000.github.io/node_modules/vitepress-plugin-tabs/dist/index.js";
import { withMagicMove } from "file:///Users/mikec/Documents/project/blog-vitepress/cheng000.github.io/node_modules/vitepress-plugin-magic-move/dist/vitepress-plugin-magic-move.js";
var config_default = withMagicMove(defineConfig({
  title: "\u5F00\u53D1\u8005",
  description: "blog",
  lastUpdated: true,
  // 对 markdown 的配置
  markdown: {
    toc: {
      level: [1, 2, 3, 4, 5]
      // 指定标题的层级
    },
    theme: {
      light: "vitesse-light",
      dark: "vitesse-dark"
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
    }
  },
  vite: {
    plugins: [
      AutoSidebar(
        { collapsed: true }
      )
      // AnnouncementPlugin({
      //   title: '公告',
      //   body: [
      //     { type: 'text', content: '👇公众号👇 ---👇 赞赏 👇' },
      //     {
      //       type: 'image',
      //       src: 'https://cdn.upyun.sugarat.top/mdImg/sugar/85c9554d023be2fcc5aab94effeef033',
      //       style: 'display: inline-block;width:46%;padding-right:6px'
      //     },
      //     {
      //       type: 'image',
      //       src: 'https://cdn.upyun.sugarat.top/mdImg/sugar/54eacf3e730af9c1e3542a4800a422ea',
      //       style: 'display: inline-block;width:46%;padding-left:6px'
      //     }
      //   ],
      //   footer: [
      //     {
      //       type: 'text',
      //       content: 'footer content'
      //     },
      //     {
      //       type: 'button',
      //       content: '作者博客',
      //       link: 'https://sugarat.top'
      //     },
      //     {
      //       type: 'button',
      //       content: '博客主题',
      //       link: 'https://theme.sugarat.top',
      //       props: {
      //         type: 'success'
      //       }
      //     },
      //   ],
      // })
    ]
  },
  themeConfig: {
    logo: "/cool.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Programmer", link: "/01_Programmer/01_Language/01_Java/01_Java-Basic" },
      { text: "Architecture", link: "/02_Architecture/01_Architecture-Basic/01_\u67B6\u6784\u77E5\u8BC6\u4F53\u7CFB" },
      { text: "Tools", link: "/03_Tools/01_Development-Tools/01_Development-List" },
      { text: "Projects", link: "/04_Projects/01_Learn-Project/01_\u9879\u76EE\u57FA\u7840" },
      { text: "DevSummary", link: "/05_DevSummary/01_Work/001_\u4EBA\u673A\u5BC6\u7801\u5206\u79BB" },
      { text: "Cabin&Backpack", link: "/06_Cabin&Backpack/01_Books/001_\u660E\u671D\u90A3\u4E9B\u4E8B\u513F \u4E0E \u5F53\u5E74\u660E\u6708\uFF08\u77F3\u60A6\uFF09" },
      { text: "OurStory", link: "/07_OurStory/01_OurLoveMomentByMoment/001_Dairy" }
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/cheng000" }
    ],
    editLink: {
      pattern: "https://github.com/cheng000/cheng000.github.io/tree/master/docs/:path",
      text: "Edit this page on GitHub"
    },
    search: {
      provider: "local"
    },
    footer: {
      message: "lucky you",
      copyright: "Copyright \xA9 2024-present"
    },
    lastUpdatedText: "\u6700\u540E\u66F4\u65B0",
    // string
    outline: {
      // level: [2,4], // 显示2-4级标题
      level: "deep",
      // 显示2-6级标题
      label: "TOC"
      // 文字显示
    }
  }
}));
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWlrZWMvRG9jdW1lbnRzL3Byb2plY3QvYmxvZy12aXRlcHJlc3MvY2hlbmcwMDAuZ2l0aHViLmlvL2RvY3MvLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21pa2VjL0RvY3VtZW50cy9wcm9qZWN0L2Jsb2ctdml0ZXByZXNzL2NoZW5nMDAwLmdpdGh1Yi5pby9kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWlrZWMvRG9jdW1lbnRzL3Byb2plY3QvYmxvZy12aXRlcHJlc3MvY2hlbmcwMDAuZ2l0aHViLmlvL2RvY3MvLnZpdGVwcmVzcy9jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJ1xuaW1wb3J0IEF1dG9TaWRlYmFyIGZyb20gJ3ZpdGUtcGx1Z2luLXZpdGVwcmVzcy1hdXRvLXNpZGViYXInO1xuaW1wb3J0IHRpbWVsaW5lIGZyb20gXCJ2aXRlcHJlc3MtbWFya2Rvd24tdGltZWxpbmVcIjsgXG5pbXBvcnQgeyB0YWJzTWFya2Rvd25QbHVnaW4gfSBmcm9tICd2aXRlcHJlc3MtcGx1Z2luLXRhYnMnXG5pbXBvcnQgeyB3aXRoTWFnaWNNb3ZlIH0gZnJvbSAndml0ZXByZXNzLXBsdWdpbi1tYWdpYy1tb3ZlJ1xuaW1wb3J0IHsgQW5ub3VuY2VtZW50UGx1Z2luIH0gZnJvbSAndml0ZXByZXNzLXBsdWdpbi1hbm5vdW5jZW1lbnQnXG5cbi8vIGh0dHBzOi8vdml0ZXByZXNzLmRldi9yZWZlcmVuY2Uvc2l0ZS1jb25maWdcbmV4cG9ydCBkZWZhdWx0IHdpdGhNYWdpY01vdmUoZGVmaW5lQ29uZmlnKHtcbiAgdGl0bGU6IFwiXHU1RjAwXHU1M0QxXHU4MDA1XCIsXG4gIGRlc2NyaXB0aW9uOiBcImJsb2dcIixcbiAgbGFzdFVwZGF0ZWQ6IHRydWUsXG4gIC8vIFx1NUJGOSBtYXJrZG93biBcdTc2ODRcdTkxNERcdTdGNkVcbiAgbWFya2Rvd246e1xuICAgIHRvYzoge1xuICAgICAgbGV2ZWw6IFsxLDIsMyw0LDVdLCAvLyBcdTYzMDdcdTVCOUFcdTY4MDdcdTk4OThcdTc2ODRcdTVDNDJcdTdFQTdcbiAgICB9LFxuICAgIFxuICAgIHRoZW1lOiB7XG4gICAgICBsaWdodDogJ3ZpdGVzc2UtbGlnaHQnLFxuICAgICAgZGFyazogJ3ZpdGVzc2UtZGFyaycsXG4gICAgfSxcblxuICAgIFxuICAgIC8vXHU4ODRDXHU1M0Y3XHU2NjNFXHU3OTNBXG4gICAgbGluZU51bWJlcnM6IHRydWUsIFxuXG4gICAgLy9cdTY1RjZcdTk1RjRcdTdFQkZcbiAgICBjb25maWc6IChtZCkgPT4ge1xuICAgICAgbWQudXNlKHRpbWVsaW5lKTtcbiAgICAgIG1kLnVzZSh0YWJzTWFya2Rvd25QbHVnaW4pO1xuICAgIH0sXG5cbiAgICBpbWFnZToge1xuICAgICAgLy8gXHU1RjAwXHU1NDJGXHU1NkZFXHU3MjQ3XHU2MUQyXHU1MkEwXHU4RjdEXG4gICAgICBsYXp5TG9hZGluZzogdHJ1ZVxuICAgIH0sXG4gIH0sXG4gIHZpdGU6IHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICBBdXRvU2lkZWJhcihcbiAgICAgICAge2NvbGxhcHNlZDogdHJ1ZX1cbiAgICAgICksXG4gICAgICAvLyBBbm5vdW5jZW1lbnRQbHVnaW4oe1xuICAgICAgLy8gICB0aXRsZTogJ1x1NTE2Q1x1NTQ0QScsXG4gICAgICAvLyAgIGJvZHk6IFtcbiAgICAgIC8vICAgICB7IHR5cGU6ICd0ZXh0JywgY29udGVudDogJ1x1RDgzRFx1REM0N1x1NTE2Q1x1NEYxN1x1NTNGN1x1RDgzRFx1REM0NyAtLS1cdUQ4M0RcdURDNDcgXHU4RDVFXHU4RDRGIFx1RDgzRFx1REM0NycgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgLy8gICAgICAgc3JjOiAnaHR0cHM6Ly9jZG4udXB5dW4uc3VnYXJhdC50b3AvbWRJbWcvc3VnYXIvODVjOTU1NGQwMjNiZTJmY2M1YWFiOTRlZmZlZWYwMzMnLFxuICAgICAgLy8gICAgICAgc3R5bGU6ICdkaXNwbGF5OiBpbmxpbmUtYmxvY2s7d2lkdGg6NDYlO3BhZGRpbmctcmlnaHQ6NnB4J1xuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgdHlwZTogJ2ltYWdlJyxcbiAgICAgIC8vICAgICAgIHNyYzogJ2h0dHBzOi8vY2RuLnVweXVuLnN1Z2FyYXQudG9wL21kSW1nL3N1Z2FyLzU0ZWFjZjNlNzMwYWY5YzFlMzU0MmE0ODAwYTQyMmVhJyxcbiAgICAgIC8vICAgICAgIHN0eWxlOiAnZGlzcGxheTogaW5saW5lLWJsb2NrO3dpZHRoOjQ2JTtwYWRkaW5nLWxlZnQ6NnB4J1xuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgXSxcbiAgICAgIC8vICAgZm9vdGVyOiBbXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgLy8gICAgICAgY29udGVudDogJ2Zvb3RlciBjb250ZW50J1xuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgdHlwZTogJ2J1dHRvbicsXG4gICAgICAvLyAgICAgICBjb250ZW50OiAnXHU0RjVDXHU4MDA1XHU1MzVBXHU1QkEyJyxcbiAgICAgIC8vICAgICAgIGxpbms6ICdodHRwczovL3N1Z2FyYXQudG9wJ1xuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgdHlwZTogJ2J1dHRvbicsXG4gICAgICAvLyAgICAgICBjb250ZW50OiAnXHU1MzVBXHU1QkEyXHU0RTNCXHU5ODk4JyxcbiAgICAgIC8vICAgICAgIGxpbms6ICdodHRwczovL3RoZW1lLnN1Z2FyYXQudG9wJyxcbiAgICAgIC8vICAgICAgIHByb3BzOiB7XG4gICAgICAvLyAgICAgICAgIHR5cGU6ICdzdWNjZXNzJ1xuICAgICAgLy8gICAgICAgfVxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgIF0sXG4gICAgICAvLyB9KVxuICAgIF0sXG4gIH0sXG5cblxuICB0aGVtZUNvbmZpZzoge1xuICAgIGxvZ286ICcvY29vbC5wbmcnLFxuICAgIC8vIGh0dHBzOi8vdml0ZXByZXNzLmRldi9yZWZlcmVuY2UvZGVmYXVsdC10aGVtZS1jb25maWdcbiAgICBuYXY6IFtcbiAgICAgIHsgdGV4dDogJ0hvbWUnLCBsaW5rOiAnLycgfSxcbiAgICAgIHsgdGV4dDogJ1Byb2dyYW1tZXInLCBsaW5rOiAnLzAxX1Byb2dyYW1tZXIvMDFfTGFuZ3VhZ2UvMDFfSmF2YS8wMV9KYXZhLUJhc2ljJyB9LFxuICAgICAgeyB0ZXh0OiAnQXJjaGl0ZWN0dXJlJywgbGluazogJy8wMl9BcmNoaXRlY3R1cmUvMDFfQXJjaGl0ZWN0dXJlLUJhc2ljLzAxX1x1NjdCNlx1Njc4NFx1NzdFNVx1OEJDNlx1NEY1M1x1N0NGQicgfSxcbiAgICAgIHsgdGV4dDogJ1Rvb2xzJywgbGluazogJy8wM19Ub29scy8wMV9EZXZlbG9wbWVudC1Ub29scy8wMV9EZXZlbG9wbWVudC1MaXN0JyB9LFxuICAgICAgeyB0ZXh0OiAnUHJvamVjdHMnLCBsaW5rOiAnLzA0X1Byb2plY3RzLzAxX0xlYXJuLVByb2plY3QvMDFfXHU5ODc5XHU3NkVFXHU1N0ZBXHU3ODQwJyB9LFxuICAgICAgeyB0ZXh0OiAnRGV2U3VtbWFyeScsIGxpbms6ICcvMDVfRGV2U3VtbWFyeS8wMV9Xb3JrLzAwMV9cdTRFQkFcdTY3M0FcdTVCQzZcdTc4MDFcdTUyMDZcdTc5QkInIH0sXG4gICAgICB7IHRleHQ6ICdDYWJpbiZCYWNrcGFjaycsIGxpbms6ICcvMDZfQ2FiaW4mQmFja3BhY2svMDFfQm9va3MvMDAxX1x1NjYwRVx1NjcxRFx1OTBBM1x1NEU5Qlx1NEU4Qlx1NTEzRiBcdTRFMEUgXHU1RjUzXHU1RTc0XHU2NjBFXHU2NzA4XHVGRjA4XHU3N0YzXHU2MEE2XHVGRjA5JyB9LFxuICAgICAgeyB0ZXh0OiAnT3VyU3RvcnknLCBsaW5rOiAnLzA3X091clN0b3J5LzAxX091ckxvdmVNb21lbnRCeU1vbWVudC8wMDFfRGFpcnknIH0sXG4gICAgXSxcblxuXG4gICAgc29jaWFsTGlua3M6IFtcbiAgICAgIHsgaWNvbjogJ2dpdGh1YicsIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vY2hlbmcwMDAnIH1cbiAgICBdLFxuXG5cbiAgICBlZGl0TGluazoge1xuICAgICAgcGF0dGVybjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9jaGVuZzAwMC9jaGVuZzAwMC5naXRodWIuaW8vdHJlZS9tYXN0ZXIvZG9jcy86cGF0aCcsXG4gICAgICB0ZXh0OiAnRWRpdCB0aGlzIHBhZ2Ugb24gR2l0SHViJ1xuICAgIH0sXG5cbiAgICBzZWFyY2g6IHtcbiAgICAgIHByb3ZpZGVyOiAnbG9jYWwnXG4gICAgfSxcblxuICAgIGZvb3Rlcjoge1xuICAgICAgbWVzc2FnZTogJ2x1Y2t5IHlvdScsXG4gICAgICBjb3B5cmlnaHQ6ICdDb3B5cmlnaHQgXHUwMEE5IDIwMjQtcHJlc2VudCdcbiAgICB9LFxuXG4gICAgbGFzdFVwZGF0ZWRUZXh0OiBcIlx1NjcwMFx1NTQwRVx1NjZGNFx1NjVCMFwiLCAvLyBzdHJpbmdcblxuICAgIG91dGxpbmU6IHsgXG4gICAgICAvLyBsZXZlbDogWzIsNF0sIC8vIFx1NjYzRVx1NzkzQTItNFx1N0VBN1x1NjgwN1x1OTg5OFxuICAgICAgbGV2ZWw6ICdkZWVwJywgLy8gXHU2NjNFXHU3OTNBMi02XHU3RUE3XHU2ODA3XHU5ODk4XG4gICAgICBsYWJlbDogJ1RPQycgLy8gXHU2NTg3XHU1QjU3XHU2NjNFXHU3OTNBXG4gICAgfSxc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
