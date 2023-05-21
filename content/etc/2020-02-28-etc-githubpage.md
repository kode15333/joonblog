---
title: '빌드하면서 자동으로 깃업페이지 만들기'
description: 'npm i -s gh-pages'
draft: false
template: 'post'
category: 'etc'
tags:
    - etc
    - npm
date: 2020-01-16
---

## 빌드하면서 자동으로 깃업페이지 만들기

1. pachage.json 에 homepage 추가

    - "homepage" : 'https://username.github.io/저장소'

2. gh-pages 패키지 설치 및 스크립트 추가

    ```bash
    npm i -s gh-pages
    ```

    package.json 스크립트 추가

    ```json
    "scripts": {
      + "predeploy": "npm run build",
      - "deploy": "gh-pages -d build",
         // 프로젝트 페이지 대신 github 페이지 배포하는 경우
      + "deploy": "gh-pages -b master -d build",
        "start": "react-scripts start",
        "build": "react-scripts build",
    ```

3. npm run deploy 실행

4. git 저장소 setting
   ![image](https://i.imgur.com/HUjEr9l.png)
