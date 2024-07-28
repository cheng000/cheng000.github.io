// docs/.vitepress/config.mts
import { defineConfig } from "file:///Users/mikec/Documents/project/vitepress/blog/cheng000.github.io/node_modules/vitepress/dist/node/index.js";
import AutoSidebar from "file:///Users/mikec/Documents/project/vitepress/blog/cheng000.github.io/node_modules/vite-plugin-vitepress-auto-sidebar/dist/index.mjs";
import timeline from "file:///Users/mikec/node_modules/vitepress-markdown-timeline/dist/cjs/index.cjs.js";
import { tabsMarkdownPlugin } from "file:///Users/mikec/node_modules/vitepress-plugin-tabs/dist/index.js";
import { withMagicMove } from "file:///Users/mikec/node_modules/vitepress-plugin-magic-move/dist/vitepress-plugin-magic-move.js";
var config_default = withMagicMove(defineConfig({
  title: "\u5F00\u53D1\u8005",
  description: "blog",
  lastUpdated: true,
  // 对 markdown 的配置
  markdown: {
    theme: {
      light: "vitesse-light",
      dark: "vitesse-dark"
    },
    toc: {
      level: [1, 2, 3, 4, 5]
      // 指定标题的层级
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
      AutoSidebar()
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
      { text: "DevSummary", link: "/05_Projects/01_Learn-Project/01_\u9879\u76EE\u57FA\u7840" }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy5tdHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWlrZWMvRG9jdW1lbnRzL3Byb2plY3Qvdml0ZXByZXNzL2Jsb2cvY2hlbmcwMDAuZ2l0aHViLmlvL2RvY3MvLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21pa2VjL0RvY3VtZW50cy9wcm9qZWN0L3ZpdGVwcmVzcy9ibG9nL2NoZW5nMDAwLmdpdGh1Yi5pby9kb2NzLy52aXRlcHJlc3MvY29uZmlnLm10c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWlrZWMvRG9jdW1lbnRzL3Byb2plY3Qvdml0ZXByZXNzL2Jsb2cvY2hlbmcwMDAuZ2l0aHViLmlvL2RvY3MvLnZpdGVwcmVzcy9jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJ1xuaW1wb3J0IEF1dG9TaWRlYmFyIGZyb20gJ3ZpdGUtcGx1Z2luLXZpdGVwcmVzcy1hdXRvLXNpZGViYXInO1xuaW1wb3J0IHRpbWVsaW5lIGZyb20gXCJ2aXRlcHJlc3MtbWFya2Rvd24tdGltZWxpbmVcIjsgXG5pbXBvcnQgeyB0YWJzTWFya2Rvd25QbHVnaW4gfSBmcm9tICd2aXRlcHJlc3MtcGx1Z2luLXRhYnMnXG5pbXBvcnQgeyB3aXRoTWFnaWNNb3ZlIH0gZnJvbSAndml0ZXByZXNzLXBsdWdpbi1tYWdpYy1tb3ZlJ1xuXG4vLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL3NpdGUtY29uZmlnXG5leHBvcnQgZGVmYXVsdCB3aXRoTWFnaWNNb3ZlKGRlZmluZUNvbmZpZyh7XG4gIHRpdGxlOiBcIlx1NUYwMFx1NTNEMVx1ODAwNVwiLFxuICBkZXNjcmlwdGlvbjogXCJibG9nXCIsXG4gIGxhc3RVcGRhdGVkOiB0cnVlLFxuICAvLyBcdTVCRjkgbWFya2Rvd24gXHU3Njg0XHU5MTREXHU3RjZFXG4gIG1hcmtkb3duOntcbiAgICB0aGVtZToge1xuICAgICAgbGlnaHQ6ICd2aXRlc3NlLWxpZ2h0JyxcbiAgICAgIGRhcms6ICd2aXRlc3NlLWRhcmsnLFxuICAgIH0sXG5cbiAgICB0b2M6IHtcbiAgICAgIGxldmVsOiBbMSwyLDMsNCw1XSwgLy8gXHU2MzA3XHU1QjlBXHU2ODA3XHU5ODk4XHU3Njg0XHU1QzQyXHU3RUE3XG4gICAgfSxcbiAgICAvL1x1ODg0Q1x1NTNGN1x1NjYzRVx1NzkzQVxuICAgIGxpbmVOdW1iZXJzOiB0cnVlLCBcblxuICAgIC8vXHU2NUY2XHU5NUY0XHU3RUJGXG4gICAgY29uZmlnOiAobWQpID0+IHtcbiAgICAgIG1kLnVzZSh0aW1lbGluZSk7XG4gICAgICBtZC51c2UodGFic01hcmtkb3duUGx1Z2luKTtcbiAgICB9LFxuXG4gICAgaW1hZ2U6IHtcbiAgICAgIC8vIFx1NUYwMFx1NTQyRlx1NTZGRVx1NzI0N1x1NjFEMlx1NTJBMFx1OEY3RFxuICAgICAgbGF6eUxvYWRpbmc6IHRydWVcbiAgICB9LFxuICB9LFxuICB2aXRlOiB7XG4gICAgcGx1Z2luczogW1xuICAgICAgQXV0b1NpZGViYXIoKSxcbiAgICBdLFxuICB9LFxuXG5cbiAgdGhlbWVDb25maWc6IHtcbiAgICBsb2dvOiAnL2Nvb2wucG5nJyxcbiAgICAvLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL2RlZmF1bHQtdGhlbWUtY29uZmlnXG4gICAgbmF2OiBbXG4gICAgICB7IHRleHQ6ICdIb21lJywgbGluazogJy8nIH0sXG4gICAgICB7IHRleHQ6ICdQcm9ncmFtbWVyJywgbGluazogJy8wMV9Qcm9ncmFtbWVyLzAxX0xhbmd1YWdlLzAxX0phdmEvMDFfSmF2YS1CYXNpYycgfSxcbiAgICAgIHsgdGV4dDogJ0FyY2hpdGVjdHVyZScsIGxpbms6ICcvMDJfQXJjaGl0ZWN0dXJlLzAxX0FyY2hpdGVjdHVyZS1CYXNpYy8wMV9cdTY3QjZcdTY3ODRcdTc3RTVcdThCQzZcdTRGNTNcdTdDRkInIH0sXG4gICAgICB7IHRleHQ6ICdUb29scycsIGxpbms6ICcvMDNfVG9vbHMvMDFfRGV2ZWxvcG1lbnQtVG9vbHMvMDFfRGV2ZWxvcG1lbnQtTGlzdCcgfSxcbiAgICAgIHsgdGV4dDogJ1Byb2plY3RzJywgbGluazogJy8wNF9Qcm9qZWN0cy8wMV9MZWFybi1Qcm9qZWN0LzAxX1x1OTg3OVx1NzZFRVx1NTdGQVx1Nzg0MCcgfSxcbiAgICAgIHsgdGV4dDogJ0RldlN1bW1hcnknLCBsaW5rOiAnLzA1X1Byb2plY3RzLzAxX0xlYXJuLVByb2plY3QvMDFfXHU5ODc5XHU3NkVFXHU1N0ZBXHU3ODQwJyB9LFxuICAgIF0sXG5cblxuICAgIHNvY2lhbExpbmtzOiBbXG4gICAgICB7IGljb246ICdnaXRodWInLCBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2NoZW5nMDAwJyB9XG4gICAgXSxcblxuXG4gICAgZWRpdExpbms6IHtcbiAgICAgIHBhdHRlcm46ICdodHRwczovL2dpdGh1Yi5jb20vY2hlbmcwMDAvY2hlbmcwMDAuZ2l0aHViLmlvL3RyZWUvbWFzdGVyL2RvY3MvOnBhdGgnLFxuICAgICAgdGV4dDogJ0VkaXQgdGhpcyBwYWdlIG9uIEdpdEh1YidcbiAgICB9LFxuXG4gICAgc2VhcmNoOiB7XG4gICAgICBwcm92aWRlcjogJ2xvY2FsJ1xuICAgIH0sXG5cbiAgICBmb290ZXI6IHtcbiAgICAgIG1lc3NhZ2U6ICdsdWNreSB5b3UnLFxuICAgICAgY29weXJpZ2h0OiAnQ29weXJpZ2h0IFx1MDBBOSAyMDI0LXByZXNlbnQnXG4gICAgfSxcblxuICAgIGxhc3RVcGRhdGVkVGV4dDogXCJcdTY3MDBcdTU0MEVcdTY2RjRcdTY1QjBcIiwgLy8gc3RyaW5nXG5cbiAgICBvdXRsaW5lOiB7IFxuICAgICAgLy8gbGV2ZWw6IFsyLDRdLCAvLyBcdTY2M0VcdTc5M0EyLTRcdTdFQTdcdTY4MDdcdTk4OThcbiAgICAgIGxldmVsOiAnZGVlcCcsIC8vIFx1NjYzRVx1NzkzQTItNlx1N0VBN1x1NjgwN1x1OTg5OFxuICAgICAgbGFiZWw6ICdUT0MnIC8vIFx1NjU4N1x1NUI1N1x1NjYzRVx1NzkzQVxuICAgIH0sXG4gIH0sXG4gIFxuICAgXG5cbn0pKVxuXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBaLFNBQVMsb0JBQW9CO0FBQ3ZiLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sY0FBYztBQUNyQixTQUFTLDBCQUEwQjtBQUNuQyxTQUFTLHFCQUFxQjtBQUc5QixJQUFPLGlCQUFRLGNBQWMsYUFBYTtBQUFBLEVBQ3hDLE9BQU87QUFBQSxFQUNQLGFBQWE7QUFBQSxFQUNiLGFBQWE7QUFBQTtBQUFBLEVBRWIsVUFBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUVBLEtBQUs7QUFBQSxNQUNILE9BQU8sQ0FBQyxHQUFFLEdBQUUsR0FBRSxHQUFFLENBQUM7QUFBQTtBQUFBLElBQ25CO0FBQUE7QUFBQSxJQUVBLGFBQWE7QUFBQTtBQUFBLElBR2IsUUFBUSxDQUFDLE9BQU87QUFDZCxTQUFHLElBQUksUUFBUTtBQUNmLFNBQUcsSUFBSSxrQkFBa0I7QUFBQSxJQUMzQjtBQUFBLElBRUEsT0FBTztBQUFBO0FBQUEsTUFFTCxhQUFhO0FBQUEsSUFDZjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxNQUNQLFlBQVk7QUFBQSxJQUNkO0FBQUEsRUFDRjtBQUFBLEVBR0EsYUFBYTtBQUFBLElBQ1gsTUFBTTtBQUFBO0FBQUEsSUFFTixLQUFLO0FBQUEsTUFDSCxFQUFFLE1BQU0sUUFBUSxNQUFNLElBQUk7QUFBQSxNQUMxQixFQUFFLE1BQU0sY0FBYyxNQUFNLG1EQUFtRDtBQUFBLE1BQy9FLEVBQUUsTUFBTSxnQkFBZ0IsTUFBTSxpRkFBbUQ7QUFBQSxNQUNqRixFQUFFLE1BQU0sU0FBUyxNQUFNLHFEQUFxRDtBQUFBLE1BQzVFLEVBQUUsTUFBTSxZQUFZLE1BQU0sNERBQXdDO0FBQUEsTUFDbEUsRUFBRSxNQUFNLGNBQWMsTUFBTSw0REFBd0M7QUFBQSxJQUN0RTtBQUFBLElBR0EsYUFBYTtBQUFBLE1BQ1gsRUFBRSxNQUFNLFVBQVUsTUFBTSw4QkFBOEI7QUFBQSxJQUN4RDtBQUFBLElBR0EsVUFBVTtBQUFBLE1BQ1IsU0FBUztBQUFBLE1BQ1QsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUVBLFFBQVE7QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFFQSxRQUFRO0FBQUEsTUFDTixTQUFTO0FBQUEsTUFDVCxXQUFXO0FBQUEsSUFDYjtBQUFBLElBRUEsaUJBQWlCO0FBQUE7QUFBQSxJQUVqQixTQUFTO0FBQUE7QUFBQSxNQUVQLE9BQU87QUFBQTtBQUFBLE1BQ1AsT0FBTztBQUFBO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFJRixDQUFDLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
