---
title:  "ES6 없이 사용하는 React"
description: "ES6 없이 사용하는 React에 대해서 알아보자"
draft: false
template: "post"
category : "react"
tags:
  - js
  - react
date: 2020-11-08
---
Q1. 현재 Class 문법을 활용하여 잘 사용하고 있는데... 만약 Class가 없다면?

1. create-react-class의 createReactClass를 활용
2. class 문법 또한 컴파일 되면 객체로 변환하기 때문 상관없다.
3. 사용하는 방법만 다를뿐, 만들어지는 결과나, 안의 속성은 같다.

```jsx
//es6 
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

//var 
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

Q2. defaultProps는 어떻게 사용?

1. es6에서도 class의 defaultProps의 속성에 접근해서 값을 할당한다.
2. createReactClass에서는 getMethod와 비슷한 getDefaultProps를 정의

```jsx
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};

var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

Q3. State 정의는?

1. props와 비슷하게 getInitialState를 정의한다.

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}

var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

Q4.  내부 method의 this 할당은?

1. class Properties를 활용한다면, 쉽게 this를 바인딩 하지 않아도 된다.
2. createReactClass의 내부 함수를 구현하므로 this는 createReactClass를 바라보기 때문에 this를 바인딩하지 않아도 된다.

```jsx
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // 경고: 이 문법은 실험적입니다!
  // 화살표 함수를 통해 메서드를 바인딩합니다.
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}

var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

### Mixins의 기능이 있지만, 공식 문서에서 추천하지 않는다.

createReactClass에서는 구현이 가능
