---
title: 'JS CurringPattern'
description: '자바스크립트 CurringPattern 패턴 정의 및 코드'
draft: false
template: 'post'
category: 'js'
tags:
    - js
date: 2020-02-13
---

## 커링? Curring

-   커링은 함수 하나가 n개의 인자를 받는 과정을 n개의 함수로 각각의 인자를 받도록 하는 것이다. 부분적으로 함수를 체인으로 계속 생성해 결과적으로 값을 처리하도록 하는 것이 그 본질이다.

```js
function curry(fn) {
    var criteria = fn.length
    // Curring할 함수의 인자의 개수를 받는다. 기준 지정 : 함수 Counting 지정!!!

    return (function resolve() {
        var memomry = Array.prototype.slice.call(arguments)
        // resolve함수의 전달 인자들을 memory배열에 복사한다.
        return function () {
            var local = memory.slice()
            //   전에 있던 인자들을 local이라는 변수에 저장
            Array.prototype.push.apply(local, arguments)
            //   resolve -> 익명 함수가 다시 실행되면 전달 인자를 local(현재 저장되고 있는 전달인자 배열)에 저장한다.
            next = local.length >= criteria ? fn : resolve
            // local과 criteria의 길이가 같거나 크다면 Curring 초기에 받은 함수를 실행
            // local의 length가 작다면 resolve -> 익명함수를 리턴하여 다시 전달인자를 받아오게 한다.
            return next.apply(null, local)
        }
    })()
}
```

```js
function volume(i, w, h) {
    return i * w * h
}

var curried = curry(volume)
// criteria에 volume의 전달인자를 저장
var length = curried(1)
// memory.local에 1이라는 전달인자를 저장하고 criteria보다 작기때문에 익명함수 호출
var lengthAndWidth = length(2)
// memory.local에 2이라는 전달인자를 저장하고 criteria보다 작기때문에 익명함수 호출
lengthAndWidth(3)
// criteria 와 local이 길이가 동일하므로 volume(local) 실행하여 결과 리턴
curried(1)(2)(3) //6
```
