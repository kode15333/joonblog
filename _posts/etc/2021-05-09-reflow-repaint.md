---
title:  "Reflow or Repaint"
description: "reflow와 repaint의 차이점에 대해서 알고싶어서"
date: "2021-05-09"
---
### Reflow or Repaint
### 1. 글을 작성하는 이유?

- reflow와 repaint의 차이점에 대해서 알고싶어서

### 2. 브라우저 렌더링 작동 순서 및 설명

![https://d2.naver.com/content/images/2015/06/helloworld-59361-2.png](https://d2.naver.com/content/images/2015/06/helloworld-59361-2.png)

1. **HTML CSS JS파싱**
    - 문서(HTML, CSS, JS)를 읽어 브라우저가 문법을 분석, 코드를 이해한다
    - `<script>`태그를 만나면 JS를 해석할 때까지 파싱을 멈춘다.
        - 브라우저는 스크립트가 페이지에서 무엇을 수행할지 모르기 때문에, 브라우저는 최악의 시나리오를 가정하고 파서를 차단한다.
        - script 태그의 async와 defer를 활용하여, script 실행을 조작 할 수 있다[.(참고)](https://jooonho.com/js/2020-07-31-jsproblem/)
2. **DOM CSSOM 변환**
    - 브라우저에서 사용할 수 있는 구조로 변환한다
    - 파싱이 끝났다면 메모리에 브라우저에서 사용가능한 객체를 만든다(DOM, CSSDOM)
    - CSSOM 각 노드의 스타일의 형태를 나타낸다
3. **렌더 트리 구축**
    - DOM과 CSSOM을 결합하여 화면에 그려낼 내용을 작성한다.
    - 즉, 어떤 엘리먼트에 어떤 스타일을 적용할 것인지 정해진다.

      ![https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/render-tree-construction.png?hl=ko](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/render-tree-construction.png?hl=ko)

4. **렌터 트리 배치(Layout 단계)**
    - 각 요소의 크기와 위치를 계산한다(아직 실제로 화면에 그리진 않음!!)
5. **렌더 트리 그리기(Paint단계 →  Compositing 단계)**
    - 요소를 실제로 픽셀로 변환하여 그린다(Paint 단계, Rasterize)(아직 실제로 화면에 그리진 않음!!)
    - 픽셀로 그려진 여러 레이어를 합성한다(Compositing 단계)
    - 뷰포트는 우리가 화면에 보여지는 것, 실제 문서는 우리가 생각하는것보다 크다

      [![https://developers.google.com/web/updates/images/inside-browser/part3/composit.mp4?hl=ko](../../assets/composite.png)](https://developers.google.com/web/updates/images/inside-browser/part3/composit.mp4?hl=ko)

6. 모든 문서가 Composite 단계까지 완료되야지 보여질까?
    - **아니다**! 브라우저는 먼저 실행한것에 대해서 먼저 보여진다(점진적)



### 3. JS가 Style을 변화시키면 Re-Render 된다. 
![https://developers.google.com/web/fundamentals/performance/rendering/images/avoid-large-complex-layouts-and-layout-thrashing/frame.jpg?hl=ko](https://developers.google.com/web/fundamentals/performance/rendering/images/avoid-large-complex-layouts-and-layout-thrashing/frame.jpg?hl=ko)

1. **Layout / Paint / Composite 단계를 Trigget하는 css 요소 [(참고)](https://csstriggers.com/)**

    - Layout : width, height, padding, margin, display,  box-shadow
    - Paint : color, z-index,  background
    - Composite: opacite, transform, cursor, pointer-event

2. **Layout 단계를 호출하면 그 아래 단계도 호출된다**

    - 초기 단계일수록, 리소스가 크므로, 가능하면 하위단계의 css를 변경해서 최적화해야한다.

### 4. Main Thread vs Composite Thread

![https://developers.google.com/web/fundamentals/performance/rendering/images/avoid-large-complex-layouts-and-layout-thrashing/frame.jpg?hl=ko](https://developers.google.com/web/fundamentals/performance/rendering/images/avoid-large-complex-layouts-and-layout-thrashing/frame.jpg?hl=ko)

1. **Main Thread  (Javascipt부터 Paint 단계)**
    - 자바스크립트로 시작적 변화 유발
    - 어떤 규칙을 어떤 요소에 적용할 지 계산
    - 요소가 화면에서 차지하는 공간과 위치 계산 다른 요소에 영향을 줄 수 도 있음
    - 각 레이어에 픽셀을 그려내는 과정(텍스트, 색, 이미지 경계썬, 그림자 등 표현)
2. **Composite Thread (Composite 단계)**
    - 정해진 순서로 레이어를 합성하여 최종 결과물을 그려내는 과정(z-index, scroll 등)

3. **자바스크립트 렌더링 과정은 싱글쓰레드라서 앞단계로 가면 뒷단계까지 멈춘다**

    - 메인쓰레드에서 유발을 하면 화면이 멈춘다!(새로운 css를 읽어서 표시하는 것도 렌더링을 차단)
    - Composite 단계는 별도의 쓰레드이기 때문에, 멈추지 않는다!

### 5. Reflow,Repaint 요약

- Reflow는 Display 단계를 의미하며, Main Thread(UI) 위에서 작동한다.
- Repaint는 각 브라우저별로 Trigger하는 CSS가 다르나, Reflow보다 리소스가 적다

### 6. 관련출처

- [https://developers.google.com/web/fundamentals/performance/rendering/images/avoid-large-complex-layouts-and-layout-thrashing/frame.jpg?hl=ko](https://developers.google.com/web/fundamentals/performance/rendering/images/avoid-large-complex-layouts-and-layout-thrashing/frame.jpg?hl=ko)
- [https://d2.naver.com/content/images/2015/06/helloworld-59361-2.png](https://d2.naver.com/content/images/2015/06/helloworld-59361-2.png)
- [https://developers.google.com/web/fundamentals/performance/rendering/debounce-your-input-handlers?hl=ko](https://developers.google.com/web/fundamentals/performance/rendering/debounce-your-input-handlers?hl=ko)
- [https://csstriggers.com/](https://csstriggers.com/)
