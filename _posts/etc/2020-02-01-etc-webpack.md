---
title:  "WebPack"
description: "WebPack 정의 및 config 파일 정리"
draft: false
template: "post"
category : "etc"
tags:
  - etc
  - webpack
date: 2020-01-16
---
## WebPack 요약집
**웹팩은 변수와 의존성을 해결하면서 JS, CSS, SASS 등 여러가지 파일을 하나로 합쳐주는거다**

* 1단계
  * npm init -y(default로 package.json 파일 setting)
  * npm install [패키지명] (--save / --save--dev : dev dependency로 추가)
  * index.html에 bundle.js 추가
* 2단계 
  * webpack.config.js 생성
  * entry 설정 : 번들 할 대상 파일의 시작점
  * output 설정 : 번들 후 저장경로 및 파일명
  * module 설정 : rules/규칙, test/파일규칙, use/loader 설정
  * plugin : 번들 후 새로운 기능 추가
    * MiniCssExtractPlugin() -- css 파일을 별도로 생성
    * HtmlWebpackPlugin() -- index.html 파일을 만들어줌

```js
// webpack.config.js
var path = require('path');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'none',
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    "css-loader"
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin()
    ],
}
```  

* 3단계
    * package.json에 script 설정 : 명령어 추가
      * 예) build : 'webpack'

            ```json  
        {   
            "name": "폴더명",
            "version": "1.0.0",
            "description": "",
            "main": "index.js",
            "scripts": {
                "build": "webpack",
                "devserver": "webpack-dev-server --open --progress"
            },
            "keywords": [],
            "author": "",
            "license": "ISC",
            "devDependencies": {
                "css-loader": "^3.4.0",
                "mini-css-extract-plugin": "^0.9.0",
                "style-loader": "^1.1.2",
                "webpack": "^4.41.4",
                "webpack-cli": "^3.3.10"
             }
        }
            ```
* 4단계
    * .gitignore에 node_modules과 package-json-dev를 추가한다.

    ```
    해당 파일명.확장자 < 해댕 파일명 제외
    /디렉토리/ < 디렉토리 부터 제외
    ```
