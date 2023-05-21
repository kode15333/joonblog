---
title: 'Package Versioning'
description: 'Package Version Management, SemVer, and Node Version, 의존성 모듈'
draft: false
template: 'post'
category: 'CS'
tags:
    - version
date: 2022-12-26
---

## 0. 작성하는 이유

-   답변하지 못했다…
    -   찾아서 답변했지만, 이해하지 못했다.

## TLDR

-   X(Major).Y(Minor).Z(Patch) 버전
-   `v1.2.3` 은 태깅 버전, `1.2.3` 버전
-   `~` 틸트는 최신 패치 버전만 설처
    -   ~1.2.3 ⇒ 1.2.3 ≤ x < 1.3.0
-   `^` 캐럿은 최신의 마이너 버전만 설치
    -   ^1.2.3 ⇒ 1.2.3 ≤ x < 2.0.0
-   `@` 앳은 특정 버전만 설치
    -   단, 설치하고 나서, package.json에서 버전외 Symbol 삭제
    -   삭제후, 모듈 전체 설치해야지, `yarn.lock` 변경됨

## 1. 버전은 어떻게 만들까?

### 1. **Backus–Naur Form Grammar for Valid SemVer Versions**

-   Semantic Versioning 규칙

    ```jsx
    <version core> ::= <major> "." <minor> "." <patch>
    ```

-   버전 번호는 X.Y.Z 형식으로 `음수가 아닌 정수`이며, 선행은 `0`을 포함해서는 안된다
-   `X === 0` 일 경우, 초기 개발용!(언제든지 변경되도 상관없다)
-   `1.0.0` 은 공식적인 버전 (릴리즈 이후에는 버전 번호가 증가하는 방식을 따라야 한다)
-   `Z` 버전이 변경되면, **버그 패치**
-   `Y` 버전이 변경되면, **새기능을 추가하거나, 개선사항 도입**
    -   `Y` 버전이 변경되면, `Z` 버전은 `0` 으로 초기화 된다.
    -   `deprecated` 를 표시해주거나, 하위호환성을 유지해야 한다.
-   `X` 버전이 변경되면, **이전버전과 호환이 되지 변경 및 신규사항 추가**
    -   `X` 버전이 변경되면, `Y`, `Z` 은 `0` 으로 초기화 된다.

### 2. 우선 순위

-   메이저, 마이너, 패치 순으로 우선순위를 정한다.
-   문자 또는 하이픈이 있는 식별자는 ASCII 정렬 순서로 어휘적으로 비교됩니다.

    ```jsx
    1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta
    < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0- rc.1 < 1.0.0.
    ```

### 3. `v1.2.3`은 시맨틱 버전일까?

-   버전은 `1.2.3` 태깅이 `v1.2.3` 다!

## 2. 버전 Range Symbol

### 1. `-`

```jsx
1.2.3 - 2.3.4 := >=1.2.3 <=2.3.4
```

### 2. `x or X or *`

```jsx
- *:= >=0.0.0(모든 버전 만족)
- 1.x:= >=1.0.0 <2.0.0(major 버전 일치)
- 1.2.x:= >=1.2.0 <1.3.0(major 버전과 minor 버전 일치)
```

### 3. `~` (틸트/ **Tilde**)

-   **major version과 minor version은 변경되지 않는다.**
-   `~` 를 사용하면, 가장 최근의 minor 버전을 다운받는다(즉, patch 마지막 버전)
-   목적은 버그 fix

### 4. `^` (캐럿 / **Caret**)

-   **major version이 변경되지 않는다.**
-   `^` 를 사용하면, 가장 최근의 major 버전을 다운받는다(즉, minior 마지막 버전)
-   하위호완성 및 새로운 API를 사용할 수 있다.

## 3. 노드 환경에서 패키치 설치시 어떻게 될까?

### 1. pachage.json

1. `axios` 설치

    ```jsx
    "dependencies": {
        "axios": "^1.2.1",
    		 ...
      },
    ```

2. `^` (캐럿 / **Caret**)으로 해당 모듈이 설치된다.

### 2. yarn.lock or package-lock.json

-   의존성 모듈에도 동일하게 버전이 표시된다.

    ```jsx
    axios@^1.2.1:
      version "1.2.1"
      resolved "https://registry.yarnpkg.com/axios/-/axios-1.2.1.tgz#44cf04a3c9f0c2252ebd85975361c026cb9f864a"
      integrity sha512-I88cFiGu9ryt/tfVEi4kX2SITsvDddTajXTOFmt2uK1ZVA8LytjtdeyefdQWEf5PU8w+4SSJDoYnggflB5tW4A==
      dependencies:
        follow-redirects "^1.15.0"
        form-data "^4.0.0"
        proxy-from-env "^1.1.0"
    ```

-   `follow-redirects` 를 검색해보자

    -   모듈이름과 version이 동일하지 않는다.
    -   `^` (캐럿 / **Caret**)일 경우, 의존성 모듈에서 다르게
    -   모듈을 개발할때는, 해당 버전이 최신이었지만, 계속해서 버전이 올라가고 있다.
    -   **패키지 설치시, 심볼을 확인하여 가장 최신 버전을 다운받는다.**

    ```jsx
    follow-redirects@^1.0.0, follow-redirects@^1.15.0:
      version "1.15.2"
      resolved "https://registry.npmjs.org/follow-redirects/-/follow-redirects-1.15.2.tgz"
      integrity sha512-VQLG33o04KaQ8uYi2tVNbdrWp1QWxNNea+nmIB4EVM28v0hmP17z7aG1+wAkNzVq4KeXTq3221ye5qTJP91JwA==
    ```

### 3. `follow-redirects` 모듈은 왜 두개가 나오고 잇지??

-   해당 모듈을 사용하는 곳이 두곳이라는것!!
-   해당 모듈에 의존성 있는 것, 버전을 따라간다.

    -   순서는 버전닝 순서를 따른다
    -   같은 범위에 있는 버전은 한 모듈만 바로보게 한다.

    ```jsx
    1. http-proxy@^1.18.1:
      version "1.18.1"
      resolved "https://registry.npmjs.org/http-proxy/-/http-proxy-1.18.1.tgz"
      integrity sha512-7mz/721AbnJwIVbnaSv1Cz3Am0ZLT/UBwkC92VlxhXv/k/BBQfM2fXElQNC27BVGr0uwUpplYPQM9LnaBMR5NQ==
      dependencies:
        eventemitter3 "^4.0.0"
        follow-redirects "^1.0.0"

    2. axios@^1.2.1:
      version "1.2.1"
      resolved "https://registry.yarnpkg.com/axios/-/axios-1.2.1.tgz#44cf04a3c9f0c2252ebd85975361c026cb9f864a"
      integrity sha512-I88cFiGu9ryt/tfVEi4kX2SITsvDddTajXTOFmt2uK1ZVA8LytjtdeyefdQWEf5PU8w+4SSJDoYnggflB5tW4A==
      dependencies:
        follow-redirects "^1.15.0"
    ```

### 4. 만약 특정 버전을 설치하고 싶을 경우, `@`

-   `@` 심볼을 이용하여, 특정 버전을 설치하고 싶은 경우

    ```jsx
    yarn add axios@1.2.0
    ```

-   package.json과 yarn.lock은 특정 버전을 가르키고 있지 않는다.

    ```jsx
    "axios": "^1.2.0",

    axios@^1.2.0:
      version "1.2.0"
      resolved "https://registry.yarnpkg.com/axios/-/axios-1.2.0.tgz#1cb65bd75162c70e9f8d118a905126c4a201d383"
      integrity sha512-zT7wZyNYu3N5Bu0wuZ6QccIf93Qk1eV8LOewxgjOZFd2DenOs98cJ7+Y6703d0wkaXGY6/nZd4EweJaHz9uzQw==
      dependencies:
        follow-redirects "^1.15.0"
        form-data "^4.0.0"
        proxy-from-env "^1.1.0"
    ```

-   특정버전만 사용하고 싶다면!!! package.json을 변경하고 모듈을 다시 설치하자

    ```jsx
    "axios": "1.2.0",

    axios@1.2.0:
      version "1.2.0"
      resolved "https://registry.yarnpkg.com/axios/-/axios-1.2.0.tgz#1cb65bd75162c70e9f8d118a905126c4a201d383"
      integrity sha512-zT7wZyNYu3N5Bu0wuZ6QccIf93Qk1eV8LOewxgjOZFd2DenOs98cJ7+Y6703d0wkaXGY6/nZd4EweJaHz9uzQw==
      dependencies:
        follow-redirects "^1.15.0"
        form-data "^4.0.0"
        proxy-from-env "^1.1.0"

    ```

## 참고

-   [https://semver.org/](https://semver.org/)
-   [https://www.rfc-editor.org/rfc/rfc2119](https://www.rfc-editor.org/rfc/rfc2119)
-   [https://docs.npmjs.com/cli/v8/configuring-npm/package-json#dependencies](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#dependencies)
-   [https://stackoverflow.com/questions/22343224/whats-the-difference-between-tilde-and-caret-in-package-json](https://stackoverflow.com/questions/22343224/whats-the-difference-between-tilde-and-caret-in-package-json)
-   [https://jeonghwan-kim.github.io/series/2019/12/09/frontend-dev-env-npm.html](https://jeonghwan-kim.github.io/series/2019/12/09/frontend-dev-env-npm.html)
