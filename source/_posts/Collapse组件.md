---
title: Collapse组件
date: 2018-04-06 22:39:48
tags: [Element源码分析]
---
**Collapse组件**的关键点在于，实现的时候不能写的太死，要给内容区域预留一定的定制化能力。

最终实现效果
---
https://viajes7.github.io/element-imitate/#/zh-CN/component/collapse

provide / inject
---
查看Element的实现细节，为了使组件的高度可定制化，分离了Collapse组件和Collapse-item组件。

Collapse组件用来管理当前展开哪个子组件，activeNames。这就涉及了一个问题，activeNames在父组件上，
那子组件怎么才能知道自己当前是不是应该处于展开状态了呢？

点击展开子组件的时候，子组件会发消息给父组件说，哎，我要展开内容区域了，你记录一下，然后父组件就记录下了。
这时候，通过props给每个子组件都传递这个activeNames么？

还有一个更简单的实现方式，`provide / inject`。

```javascript
// Collapse
<template>
  <div class="el-collapse" role="tablist" aria-multiselectable="true">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'ElCollapse',

    componentName: 'ElCollapse',

    props: {
      value: {
        type: [Array, String, Number],
        default() {
          return [];
        }
      }
    },

    data() {
      return {
        activeNames: [].concat(this.value)
      };
    },

    provide() {
      return {
        collapse: this
      };
    },
    
    created() {
      this.$on('item-click', this.handleItemClick);
    }
  };
</script>


// Collapse-item
<script>
  export default {
    name: 'ElCollapseItem',

    componentName: 'ElCollapseItem',

    inject: ['collapse'],

    // ...

    computed: {
      isActive() {
        return this.collapse.activeNames.indexOf(this.name) > -1;
      },
      // ...
    },

    methods: {
      // ...
      handleHeaderClick() {
        this.dispatch('ElCollapse', 'item-click', this);
        // ...
      }
    }
  };
</script>
```
看下一Vue官方文档中的解释，[provide / inject](https://cn.vuejs.org/v2/api/#provide-inject)
[](/blog/images/14.png)

总结
---
通过这个Collapse组件，至少可以学到三点
- 对于过渡动画，钩子函数的使用，以及封装
- 对于vm的实例属性，$parent,$children,$options的应用
- 对于祖先组件与子孙组件的数据依赖解决方案，provide/inject 
