---
title:  "Ref와 DOM"
description: "Ref와 DOM 대해서 알아보자"
draft: false
template: "post"
category : "react"
tags:
  - js
  - react
date: 2020-11-29
---
### Ref는 render 메서드에서 생성된 DOM 노드나 React 엘리먼트에 접근하는 방법

### Ref의 역할

- 일반적인 데이터 플로우에서 벗어나 직접적으로 자식을 수정해야 할 경우
  - 수정할 자식이 React 컴포넌트 인스턴스나, DOM 엘리먼트일 수도 있다
- (일반적인 데이터 플로우) 자식을 수정하려면, 새로운 Props를 전달하여 자식을 다시 렌더링
- Dialog 컴포넌트에서 open / close 함수를 구현하는 대신 isOpen props를 전달하여 관리

### Ref 사용처

- 포커스, 텍스트 선택영역, 혹은 미디어의 재생을 관리할 때
- 애니메이션을 직접적으로 실행시킬 때
- 서드 파티 DOM 라이브러리를 React와 같이 사용할 때

### Ref 생성

- 컴포넌트의 인스턴스가 마운트 될 때 React는 ref 콜백을 DOM 엘리먼트와 함께 호출합니다.
- 컴포넌트가 마운트될 때 React는 current 프로퍼티에 DOM 엘리먼트를 대입

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Ref에 접근하기

1) HTML Element

- ref.current 안 HTML 엘리먼트 기본 메서드 호출 및 상태를 변경할 수 있다.

```jsx
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    this.textInput.current.focus();
  }

  render() {
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

2) Class Component

- ref.current 안 component 인스턴스로 메서드 호출 및 상태를 변경할 수 있다.

```jsx
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

3) Functional Component

- 함수 컴포넌트는 인스턴스를 생성하지 않는 때문에, React.creatRef()를 사용 할 수 없다.
- hook의 forwardRef를 사용하여 구현 할 수 있다.

### Ref 수정/해제 시기

- 수정 : componentDidMount / componentDidUpdate  메서드가 호출되기 전
- 삭제 : 컴포넌트의 마운트가 해제될 때 current 프로퍼티를 다시 null

### 부모 컴포넌트에서 자식 컴포넌트의 DOM 노드에 접근하려 하는 경우

- 자식 컴포넌트의 캡슐화를 파괴하기 때문에 권장되지 않는다.
- 자식 컴포넌트의 DOM 노드를 포커스하는 일이나, 크기 또는 위치를 계산하는 일 등을 할 때는 효과적인 방법
- 함수형 컴포넌트는 React.forwardRef를 사용하거나, 16.2 이전일 경우 아래와 같이 ref를 설정할 수 있다.

```jsx
function CustomTextInput(props) {

  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```
