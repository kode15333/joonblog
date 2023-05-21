---
title: 'OJT3'
description: 'OJT3'
draft: false
template: 'post'
category: 'etc'
tags:
    - etc
date: 2020-03-27
---

## 리펙토링

전체적인 흐름

1. 테스트코드를 작성한다.
2. 인풋과 아웃풋을 통해 내가 원하는 함수를 만든다
3. 테스트가 통과한다면, 코드 스멜을 찾아 리펙토링을 한다.
4. 단, 리펙토링을 한다고 아웃풋이 변하지 않는다.

-   [코드스멜](https://www.slideshare.net/jaehoonoh/javascript-refactoring-workshop)
    -   켄트 백이 만든 용어
    -   리펙토링이 필요한 코드를 식별하게 도와준다.
    -   언제 리팩토링을 해야 하는지를 알려준다.
    -   [목록](https://en.wikipedia.org/wiki/Code_smell)
-   리펙토링의 전제조건
    -   리펙토링 : 외부 동작을 바꾸지 않으면서 내부구조를 개선하는것
    -   코드를 변경햇을 때, 외부 동작이 바뀌지 않았다는 것을 증명해야 한다.

## Characterization Test Process

-   legacy code : 테스트 코드를 진행하지 않는 프로젝트
-   리펙토링을 하려고 할때
    -   함수의 특성 및 어떤 프로세스로 진행되는 것에 대해서는 정확히 파악하지 않고서 리펙토링 불가
    -   mocha, nyc (커버러지 툴이 함수의 얼마나 실행을 했는지를 활용하여 파악한다.)
    -   순서는 테스트 코드를 작성하여 커버리지 확인
    -   테스트 코드 작성 -> 커버리지 100% 달성 후 리펙토링 작업

## [참고사이트](https://github.com/KisukPark/js-refactoring-2019)
