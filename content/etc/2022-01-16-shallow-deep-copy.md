---
title: 'Shallow / Deep Copy And FP'
description: '언제 얕은 복사를 쓸까?, 도대체 왜 깊은 복사를 쓰는거지?'
draft: false
template: 'post'
category: 'etc'
tags:
    - copy
    - functional Programming
date: 2022-01-16
---

## 0. 작성이유

-   스터디 주제...
-   언제 얕은 복사를 쓸까?
-   도대체 왜 깊은 복사를 쓰는거지?

## 1. Primitive Type vs Reference Data Type

1. Primitive
    - 변수(메모리 주소)가 값을 가지고 있음(강결합)
    - 복사를 하게 될 경우, 새로운 값(메모리)를 할당하여 **real copy**
2. Reference

    - 변수(메모리 주소)가 주소를 가지고 있음
    - 복사를 할 경우, 방법에 따라 **Shallow, Deep Copy**

    ```jsx
    let foo = 30
    bar = foo

    const fooRef = {
        age: 30,
        name: 'kim',
    }

    const barRef = fooRef
    barRef.age = 35
    ```

## 2. Shallow And Deep Copy

> 과일 바구니만 복사하는거랑, 과일까지 복사하는 차이

![copy](https://media.geeksforgeeks.org/wp-content/uploads/20201104103252/shallowdeep.jpg)

1. Shallow Copy
    - Object(Original Memory Address) **주소만을** 저장한다. (과일바구니)
    - Original/Copied Object는Value가 동일하기 때문에, **서로 영향을 받는다.**
    - Copy시, Original Object의 Pointer만 복사하기 때문에 **빠르다!**
2. Deep Copy
    - Object의 value의 복사복을 저장한다. (과일바구니 안에 담겨있는 과일)
    - Copied Object의 value가 변경되도 Original에는 **영향이 없다.**
    - Copy시, Original Object와 Value까지 복사하기 때문에 **느리다.**

## 3 . Reference Data Type의 요소들의 값이 ..

-   Primitive일 경우,

    ```jsx
    const foo = [1, 2, 3, 4, 5]
    const bar1 = [...foo]
    const bar2 = foo.slice()
    const bar3 = Array.from(foo)

    const bar = { name: 'kim' }
    Object.assign({}, bar)
    ```

-   reference일 경우 JSON.parse/stringify, \_.cloneDeep을 이용한다

    -   JSON의 경우 Boolean, Number, String의 타입만 변경한다.

        ```jsx
        const foo = {
            date: new Date(),
            nan: NaN,
            undef: undefined,
            symbl: Symbol('foo'),
            infinity: Infinity,
            set: new Set([1, 2, 3]),
            map: new Map(),
        }

        JSON.parse(JSON.stringify(foo))
        ```

## 4. Shallow Copy는 언제 쓰나?

-   텍스트 에디터를 개발할때 주로 쓰인다. (참고 : 플라이웨이트 패턴)

## 5. 함수형 프로그래밍의 특징(in JS)

1. Avoid side effects(use “pure” functions)

    - `오직 인풋만을 가지고 계산하여 아웃풋을 반환하여야 순수함수`

    ```jsx
    // 순수함수가 아닌 이유 : 인풋이 없고, 아웃풋 또한 없으며 단순히 콘솔 창에 찍어주는것만 한다.
    var name = 'Jun'
    function greet() {
        console.log("Hi, I'm " + name)
    }

    // 순수함수 : 아웃풋에 영향을 주는것 인풋 밖에 없다
    function greet(name) {
        return "Hi, I'm " + name
    }
    ```

2. Use higher-order functions

    - 함수형 패러다임에만 존재하는 형태 (like HOC)
    - 자바스크립트는 함수또한 객체이기 때문에 함수를 리턴할 수 있다.

    ```jsx
    function makebeverage(fruit){
        return function(string){
            return fruit + string
        }
    }

    var apple = makebeverage('apple');
    apple('soda');
        => 'apple soda'
    ```

3. Don’t Iterate(for, while) ⇒ (filter, map, ...)
    - For-Loop하면서 해당 요소(input)의 함수를 호출시켜 원하는 작업을 진행 (output)
4. Avoid mutability => use immutable data

    - 의도치 않은 변화로 인해 문제가 발생할 수 있다 (shallow copy 문제)
    - 변경된 새로운 데이터를 만든다 (원래 데이트는 불변성을 지킨다.)

    ```jsx

    const rooms = ['h1','h2','h3'];
    rooms[2] = 'h4';
    rooms;
    => ['h1','h2','h4']

    const newRooms = rooms.map(rm => {
       if(rm === 'h3'){return 'h4'}
       else{return rm}
    })

    newRooms; => ['h1','h2','h4']
    rooms; =>  ['h1','h2','h3']

    ```

5. Persistent data structures for efficient immutability => Mori, **[Immutable.js](https://immutable-js.github.io/immutable-js/)**

    - immutable의 문제점 ⇒ 매번 사본을 만들기 떄문에 리소스(시간, 메모리) 소요
    - strucure sharing 형태(데이터 → 트리 형태로)
        - 데이터를 트리의 형태로 만들어서 기존에 있는 노드를 재사용한다.

    ![Persistent data structures](https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Purely_functional_tree_after.svg/438px-Purely_functional_tree_after.svg.png)

## 참고

-   [https://javascript.plainenglish.io/shallow-copy-and-deep-copy-in-javascript-a0a04104ab5c](https://javascript.plainenglish.io/shallow-copy-and-deep-copy-in-javascript-a0a04104ab5c)
-   [https://www.geeksforgeeks.org/difference-between-shallow-and-deep-copy-of-a-class/](https://www.geeksforgeeks.org/difference-between-shallow-and-deep-copy-of-a-class/)
-   [https://www.techopedia.com/definition/25608/deep-copy](https://www.techopedia.com/definition/25608/deep-copy)
-   [youtube.com/watch?v=e-5obm1G_FY&t=5s](http://youtube.com/watch?v=e-5obm1G_FY&t=5s)
-   [https://en.wikipedia.org/wiki/Persistent_data_structure](https://en.wikipedia.org/wiki/Persistent_data_structure)
-   [https://en.wikipedia.org/wiki/Flyweight_pattern](https://en.wikipedia.org/wiki/Flyweight_pattern)
-   [https://en.wikipedia.org/wiki/Persistent_data_structure](https://en.wikipedia.org/wiki/Persistent_data_structure)
