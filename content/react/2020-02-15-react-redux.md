---
title: 'Redux Flux'
description: 'Redux에 대한 정의와 사용법'
draft: false
template: 'post'
category: 'react'
tags:
    - react
date: 2020-01-16
---

## Redux 정리

## 1. action creators

    - 애플리케이션 상태를 바꾸고 싶다면 항상 액션을 보내는 방법(유일한 방법)

## 2. Store

    - state tree 전체를 유지하는 역할
    - Action이 들어오면 reducer에게 위임
    - Flux에서 dispatch가 action을 각 store로 보내는 역할을 Redux에서는 store가 한다.

## 3. Reducers

    - 리듀서는 원본의 복사본을 만들어 액션에 따라서 상태를 변경해준다.
    - 리듀서가 여러가지라면 루트 리듀서를 만들어서 리듀서를 합쳐준다.

## 4. Component

    - flux
    1.  controller view
        - 스토어와 뷰 사이의 중간관리자같은 역할
        - 상태가 변경되었을때, 스토어가 전달하여 밑에 있는 뷰에게 상태를 전달
    2.  thw view
        - 받은 데이터를 가지고 화면을 만드는 역할뿐
    - Redux
    1.  smart component
        - 액샌 처리를 책임
        - props를 통해 dumb에게 함수를 보내 dumb은 받은 함수를 통해서 호출할 뿐
        - dumb component 관리
    2.  dumb component
        - 액션에 대한 직접 의존성을 가지지 않는다.
        - css style을 가진다(smart는 못가진다.)

## 5. view layer binding

-   스토어와 뷰를 연결하기 위해 react-redux를 사용
-   Privider 컴포넌트 트리를 감싸는 컨포넌트 connect()를 이용해 루트 컴포넌트 밑의 컴포넌트들이 스토어에 연결
-   connect()는 react-redux가 제공하는 함수이다. 컴포넌트가 애플리케이션 상태 업테이트를 받고 싶은면 connect()를 이용해서 컴포넌트를 감싸주면 된다. 그러면 connect()가 selector를 이용해서 필요한 모든 연결을 만들어준다.
-   셀렉터는 직접 만들어야 하는 함수이다. 애플리케이션 상태 안의 어느 부분이 컴포넌트에 props로써 필요한 것인지 지정

## 6. root component

-   스토어를 생성하고 무슨 리듀서를 사용할지 알려주며, 뷰레이어 바인딩과 뷰를 불러온다.
