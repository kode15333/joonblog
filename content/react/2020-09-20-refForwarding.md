---
title: 'Ref Forwarding'
description: 'Ref Forwarding에 대해서 알아보자'
draft: false
template: 'post'
category: 'react'
tags:
    - js
    - react
date: 2020-09-20
---

## React.forwardRef를 사용해야 하는 이유

1. 리엑트의 컴포넌트는 캡슐화의 특징을 가지고 있다.
    - 컴포넌트 자체의 응집도를 높이고 의존도를 낮추기 위해 캡슐화
    - 캡슐화를 통해 컴포넌트의 내부의 로직이나 상태는 노출되지 않는다.
    - 사용하는 쪽은 DOM에 렌더링 될 HTML만 원하고 ref같은 객체를 원하지 않는다(?)
    - 함수를 구현할때도 부모 컴포넌트는 자식의 상태를 알지 못하고 함수만 내려줄 뿐이다.
2. ref객체도 props와 비슷하게 전달한다. 하지만 props와는 다르게 key의 속성과 비슷하다.
    - key는 컴포넌트의 속성으로 작성해도 내려가지 않는다.
3. ref는 React.forwardRef()를 통해 하위 컴포넌트로 전달 할 수 있다.
    - 전달 원리는 HOC(클래스 컴포넌트 동일)

### React.forwardRef 사용방법

1. React.createRef() 를 통해 ref 객체를 생성
2. 생성한 ref 객체를 자식 컴포넌트의 ref 속성으로 넘겨준다.
3. 자식 컴포넌트는 React.forwardRef를 감쏴 props와 ref객체를 받아올 수 있다.
4. 받아온 ref객체를 button 태그에 속성으로 넣는다.
5. ref.curret를 통해 DOM이 렌더링 된 후 button 객체 속성을 이용할 수 있다.

    ```jsx
    const FancyButton = React.forwardRef((props, ref) => (
        <button ref={ref} className="FancyButton">
            {props.children}
        </button>
    ))

    const ref = React.createRef()
    ;<FancyButton ref={ref}>Click me!</FancyButton>
    ```

### 직접 HOC 구현하면?

1. props를 통해 ref가 전달되지 않는다.
2. ref가 전달된곳은 LogProps 컴포넌트이다.
3. FancyButton은 렌더링 되지만 focus 함수 미작동

```jsx
function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return LogProps;
}

class FancyButton extends React.Component {
  focus() {
		this.props.handleClick(
  }

	reder(){
		return(
			<button ref={ref} className="FancyButton" onClick={this.focus}>
		    {props.children}
		  </button>
		)
}

export default logProps(FancyButton);

const ref = React.createRef();

<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;
```

## 그러면 방법이 없는건가?

1. logProps를 리턴값을 React.forwardRef 함수로 감싼다
2. props로 내리기전 ref라는 속성값대신 별도의 속성값을 통해 전달한다 .(forwardedRef)
3. props로 전달된 속성 중 ref값을 컴포넌트에 속성으로 넣어준다.

```jsx
function logProps(Component) {
    class LogProps extends React.Component {
        render() {
            const { forwardedRef, ...rest } = this.props
            return <Component ref={forwardedRef} {...rest} />
        }
    }
    return React.forwardRef((props, ref) => {
        return <LogProps {...props} forwardedRef={ref} />
    })
}
```

### 개발자 도구에서 Ref 이름

1. React.forwardRef의 콜백을 화살표 함수대신 함수정의문으로 넣는다.
2. 컴포넌트의 속성중 displayName을 활용

```jsx
// 화살표 함수 대신 일반함수 정의문으로 구현
const WrappedComponent = React.forwardRef(function myFunction(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />
})

function logProps(Component) {
    class LogProps extends React.Component {}

    function forwardRef(props, ref) {
        return <LogProps {...props} forwardedRef={ref} />
    }

    const name = Component.displayName || Component.name
    forwardRef.displayName = `logProps(${name})`

    return React.forwardRef(forwardRef)
}
```
