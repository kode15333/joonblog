---
title: 'Debounced And Throttle'
description: 'Debounced And Throttle에 대해서'
draft: false
template: 'post'
category: 'web'
tags:
    - lodash
    - js
date: 2021-01-31
---

## 0. 이글을 작성하는 이유?

-   최근 업무(검색시, 가장 마지막에 입력한 글자만 검색되게..)를 진행하면서, 디바운스를 사용했다.
-   쓰로틀링과 디바운스의 차이점에 대해서 정확히 알고 싶어서..

## 1. 용어 정리

-   Throttle (쓰로틀)
    -   의미 : 이벤트를 일정한 주기마다 발생하도록 하는 기술
    -   사전적 의미 : 꽉 조여 압축하다
    -   나만의 해석 : 이벤트 발생 주기를 조절, 그 주기 안에 발생하는 모든 이벤트를 하나의 이벤트로 압축한다.
-   Debounce
    -   의미 : 이벤트를 그룹화하여 특정시간이 지난 후 하나의 이벤트만 발생하도록 하는 기술
    -   사전적 의미 : 기계식 스위치를 전기 회로에서 밀어 일련의 단락을 만들 때 형성되는 작은 전류 리플을 제거합니다.
    -   나만의 해석 : 마지막 이벤트만 처리하자!

## 2. Throttle

-   예시) 10초 동안 A 버튼을 계속 클릭해보자!(Throttle time 1초)
-   예시 결과) 10번 클릭된다! 1초 간격

    ![https://llu.is/wp-content/uploads/2020/07/debounce-demo-1.png](https://llu.is/wp-content/uploads/2020/07/debounce-demo-1.png)

-   무한스크롤을 구현시 사용됨(페이스북, 트위터)

    ```jsx
    // 스크롤 이벤트가 발생시, throttle 처리
    document.addEventListener(
        'scroll',
        _.throttle(function () {
            check_if_needs_more_content()
        }, 300)
    )

    function check_if_needs_more_content() {
        // 현재 위치가 문서의 끝 부분이랑 얼마나 차이 있는지 확인
        pixelsFromWindowBottomToBottom =
            0 +
            document.documentElement.scrollHeight -
            document.documentElement.scrollTop -
            document.documentElement.clientHeight

        // 만약 200 이하면, 콘텐츠를 넣어준다!
        if (pixelsFromWindowBottomToBottom < 200) {
            // 마지막에 추가할 콘텐츠 추가 방법(Ajax 이벤)
        }
    }
    ```

## 3. Debounce

-   예) 10초 동안 A 버튼을 계속 클릭해보자!(debounce Time 1초)
-   결과) 1번 클릭된다! 마지막 클릭만!

    ![https://llu.is/wp-content/uploads/2020/07/debounce-demo.png](https://llu.is/wp-content/uploads/2020/07/debounce-demo.png)

-   검색이벤트 처리할때, 브라우저 창 크기를 조절할때

    ```jsx
    function after_resize() {
    	// 마지막 이벤트가 발생하고 처리할 함수
    }

    document.addEventListener('resize', _.debounce(function() {
        after_resize();
    }, 400));

    function make_ajax_request(e){
    	// 마지막 이벤트가 발생하고 처리할 함수
    }

    document.addEventListener('keydown',
         _.debounce(make_ajax_request, 1300));
    });
    ```

### 4. 출처

[https://medium.com/@progjh/throttle-debounce-개념-잡기-19cea2e85a9f](https://medium.com/@progjh/throttle-debounce-%EA%B0%9C%EB%85%90-%EC%9E%A1%EA%B8%B0-19cea2e85a9f)

[https://css-tricks.com/debouncing-throttling-explained-examples/](https://css-tricks.com/debouncing-throttling-explained-examples/)
