---
title: 'Drag and Drop Api'
description: 'HTML5 API에서 지원하는 Drag and Drop Api 정리'
draft: false
template: 'post'
category: 'etc'
tags:
    - etc
    - html5
date: 2020-01-16
---

## [Drag and Drop](https://developer.mozilla.org/ko/docs/Web/API/HTML_%EB%93%9C%EB%9E%98%EA%B7%B8_%EC%95%A4_%EB%93%9C%EB%A1%AD_API/Drag_operations)

1. 정의 : 요소를 드래그해서 새로운 요소로 이동하는 것!(HTML 5)

2. 속성 및 이벤트 종류

    - 속성 : dataTransfer
    - 이벤트의 종류
        - drag : 마우스 드래그 했을떄 발생
        - dragend : 마우스 드래그가 종료했을떄(버튼 릴리즈)
        - dragenter : 드래그 한 요소가 다른 요소로 접근했을떄
        - dragexit
        - dragleave : 드래그한 요소가 유요한 곳을 떠날떄
        - dragover : 드래그한 요소를 유요한 곳을 지날때
        - dragstart : 드래그를 발생할 요소에 정의
        - drop : 드래그한 요소를 유효한 곳에 놓을때

3. 사용법

    1. 드래그가 가능한 요소를 만들자

    ```html
    <tag draggable="true"></tag>
    ```

    2. 드래그가 발생할 때 필요한 데이터를 저장

    ```html
    // ondragstart는 drag 발생할때 처음으로 발생하는 이벤트 // 이유 : 드래그한
    요소에 대한 정보를 저장하기 위해
    <tag draggable="true" ondragstart="drag(event)"></tag>
    ```

    ```js
    // 정보를 저장하기 위해 드래그 이벤트 속성에 있는 dataTransfer에 setData(키, 벨류)로 저장
    function drag(ev) {
        ev.dataTransfer.setData('키', 벨류)
    }
    ```

    3. 드래그가 발생하면 브라우져에서 기본적으로 삭제를 시도한다 이러한 삭제를 방지하자

    ```js
    ev.preventDefault() // allowDrop();
    ```

    4. 드랍할 곳!에 이벤트를 정의하자

    ```html
    // ondragover : 브라우져 삭제 방제 // ondrop으로 드랍된 데이터를 사용하자
    <div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
    ```

    ```js
    // 정보를 저장하기 위해 드래그 이벤트 속성에 있는 dataTransfer에 setData(키, 벨류)로 저장
    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData('키');
        ev.target.appendChild(document.getElementById(data));
        <!-- 저장한 데이터(아이디 값)을 가지고 요소를 drop한 곳에 appendChild를 통해 추가해준다  -->
      }
    ```

4. 분석 소스

```html
<script>
    function allowDrop(ev) {
        ev.preventDefault()
    }

    function drag(ev) {
        ev.dataTransfer.setData('text', ev.target.id)
    }

    function drop(ev) {
        ev.preventDefault()
        var data = ev.dataTransfer.getData('text')
        ev.target.appendChild(document.getElementById(data))
    }
</script>
<body>
    <h2>Drag and Drop</h2>
    <p>Drag the image back and forth between the two div elements.</p>
    <div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)">
        <img
            src="img_w3slogo.gif"
            draggable="true"
            ondragstart="drag(event)"
            id="drag1"
            width="88"
            height="31"
        />
    </div>

    <div id="div2" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
</body>
```
