---
title: 'top은 왜 아래로 증가를 하는가?'
description: 'top/left, element size/position, sticky/fixed, 62.5%'
draft: false
template: 'post'
category: 'css'
tags:
    - css
date: 2021-10-10
---

### 0. 작성이유

-   왜? top은 아래로 증가되지?(좌표와 다르게..)
-   항상 헷갈리는 client/offset width/height
-   sticky는 fixed랑 모가 다르죠?
-   font-size : 62.5%???

### 1. Top은 왜 아래로 증가를 하는가(추론)?

1. 서양 언어 방향 (왼쪽 → 오른쪽) / 시계반향
    - 최초의 디스플레이 개발자 (독일)
    - 이러한 문화가 디스플레이 쪽으로 개발되었다.
2. CRT 디스플레이 작동원리(그래픽 카드와 CRT 사이의 인터페이스 - 순서대로 메모리 읽기)

    - 왼쪽 상단(메모리 주소가 가장 낮음)
    - 오른쪽 하단(메모리 주소가 가장 높음)

    ![crt](../../assets/crt.png)

### 2. Element 사이즈와 포지션

-   offsetTop / offsetLeft : 부모 요소와의 거리
-   offsetWidth / offsetHeight : 해당 요소의 너비 / 높이 (border 포함)
-   clientTop / clientLeft : 가장 바깥쪽에 있는 테두리로 부터의 거리
-   clientWidth / clientHeight : 해당 요소의 크기(padding 포함 / 스크롤 바 제외)
-   scrollTop : 스크롤 영역 최상단에서 해당 요소까지의 거리
    ![crt](../../assets/element-size.png)
-   해당 페이지가 몇 % 보여졌는지 (예제코드)

    ```jsx
    const $scroll = document.scrollingElement
    const percent = document.querySelector('#percent')

    window.addEventListener('scroll', () => {
        const currentPercentage =
            ($scroll.scrollTop / ($scroll.scrollHeight - window.innerHeight)) *
            100
        percent.style.width = currentPercentage + '%'
    })
    ```

### 3. fixed vs sticky?

-   fixed
    -   해당 요소는 문서흐름에서 제외되고, 페이지에서 공간을 배정하지 않는다.
    -   뷰포트를 기준으로 위치를 잡는다.
-   sticky
    -   해당 요소는 문서흐름에 따라 배치하고, **`스크롤이 되는 조상`**을 기준
    -   스크롤 박스를 기준으로 offset(top, left)을 지정하나, **`다른 요소에는 영향 없음`**
    -   sticky는 해당 스크롤 박스에 따라 생길뿐, 넘어가면 보여지지 않는다

### 4. Font-size : 62.5%?

-   브라우저의 기본 폰트 크기 16px
-   반응형을 작업하기 주로 크기의 단위를 rem을 사용
-   16px 보다는 10px로 만들어, 생산성 향상(16 \* 62.6 / 100 = 10)

### 참고자료

-   [https://en.wikipedia.org/wiki/Analog_television#Displaying_an_image](https://en.wikipedia.org/wiki/Analog_television#Displaying_an_image)
-   [https://gamedev.stackexchange.com/questions/83570/why-is-the-origin-in-computer-graphics-coordinates-at-the-top-left](https://gamedev.stackexchange.com/questions/83570/why-is-the-origin-in-computer-graphics-coordinates-at-the-top-left)
-   [https://docs.oracle.com/javase/tutorial/2d/overview/coordinate.html](https://docs.oracle.com/javase/tutorial/2d/overview/coordinate.html)
-   [https://ko.javascript.info/size-and-scroll](https://ko.javascript.info/size-and-scroll)
-   [https://developer.mozilla.org/ko/docs/Web/CSS/font-size](https://developer.mozilla.org/ko/docs/Web/CSS/font-size)
