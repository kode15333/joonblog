---
title: 'PropTypes Type Check'
description: 'PropTypes Type Check에 대해서 알아보자'
draft: false
template: 'post'
category: 'react'
tags:
    - js
    - react
date: 2020-12-20
---

### 1. Type Check하면 애플리케이션의 오류를 미리 잡을 수 있다??

-   자바스크립트 초기 로딩시! 문법이 맞는지만 확인하기 때문
-   실행해야지만, 오류를 확인할 수 있다.
-   이러한 문제를 해결하기 위해 TypeScript / Flow를 사용하여 미리 에러를 확인을 할 수 있다.
-   하지만, React에 내장된 PropType를 사용하면 손쉽게 타입을 체크할 수 있다.

### 2. 사용방법

-   해당 Class의 propTypes를 정의한다.(함수형 컴포넌트, React.memo, React.forwardRef와 동일)
-   `Greeting.propTypes`와 같이 정의하면 해당 컴포넌트의 Props가 전달이 되면!!
-   유효성 검사기([props-types 내장된](https://ko.reactjs.org/docs/typechecking-with-proptypes.html#proptypes) )로 보내시고, 타입이 맞다면 Pass / 틀리다면 Console 창에 경고가 발생!!

```jsx
import PropTypes from 'prop-types'

// class형 컴포넌트
class Greeting extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>
    }
}

Greeting.propTypes = {
    name: PropTypes.string,
}

// 함수형 컴포넌트
function HelloWorldComponent({ name }) {
    return <div>Hello, {name}</div>
}

HelloWorldComponent.propTypes = {
    name: PropTypes.string,
}
```

### 3. PropsType의 초기 Props 값 할당

-   Props의 없다면, 에러가 발생한다. 별도의 Props가 없다는 표현식을 작성하는것 보다
-   초기 Props를 할당하여, 대처를 하자

```jsx
class Greeting extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>
    }
}

// props의 초깃값을 정의합니다.
Greeting.defaultProps = {
    name: 'Stranger',
}

// "Hello, Stranger"를 랜더링 합니다.
ReactDOM.render(<Greeting />, document.getElementById('example'))
```

-   클래스 내에 정적 프로퍼티를 선언해서 쓴다면, 아래와 같이 쓸수 있다.

```jsx
class Greeting extends React.Component {
    static defaultProps = {
        name: 'stranger',
    }

    render() {
        return <div>Hello, {this.props.name}</div>
    }
}
```
