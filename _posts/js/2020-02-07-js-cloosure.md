---
title:  "JS 클로져"
description: "클로져 구현 코드"
draft: false
template: "post"
category : "js"
tags:
  - js
date: 2020-02-13
---
## 클로져 예제

```js
function HelloFunc() {
this.greeting = "hello";
}
// HelloFunc 생성자함수 생성

HelloFunc.prototype.call = function(func) {
func ? func(this.greeting) : this.func(this.greeting);
};
// HelloFun의 프로토타입 객체에 call이라는 프로터 타입에 익명 함수대입
// 인자로 들어오는 값이 참이면 func()함수를 실행 / 거짓이면 this.func() 함수 실행

var userFunc = function(greeting) {
console.log(greeting);
};
// 함수 표현식으로 useFunc 변수에 greeting 값을 찍어주는 console 입력

var objHello = new HelloFunc();
// objHello 객체 생성
objHello.func = userFunc;
// func라는 키 값에 useFunc 대입
objHello.call();
// objHello의 부모 HelloFunc의 call()함수 호출 인자가 없으므로 this.func(this.greeting) 호출하여 Hello 인출

```
---
```js
function saySomething(obj, methodName, name){
    return (function(greeting){
        return obj[methodName](greeting, name)
    })
}

function newObj(obj, name){
    obj.func = saySomething(this, "who", name);
    return obj
}

newObj.prototype.who = function(greeting, name){
    console.log(greeting + '' + (name || 'everyone'))
}

var obj1 = new newObj(objHello, 'zzon');
```
