## AceNote
![](https://img.shields.io/badge/Build-pass-green.svg)
![](https://img.shields.io/badge/Platform-mac-default.svg)
![](https://img.shields.io/badge/License-MIT-blue.svg)

**AceNote** 是一个定制化的个人笔记系统。拥有和其它笔记系统一样的基础功能，同时你还可以把你的笔记推送到远程仓库进行版本管理。你也可以把笔记系统作为一个底层支持，使用上层应用，比如基于笔记构建自己的复习队列卡片和复习计划（todos：计划管理，时间管理，可视化管理）

[English](./README.md) | 中文版

## 为什么要造这个轮子
很简单，没有轮子，怎么造汽车... 话糙理不糙。在用过了一些常用的笔记系统后，发现常用的功能做的真的很棒了，笔记的存储，分类，tag，导出... 在用了两年换了一个新的笔记系统，转移笔记时，总是又似曾相识的感觉，这是我记得嘛？怎么没有印象...  再一想，这不就是妥妥的 **数据库** 嘛，提供了各种存储方式，分类方式，查询方式，我们忽略了一个重要的点就是，我们总感觉用笔记记下来的知识，就已经吸收了，但其实这只是做了一次搬运工，把网上的东西搬到 **数据库** 中；当然有的同学会用来做计划或其它的个人记录等（但是在可视化方面，单纯的笔记系统做的并不好），所以为了解决这些痛点，这个轮子就诞生了
* 对自己的笔记有绝对的控制权（版本化管理，本地编写，没有任何导出烦恼）
* 基于底层笔记系统支持，构建上层的笔记复习队列，帮助科学记忆（参考阿宾浩斯遗忘曲线和anki）
* 通用可视化管理（todos）
* 计划管理（todos）
* 时间跟踪（todos）

## 特性 & todos
### 版本 1.2.0
✨ 笔记标签管理

⚡ 优化 cardReview

⚡ 支持更多快捷键
* 全局快捷键
    * ⌘+f -> open search bar
    * ⌘+1 -> fold/unfold left sidebar
    * ⌘+2 -> fold/unfold the list of note

* Markdown 快捷键
    * ⌘+x -> delete one line
    * ⌘+b -> bold word
    * ⌘+d -> add strikethrough
    * ⌘+3 -> ###
    * ⌘+4 -> ####
    * ⌘+5 -> #####
    * ⌘+'  -> `

### 下个版本 todos
- [ ] 个人计划管理
- [ ] 优化 tag/cardReview 体验
- [ ] 支持打开 note 所在文件夹

## 日历版卡片式复习 说明
**日历版卡片式复习** 功能是参考[阿宾浩斯遗忘曲线](https://zh.wikipedia.org/zh-hk/%E9%81%97%E5%BF%98%E6%9B%B2%E7%BA%BF)和[anki](https://apps.ankiweb.net/)打造的一个 卡片式复习队列，目的是为了更好的帮助记忆所需要得知识。
你可以把需要复习的笔记加入到复习队列中，系统会自动生成该笔记的复习日历，进入到复习日历就可以查到所有卡片的复习记录和未来的复习计划，点击当天的待复习笔记，就可以进行复习，标记状态（只有当天的笔记才可以标记状态）

**具体的规则如下**
四种复习状态：🕳未复习，💔遗忘的，💘有点模糊，💖容易
- 每加入一个笔记到队列中，系统都会动态生成一个复习计划，复习间隔 0, 1, 3, 7, 14, 29, 69, 129 天
- 如果当天没有复习，那么系统会设置当天复习状态为🕳，且重置复习间隔
- 如果当天设置状态为💔，下次复习间隔会后退一步；比如当前是第三次复习，即复习间隔为3，那么设置该状态，下次复习间隔就变成1，即明天需要复习
- 如果当天设置状态为💘，下次复习间隔不变；比如当前是第三次复习，下次复习还是会2天后复习
- 如果当天设置状态为💖，则会按照计划进行复习


## 下载
[AceNote v1.3.0](https://github.com/Aceysx/ace-note/releases)

## 截图
![UTOOLS1582281300384.png](https://user-gold-cdn.xitu.io/2020/2/21/17067509e5d22251?w=3000&h=1874&f=png&s=433758)
![UTOOLS1584695830240.png](https://user-gold-cdn.xitu.io/2020/3/20/170f73b69d1dcda4?w=2984&h=1804&f=png&s=363014)
![UTOOLS1583501654699.png](https://user-gold-cdn.xitu.io/2020/3/6/170b00dbec37b579?w=3000&h=1874&f=png&s=288490)

![UTOOLS1583501770457.png](https://user-gold-cdn.xitu.io/2020/3/6/170b00f82ae0bfb8?w=3000&h=1874&f=png&s=257202)
![UTOOLS1583501801243.png](https://user-gold-cdn.xitu.io/2020/3/6/170b00ffbef29dd8?w=3000&h=1874&f=png&s=749549)

## 本地开发
1. git clone https://github.com/Aceysx/ace-note.git
2. npm install
3. npm start
4. electron app/main
5. npm run build:mac (package command)

>提示：当前只能打包mac版

