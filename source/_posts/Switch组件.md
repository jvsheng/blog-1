---
title: Switch组件
date: 2018-04-12 09:31:30
tags:
---
**Switch组件**，业务需求中经常遇到。我司的旧项目中，由于没有使用较为成熟点的组件库。自己实现了一个switch组件，但是实现的略微有些丑陋。

实现基本需求
------
{% jsfiddle huang_jusheng/La5koerg/69 result %}

这里，需要实现基础的**切换功能和禁用功能**。
```html
<template id="switch">
  <div class="el-switch" 
       @click="handleChange"
       :class="{'is-checked': value, 'is-disabled': disabled}">
    <input type="checkbox" ref="input">
    <span class="el-switch__content">
      <span class="el-switch__button" :style="{transform}"></span>
	</span>
  </div>
</template>
```
```javascript
let ElSwitch = {
  name: 'ElSwitch',
  template: '#switch',

  props: {
    value: {
      type: [Boolean],
      default: false
    },
    disabled: {
      type: [Boolean],
      default: false
    }
  },

  computed: {
    transform() {
      return this.value ? `translate3d(20px, 0, 0)` : '';
    }
  },

  methods: {
    handleChange() {
      if (!this.disabled) {
        this.$emit('input', !this.value);
        this.$nextTick(() => {
          this.$refs.input.checked = this.value;
        });
      }
    }
  },

  mounted() {
    this.$refs.input.checked = this.value;
  }
};
```
这里需要注意一点，对于自定义的表单组件，Element绑定值到组件中，是用的v-model。而v-model只是一个语法糖，是以下这种的简化形式：
```html
<input v-model="something">

<input
  v-bind:value="something"
  v-on:input="something = $event.target.value">
````

所以，为了当组件内部值发生改变的时候，可以将变化的值传出来，需要使用这句：
```javascript
this.$emit('input', value);
```
更具体的，可以参考Vue文档：[使用自定义事件的表单输入组件](https://cn.vuejs.org/v2/guide/components.html#%E4%BD%BF%E7%94%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%8B%E4%BB%B6%E7%9A%84%E8%A1%A8%E5%8D%95%E8%BE%93%E5%85%A5%E7%BB%84%E4%BB%B6)

其次，我们在模板中加了一个 type：checkbox 的input。这不是摆设，当switch组件用在表单中的时候，可能会用到`form.name.checked`。所以，我们需要在值改变的时候，也改变input.chekced属性。**这里存在一个时机问题吧，因为v-model绑定了值到组件中，组件中不能直接修改这个值为true来进行改变，需要触发input事件，所以，这里checked的改变需要等到下一次渲染的时候，再进行设置**。

自定义activeValue、背景色、宽度
---------------------
https://jsfiddle.net/huang_jusheng/La5koerg/

自定义activeValue的点在于，有些情况下，switch的值可能是0、1.不能确定就一定是true或者false

emm....实现了下，发现也没什么难点，主要关注下改变背景色这一段的代码吧，我觉得写着还是挺好的
```javascript
let ElSwitch = {
  name: 'ElSwitch',
  template: '#switch',

  props: {
    // ...
  },

  computed: {
    checked() {
      return this.value === this.activeValue;
    },
    // ...
  },

  methods: {
    handleChange() {
      //...
    },

    setBackgroundColor() {
      let newColor = this.checked ? this.activeColor : this.inactiveColor;
      this.$refs.content.style.borderColor = newColor;
      this.$refs.content.style.backgroundColor = newColor;
    }
  },

  watch: {
    checked() {
      this.$refs.input.checked = this.value;
      if (this.activeColor || this.inactiveColor) {
        this.setBackgroundColor();
      }
    }
  },

  created() {
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.value)) {
      this.$emit('input', this.inactiveValue);
    }
  },

  mounted() {
    this.$refs.input.checked = this.checked;
    if (this.activeColor || this.inactiveColor) {
      this.setBackgroundColor();
    }
  }
};
```
改变背景颜色，是发生在`this.$emit('input'，value)`之后的，这有一个执行顺序的问题。如果在this.$nextTick中进行改变背景色也行，效果一样，只是handleChange的代码长一点。但这里通过监听computed属性（checked），来做响应式改变，代码，emm....，感觉是更加清晰了点吧。

总结
--
Switch插件的编写不是很难，可以关注两点：
- 通过watch监听computed属性，作为初学者，这点以后可以关注一下
- 多巧用ref，获取节点、设置属性很方便