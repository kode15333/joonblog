---
title: 'Optimizing Performance'
description: 'Optimizing Performance에 대해서 알아보자'
draft: false
template: 'post'
category: 'react'
tags:
    - js
    - react
date: 2020-10-18
---

> 리엑트는 내부적으로 최적화 되있다. But 더 빠르게 할 수 없을까?

## 내가 개발한 어플리케이션은 얼마나 최적화가 되있을까?

1. [크롬 개발자 도구의 Perfomance 탭 활용](https://calibreapp.com/blog/react-performance-profiling-optimization)
2. [리엑트 개발자도구 활용](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)

## 어떠한 부분을 어떻게 할까?

### Virtualize Long Lists

-   1000개 리스트를 보여주는 화면에서 처음 보여지는 리스트의 갯수는 20~30개 남짓
-   'Windowing' 기법을 활용하여 렌더링 시간을 줄이자
-   react-window, react-virtualized 같은 라이브러리를 활용하면 쉽게 window를 구현할 수 있다.

### Avoid Reconciliation

-   Component의 props와 state가 변경이 될때, diff 알고리즘을 통해 가상돔과 현재돔의 변화를 찾아 새롭게 돔을 업데이트 해준다
-   React.PureComponent를 활용하면 매번 얇은 비교(주소 비교)를 통해서 돔의 변화를 찾어 shouldComponentUpdatete 실행한다(React.PureComponent는 매번 실행하지 않음)
-   아래의 코드는 React.component와 React.PureComponent가 동일하게 작동하는걸 나타낸다.

```jsx
class CounterButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = { count: 1 }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.color !== nextProps.color) {
            return true
        }
        if (this.state.count !== nextState.count) {
            return true
        }
        return false
    }

    render() {
        return (
            <button
                color={this.props.color}
                onClick={() =>
                    this.setState((state) => ({ count: state.count + 1 }))
                }
            >
                Count: {this.state.count}
            </button>
        )
    }
}

class CounterButton extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = { count: 1 }
    }

    render() {
        return (
            <button
                color={this.props.color}
                onClick={() =>
                    this.setState((state) => ({ count: state.count + 1 }))
                }
            >
                Count: {this.state.count}
            </button>
        )
    }
}
```

-   React Compoenet Tree를 보면 shouldComponentUpdatete에서 true를 리턴한 컴포넌트만 리렌더링
-   shouldComponentUpdatete로 최적화를 구현됬다는걸 확인할 수 있다.

![vDOMEq](https://ko.reactjs.org/static/5ee1bdf4779af06072a17b7a0654f6db/cd039/should-component-update.png)

### 변화가 있다면, 지우고 다시 그리자

-   PureComponet는 얕은 비교로 주소값만 비교하고 안에 있는 데이터를 비교하지 않기때문
-   데이터에 따라 변경되는 리엑트가 바보가 될 수 있다.
-   데이터가 변경된다면, 새롭게 만들자

```jsx
// concat()
const array1 = ['a', 'b', 'c'];
const array2 = ['d', 'e', 'f'];
const array3 = array1.concat(array2);

console.log(array3);
// expected output: Array ["a", "b", "c", "d", "e", "f"]

// speard syntax
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};

// object.assign
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}

// object.assign => object spread properties
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

-   Immer를 통해 손쉽게 데이터를 핸들링 할 수 있다.
