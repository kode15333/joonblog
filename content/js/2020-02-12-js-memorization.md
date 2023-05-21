---
title: 'JS 메모리제이션패턴'
description: '자바스크립트 메모리제이션패턴 정리'
draft: false
template: 'post'
category: 'js'
tags:
    - js
date: 2020-02-12
---

## 메모리제이션 패턴

'memorize'란 표현을 사전에서 찾아보면, '계산 결과를 저장해 놓아 이후 다시 계산할 필요 없이 사용할 수 있게 한다는 컴퓨터 용어라고 나와 았다.
메모이제이션 패턴은 바로 이러한 기능 자바스크립트에서 구현한 패턴이다. 기본적으로 계산된 결과를 함수 프로퍼티 값으로 담아 놓고 나중에 사용한다.

```js
function Calculate(key, input, func) {
    Calculate.data = Calculate.data || {}
    if (!Calculate.data[key]) {
        var result
        result = func(input)
        Calculate.data[key] = result
    }

    return Calculate.data[key]
}

var result = Calculate(1, 5, function (input) {
    return input * input
})

console.log(result)

result = Calculate(2, 5, function (input) {
    return (input * input) / 4
})

console.log(result)

console.log(Calculate(1))
console.log(Calculate(2))
```

위 예제에서 보는 바와 같이 함수 Calculate() 프로퍼티에 data 프로퍼티를 만들어 객체를 할당하였다.
이곳에 사용자는 자신의 원하는 값을 원하는 키로 저장해 놓을 수 있다ㅣ 일단 한번 계산된 값이 들어가면
그 이후에는 해당 키로 저장해 놓은 값을 받아서 사용할 수 있다.

### 팩토리얼에 적용해보자

```js
var fact = (function () {
    var cache = { 0: 1 }
    var func = function (n) {
        var result = 0

        if (typeof cache[n] === 'number') {
            result = cache[n]
        } else {
            result = cache[n] = n * func(n - 1)
        }

        return result
    }

    return func
})()

console.log(fact(10))
console.log(fact(20))
```
