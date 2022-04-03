---
title:  "노드에서 크롤링을 해보자"
description: "npm i axios cheerio pupperteer"
draft: false
template: "post"
category : "etc"
tags:
  - etc
  - npm
date: 2020-01-16
---
## 크롤링 도구(axios, cheerio, pupperteer)

1. axios : 비동기 통신 도구
2. cheerio : cheerio.load(`HTML 객체`) load 함수에 HTML객체를 넣으면 제이쿼리의 선택자를 통해 원하는 정보를 뽑아낼수있다.
3. pupperteer : 스크린샷, PDF 생성 및 화면을 조정 할 수 있다.

```js
// /********** axios, cheerio **********/
const axios = require('axios');
const cheerio = require('cheerio');
const crawler = async () => {
  let result, $, text, summary = [];
  for(let v of rs2) {
    result = await axios.get(v.link);
    // 비동기 통신으로 해당 링크의 html을 가지고 온다.
    // console.log(result.data);
    $ = cheerio.load(result.data);
    // cheerio로 통해 html을 제이쿼리 선택자 처럼 사용할수있게한다.
    text = $(".story_area .con_tx").text();
    // 해당 문서에서 찾아서 text() text만 뽑아낸다
    summary.push(text);
  }
  // console.log(summary);
}
crawler();

/********** puppeteer **********/
const puppeteer = require('puppeteer');
const crawler2 = async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(rs2[0].link);
  await page.waitFor(2000);
  await page.goto(rs2[1].link);
  await page.waitFor(3000);
  await page.close();
  await browser.close();
};
crawler2();

```
