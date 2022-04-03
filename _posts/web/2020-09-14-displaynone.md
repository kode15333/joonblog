---
title: "Display None"  
description: "Display None에 대해서"
draft: false 
template: "post"
category : "web"
tags:
- CSS 
date: 2020-09-14
---
## Why?

- 초기세팅 이후 IFRAME 요소의 스크롤이 움직이지 않음.
- display의 속성이 none ⇒ block으로 변경시 scrollTop이 0으로  변경됨.
- 이러한 문제 때문에 display와 visibility에 대해서 정리

## display : none

- display 속성이 적용된 HTML 요소가 화면에 표시되지 않는다.(자식요소 포함)
- 렌더링은 했으나, 화면에는 요소가 표시되지 않으며, 돔 구성에서도 포함되지 않는다
- 선택자를 통해 요소의 스타일과 이벤트를 줄  수 있다.
- iframe내 요소도 접근 할 수 있으며, 동일하게 스타일과 이벤트를 줄 수 있다.
    - iframeElement.contentDocument.body를 통해서 부모(opener)에서 접근 가능
- 개발자 도구에서 확인할 수 있다.

## visibility : hidden

- visivility속성이 적용된 HTML 요소가 화면에 표시되지 않는다(자식 요소 포함)
- display : none가 동일하게 화면에 표시되지 않지만, 돔 구성에는 포함되어 있다.
    - width와 height를 가진다

```jsx
// 예제 코드
<body>
<button id="none">display none</button>
<button id="block">display block</button>
<button id="color">color</button>
<div id="dis">
    Display None
    <h1>Hello world</h1>
    <iframe src="../test.html">
    </iframe>
</div>
<div id="vis">
    Visivility Hiddden
</div>
<script>
  document.querySelector('#dis').style.color = 'red';

  document.querySelector('#none').onclick = function () {
    document.querySelector('#dis').style.display = 'none';
  }
  document.querySelector('#block').onclick = function () {
    document.querySelector('#dis').style.display = 'block';
  }
  document.querySelector('#color').onclick = function () {
    document.querySelector('#dis').style.color = 'blue';
  }

</script>
</body>
```
