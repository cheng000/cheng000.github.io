import{u as h,c as p,l as s,t as i,m as e,a8 as r,a,o as k}from"./chunks/framework.2F4O5CV0.js";const d=r(`<h1 id="runtime-api-examples" tabindex="-1">Runtime API Examples <a class="header-anchor" href="#runtime-api-examples" aria-label="Permalink to &quot;Runtime API Examples&quot;">​</a></h1><p>This page demonstrates usage of some of the runtime APIs provided by VitePress.</p><p>The main <code>useData()</code> API can be used to access site, theme, and page data for the current page. It works in both <code>.md</code> and <code>.vue</code> files:</p><div class="language-md vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">script</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> setup</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">import</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> useData</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> }</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;"> from</span><span style="--shiki-light:#B5695999;--shiki-dark:#C98A7D99;"> &#39;</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;">vitepress</span><span style="--shiki-light:#B5695999;--shiki-dark:#C98A7D99;">&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#AB5959;--shiki-dark:#CB7676;">const</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> {</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> theme</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">,</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> page</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">,</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> frontmatter</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> }</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> =</span><span style="--shiki-light:#59873A;--shiki-dark:#80A665;"> useData</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">()</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">script</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;--shiki-light-font-weight:bold;--shiki-dark-font-weight:bold;">##</span><span style="--shiki-light:#1C6B48;--shiki-dark:#4D9375;--shiki-light-font-weight:bold;--shiki-dark-font-weight:bold;"> Results</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;--shiki-light-font-weight:bold;--shiki-dark-font-weight:bold;">###</span><span style="--shiki-light:#1C6B48;--shiki-dark:#4D9375;--shiki-light-font-weight:bold;--shiki-dark-font-weight:bold;"> Theme Data</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">pre</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;{{</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> theme</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> }}&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">pre</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">### Page Data</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">pre</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;{{</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> page</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> }}&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">pre</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#393A34;--shiki-dark:#DBD7CAEE;">### Page Frontmatter</span></span>
<span class="line"><span style="--shiki-light:#999999;--shiki-dark:#666666;">&lt;</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">pre</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;{{</span><span style="--shiki-light:#B07D48;--shiki-dark:#BD976A;"> frontmatter</span><span style="--shiki-light:#999999;--shiki-dark:#666666;"> }}&lt;/</span><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375;">pre</span><span style="--shiki-light:#999999;--shiki-dark:#666666;">&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><h2 id="results" tabindex="-1">Results <a class="header-anchor" href="#results" aria-label="Permalink to &quot;Results&quot;">​</a></h2><h3 id="theme-data" tabindex="-1">Theme Data <a class="header-anchor" href="#theme-data" aria-label="Permalink to &quot;Theme Data&quot;">​</a></h3>`,6),o=s("h3",{id:"page-data",tabindex:"-1"},[a("Page Data "),s("a",{class:"header-anchor",href:"#page-data","aria-label":'Permalink to "Page Data"'},"​")],-1),g=s("h3",{id:"page-frontmatter",tabindex:"-1"},[a("Page Frontmatter "),s("a",{class:"header-anchor",href:"#page-frontmatter","aria-label":'Permalink to "Page Frontmatter"'},"​")],-1),c=s("h2",{id:"more",tabindex:"-1"},[a("More "),s("a",{class:"header-anchor",href:"#more","aria-label":'Permalink to "More"'},"​")],-1),m=s("p",null,[a("Check out the documentation for the "),s("a",{href:"https://vitepress.dev/reference/runtime-api#usedata",target:"_blank",rel:"noreferrer"},"full list of runtime APIs"),a(".")],-1),B=JSON.parse('{"title":"Runtime API Examples","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"api-examples.md","filePath":"api-examples.md","lastUpdated":1714277096000}'),u={name:"api-examples.md"},A=Object.assign(u,{setup(b){const{site:y,theme:n,page:t,frontmatter:l}=h();return(D,f)=>(k(),p("div",null,[d,s("pre",null,i(e(n)),1),o,s("pre",null,i(e(t)),1),g,s("pre",null,i(e(l)),1),c,m]))}});export{B as __pageData,A as default};