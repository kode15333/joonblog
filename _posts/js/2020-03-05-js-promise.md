---
title:  "JS Promise, Async Await"
description: "프로미스를 사용해보고, 프로미스를 동기적으로 사용해복자"
draft: false
template: "post"
category : "js"
tags:
  - js
date: 2020-03-05
---
## [프로미스]


## 1. 정의
- 프로미스는 자바스크립트 비동기 처리에 사용되는 객체, 객체의 상태는 3가지로 구성되있습니다.
- Pending(대기) : 비동기 처리 로직이 아직 완료되지 않은 상태
- Fulfilled(이행) : 비동기 처리가 완료되어 프로미스가 결과 값을 반환해준 상태
- Rejected(실패) : 비동기 처리가 실패하거나 오류가 발생한 상태

## 2. 사용법
- 먼저 프로미스는 resolve, reject를 통하여 비동기 통신의 성공 여부를 결정한다.
- 대기상태는 프로미스 객체를 호출하고 resolve, reject를 받아오기 전입니다.
- 이행 상태가 되면 .then()을 통하여 resolve를 받아와 결과 확인가능
- 실패 상태가 되면 .catch()을 통하여 실패로 인한 error를 확인가능

    ```js
    // 프로미스 객체 생성 
    function getData() {
    return new Promise(function(resolve, reject) {
        $.get('url 주소/products/1', function(response) {
        if (response) {         // 비동기 통신을 성공햇다면 resolve에 객체를 넣어준다.
            resolve(response);
        }
        reject(new Error("Request is failed")); // 실패했다면, error를 발생하여 reject 객체에 넣어준다
        });
    });
    }

    // 위 $.get() 호출 결과에 따라 'response' 또는 'Error' 출력
    getData().then(function(data) {
    console.log(data); // response 값 출력
    }).catch(function(err) {
    console.error(err); // Error 출력
    });
    ```

## 3. 특징
![프로미스 순서](https://mdn.mozillademos.org/files/15911/promises.png)
- 이행 및 실패의 끝으로 프로미스는 또 다시 프로미스 객체를 반환한다.
- then()을 통하여 계속해서 프로미스 객체를 사용 할 수 있다. 
- `catch()를 통하여 꼭 오류를 잡아주고 원인을 알자`


---

## Async Await

## 1. 정의
- 비동기적인 작업을 동기적인것처럼 만들어보기 위해 사용되는 문법

## 2. 사용법
- 먼저 함수 앞에 async 라는 예약어를 붙어줍니다.
- 프로미스 객체를 반환하는 메소드에 await을 붙여줍니다.

    ```js
    function async foo(){
        const data = await returnPromiseObject();  // 일반적으로 비동기 통신을 통한 객체의 결과값을 호출할떄 많이 사용
    }

    function foo() {
      var user = fetchUser();
        console.log(user.title); // undefined
      }
    }

    async function foo() {
      var user = await fetchUser();
        console.log(user.title); // 두두아빠
      }
    }

    ```


## 3. 오류
- try-catch를 이용

## 4. then과 await의 차이점??

- await은 then에서 처리를 다 처리한다. 
- await은 오류를 null로 처리를 한다.
- await은 promise객체를 반환하지 않는다.

    ```js
    var resolveAfter2Seconds = function() {
      console.log("starting slow promise");
      return new Promise(resolve => {
        setTimeout(function() {
          resolve(20);
          console.log("slow promise is done");
        }, 2000);
      });
    };

    var resolveAfter1Second = function() {
      console.log("starting fast promise");
      return new Promise(resolve => {
        setTimeout(function() {
          resolve(10);
          console.log("fast promise is done");
        }, 1000);
      });
    };

    var sequentialStart = async function() {
      console.log('==SEQUENTIAL START==');
      // If the value of the expression following the await operator is not a Promise, it's converted to a resolved Promise.
      const slow = await resolveAfter2Seconds();  // 2초 기달린다.
      console.log(slow);

      const fast = await resolveAfter1Second();  // 앞에 있는 2초가 진행되고 나서 진행시작
      console.log(fast);
    }
    ```
