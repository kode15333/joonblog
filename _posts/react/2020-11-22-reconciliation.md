---
title:  "Reconciliation"
description: "Reconciliation 대해서 알아보자"
draft: false
template: "post"
category : "react"
tags:
  - js
  - react
date: 2020-11-22
---

### Motivation

- 하나의 트리를 가지고 다른 트리로 변환하기 위한 최소한의 연산 수를 구하는 알고리즘은 일반적은 O(n^3)의 복잡도를 가지고 있다.(state of the art algorithms)
- 일반적으로  1000개의 엘리먼트를 그리기 위해서 10억 번의 비교 연산 수행
- 이 과도한 연산을 O(n)으로 줄이기 위해 2가지의 가정을 통해 구현할 수 있었다.

    1) 서로 다른 타입의 두 엘리먼트는 서로 다른 트리를 만들어 낸다.

    2) 엘리먼트의 key prop을 통해, 어떤 자식 엘리먼트가 변경되지 않아야 할지 표시해 줄 수 있다.

### Diffing Alogirithm

두 개의 트리를 비교할 때, React는 두 엘리먼트의 루트(root) 엘리먼트부터 비교합니다. 이후의 동작은 루트 엘리먼트의 타입에 따라 달라집니다.

- **엘리먼트의 type이 다른 경우**
    1. type이 다른걸 check
    2. componentWillUnmount()로 이전 DOM 노드를 삭제한다.
    3. 새로운 DOM 노드 생성
    4. componentWillMount()
    5. componentDidMount()
    6. 루트 엘리먼트가 가지고 있는 state가 변경 ⇒ 초기화

    ```jsx
    <div>
      <Counter />
    </div>

    <span>
      <Counter />
    </span>

    // 이전 Counter는 사라지고, 새로 다시 마운트가 될 것입니다.
    ```

- **DOM 엘리먼트의 타입이 같은 경우**
    1. 속성이 변경되었다면, 변경된 속성만 업데이트

    ```jsx
    <div className="before" title="stuff" />

    <div className="after" title="stuff" />
    ```

    2. style이 변경되었다면, 변경된 style만 업데이트

    ```jsx
    <div style={{color: 'red', fontWeight: 'bold'}} />

    <div style={{color: 'green', fontWeight: 'bold'}} />
    ```

    3. DOM 노드의 처리가 끝나면, React는 이어서 해당 노드의 자식들을 재귀적으로 처리

- **같은 타입의 컴포넌트 엘리먼트(타입은 같지만, 상태가 다를때)**
    1. componentWillReceiveProps() - 새로운 내용을 반영하기 위해 props 갱신
    2. componentWillUpdate() - props로 component의 상태 변경
    3. render() - 비교 알고리즘이 이전 결과와 새로운 결과를 재귀적으로 처리

### Key를 통한 효율적인 엘리먼트 관리

- 형제 노드사이에서만 유일하고 **전역**에서 유일할 필요는 없다!!!
1. key가 없다면
    - 변경된 부분을 다시 그려줘야 한다.

    ```jsx
    <ul>
      <li>Duke</li>
      <li>Villanova</li>
    </ul>

    <ul>
      <li>Connecticut</li>
      <li>Duke</li>
      <li>Villanova</li>
    </ul>
    ```

2. key로 인한 장점
    - 다시 그리는게 아니라, 이동만 할 뿐

    ```jsx
    <ul>
      <li key="2015">Duke</li>
      <li key="2016">Villanova</li>
    </ul>

    <ul>
      <li key="2014">Connecticut</li>
      <li key="2015">Duke</li>
      <li key="2016">Villanova</li>
    </ul>
    ```

### 결론

- render()를 호출한다
    1. diffing 을 통해 변화가 없다면, 출력되는 값/화면은 같다(마운트된 엘리먼트를 사용)
    2. diffing 을 통해 변화가 있다면, 언마운트시키고, 다시 마운트 ⇒ 변경된 부분만 적용
- key는 반드시 변하지 않고, 예상 가능하며,  유일해야 한다.
    1. 변하는 key(Math.random()으로 생성된 값 등)를 사용하면 많은 컴포넌트 인스턴스와 DOM 노드를 불필요하게 재생성하여 성능이 나빠지거나 자식 컴포넌트의 state가 유실될 수 있습니다.
- 타입은 다르지만 비슷한 결과물을 출력하는 두 컴포넌트있다면, 하나의 타입으로 만들자(비교하기 쉽게!!)
