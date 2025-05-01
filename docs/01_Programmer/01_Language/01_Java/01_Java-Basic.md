# 01_Java-Basic

[[toc]]

```ts{4-5}
export default defineConfig({
  lang: 'zh-CN', 
  title: "VitePress", 
  description: "我的vitpress文档教程", // [!code  --]
  description: "更详细的vitpress中文文档教程", // [!code  ++]
  titleTemplate: '另起标题覆盖title' ,
})
```

<details>
  <summary>点我展开</summary>
  Markdown默认折叠语法，Vitepress可以使用容器折叠语法，更加美观
</details>

::: info
这是一条信息，info后面的文字可修改
:::

::: tip 说明
这是一个提示，tip后面的文字可修改
:::

::: warning 警告
这是一条警告，warning后面的文字可修改
:::

::: danger 危险
这是一个危险警告，danger后面的文字可修改
:::

::: details 点我查看
这是一条详情，details后面的文字可修改
:::

```ts{2-3,5}
export default defineConfig({
  lang: 'zh-CN',
  title: "VitePress",
  description: "我的vitpress文档教程",
  titleTemplate: '另起标题覆盖title' ,
})
```

```ts{4}
export default defineConfig({
  lang: 'zh-CN',
  title: "VitePress",
  description: "我的vitpress文档教程", // [!code  focus]
  titleTemplate: '另起标题覆盖title' ,
})
```

```ts{4-5}
export default defineConfig({
  lang: 'zh-CN', 
  title: "VitePress", 
  description: "我的vitpress文档教程", // [!code  error]
  description: "更详细的vitpress中文文档教程", // [!code  warning]
  titleTemplate: '另起标题覆盖title' ,
})
```

::: code-group

```sh [pnpm]
#查询pnpm版本
pnpm -v
```

```sh [yarn]
#查询yarn版本
yarn -v
```

:::


## 1. 变量

![](https://ameng000.oss-cn-chengdu.aliyuncs.com/vitepress-blog/20240427191931.png)

# aaaa

## 2. 基本类型

### 1.1 基本类型

#### 1.1.1.1 test

Java语言支持以下基本类型：

- 整数类型：byte、short、int、long
- 浮点类型：float、double   
- 字符类型：char
- 布尔类型：boolean

### 1.2 引用类型

Java语言支持以下引用类型：

- 类：类、接口、注解
- 数组：int[]、double[]、String[]
- 枚举：enum
- 注解：@interface

### 1.3 变量声明

变量声明语法：

```java
数据类型 变量名 = 初始值;
```

例如：

```java
int age = 25;
double salary = 5000.0;
char grade = 'A';
boolean isMarried = true;
```

### 1.4 变量作用域

Java语言中，变量的作用域分为以下几种：

- 局部变量：在方法、构造方法、代码块中声明的变量，只在当前作用域内有效。