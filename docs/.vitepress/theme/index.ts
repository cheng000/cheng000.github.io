// .vitepress/theme/index.ts
import DefaultTheme from 'vitepress/theme';
import giscusTalk from 'vitepress-plugin-comment-with-giscus';
import { useData, useRoute } from 'vitepress';

import { inBrowser } from 'vitepress'
import busuanzi from 'busuanzi.pure.js'

import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick } from 'vue';

// 只需添加以下一行代码，引入时间线样式
import "vitepress-markdown-timeline/dist/theme/index.css";

import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import vitepressBackToTop from 'vitepress-plugin-back-to-top'
import 'vitepress-plugin-back-to-top/dist/style.css'

import 'shiki-magic-move/style.css'


export default {
  extends: DefaultTheme,

  // 浏览量
  enhanceApp({ app , router }) {
    if (inBrowser) {
      router.onAfterRouteChanged = () => {
        busuanzi.fetch()
      }
    }
    enhanceAppWithTabs(app),
    vitepressBackToTop({
        // default
        threshold:300
    })
  },

  setup() {
    // Get frontmatter and route
    const { frontmatter } = useData();
    const route = useRoute();
        
    // giscus配置
    giscusTalk({
      repo: 'cheng000/cheng000.github.io', //仓库
      repoId: 'R_kgDOLwrx7A', //仓库ID
      category: 'Announcements', // 讨论分类
      categoryId: 'DIC_kwDOLwrx7M4Ce_Bz', //讨论分类ID
      mapping: 'pathname',
      inputPosition: 'bottom',
      lang: 'zh-CN',
      }, 
      {
        frontmatter, route
      },
      //默认值为true，表示已启用，此参数可以忽略；
      //如果为false，则表示未启用
      //您可以使用“comment:true”序言在页面上单独启用它
      true
    );

    // 图片缩放
    const initZoom = () => {
        // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
        mediumZoom('.main img', { background: 'var(--vp-c-bg)' }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
      };
      onMounted(() => {
        initZoom();
      });
      watch(
        () => route.path,
        () => nextTick(() => initZoom())
      );

  }

}