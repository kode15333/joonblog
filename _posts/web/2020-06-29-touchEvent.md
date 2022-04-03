---
title:  "터치이벤트"
description: "모바일 화면에서 이벤트 처리"
draft: false
template: "post"
category : "html"
tags:
- html 
date: 2020-06-29
---
## 터치이벤트(touch Event)

1. 터치이벤트
	- 터치이벤트는 손가락을 화면에 댈 때, 화면을 따라 드래그할 때, 화면에서 손을 땔 때 발생
		 - touchstart : 손가락으로 화면을 터치할 때 발생하며, 이미 다른 손가락을 화면에 대고 있어도 다른 손가락을 대면 또 발생
		 - touchmove : 손가락을 화면에서 움직일 때 계속 발생합니다. 이 이벤트가 일어나느 동안 preventDefaut()를 호출하면 스크롤을 막을 수 있습니다.
		 - touchend : 손가락을 화면에서 뗄 때 발생합니다.
		 - touchcancel : 시스템에서 터치를 더 이상 추적하지 않을 때 발생합니다. 언제 이런 상황이 발생하는지 명확하게 문서화되지는 않았습니다
	- 각 이벤트는 모두 버블링되어 올라가며 취소 가능합니다.

2. 터치이벤트 객체 프로퍼티
	- clientX : 뷰포트를 기준으로 한 터치 x좌표
	- clientY : 뷰포트를 기준으로 한 터치 y좌표
	- identifier : 터치의 고유한 ID
	- pageX : 페이지를 기준으로 한 터치의 x좌표
	- pageY : 페이지를 기준으로 한 터치의 y좌표
	- screenX : 화면을 기준으로 한 터치의 x좌표
	- screenY : 화면을 기준으로 한 터치의 y좌표
	- target : 터치의 타깃인 DOM 노드

3. touchend 주의사항
	- touchend 이벤트가 일어나면 마지막 터치 정보를 표시합니다. touchend 이벤트에는 활성인 터치가 없으므로 touches 컬렉션도 존재하지 않습니다.
	- changedTouches 컬렉션을 반드시 대신 사용해야 합니다.

4. 요소를 탭 했을때 이벤트가 일어나는 순서(마우스 이벤트 포함)
	1. touchstart
	2. mouseover
	3. mousemove(한 번만) : 클릭했을때!! 마우스가 움직인다.
	4. mousedown
	5. mouseup
	6. click
	7. touchend
