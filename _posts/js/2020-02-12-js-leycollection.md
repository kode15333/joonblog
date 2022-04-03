---
title:  "JS KeyCollection"
description: "자바스크립트에서 지원하는 Map, Set 객체 정리"
draft: false
template: "post"
category : "js"
tags:
  - js
date: 2020-02-12
---
## Map and Set in JS
### 입력된 키값을 기준으로 정렬되는 데이터의 집합(자료구조)
### Map과 Set은 입력된 순서대로 반복적으로 접근 가능한 요소들을 포함하고 있다.

## Map vs Object
`[key, value]`의 형태로 존재하며, 키값 입력순서대로 Map객체에 포함된다.

### Object 와 Map 의 비교
1. Chaining
    * Object - Prototype을 통해 키 값이 충돌할수도 있음
    * Map    - default valuer가 없다.
2. Key Type
    * Object - Only use String, Simbol
    * Map    - anything (primitive, function, object)
3. key Order
    * Object - not Ordered
    * Map    - 넣어진 키 순서대로 저장이 된다.
4. Size
    * Object - 구할수는 있지만, 정의해 주어야 한다.
    * Map    - Map.prototype.size() 
5. Performanse
    * Object - 키/벨류 형태를 추가/삭제 하는데 `효율적이지 못하다`
    * Map    - `효율적이다`

## Map

### Proporty

1. Map.prototype.constructor = return Map function by default

2. Map.prototype.size = return key/value number

### Function

1. Map.prototype.clear() = remove all Map Object(key/value)

2. Map.prototype.delete(Key)

3. Map.prototype.entries() = Map Object를 Iterator 객체를 리턴한다.

4. Map.prototype.forEach(callBackFn[, thisValue]

5. Map.prototype.get(Key)

6. Map.prototype.has(Key) = Map객체 내에서 해당 Key값 여부(hasOwnProperty와 비슷)

7. Map.prototype.keys() = key의 Iterator 객체를 리턴한다

8. Map.prototype.set(key, value) = Map객체의 key/value값을 지정  
  (Map[key] = value OR Map[key]로 사용하는 것은 Map객체의 프로퍼티를 사용하는것! set/get 추천)

9. Map.prototype.values() = Value만 Iterator 객체로 리턴한다.

* Map객체 내에 키/값을 반복해서 꺼내는 메소드 예제
    ```js
    let recipeMap = new Map([
      ['cucumber', 500],
      ['tomatoes', 350],
      ['onion',    50]
    ]);

    // iterate over keys (vegetables)
    for (let vegetable of recipeMap.keys()) {
      alert(vegetable); // cucumber, tomatoes, onion
    }

    // iterate over values (amounts)
    for (let amount of recipeMap.values()) {
      alert(amount); // 500, 350, 50
    }

    // iterate over [key, value] entries
    for (let entry of recipeMap) { // the same as of recipeMap.entries()
      alert(entry); // cucumber,500 (and so on)
    }
    ```

## Set

값 콜렉션으로 Set객체 내에 값들은 유일하게 존재한다.

### Property

1. Set.prototype.size = set의 사이즈를 리턴한다
2. Set.prototype.constructor

### Function

1. Set.prototype.add(value) = set 객체내에 새로운 value를 추가한다

2. Set.prototype.clear() = set 객체내 요소를 전체 다 삭제한다.

3. Set.prototype.delete(value) = value를 삭제한다
    - 삭제를 하기전에는 set.has(value) => true 리턴
    - 삭제 후 set.has(value) => false 리턴
4. Set.prototype.entries() = Set 객체를 iterator한 객체로 만들어 리턴

5. Set.prototype.forEach(callbackFn)

6. Set.prototype.has(value) = Set 객체 내의 값 존재 여부 확인(true/ false)

7. Set.prototype.keys() / values() = Set 객체를 iterator한 객체로 만들어 리턴

    ```js
    let set = new Set(["oranges", "apples", "bananas"]);

    for (let value of set) alert(value);

    // the same with forEach:
    set.forEach((value, valueAgain, set) => {
      alert(value);
    });
    ```

## WeakMap and WeakSet
Map과 Set의 메모리 누수문제~ 및 가비지 컬렉터 대상이 아니기 때문에 무겁다
그래서 WeakMap과 WeakSet을 만들어 참조되지 못하는 키와 값이 있다면 가비지컬렉터 대상이 되어 사라진다
그리고 객체만 추가할수 있어 열거할수가 없다.



  - WeakMap.prototype.delete(key)
  - WeakMap.prototype.get(key)
  - WeakMap.prototype.has(key)
  - WeakMap.prototype.set(key, value)

  - WeakSet.prototype.add(value)
  - WeakSet.prototype.delete(value)
  - WeakSet.prototype.has(value)
