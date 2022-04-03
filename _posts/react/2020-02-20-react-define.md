---
title:  "React_정의와 개념"
description: "React에 대한 전체전인 정의와 개념을 정리"
draft: false
template: "post"
category : "react"
tags:
  - js
  - react
date: 2020-01-16
---
## React 주요 개념
1. [Hello World](https://ko.reactjs.org/docs/hello-world.html)

    ```js
    ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('root')
    );
    // <h1>Hello, world!</h1>, 태그를 document.getElementById('root')에 그려준다.
    ```

2. [JSX 소개](https://ko.reactjs.org/docs/rendering-elements.html)

    - 정의 : 리엑트에서 UI를 표현할 떄 쓰는 문법 / HTML 처럼 쓰면 되지만, 사실 HTML은 아니다.
    - 규칙
        1. 꼭 닫혀야 하는 태그, 꼭 감싸져 있는 태그, 객체형태의 style
        2. {}안에는 자바스크립트 표현식이 들어가야한다!!! 그래서 조건부 렌더링을 할때도 if 말고 3항 방정식을 사용
        3. 모든 항목은 렌더링 되기전 문자열로 변환
        4. JSX는 React.creatElement()로 컴파일 되며 virtual Dom의 노드형태로 변환

        ```jsx
        const element = (
            <h1 className="greeting">
                Hello, world!
            </h1>
            );
        1. 바벨은 JSX를 React.createElement()로 호출하여 컴파일한다.
        const element = React.createElement(
            'h1',
            {className: 'greeting'},
            'Hello, world!'
            );


        2. React Element는 이러한 JSON형태의 노드를 가상돔에 렌더링한다.
        const element = {
            type: 'h1',
            props: {
                className: 'greeting',
                children: 'Hello, world!'
            }
            };
        ```

    ```jsx
    // 1. 꼭 닫혀야 하는 태그
    render() {
        return (
        <div className="App">
            <input type ="text" /> // <<< 꼭 닫혀야 하는 태그
        </div>
        )

    // 2. 꼭 감싸져 있는 태그
    render() {
        return (
        <div className="App"> // <<< 감싸져 있는 태그
            <input type ="text" /> 
        </div> // <<< 감싸져 있는 태그
        )
    }

    //3. javascript 값을 사용하고 싶다면 중괄호 안에
    render() {
        const name = "jun"
        return (
        <div className="App">
            <div>
                {name} // <<< name이라는 값을 쓰기위해서 중괄호 사용
            </div>
        </div>
        )
    }

    //4. style은 객체형식으로 작성
    render() {
        const style = { color : "red"}
        return (
        <div className="App">
            <div style={style}> // <<< 객체 형태로 사용
                {name}
            </div>
        </div>
        )
    }
    ```


3. [엘리먼트 렌더링](https://ko.reactjs.org/docs/rendering-elements.html)

    - 정의 : 엘리먼트는 React앱의 가장 작은 단위 이며, 불변객체입니다.
    - 브라우저 DOM 엘리먼트와 달리 React 엘리먼트는 일반 객체이며(plain object) 쉽게 생성할 수 있습니다. 
    - React DOM(가상돔)은 React 엘리먼트와 일치하도록 DOM을 업데이트합니다.

4. [Component와 Props](https://ko.reactjs.org/docs/components-and-props.html)

    - Component : 컴포넌트는 자바스크립트 함수와 비슷하다. Props를 입력 받아 element를 반환한다.

        ```jsx
        function Welcome(props) {
        return <h1>Hello, {props.name}</h1>;
        }

        const element = <Welcome name="Sara" />;
         // Welcome이라는 함수에 "Sara"라는 input값을 주어 <h1>Hello, Sara</h1> 엘리먼트를 반환한다.
        ReactDOM.render(
        element,
        document.getElementById('root')
        );
        ```
    - Props : 읽기 전용 값이며, 컴포넌트에서 prop를 이용할때는 순수함수처럼 사용해야 한다.

5. [State](https://ko.reactjs.org/docs/state-and-lifecycle.html)

    - State : 컴포넌트(함수)안에서 사용하는 변수라고 생각하면 되며, state의 범위는 해당 컴포넌트까지 이다.

6. [이벤트 처리하기](https://ko.reactjs.org/docs/handling-events.html)

    - HTML의 이벤트를 카멜케이스로 작성하면 React 이벤트다
    - React에서는 return false를 하여도 기본동작을 방지할수가 없으므로, preventDefault()를 사용해준다.
    - JSX 콜백안에서는 this가 바인딩되어 있지 않다. 그러므로 화살표함수를 통해 해당 컴포넌트의 this를 사용하게 하여야한다.

7. [조건부 렌더링](https://ko.reactjs.org/docs/conditional-rendering.html)

    - 삼항식, if문을 만들어 즉시실행함수
    - 렌더링을 숨기고 싶다면 return 값을 null 반환하면 렌더링 되지 않는다.

    ```jsx
    function WarningBanner(props) {
        if (!props.warn) {
            return null;
        }

        return (
            <div className="warning">
            Warning!
            </div>
        );
    }
    ```

8. [리스트와 Key](https://ko.reactjs.org/docs/lists-and-keys.html)

    - Key는 React가 어떤 항목을 변경, 추가 또는 삭제할지 식별하는 것을 도우며. key는 엘리먼트에 안정적인 고유성을 부여하기 위해 배열 내부의 엘리먼트에 지정해야 합니다.
    - Key는 형재 사이에서 유일한 값이여야 한다.
    - index를 key로 쓰면 유일성 바뀔수 있으므로, index를 자재하여야 한다(추천 : shortid 라이브러리를 사용하여 유일한 값을 사용할수잇다.)

9. [폼](https://ko.reactjs.org/docs/forms.html)
    - form 엘리먼트는 React의 다른 element와 다르게 작동한다. 
    - state를 통해 사용자의 입력값과 관리하고 업데이트 합니다. => 신뢰 가능한 단일 출처로 만들어줌
    - react에 의해 값이 제어되는 입력 폼 엘리먼트를 제어 컴포넌트라고 한다.

10. [State 끌어올리기](https://ko.reactjs.org/docs/lifting-state-up.html)

    - 공통으로 사용 하는 state는 상위 컴포넌트로 올려 props로 내려주는 것이 효율적이다. 

11. [합성 vs 상속](https://ko.reactjs.org/docs/composition-vs-inheritance.html)

12. [React로 생각하기](https://ko.reactjs.org/docs/thinking-in-react.html)

### 결론 : jsx라고 생각하기 보다는 js라고 생각하고 구현을 한다면 조금 더 쉽게 개발을 할 수있다.
