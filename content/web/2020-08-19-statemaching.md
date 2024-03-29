---
title: '상태머신과 오류가 발생하는 이유'
description: '웹 애플리케이션은 상태 머신이다. 웹 애플리케이션 오류가 발생하는 경우에 대해서 알아보자'
draft: false
template: 'post'
category: 'js'
tags:
    - js
date: 2020-08-19
---

## 상태머신

![상태머신](https://www.itemis.com/hubfs/yakindu/statechart-tools/documentation/images/overview_simple_moore.jpg)
![SR Flip-flop](https://www.electronics-tutorials.ws/wp-content/uploads/2018/05/sequential-seq4.gif)

1. 웹 애플리케이션은 상태 머신이다.
    - 상태머신이란 주어진 시간의 상태가 존재하고, 어떤 한 사건에 의해 다른 상태로 변할 수 있는 수학적 모델을 의미한다.
        - 시스템으로 input이 발생한다.
        - 프로그램 로직은 input과 현재 프로그램 상태에 따라 행위를 결정한다.
        - 프로그램 로직은 결정에 따라, 프로그램 상태를 변경한다.
        - 경우에 따라서는 프로그램 로직은 output을 생산하기도 한다.
    - 그림과 같이 화면에 on/off 버튼이 나와있다면,
        - 클라이언트로부터 event가 발생한다.
        - JS는 button의 value값이 on / off 상태인지 check
        - JS는 on -> off , off -> on의 형태로 변경을 한다.
        - 변경된 value값을 dom에 새롭게 렌더링을 한다.
    - 웹 애플리케이션에서 구현된 기능은 상태 머신에서 말하는 입력값과 기존 상탯값 그리고 로직에 따라 현재 상태가 결정된다.

## 오류 종류

1. 입력 오류
    - 시스템으로 전달되는 input으로 생기는 오류이다
    - 서버에서 데이터를 전달 받았을때, 응답이 오류, 비정상 데이터, 응답이 오기전에 일어난다.
    - 예시) 이벤트가 처리하였을때, 해당 프로퍼티 값이 없거나, 숫자만 처리하는데 문자도 같이 오는 경우?
2. 상태 오류
    - 구성요소 간에 의존도가 있는 경우
        - React를 기준으로, 부모 컴포넌트에서 데이터를 받아 자식 컴포넌트에서 데이터를 화면에 뿌려주는 경우
        - 자식 컴포넌트는 부모 컴포넌트의 데이터를 지속적으로 확인하여, 갱신을 하여야 하는데 그렇지 못하면, 에러가 발생
    - 호출 순서에 의존도가 있는 경우
        - 이벤트를 호출할때, A를 호출하고 B가 호출되는 순서로 로직이 구성되있을 경우
        - B가 먼저 호출이 되면 A를 통해서 변경되는 상태를 갱신하지 못해, 에러가 발생
3. 로직 오류
    - 어플리케이션에 대한 이해도 부족 및 개발자의 역량 부족으로 생기는 오류이다.(초보 개발자)
    - Flow Control에 이해하지 못하고 짜는 경우가 대부분이어서 수많은 조건문과 반복문으로 인해 로직 오류가 발생한다.
    - 지금은 자바스크립트에서 블록 스코프를 지원하는 let, const로 인해 전역오염을 방지할 수 있지만, 이러한 경우도 많다.
    - 로직 오류를 방지하는 방법은 경험과 테스트 코드를 해결한다고 한다...
