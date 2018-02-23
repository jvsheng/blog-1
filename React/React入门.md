## React入门
**【为什么要学React】**  
其实一直以来，对于React，是有点拒绝的。特别是看到JSX的语法，JS和HTML混写在一起，简直有种这是坨什么的既视感。

昨天突然看到掘金上的一个链接，国内一群大神翻译了一本React入门教程，既然React这么火，要不试试？而且里面还包括了Redux，缓存，搜索优化等的内容，反正看了也不吃亏。

链接在这：[React 学习之道》我们翻译了一本最简单，且最实用的 React 实战教程……](https://zhuanlan.zhihu.com/p/33305494)

**【笔记】**  
**1.React基础**  
组件内部状态
组件内部状态也被称为局部涨停，允许保存、修改和删除存储在组件内部的属性。（类似于Vue的props和data?）

ES6编写的组件有一个构造函数时，需要强制地调用super( )方法。
```javascript
Class App extends Component {
  constructor(props) {
      super(props);
  }
}
```

**2.ES6对象初始化**  
```javascript
// 简写属性
// ES5
const name = 'Robin';
const user = {
  name: name
};
// ES6
const name = 'Robin';
const user = {
  name
};

// 简写方法名
// ES5
var userService = {
  getUserName: function (user) {
    return user.firstname + ' ' + user.lastname;
  }
};
// ES6
var userService = {
  getUserName(user) {
    return user.firstname + ' ' + user.lastname;
  }
};

// 计算属性名
// ES5
var user = {
  name: 'Robin'
};
// ES6
const key = 'name';
const user = {
  [key]: 'Robin'
};
```

**3.单向数据流**  
![image](https://user-images.githubusercontent.com/35365161/35478969-f34b6494-0425-11e8-9fed-82811389390b.png)

**4.绑定**  
为什么要在构造函数中绑定方法？ -> **类方法不会自动绑定到this实例上。**
React官方文档中坚持在构造函数中绑定类方法。

**5.事件处理**  
![image](https://user-images.githubusercontent.com/35365161/35479009-ddfcbca4-0426-11e8-9d5e-ba3616abb286.png)
类方法在打开程序时会立即执行！由于监听表达式是函数执行的返回值而不再是函数，所以点击按钮不会有任何事发生。

**6.和表单交互**  
完成了一个搜索过滤的功能，和vue, ng的感觉还是不太一样。对于vue，ng，在列表渲染的时候有repeat指令，做过滤的话可以直接在这使用过滤器实现。
  
但是在React中，JSX的语法，使得可以通过filter, map的混合使用，实现相同的功能。
![image](https://user-images.githubusercontent.com/35365161/35479197-6a24c21c-042c-11e8-8866-36305ad2789a.png)

**7.ES6解构**  
![image](https://user-images.githubusercontent.com/35365161/35479209-aea33fa4-042c-11e8-86d2-986d34633e33.png)
所以，在JSX中，不用每次都写this.state.XXX了。

**8.受控组件**  
表单元素会以原生HTML的形式保存自己的状态。一旦有人从外部做了修改，它们就会修改内部的值，在React中这被称为不受控组件，因为他们自己处理状态。
解决方法：
![image](https://user-images.githubusercontent.com/35365161/35479463-289c3a8a-0433-11e8-997f-60eb782c5dc9.png)

**9.拆分组件**  

**10.可组合组件**  
在props对象中海油一个属性可供使用：children属性，通过它可以将元素从上层传递到你的组件中，这些元素对于组件来说是未知的，但是却为组件相互组合提供了可能性。
可以理解为slot吧

**11.可复用组件**  
可复用和可组合组件让你能够思考合理的组件分层，它们是React视图层的基础。
示例：button

**12.无状态组件**  
这类组件就是函数，它们接收一个输入并返回一个输出。输入是props，输出就是一个普通的JSX组件实例。无状态组件是没有生命周期方法的。

**总结**  
![image](https://user-images.githubusercontent.com/35365161/35479912-fec2d0ec-043d-11e8-9473-6691635d298b.png)

**13.生命周期**  
挂载过程中的四个生命周期方法  
![image](https://user-images.githubusercontent.com/35365161/35499753-afcb1568-050e-11e8-8f34-9daa653df4fa.png)

组件的状态或者属性改变的时候的生命周期  
![image](https://user-images.githubusercontent.com/35365161/35499756-b612d2bc-050e-11e8-96e7-0914ab042342.png)

**14.扩展操作符**  
React用户不可变的数据，不应该改变一个对象。更好的做法是基于现在拥有的资源来创建一个新的对象。这样就没有任何对象被改变。这样做的好处是数据结构将保持不变，因为总是返回一个新的对象，而之前的对象保持不变。
Object.assign( )  
![image](https://user-images.githubusercontent.com/35365161/35500123-56d6518c-0510-11e8-9b4a-9b97c8880abf.png)

扩展操作符-数组  
![image](https://user-images.githubusercontent.com/35365161/35500149-768040c4-0510-11e8-8406-ea36a8e97fbb.png)

扩展操作符-对象  
![image](https://user-images.githubusercontent.com/35365161/35500192-926af752-0510-11e8-9144-68ae2a714a64.png)

**15.条件渲染**  
if-else、三目运算、&&  
![image](https://user-images.githubusercontent.com/35365161/35500380-42f611e2-0511-11e8-9180-2b693b8d2079.png)
















