---
title: 'weakMap을 이용한 singleton 패턴 '
description: 'singleton weakMap에 대해서'
draft: false
template: 'post'
category: 'js'
tags:
    - js
date: 2021-02-20
---

## **이글을 작성하는 이유?**

-   코드스피치 유튜브 영상에서 소개한 Singleton Pattern에 대해서 공유하고 싶어서
-   Map 과 WeakMap에 대해서 정확한 차이를 알고 싶어서

> Singleton Pattern : 단 하나의 인스턴스만 생성되고 사용되어 진다.

-   어디에서 불러내고 요청되도 인스턴스는 언제나 하나(Singleton 유지)

    App 개발에서 메모리 Context에 따라 세가지의 Singleton

    1.  Application Memory : 서버가 죽을때까지의 메모리
    2.  Session Memory : 유저가 로그인하고 로그아웃 할때까지의 메모리
    3.  Request Memory : 하나의 요청당 하나의 메모리

## JavaScript에서 SingleTon을 구현하는 방법

### 1. [closure + IIFE](https://www.zerocho.com/category/JavaScript/post/57541bef7dfff917002c4e86) (from ZeroCho)

-   ES6 이전에 구현하는 방법

    ```jsx
    var singleton = (function () {
        var instance
        var a = 'hello'
        function initiate() {
            return {
                a: a,
                b: function () {
                    alert(a)
                },
            }
        }
        return {
            getInstance: function () {
                if (!instance) {
                    instance = initiate()
                }
                return instance
            },
        }
    })()
    var first = singleton.getInstance()
    var second = singleton.getInstance()
    console.log(first === second) // true;
    ```

### 2. WeakMap (from CodeSpitz)

-   Map과 다른점은 Key에 참조값만 넣을 수 있다! ⇒ Key가 객체이다
-   어떤 객체를 기반으로 무언가 값을 얻어내고 싶으면, WeakMap 사용
-   weakMap의 내장 메소드를 에러처리하여, Singleton의 역할만 할 수 있게!

    ```jsx
    const Singleton = class extends WeakMap {
        has() {
            err()
        }
        get() {
            err()
        }
        set() {
            err()
        }
        getInstance(v) {
            if (!super.has(v.constructor)) super.set(v.constructor, v)
            return super.get(v.constructor)
        }
    }

    const singleton = new Singleton()

    const Test = class {
        constructor(isSingleton) {
            if (isSingleton) return singleton.getInstance(this)
        }
    }

    const test1 = new Test(true),
        test2 = new Test(true),
        test3 = new Test()
    console.log(test1 === test2) //true
    console.log(test2 === test3) //false
    ```

## Map이 있는데... WeakMap은 왜 쓸까?

### 1. **등장배경**

-   JS 엔진은 **Mark And Sweap** 알고리즘 방식으로 메모리를 관리한다

    ```jsx
    let john = { name: 'John' }
    john = null // 더이상 쓰이지 않아, 메모리에서 삭제!

    john = { name: 'John' }
    let array = [john] // array[0]는 john 객체을 참조
    john = null // 참조를 null로 덮어씀

    // john을 나타내는 객체는 배열의 요소이기 때문에 가비지 컬렉터의 대상이 되지 않습니다.
    // array[0]을 이용하면 해당 객체를 얻는 것도 가능합니다.
    console.log(JSON.stringify(array[0])) //{ "name": "John" }
    ```

-   Map에서 객체를 키로 사용한 경우, Map이 메모리에 있는 한 객체도 메모리에 남아 있는다**(가비지 컬렉터의 대상이 되지 않는다)**

    ```jsx
    let john = { name: 'John' }

    let map = new Map()
    map.set(john, '...')

    john = null // 참조를 null로 덮어씀

    // john을 나타내는 객체는 맵 안에 저장되어있습니다.
    // map.keys()를 이용하면 해당 객체를 얻는 것도 가능합니다.
    for (let obj of map.keys()) {
        alert(JSON.stringify(obj))
    }

    alert(map.size)
    ```

### **2. WeakMap을 이용하여 객체를 키로 사용할때 발생하는 문제를 해결할 수 있다**

-   john을 나타내는 객체는 오로지 위크맵의 키로만 사용되고 있으므로,
-   참조를 덮어쓰게 되면 객체는 위크맵과 메모리에서 자동으로 삭제됩니다.

    ```jsx
    let john = { name: 'John' }

    let weakMap = new WeakMap()
    weakMap.set(john, '...')

    john = null // 참조를 덮어씀

    // john을 나타내는 객체는 이제 메모리에서 지워집니다!
    ```

## 관련 출처

-   [https://www.zerocho.com/category/JavaScript/post/57541bef7dfff917002c4e86](https://www.zerocho.com/category/JavaScript/post/57541bef7dfff917002c4e86)
-   [https://ko.javascript.info/weakmap-weakset](https://ko.javascript.info/weakmap-weakset)
-   [https://www.youtube.com/watch?v=LJhkPP0E6dw&list=PLBNdLLaRx_rLSwAiLS52IXEo26KsMhzLC&index=2](https://www.youtube.com/watch?v=LJhkPP0E6dw&list=PLBNdLLaRx_rLSwAiLS52IXEo26KsMhzLC&index=2)
