## Badge组件
### 实现效果
![Badge组件](../images/badge-1.png)

首先理一下组件的需求：  
+ 基本功能，在按钮或图标的右上角，显示需要处理的消息数目
+ 状态，提供hidden隐藏功能
+ 进阶，可以单独使用，不用包裹任何元素
+ 功能完善，可以自定义最大显示数目，超出时显示 maxNum+
+ 功能完善，可以自定义展现形式为圆点

通过需求，来思考编写时的问题：  
- 单独使用时，如何去判断它所处的状态（是否包裹了子元素）?  
- 可以显示为数目，也可以显示为圆点。那么，怎么去实现这个效果？v-if v-else?
- 最大数目时，针对全局，怎么写的优雅一点，不通过v-if小于99时，显示number，v-else显示99+?

### step-1，实现基本显示功能
```javascript
<template>
  <div class="el-badge">
    <slot></slot>
    <sup
      v-show="!hidden"
      class="el-badge__content"
      :class="{'is-fixed': $slots.default}"
    >
      {{ value }}
    </sup>
  </div>
</template>

<script>
export default {
  name: 'ElBadge',
  props: {
    value: [Number, String],
    hidden: {
      type: Boolean,
      default: false
    }
  }
};
</script>

```
到这，我觉得有两点值得关注一下。  
+ $slots.default的应用，解决了判断是否包含子元素的问题。
+ 当前面这个问题解决后，就是单独使用时的展示问题。element的做法是，当需要显示在右上角时，  
进行absolute定位，通过transform，top，right进行位置调整。
```css
&__content.is-fixed {
    position: absolute;
    right: 10px;
    top: 0;
    transform: translateX(100%) translateY(-50%);
  }
```
这里的偏移转换还是很有意思的，这样的实现可以保证红色圆圈始终只与右边重合了10px。  
  
本来我还考虑的是top: -50%， right: -50%，但是发现并不是这么回事。css中百分比可以深入了解一下。

### step-2 实现圆点的展现形式、最大值判断
```javascript
<template>
  <div class="el-badge">
    <slot></slot>
    <sup
      v-show="!hidden"
      class="el-badge__content"
      :class="{'is-fixed': $slots.default, 'is-dot': isDot}"
    >
      {{ text }}
    </sup>
  </div>
</template>

<script>
  export default {
    name: 'ElBadge',
    props: {
      value: [Number, String],
      hidden: {
        type: Boolean,
        default: false
      },
      isDot: {
        type: Boolean,
        default: false
      },
      max: Number
    },

    computed: {
      text() {
        if (this.isDot) return;

        if (typeof this.value === 'number' && typeof this.max === 'number') {
          return this.value > this.max ? `${this.max}+` : this.value;
        }

        return this.value;
      }
    }
  };
</script>
```
```css
 &__content.is-dot {
    right: 5px;
    width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 50%;
  }
```
这里的computed属性，用的还是极好的。这样一来，展示的是text，至于是否需要圆点展示，是否有最大值限制  
都不用在html中做多余的判断了。