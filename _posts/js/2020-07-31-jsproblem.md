---
title:  "link와 script 태그"
description: "link와 script에 대해서"
draft: false
template: "post"
category : "etc"
tags:
  - etc
date: 2020-07-31
---
## 1. Link 태그에 대해서
  - 해당 문서와 외부 소스(external resource) 사이의 관계를 정의할 때 사용합니다.
  - `<link>`는 스타일 시트를 연결할 때 제일 많이 사용
  - `<head> 요소 내부에만` 위치할 수 있으며, 그 개수에는 제한이 없습니다.
  - SOP 미적용에 따라 외부 resource 요청가능
      - XMLHttpRequest나 Fetch API를 사용해 다른 출처에 리소스를 요청할 때 SOP적용

## 2. script 태그에 대해서
  1. 정의
      - 스크립트 코드를 요소 내부에 직접 명시하거나, src 속성을 사용하여 외부 스크립트 파일을 참조할 수 있습니다. 
      - 하지만 src 속성이 명시된 `<script>` 요소에는 스크립트 코드를 직접 명시해서는 안 됩니다.
  2. 외부 스크립트 파일을 불러오는 방법 및 주요한 속성
      - 방법 : src에 해당 스크립트 파일 위치
        ```html
          <script src="불러올 스크립트 파일"></script>
        ```
      - 주요한 속성 : async / await
        - async 속성이 명시된 경우 : 브라우저가 페이지를 파싱되는 동안 스크립트가 실행됨.
        - async 속성은 명시되어 있지 않고 defer 속성만 명시된 경우 : 브라우저가 페이지의 파싱을 모두 끝내면 스크립트가 실행됨.
        - async 속성과 defer 속성이 모두 명시되어 있지 않은 경우 : 브라우저가 페이지를 파싱하기 전에 스크립트를 가져와 바로 실행시킴.
![script](https://i.stack.imgur.com/wfL82.png)


## FOUC(Flash of unstyled content)란 무엇일까?
  1. 정의
      - 외부의 CSS가 불러오기 전에 잠시 스타일이 적용되지 않은 웹 페이지가 나타나는 현상이다.
      - 스타일이 적용되지 않은 웹 페이지가 스타일이 적용된 웹 페이지로 변화하는 것이다. 
      - 웹 브라우저가 웹 페이지에 스타일 정의를 부르고 적용할 때 보여지는 부분을 최대한 빨리 수정하지만
      - 짧지 않은 시간 동안 나타나므로 사용자는 페이지에 오류가 있다는 생각을 하게된다.
  2. 원인 === 브라우저 작동방식???
      - 브라우저는 HTML, CSS, JS을 이용하여 DOM을 만든다
      - 브라우저는 그 중에 텍스트틀 가장 빨리 해석하기 때문에 브라우저에 먼저 보여준다.
      - 이러한 텍스트가 보여지고 CSS가 적용된다. 깜박이면서 전체적인 DOM이 완성이 된다.
      - 브라우저 렌더링 과정
      ![render](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/webkitflow.png)
  3. 해결방법
      - 스타일이 적용된 콘텐츠를 보여주자. 그 전까지는 숨기자
          ```html
          <body style="visibility: hidden;" onload="js_Load()">
    
          <script>
            function js_Load() {
              document.body.style.visibility='visible';
            }
          </script>
    
          // script태그가 없을때를 대비하여 noscript태그를 활용하면 좋다
          <noscript>
            <style>body { visibility: visible; }</style>
          </noscript>
          ``` 

## CSS 우선순위(참고)
  1. 인라인
     - html태그의 내부 속성 style을 이용하여 스타일 적용(우선순위 : 1순위)
        ```html
        <p style="color:red; background-color:yellow;">안녕하세요.</p>
        ```
  2. 내부스타일 시트
     - style태그에 해당 선택자(id, class, tag ..)를 통하여 style을 적용(우선순위 : 2순위)
        ```css
        <style>
          #hello1 {
            color: red;
            background-color: yellow;
          }
          #hello2 {
            color: green;
          }
        </style>
        ```
  3. link태그를 활용한 외부 스타일 시트
     - link 태그를 통하여 외부 스타일을 불러와 적용을 한다.(우선순위 : 3순위)
        ```html
        <link rel="stylesheet" href="mystyle.css">
        ```
