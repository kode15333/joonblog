---
title:  "노드에서 환경변수를 사용해보자"
description: "npm i dotenv"
draft: false
template: "post"
category : "etc"
tags:
  - etc
  - npm
date: 2020-01-16
---
## .env 설정 및 'dotenv' 사용법

* 중요한 코드 정보를 노출시키지 않고 변수에 담아 쓰기위해 사용

  ```bash
  # dotenv 설치
  npm install dotenv
  ``` 
* 환경변수 파일 (.env) 만듬

  ```
  localhost=127.0.0.1
  ```
* JS파일에서 환경변수 풀러오기
  * 사용법 : process.env.환경변수 

  ```js
  // test.js
  const dotenv = require('dotenv');

  console.log("환경변수 : " + process.env.localhost)
  ```
* Node로 실행

  ```bash
  node test.js
  환경변수 : 127.0.0.1
  ```
