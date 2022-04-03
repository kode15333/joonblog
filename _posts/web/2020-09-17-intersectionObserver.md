---
title: "Intersection Observer"  
description: "Intersection Observer에 대해서"
draft: false
template: "post"
category : "web"
tags:
- IntersectionObserver
date: 2020-09-17
---
## 정의
 
 - WebAPI 중에 하나이며, 모던 브라우저 지원(IE 제외)
 - viewport(default)를 기준으로 해당 엘리먼트가 들어왔는지 확인 가능
 - 해당 엘리먼트가 viewport로 들어왔으면 콜백함수를 넘겨 실행시킬 수 있다.
 
 ## 왜 사용할까?
 
 - 처음에 보여지는 화면만 렌더링 및 이미지 요청을 하여 리소스 절약
 - 별도의 라이브러리를 사용하지 않고 최적화를 진행 할 수 있다(like react-virtualized)
 - 뷰포트가 이동함에 따라 엘리먼트에 애니메이션을 적용할 수 있다.
 - webAPI이기 때문에 react, vue에서도 사용가능(최적화 가능)
 
 ## 사용법
 
 ### intersection observer 생성
 
 ```jsx
 let option = {
 	root : document.qeurySelector('#scroolArea'),
 	rootMargin : '0px 0px 0px 0px',
 	threshold : 1.0
 }
 
 let observer = new IntersectionObserver(callback, options);
 ```
 
 1. option
     - root : 뷰포트의 기준(별도로 지정하지 않으면, default = 기본 뷰포트)
     - rootMargin : 뷰포트 기준의 margin이며, 값은 css와 동일하게 사용
     - threshold : 뷰포트와 지정한 엘리먼트의 교차하는 면적(% 기준)에 따라 콜백 실행
 2. IntersectionObserver
     - callback : 엘리먼트가 threshold에서 지정한 교차면적으로 들어오면 콜백 실행
 
 ## Targeting an element to be observed
 
 ```jsx
 // 하나만 
 let target = document.querySelector('#listItem');
 observer.observe(target);
 
 // 여러개의 객체 추가
 
 let targets = document.querySelectorAll('.listItem');
 targets.foreach(el => observer.observe(el));
 ```
 
 1. target : 지정할 엘리먼트(뷰포트와 만날 엘리먼트)
 2. observer.observe(target) : IntersectionObserver에서 observe 메소드를 통해 target 등록
 
 ### Intersection change callback
 
 ```jsx
 const callback = (entries, observer) => {
       entries.forEach((entry) => {
 				// 해당 target이 뷰포트 안으로 들어왔는지 여부 판단
         if (entry.isIntersecting) {
 					// 뷰포트에 들어왔으면 해당 타켓을 해제
           observer.unobserve(entry.target);
 				  // 해당 속성을 가지고와 이미지를 로딩
           entry.target.src = entry.target.dataset.src;
         }
       });
     }
 ```
 
 1. entries :  oberve에 등록한 엘리먼트의 정보들이 배열로 들어온다
     - boundingClientRect
         -  DOMRectReadOnly {x: 8, y: 8, width: 100, height: 200, top: 8, …}
         - 지정한 엘리먼트의 속성값(읽기 전용)
     - intersectionRatio
         - 뷰포트와 지정한 엘리먼트의 교차 비율
     - intersectionRect
         -  DOMRectReadOnly {x: 8, y: 8, width: 100, height: 200, top: 8, …}
         - 뷰포트와 지정한 엘리먼트의 교차된 부분의 속성값(읽기 전용)
     - isIntersecting :  true
         - 교차 여부
     - isVisible :  false
     - rootBounds
         -  DOMRectReadOnly {x: -20, y: -20, width: 413, height: 805, top: -20, …}
         - 뷰포트 속성 값(읽기 전용)
     - target :  img.lazy.. 
         - 지정한 타켓의 속성
     - time :  256.60000000789296
 2. observer : IntersectionObserver 객체이자 속성정보
 
 ## 예제 코드(이미지 로딩)
 
 ```jsx
 <img class="lazy" src="" data-src="https://source.unsplash.com/random"/>
 .
 .
 .
 .
 <img class="lazy" src="" data-src="https://source.unsplash.com/random"/>
 
 <script>
 	// rootMargin을 20px주어 뷰포트가 내려오기전 미리 로딩
   const options = {threshold: 0, rootMargin : '20px'};
   const observer = new IntersectionObserver(
     (entries, observer) => {
       console.log(entries)
       console.log(observer)
       entries.forEach((entry) => {
         if (entry.isIntersecting) {
           observer.unobserve(entry.target);
          entry.target.src = entry.target.dataset.src;
         }
       });
     }
     , options);
 
   const boxElList = document.querySelectorAll('.lazy');
   boxElList.forEach((el) => {
     observer.observe(el);
   })
 </script>
 ```
