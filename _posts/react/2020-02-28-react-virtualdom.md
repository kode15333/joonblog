---
title:  "Virtual DOM"
description: "리엑트안에서의 가상돔은 어떻게 작동을 할까?"
draft: false
template: "post"
category : "react"
tags:
  - js
  - react
date: 2020-02-27
---
## Virtual Dom에 대해서

1. DOM(Document Object Model)
    - HTML은 program, DOM Process << 메모리내에 표현된 HTML이라고 볼수도 있다.
    - HTML을 태그와 요소를 기준으로 트리구조 형태로 나타낸 객체 추상화 모델
    - DOM에서 제공하는 API를(getElementById()...) 통해 요소에 접근하거나 조작 할 수있다.

    ```html
    <!doctype html>
    <html>
      <head>
        <title>제목입니다</title>
      </head>
      <body>
        <a href="">링크입니다</a>
        <p>단락입니다.</p>
      </body>
    </html>
    ```

    ![Dom](http://tcpschool.com/lectures/img_js_htmldom.png)

2. DOM을 계속 사용하지 왜 `Virtual Dom`을 사용할까?
    - DOM에서 새로운 노드를 추가하거나, 삭제하면 DOM을 다시 그림
        - 단, 특정 노드를 수정한다면 그 노드만 바뀜(DOM을 다시 안그림)
    - 웹 어플리케이션을 거대해지면서 DOM은 더욱더 커지고 부분 노드를 찾아 업데이트 하는게 어려움
    - 또한 SPA로 변화하면서 수많은 노드가 삭제/생성으로 인해 속도가 느려진다.
    - 결론 : DOM이 깊어지고 거대해지면, 변경하는데 cost가 높음

3. Virtual DOM 등장
    - DOM을 사용하면 생기는 이슈로 인해 새로운 해결책 등장
    - DOM을 추상화한게 Virtual DOM이다
    - Virtual DOM은 JSON 객체로 DOM을 표현한것
    - Virtual DOM으로 DOM을 바꾸는건 3단계 과정이다.

    1. 노드가 업데이트(수정, 삭제, 생성) 될때마다 Virtual DOM이 바뀐다
    ![가상돔 생성](https://github.com/sudheerj/reactjs-interview-questions/raw/master../../assets/vdom1.png)

    2. 변경 전 Virtual DOM 이랑 변경 할 Virtual DOM 사이의 차이를 계산한다
    ![리엑트가 전에 있던 가상돔과 비교하여 새로운 가상돔을 생성](https://github.com/sudheerj/reactjs-interview-questions/raw/master../../assets/vdom2.png)

    3. 계산이 완료되면 변경된 부분만 DOM에 업데이트 한다.
    ![업데이트 된 돔](https://github.com/sudheerj/reactjs-interview-questions/raw/master../../assets/vdom3.png)

4. React에서 Virtual DOM
    - Virtual DOM의 노드는 React Element로 구성 되어있다.
    - React Element는 React Componenet로 부터 반환되는 것이다.
    - React Component를 통해 React Element를 동적으로 만들어 반환하면 그 Element를 가상돔에 적용시켜 변경된 가상돔을 그 이전 가상돔과 비교하여 DOM을 업데이트 시켜준다

0. Shadow DOM 과의 차이
    - Shadow DOM은 주로 웹 구성요소의 범위 지정 변수와 CSS를 위해 설계된 브라우저 기술이다. 쉽게 설명하자면, input에 타입으로 변화로 인해 화면에 보여지는 input이 달라진다.

    ```html
    <input type="button">
    <input type="checkbox">
    <input type="color">
    <input type="date">
    <input type="datetime-local">
    <input type="email">
    <input type="file">

    // 같은 input 태그지만, 화면에서 보여지는 것을 다 다르다.
    // 개발자 도구를 통해 DOM을 확인해보아도 input 태그만 보여질뿐 별도의 CSS가 보이지 않는데
    // 이러한걸 Shadow DOM이라고 부른다.
    ```
     - Virtual DOM은 브라우저 API 위에 있는 JavaScript의 라이브러리에 의해 구현된 개념이다.

