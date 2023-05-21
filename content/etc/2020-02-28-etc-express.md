---
title: 'Exrpess_Cookie_Session_Settion'
description: '쿠키와 세션에 대한 정리 및 node에서 사용법'
draft: false
template: 'post'
category: 'etc'
tags:
    - etc
    - HTTP프로토콜
    - node
date: 2020-01-16
---

## Express에서 쿠키와 세션 등록

정의 : HTTP 프로토콜은 한번 요청과 응답을 하면 서버는 클라이언트와 끝이다.
HTTP 프로토콜의 특징!!(connectionless = 응답을 받은면 연결 해체, stateless = 통신이 끝나면 상태 유지 안함
로그인 및 장바구니 같이 계속해서 정보를 페이지가 변경이 되더라도 가지고 있어야 하지만, 안된다. 그래서 쿠키와 세션을 이용해서 정보를 가지고 있는다. 여기서 정보란 회원로그인 여부, 장바구니 내용물 등이 될수가 있다.

1. 쿠키란?

    - 정의 : 웹 서버를 통해 사용자의 컴퓨터에 직접 저장
    - 저장장소 : req.header
    - 속성
        - maxAge : 쿠키의 만료 시간을 밀리초 단위로 설정
        - expires : 쿠키의 만료 시간을 표준 시간 으로 설정
        - path : 쿠키의 경로 (default: /)
        - domain : 쿠키의 도메인 이름 (default: loaded)
        - secure : HTTPS 프로토콜만 쿠키 사용 가능
        - httpOnly : HTTP 프로토콜만 쿠키 사용 가능
        - signed : 쿠키의 서명 여부를 결정
        - encode
        - samaSite

    * 사용방법

    ```js
    // 1. 기본적인 쿠키 설정 및 사용 방법
    const express = require('express')
    var cookieParser = require('cookie-parser')
    const app = express()
    app.use(cookieParser())
    app.get('/', (req, res) => {
        // 설정
        res.cookie('rememberme', '1', {
            expires: new Date(Date.now() + 90000000),
            httpOnly: false,
        })
        res.send('Hello World!')
    })
    app.get('/user', (req, res) => {
        // 사용방법
        console.dir(req.cookies)
        res.send('cookie parser!')
    })

    // 2. 쿠기 암호화
    app.use(cookieParser('sdfkmsdlfk')) // 파라미터로 자기가 원하는 문자열! 그걸 기준으로 암호화

    // 설정  => signed : true <<<  암호화를 한다
    res.cookie('rememberme', '1', {
        expires: new Date(Date.now() + 90000000),
        httpOnly: false,
        signed: true,
    })

    // 사용방법
    req.signedCookies.rememberme
    ```

2. 세션

    - 정의 : 쿠키보다 더 안전하고 많은 데이터를 저장하는 저장 방식
    - 사용이유 : 쿠키의 경우 데이터를 사용자의 컴퓨터에 저장하기 때문에 비밀번호 같은 민감한
      부분이라도 예외없이 그래도 드러납니다. 하지만 세션은 데이터를 서버에 저장하기 떄문에 안전
    - sessing 및 관련 모듈 설치

        ```bash
        $ npm i express-session session-file-store
        ```

    - 사용방법

    ```js

    const session = require("express-session");
    const FileStore = require("session-file-store")(session);

    app.use(
        session({
            secret: "keyboard cat", // 암호화
            resave: false,
            saveUninitialized: true,
            store: new FileStore() // store를 DB와 연결하여 사용 가능

        // store: new MongoStore({
        // url: "mongodb://localhost/test",
        // collection: "sessions"
        // })
        })
    );

    app.get("/", (req, res, next) => {
        if (!req.session.num) {
            <!-- 설정 -->
            req.session.num = 1;
        } else {
            <!-- 사용방법 -->
            req.session.num = req.session.num + 1;
        }
    });


    ```
