---
title: 'React + Jquery'
description: 'How to use Jquery in React'
draft: false
template: 'post'
category: 'react'
tags:
    - js
    - react
date: 2020-10-04
---

### 어떻게?

-   React는 외부 DOM에서 일어나는 변화를 인식하지 못한다.
-   만약, JQuery와 같이 동일한 DOM을 가지고 다룬다면 React는 당연히 헷갈린다
-   이러한 충돌을 피하는 가장 쉬운 방법은
    -   React 컴포넌트가 업데이트 되지 않게 막는 것
    -   제이쿼리를 사용하지 않는것....
-   업데이트가 되지 않는다 ⇒ 렌더링 할 요소의 자식이나 프로퍼티가 없다 ⇒ state, props가 없다.
-   메모리 누수 방지를 위해, unmount시 이벤트 리스너를 해제시켜 줘야한다.
    -   다수의 이벤트리스너는 메모리 누수와 애플리케이션 속도 저하를 야기한다
    -   [https://stackoverflow.com/questions/28627606/does-adding-too-many-event-listeners-affect-performance](https://stackoverflow.com/questions/28627606/does-adding-too-many-event-listeners-affect-performance)

```jsx
class SomePlugin extends React.Component {
    componentDidMount() {
        this.$el = $(this.el)
        this.$el.somePlugin()
    }

    componentWillUnmount() {
        this.$el.somePlugin('destroy')
    }

    render() {
        return <div ref={(el) => (this.el = el)} />
    }
}

function SomePlugin() {
    useEffect(() => {
        this.$el = $(this.el)
        this.$el.somePlugin()

        return () => this.$el.somePlugin('destroy')
    }, [])

    return <div ref={(el) => (this.el = el)} />
}
```

### Jquery Chosen 플러그인 사용하기

-   Chosen 컴포넌트는 Div를 통해 Select를 감싼다.

    -   JqueryChosen으로 인해 select 태그의 형제 태그로 생성되기 되기 때문
    -   리엑트는 단일 엘리먼트만 반환하기 때문

-   Jquery_chosen의 trigger를 활용하여 react가 Dom에 대한 변경을 감지 할 수 있게 해야 한다.

    -   React는 더이상 Dom을 관리하지 않기 때문

    ```jsx
    componentDidUpdate(prevProps) {
      if (prevProps.children !== this.props.children) {
        this.$el.trigger("chosen:updated");
      }
    }
    ```

-   전체코드

    ```jsx
    class Chosen extends React.Component {
      componentDidMount() {
        this.$el = $(this.el);
        this.$el.chosen();

        this.handleChange = this.handleChange.bind(this);
        this.$el.on('change', this.handleChange);
      }

      componentDidUpdate(prevProps) {
        if (prevProps.children !== this.props.children) {
          this.$el.trigger("chosen:updated");
        }
      }

      componentWillUnmount() {
        this.$el.off('change', this.handleChange);
        this.$el.chosen('destroy');
      }

      handleChange(e) {
        this.props.onChange(e.target.value);
      }

      render() {
        return (
          <div>
            <select className="Chosen-select" ref={el => this.el = el}>
    					// JQuery_Chosen이 추가하는 Node
              {this.props.children}
            </select>
          </div>
        );
      }

    function Example() {
      return (
        <Chosen onChange={value => console.log(value)}>
          <option>vanilla</option>
          <option>chocolate</option>
          <option>strawberry</option>
        </Chosen>
      );
    }
    ```

### 문자열 기반 렌더링을 React로 바꾸기

-   ReactDOM.render()는 앱처럼 크거나 버튼처럼 작은 UI의 독립적인 부분에 대해 여러 번 호출가능
    -   애플리케이션을 한 부분씩 작성 할 수 있다.
    -   기존의 서버에서 생성한 탬플릿 및 다른 클라이언트 사이드 코드와 결합이 쉽다.
    -   작게 만든다 ⇒ 하나로 합친다 ⇒ 계층 구조로 만들 수 있다.

```jsx
// JQuery
$('#container').html('<button id="btn">Say Hello</button>')
$('#btn').click(function () {
    alert('Hello!')
})

// React
function Button() {
    return <button id="btn">Say Hello</button>
}

ReactDOM.render(<Button />, document.getElementById('container'), function () {
    $('#btn').click(function () {
        alert('Hello!')
    })
})

// ID의 의존하지 않고, 컴포넌트 렌더링시 직접 등록
function Button(props) {
    return <button onClick={props.onClick}>Say Hello</button>
}

function HelloButton() {
    function handleClick() {
        alert('Hello!')
    }
    return <Button onClick={handleClick} />
}

ReactDOM.render(<HelloButton />, document.getElementById('container'))
```
