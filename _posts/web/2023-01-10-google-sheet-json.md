---
title: "구글 Sheet JSON 파일로 로컬 저장"
description: "Google Sheet Data Get JSON, Google Sheet v4" 
draft: false 
template: "post"
category : "web"
tags:
- version
date: 2023-01-10
---

## 1. 문제
- Sheet 버전이 V3 -> V4로 변경되면서, 기존에 사용하던 방법이 안되는 문제가 발생
  ```js
  const url = 'https://spreadsheets.google.com/feeds/cells/SPREAD_SHEET_ID/1/public/full?alt=json'
  ```
- AppScript(구글 sheet 플러그인)는 redirect 발생
  ```shell
  curl -s  "https://spreadsheets.google.com/feeds/cells/SPREAD_SHEET_ID/1/public/full?alt=json" > data.json
  ```
  ```html
  <HTML>
  <HEAD>
  <TITLE>Moved Temporarily</TITLE>
  </HEAD>
  <BODY BGCOLOR="#FFFFFF" TEXT="#000000">
  <H1>Moved Temporarily</H1>
  The document has moved <A HREF="REDIRECT_URL">here</A>.
  </BODY>
  </HTML>
  ```


## 2. 해결책
- V4 API를 사용하여, JSON 형태로 데이터를 가져오자
  ```js
  const url = 'https://sheets.googleapis.com/v4/spreadsheets/SPREAD_SHEET_ID/values/TAB_NAME?alt=json&key=API_KEY'
  ```
  - SPREAD_SHEET_ID: 구글 Sheet의 고유 ID
  - TAB_NAME: Sheet의 탭 이름
  - API_KEY: 구글 API Key([링크](https://console.cloud.google.com/apis/credentials))
      - 조건) spreadsheets API 사용등록 해야함([링크](https://console.cloud.google.com/apis/api/sheets.googleapis.com))

## 3. JSON 파일을 다운받아, 로컬에 저장
- shell script를 실행하여, spreadsheets를 다운받아 json으로 만들기
  ```
  # make json 파일
  #!/bin/bash

  curl -s "https://sheets.googleapis.com/v4/spreadsheets/SPREAD_SHEET_ID/values/TAB_NAME?alt=json&key=API_KEY"
  ```
  ![sheet](/assets/google-sheet/sheet.png)
  ```json
    # data.json
  {
    "range": "test!A1:Z1000",
    "majorDimension": "ROWS",
    "values": [
      [
        "hello",
        "world"
      ],
      [
        "foo",
        "bar"
      ]
    ]
  }
  ```





## 출처 및 참고
- [https://developers.google.com/sheets/api/guides/migration#v3-api](https://developers.google.com/sheets/api/guides/migration#v3-api)
- [https://stackoverflow.com/questions/68854198/did-google-sheets-stop-allowing-json-access](https://stackoverflow.com/questions/68854198/did-google-sheets-stop-allowing-json-access)
