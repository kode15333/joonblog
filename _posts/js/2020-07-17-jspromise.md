---
title:  "프로미스란?"
description: "프로미스에 관해.."
draft: false
template: "post"
category : "js"
tags:
  - js
date: 2020-07-17
---
## 프로미스란?
  - 비동기 작업을 콜백 헬을 벗어나긴 위해 만들어진 Promise 객체
  - Promise를 통해 비동기 작업에 대한 결과값을 Promise 객체인 resolve(성공) / reject(실패)을 받아서 비동기 작업을 계속해서 작업 할 수 있음

## 왜 프로미스를 사용해야 하나요?
  - 콜백헬을 조금더 직관적이게 다른사람이 보기 쉽게 만들어 줄 수 있다.
  - then() 비동기 통신의 대한 성공값을 Promise 객체로 받아 계속해서 비동기 작업 진행 가능
  - catch() 오류 / 에러를 체크
  - 읽기 좋은 코드
     
    ```js
   
      $.get('example.com/' + userId, function(response){
        $.post('example.com/' + respose.useId, function(response){
          // 계속해서 콜백을 호출하므로 한 함수에 수 많은 컨텍스트가 생김
        })
      })

      getData(userInfo)
        .then(parseValue)
        .then(auth)
        .then(diaplay);
    ```

## Promise.all vs Promise.race
  - all()
      - 매개변수로 Promise를 array로 넣어 모든 비동기 통신이 끝나고 결과 값을 모두 리턴
      - 주어진 프로미스 중 하나라도 거부하면 다른 프로미스의 이행 여부에 상관없이 reject()를 반환
        ```js
        var p1 = Promise.resolve(3);
        var p2 = 1337;
        var p3 = new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve("foo");
          }, 100);
        }); 

        Promise.all([p1, p2, p3]).then(values => { 
          console.log(values); // [3, 1337, "foo"] 
        });
        ```
  - race()
      - all()이랑 사용법은 같은 작동방식의 차이가 있습니다.
      - race() 주어진 Pomise 중에 제일 빨리 완료된 것을 결과값을 리턴한다.
        ```js
        const promise1 = new Promise((resolve, reject) => {
          setTimeout(resolve, 500, 'one');
        });

        const promise2 = new Promise((resolve, reject) => {
          setTimeout(resolve, 100, 'two');
        });

        Promise.race([promise1, promise2]).then((value) => {
          console.log(value);
          // Both resolve, but promise2 is faster
        });
        // expected output: "two"
        ```
