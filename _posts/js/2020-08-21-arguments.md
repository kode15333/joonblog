---
title:  "Arguments 객체에 대해서"
description: "자바스크립트 함수 내부에 숨겨져있는 Arguments객체에 대해서 알아보자"
draft: false
template: "post"
category : "js"
tags:
  - js
date: 2020-08-21
---

## Arguments
1. 정의
    - arguments 객체는 함수로 전달된 인수(매개변수)
    - iteratable 인터페이스를 구현하고 있어 rest 연산자를 이용하여 전달되는 매개변수를 배열로 만들 수 있다.
    - 함수 내부에서 사용되는 내부 변수이다. 
    - arguments객체는 index로 접근 할 수 있다.
    
2. 속성
    - callee()
        - 호출 당한 함수!!! arguments 객체가 속해 있는 함수를 부른다.
        - 재귀함수 호출시 사용된다.
    - length : 함수에서 전달된 매개변수 총 수를 나타낸다.
    
3. 사용법
    ```js
    function foo(a){
     arguments.length // 6
     arguments.callee // foo 함수!!!  == foo()랑 같다.
    } 
     
    foo(1,2,3,4,5,6)
    
    function bar(...arg){
     return arg   // [1,2,3]  arguments 객체는 rest 연산자를 통해 배열로 구현 가능
    } 
    
    bar(1,2,3)
    
    // rest 연산자, 매개변수 초기값 할당을 사용하면 매개변수가 있을시 arguments 객체를 변경해도 반영 안됨
    function bar(a=1) {
      arguments[0] = 100;
      return a;
    }
    bar(10); // 10
    
    //반대로 나머지, 매개변수 초기값이 없으면 arguments 객체가 변경되면 반영
    function zoo(a) {
      arguments[0] = 100;
      return a;
    }
    zoo(10); // 100
    ```
   
4. [callee보다는 함수명을 적어주는 게 좋다](https://stackoverflow.com/questions/103598/why-was-the-arguments-callee-caller-property-deprecated-in-javascript/235760#235760)
    - namespace를 오염시키지 않는다.
    - this가 변하지 않는다.
    - arguments 객체를 접근하는 것보다 좋다(리소스가 적다)

5. 써야 할 경우?
    - 함수도 값이기 때문에 변수로 찾아 실행을 한다.
    - 아래와 같이 새로운 변수에 함수를 대입하고 이전 변수를 해제시키면 함수를 찾지 못해 에러를 발생한다.
    - 그때 함수명 대신에 arguments.callee()를 이용하면 에러를 방지 할수 있다.
        ```js
        function fac(num){
         if(num <= 1){
          return 1;
         }else{
           return num * fac(num - 1);
         }
        }
        
        var anotherFac = fac;
        fac = null;
        anotherFac(10) // TypeError fac is not a function 
        
        function fac(num) {
         ....
         else{
          return num * arguments.callee(num - 1) 
         } 
        } 
        ```

6. caller와 callee
    - 함수 호출 규약에 따라 컴퓨터 과학에서 어떻게 서브루틴(함수)가 호출자로 부터 매개변수를 어떻게 받고 결과를 어떻게 반환하는지 정해놓은것
    - caller는 메인함수이고 callee는 그 위에서 실행되는 함수라고 생각하면 되는 callee는 caller를 기억해야 하는 특징이 있다.
    - C/C++ 기준으로 설명(정확하지 않음...)
        1. 매가변수를 먼저 메모리에 올린다. 
        2. 그 다음 함수를 메모리에 올려서 실행하여 결과를 리턴한다
    
