---
title:  "build 후 tag 속성이 동적으로 반영되지 않는 문제"
description: "A 태그의 속성이 동적으로 변경되는 않는 문제 - hydration"
draft: false
template: "post"
category : "react"
tags:
  - react
date: 2022-04-24
---

### TL;DR

- hyration 이슈로  `a 태그`의 href 속성 동적으로 반영되지 않는다.
  - gatsby는 hydration error가 미노출
  - Nextjs같은 경우 hydration error가 개발환경에서 노출되기 때문, 사전방지
- onClick 이벤트를 활용하여 `location.href` 강제로 시켜준다
  - 단점, href 고유의 속성 (새창열기 `command + click` 못함)

### 문제의 조건

- 페이지별로 `migration` 하고 있어 기존 페이지를 이용해야 한다.
  - Repo가 달라.. Link태그를 사용하지 못함..
- `<a>` 태그를 활용하여 redirect를 시켜줘야하는 상황

### 문제의 컴포넌트(by Gatsby..)

- 개발환경에서는 문제없이 작동이 된다.

```tsx
// .env
// LANG=KO

// index.js
const { LANG } = process.env;

const getPath = () => {
    if (LANG === 'KO') return 'ko';
    if (LANG === 'EN') return 'en';
    return ''

}

const IndexPage = () => {
    const handleClick = () => {
        console.log(getPath(), LANG)
    }

    return (
          <p>
              <a href={getPath()}>Go to "LANG" {getPath()}</a>
              <button onClick={handleClick}>lang</button>
          </p>
    )
}

// output
<p>
	<a href="/ko">Go to "LANG" ko</a>
	<button>lang</button>
</p>
```

### Build 하고 Deploy 하면??

- 이상하다??? 왜 개발환경에서는 됬는데 빌드하고 나서는 없어졋지?

```tsx
// 빌드된 결과물...
<p>
	<a href>Go to "LANG" ko</a>
	<button>lang</button>
</p>
```

### 왜 개발환경에서 확인하지 못했을까?(html을 확인해보자)

- 개발환경
  - SSR이지만, 개발환경에서는 JS를 로딩해서 실행한다.(Markup x)
- 빌드 후 배포
  - SSR이기 때문에, 기본적인 MarkUp 생성(index.html 생성 / 상태값 없을때)
  - SSR의 결과물인 HTML + JS ⇒ `hydration` 발생

```tsx
// devlop
<div id="___gatsby"></div>

// deploy
<p>
    <a href="">Go to &quot;LANG &quot;</a>
    <button>lang</button>
</p>
```

### Hydration으로 생긴 문제

- [Hydraion](https://jooonho.com/react/2022-02-20-hydration/)의 역할은 HTML ↔  ReactDom을 비교하여 Event를 달아준다!!
- React Dom과 **attribute(href, style, dataset)**가 달라도 변경되지 않는다.
- 이러한 문제로 인해 href가 변경되도 반영이 안되는 이슈 발생

### 문제 해결 방법

- onClick Method를 활용하여 함수를 호출하여 redirect 시켜준다!!
- 단점! href 고유의 속성인 `새창열기` 는 되지 않는다.
