---
title: Collapse组件-过渡动画
date: 2018-03-30 15:08:56
tags: [Element源码分析]
---
**Collapse组件**在做内容折叠与展开显示的时候，还是用到很多的。这一个组件的内容相对于**Badge**和**Tag组件**更多一点，所以打算分成三篇文章来讲。

![实现效果](/blog/images/8.png)

高度不固定的css动画
-----------
第一篇先来讲一讲对于高度不确定的元素，怎么做高度的展开动画效果。

看一下大佬对`transition为什么不能对height：auto实现过渡动画`的解释：

![height:auto为什么不能产生过渡动画](/blog/images/9.png)

这里贴一个css trick上对于这种问题的解决方案：[Using CSS Transitions on Auto Dimensions](https://css-tricks.com/using-css-transitions-auto-dimensions/)

说一下在element-ui中的实现思路吧:

 1. 通过transition的钩子函数 + render渲染函数，我们来自定义一个过渡效果，由JS来掌控变化的值
 2. 展开时，height从` 0 逐步增大到 scrollHeight`
 3. 收缩时，height从` scrollHeight 逐步减小到 0`

过渡动画最终实现效果
----------
{% jsfiddle huang_jusheng/ov3rvppd result %}

scrollHeight, paddingSize
-------------------------
通过自适应文本高度的输入框那篇文章，我们已经了解到scrollHeight的高度是包含了padding的，所以`在这里的动画时，需要对padding-top，padding-bottom，height三个属性都做变化。`

其次，对于展开时高度的值，需要scrollHeight - paddingSize

```javascript
let Transition = {
  beforeEnter(el) {
    if (!el.dataset) el.dataset = {};
    let styles = window.getComputedStyle(el);
    // 记录展开前的属性值
    el.dataset.oldOverflow = styles.getPropertyValue('overflow');
    el.dataset.oldPaddingTop = styles.getPropertyValue('padding-top');
    el.dataset.oldPaddingBottom = styles.getPropertyValue('padding-bottom');
    // 这三个都为0，scrollHeight的高度就是真实的内容高度了
    el.style.height = 0;
    el.style.paddingTop = 0;
    el.style.paddingBottom = 0;
    el.classList.add('collapse-transition');
    el.style.overflow = 'hidden';
  },

  enter(el) {
    if (el.scrollHeight !== 0) {
      // 动画过程中，逐渐增大到展开前应占的高度值
      el.style.height = el.scrollHeight + 'px';
      el.style.paddingTop = el.dataset.oldPaddingTop;
      el.style.paddingBottom = el.dataset.oldPaddingBottom;
    }
  },

  afterEnter(el) {
    el.classList.remove('collapse-transition');
    el.style.height = '';
    el.style.overflow = el.dataset.oldOverflow;
  }

  // ....
}
```

重绘与重排
-----
观察jsfiddle的demo示例代码，会发现这句
```javascript
let Transition = {
  // ...
  leave(el) {
    if (el.scrollHeight !== 0) {
      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    }
  }
  // ...
}
```
`为什么要加el.scrollHeight !== 0的判断呢？`

试一下，如果不加这个判断，直接变化height,paddingTop,paddingBottom的值到0，这个时候，收缩时并不会有过渡动画，元素马上就消失了。

我们可以替换一下上面的代码

```javascript
let Transition =  {
  // ...
  leave(el) {
    setTimeout(() => {
      el.style.height = 0;
      el.style.paddingTop = 0;
      el.style.paddingBottom = 0;
    }, 20)
  }
  // ...
}
```
这时候，收缩也会有过渡动画。但当我们尝试将延迟时间改为0的时候，并无效，延迟时间需要大于0才会有过渡效果。所以，这个过渡动画似乎和执行队列就没什么关联了。

接下来，`我们把目标锁定在了重绘和重排上。`

着重看一下大佬的这篇文章：[高性能JavaScript 重排与重绘](http://www.cnblogs.com/zichi/p/4720000.html)

1.**什么是重排和重绘**
浏览器解析页面生成`DOM树`和`渲染树`，DOM树表示节点结构，渲染树表示节点如何显示。
DOM树节点的属性发生变化时，浏览器可能会重新计算去绘制渲染树，这个过程叫`重排`，渲染树映射到屏幕上显示的过程就叫`重绘`。

2.**重排什么时候发生**
`每次重排，必然会导致重绘，那么，重排会在哪些情况下发生？`

 1. 添加或者删除可见的DOM元素
 2. 元素位置改变
 3. 元素尺寸改变
 4. 元素内容改变（例如：一个文本被另一个不同尺寸的图片替代）
 5. 页面渲染初始化（这个无法避免）
 6. 浏览器窗口尺寸改变
`可以总结为，当一个节点的位置、大小、内容发生改变，或者增删节点的情况下会发生重排。`

3.**渲染树变化的排队和刷新**
`浏览器会把多次对节点的修改“保存”起来（大多数浏览器通过队列化修改并批量执行来优化重排过程），最终一次完成！但是，有些时候你可能会（经常是不知不觉）强制刷新队列并要求计划任务立即执行`。获取布局信息的操作会导致队列刷新，比如：

 1. offsetTop, offsetLeft, offsetWidth, offsetHeight（节点位置）
 2. scrollTop, scrollLeft, scrollWidth, scrollHeight（节点位置、大小）
 3. clientTop, clientLeft, clientWidth, clientHeight（节点大小）
 4. getComputedStyle() (currentStyle in IE)（节点样式）
可以这么理解，要获取这些值，浏览器就需要把前面缓存的重排操作先给执行了，才能计算最新的，正确的节点信息。而这种中断，打断了浏览器自身对于重排的优化，是需要我们避免的。

4.**最小化重排和重绘**
虽然浏览器对重排进行了优化，但我们不经意的操作会打断这种优化。所以，修改样式信息时，尽量集中操作

5.**fragment元素的应用**
`前面说了，重排大多数都是由于节点位置、大小，增删造成的。节点位置，大小的改变我们可以通过集中操作来规范以优化性能。而对于节点的增删就可以通过fragment元素，来避免频繁的重排和重绘了`。

`尽量不要在布局信息改变时做查询（会导致渲染队列强制刷新）`
`同一个DOM的多个属性改变可以写在一起（减少DOM访问，同时把强制渲染队列刷新的风险降为0）`
`如果要批量添加DOM，可以先让元素脱离文档流，操作完后再带入文档流，这样只会触发一次重排（fragment元素的应用）`

我们再看一下出问题的这段代码，如果不加scrollHeight的时候：

```javascript
let Transition = {
  // ...
  beforeLeave(el) {
    // ...
    el.style.height = el.scrollHeight - parseFloat(el.dataset.oldPaddingTop) - parseFloat(el.dataset.oldPaddingBottom) + 'px';
    el.style.overflow = 'hidden';
    el.classList.add('collapse-transition');

    //var tmp = el.offsetTop;
  },

  leave(el) {
    el.style.height = 0;
    el.style.paddingTop = 0;
    el.style.paddingBottom = 0;
  },

  afterLeave(el) {
    //...
  }
}
```
我们进行了一系列操作，浏览器缓存了这几次的重排。等到主线程结束，开始渲染的时候，直接就往下一直渲染到了height:0;这句。所以就没有了过渡动画。
而加上大于零的定时器，应该是由于，1.先运行js主线程。2.执行重排重绘。3.执行定时回调，变化height的值

可以试下，讲注释的这行代码（var tmp = el.offsetTop;）加入，也有过渡动画效果。
结合上面对重排和重绘的学习，可以很容易的理解到：这一句代码强制刷新了重排的队列。让前面设置的属性，增加的过渡效果的类名。让它先渲染好，然后运行到leave函数的时候，再变化高度值，transition就起作用了。

总结
--
通过过渡效果的实现：

 - 学到了一种新的思路，如果利用render+transition钩子函数，自己生成一个JS掌控的transition
 - 重排与重绘对于性能的影响，以及编程中需要注意的点

**参考文章：**
1.[Using CSS Transitions on Auto Dimensions](https://css-tricks.com/using-css-transitions-auto-dimensions/)
2.[css3怎么实现高度从固定到自动的过渡动画？](https://www.zhihu.com/question/35991373/answer/130256417)
3.[高性能JavaScript 重排与重绘](http://www.cnblogs.com/zichi/p/4720000.html)