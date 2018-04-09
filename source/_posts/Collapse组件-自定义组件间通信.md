---
title: Collapse组件-自定义组件间通信
date: 2018-04-02 15:15:00
tags: [Element源码分析]
---
因为单向数据流的设计思想，在Vue2.x中，已经不支持$dispatch, $broadcast了。

![](/blog/images/10.png)

但是Element实现了一个弱化版的父子组件间通信方法，重新实现了一次$dispatch, $broadcast。

最终实现效果
------
{% jsfiddle huang_jusheng/zqx4s622 result %}

讲一下实现思路吧

 1. 对于dispatch，通过`vm.$parent`属性，找到父组件。然后通过`vm.$options`获取自定义属性componentName, 与调用时传入的参数做一个对比，来判断是否是需要响应的父组件
 2. 对于broadcast，通过`vm.$children`，遍历子组件，然后通过`vm.$options`获取自定义属性componentName, 与调用时传入的参数做一个对比，来判断是否是需要响应的子组件

vm.$options
-----------

![](/blog/images/11.png)

可以用来在组件中自定义属性的时候，通过实例属性`vm.$options`来获取。

vm.$parent
----------

![](/blog/images/12.png)

这个属性可以和`vm.$root`结合使用。

vm.$children
------------

![](/blog/images/13.png)

获取子组件的实例属性。

总结
--
通过自定义组件通信

 - 还是需要掌握一些vm的实例属性，这次学到`了$parent,$options,$children`的使用