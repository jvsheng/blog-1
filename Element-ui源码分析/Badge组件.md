## Badge组件
**Badge组件**主要用于数字或状态的标记，对于消息类的提醒功能，使用这组件还是很常见的。具体显示效果如下图：

![clipboard.png](/img/bV6BUj)

不管组件复杂还是简单，编码实现这个组件的都不是源码分析目的。
源码分析，在于通过一步步的实现这个功能，在这个过程中，看自己能学到什么，发现哪些问题。
然后通过这些问题，去扩展知识点，最终完成 <code> 实践 - 思考 - 扩展 </code> 这三步。

1.实现基本功能，按钮右上角显示消息
----------------------
[demo-1链接](https://jsfiddle.net/huang_jusheng/v37dsk1s/107/)

第一步的实现很简单，具体的可以看示例代码，主要点在于css的思路。

仔细看，标记相对于父元素，badge的显示区域定位时只有左上角的一小部分和父元素重叠。通过下面的css可以实现这个功能。

```
<div class="al-badge">
  <slot></slot>
  <span class="al-badge--content">{{value}}</span>
</div>
```

```
.al-badge {
  display: inline-block;
  position: relative;
}
.al-badge--content {
  position: absolute;
  right: 10px;
  top: 0;
  transform: translateX(100%) translateY(-50%);
}
```
开始的时候，我还想着怎么通过right + margin属性实现。但是看源码发现这种实现方式，感觉也是很简洁。**那么问题就来了，对于css的百分比单位，哪些属性可以设置呢？设置后他们的百分比又是相对于哪个元素？**

发现一篇写的很好的总结，可以看一下：[详述css中的百分比值](http://acgtofe.com/posts/2014/06/percentage-in-css)
**总结一下：**

 1. `widht & heiht`属性，百分比值相对于`包含块的宽高`
 2. `margin & padding`属性，百分比值相对于`包含块的宽度`
 3. `font-size`属性，百分比值相对于`直接父元素的font-size`
 4. `line-height`属性，百分比值相对于自身元素的`font-size`
 5. `vertical-align`属性，百分比值相对于自身元素的`line-height`
 6. `top/left/right/bottom`属性，百分比值相对于`包含块宽高`
 7. `translate`中，百分比值相对于`自身元素border-box盒模型的宽高`

2.实现最大值判断，超过最大值max时，显示内容为max+
-----------------------------
[demo-2链接](https://jsfiddle.net/huang_jusheng/v37dsk1s/123/)

一开始，对于这个需求，我的实现思路是这样的:

```
<div class="al-badge">
  <slot></slot>
  <span class="al-badge--content" v-if="value <= max">{{value}}</span>
  <span class="al-badge--content" v-if="value > max">{{max+}}</span>
</div>
```
这算是自己在初期经常容易犯的一个问题吧。**滥用v-if v-else**。
一个好的组件，实现起来，模板一眼看过去，就应该是很简洁的。过多的v-if只会越读越糟心，后期维护以及增加新的需求时，也容易各种踩坑。

ok，我们来重新梳理一下上面这段html，两个v-if的模板，只是针对于不同条件下，内容显示不同而已。所以，可不可以**增加一个computed属性**，在js这一层进行简化？看下面这一段简化后的：

```
let ElBadge = {
  name: 'ElBadge',
  //.....
  computed: {
  	content: function() {
    	if(typeof this.value === 'number' && typeof this.max === 'number') {
      	return this.value > this.max ? `${this.max}+` : this.value; 
      }
      return this.value;
    }
  }
};
```

3.增加展现形式，可以显示为小圆点或单独使用
----------------------
[demo-3链接](https://jsfiddle.net/huang_jusheng/v37dsk1s/)

对于这个功能，首先需要解决的是，**怎么判断组件是单独使用，还是包裹了一个子元素**？

看下Vue关于内容分发的文档：https://cn.vuejs.org/v2/api/#vm-slots

![clipboard.png](/img/bV6Cdt)

好，这样通过<code>$slots.default</code>可以解决这个问题了，那么模板上怎么体现这个区别呢？v-if新增单独使用的情况？和上一点类似，我们需要保证html模板的简洁，所以通过css类名来做区别，当单独使用的时候，就不想对于左上角进行定位了。

```
<div class="al-badge">
  <slot></slot>
  <span v-show="!hidden" 
        class="al-badge--content"
        :class="[
            isDot && 'is-dot', 
            $slots.default && 'is-fixed'
        ]">
       {{content}}
  </span>
</div>
```

```
.al-badge--content {
  //.....
  &.is-fixed {
    position: absolute;
    right: 10px;
    top: 0;
    transform: translateX(100%) translateY(-50%);
  }

  &.is-dot {
    right: 5px;
    width: 8px;
    height: 8px;
    padding: 0;
  }
}
```

总结
---
通过**Badge组件**

 - 学到了模板代码的正确组织方式，如何通过computed，css类名等来简化模板的编写，使其更加清晰可读。
 - 以及$slots.default API的使用
 - 扩展了对于css百分比值的认识。

参考文献：

 1. [详述css中的百分比值](http://acgtofe.com/posts/2014/06/percentage-in-css)

