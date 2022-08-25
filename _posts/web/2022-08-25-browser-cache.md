---
title: "브라우저 로컬 캐시(memory, disk, prefetch)"
description: "memory/disk/prefetch Cache란?" 
draft: false 
template: "post"
category : "browser"
tags:
- browser
date: 2022-08-25
---
## 0. 작성하는 이유

- 빠른 서비스를 제공하기 위해 Cache를 잘 이용하자
- `memory cache` `disk cache` `prefetch cache` 차이점은 무엇일까?

## TL;DR
- **memory cache** : 현재 메모리(현재 페이지) 데이터
- **disk cache** : 저장된 데이터(방문한 페이지) 데이터
- **prefetch cache** : 서브 페이지 데이터를 캐싱 처리


## 1. 컴퓨터가 더 빠르게 계산하려면 → 화면을 더 빠르게 그릴려면?

> 빨리 가져올려면 어떻게 해야할까?  가까워야 한다.
>
- 브라우저(프로세스)의 실행주체 CPU → 브라우저가 빠르게 작동할려면?
- 연산을 빨리 할려면 CPU와 가까운 곳에서 데이터(HTML, CSS, JS)를 가지고 와야한다.
- **HTTP Cache 정책(**[Cache에 대한 설명](https://jooonho.com/web/2021-05-16-stale-while-revalidate))에 따라 브라우저는 요청한 자원을 저장(캐싱)
- 네트워크를 통해 요청된 자원보다 **캐싱된 자원을 사용하면** 시간을 줄일 수 있다

![storage](/assets/browser-cache/storage.png)

## 2. 브라우저의 Cache

![network-tab](/assets/browser-cache/network-tab.png)

### memory cache(from ram) (AKA **Blink Cache)**

- 새로고침하면 **현재 실행되고 있는 페이지 데이터(Memory에 저장된 값)**을 사용한다.
- `Non Persistent`이기 때문에, 페이지가 변경이 되거나 창이 닫히면 데이터가 사라진다.

### disk cache(from HDD or SSD)

> `~/Library/Caches/Google/Chrome/Default/Cache/Cache_Dat` 캐시 위치다…
>
- 브라우저 창을 닫고 방문했던 페이지로 들어가면 저장되있는(disk에 있는 Cache) 페이지 데이터를 사용한다
- `Persistent` (단, 캐시가 만료가 된다면, eviction algorithm을 통해 자동으로 삭제)

### prefetch cache

```jsx
<link rel="prefetch" href="/style.css" as="style" />
```

- 현재 페이지에서는 사용되지 않지만, 서브페이지를 필요한 리소스를 다운받아 Cache한다.
- 우선순위가 낮아 현재 페이지 리소스를 방해하지 않고, 리소스가 다운로드 한 후 실행되지 않는다.

## 3. Link 태그의 rel 속성에 대해 알아보자

> 해야될 작업? 할 것같은 작업?을 미리하자
>
- 웹성능을 향상시키는 방법에는 여러가지 있지만 가장 간단하게 적용할 수 있는 방법이다.

    ```jsx
    <link rel="prefetch" href="/style.css" as="style" />
    <link rel="preload" href="/style.css" as="style" />
    <link rel="preconnect" href="https://example.com" />
    <link rel="dns-prefetch" href="https://example.com" />
    <link rel="prerender" href="https://example.com/about.html" />
    <link rel="modulepreload" href="/script.js" />
    ```

  ### 1. preload

    ```jsx
    <link rel="preload" href="comic-sans.woff2" as="font" />
    ```

  - 가능한 한 빨리 리소스를 다운로드하고 캐시하도록 브라우저에 지시
  - 브라우저는 리소스를 다운로드한 후 리소스에 대해 아무 작업도 수행 X
  - 스크립트가 실행되지 않고 스타일시트가 적용되지 않는다.
  - 기본 플로우 : `index.html → index.css → comic-sans.woff2`

      ```jsx
      <!-- index.html -->
      <link rel="stylesheet" href="index.css" />
      
      /* index.css */
      @font-face {
          src: url('comic-sans.woff2') format('woff2'); // 다운로드 하지않고 캐싱 데이터 사용
      }
      ```


    ### 2. prefetch
    
    ```jsx
    <link rel="prefetch" href="/style.css" as="style" />
    ```
    
    - 백그라운드에서 리소스를 다운로드하고 캐시하도록 브라우저에 요청
    - 다운로드는 낮은 우선 순위로 발생하므로 더 중요한 리소스를 방해 X
    - 후속 페이지에서 해당 리소스가 필요하고 미리 캐시하려는 경우에 유용(이커머스 - 서브페이지)
    
    ### 3. preconnect
    
    ```jsx
    <link rel="preconnect" href="https://api.my-app.com" />
    ```
    
    - 브라우저에 사전에 도메인에 대한 연결을 수행하도록 요청
    - 단, 연결을 열고 유지하는 데 비용이 많이 드는 작업(4-6개 이상의 도메인 추천)
    - 기본플로우: `DNS → TCP handshake → TLS handshake` (이 단계를 미리 하자…)
    
    ### 4. DNS-prefetch
    
    ```jsx
    <link rel="dns-prefetch" href="https://api.my-app.com" />
    ```
    
    - 사전에 도메인의 DNS 확인을 수행하도록 브라우저에 요청
    
    ### 5. prerender
    
    ```jsx
    <link rel="prerender" href="https://my-app.com/pricing" />
    ```
    
    - 브라우저에 URL을 로드하고 보이지 않는 탭에서 렌더링하도록 요청
    - 사용자가 다음에 특정 페이지를 방문할 것이 확실하고 더 빠르게 렌더링하려는 경우에 유용
    
    ### 6. modulepreload
    
    ```jsx
    <link rel="modulepreload" href="/static/Header.js" />
    <link rel="modulepreload" href="/static/Logo.js" />
    <link rel="modulepreload" href="/static/Image.js" />
    
    <link rel="modulepreload" href="/static/Header.js" as="serviceworker"
    ```
    
    - 가능한 한 빨리 JS 모듈 스크립트를 다운로드, 캐시 및 컴파일하도록 브라우저에 지시
    - 기본 플로우 : main.js → header.js → logo.js …
    
    ```jsx
    // /static/main.js
    import Header from '/static/Header.js';
    ...
    
    // /static/Header.js
    import Logo from '/static/Logo.js';
    import Link from '/static/Link.js';
    ...
    
    // /static/Logo.js
    import Img from '/static/Img.js';
    ...
    ```


## 4. 참고

- [https://www.chromium.org/developers/design-documents/network-stack/http-cache/](https://www.chromium.org/developers/design-documents/network-stack/http-cache/)
- [https://www.chromium.org/developers/design-documents/network-stack/disk-cache/](https://www.chromium.org/developers/design-documents/network-stack/disk-cache/)
- [https://3perf.com/blog/link-rels/](https://3perf.com/blog/link-rels/)
