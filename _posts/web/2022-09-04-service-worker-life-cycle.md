---
title: "Service Worker?"
description: "Service Worker, Service Worker liceCycle" 
draft: false 
template: "post"
category : "browser"
tags:
- browser
date: 2022-09-04
---
## 0. 작성이유

- 브라우저 캐시… 2탄?
- 회사에서 Service Worker를 통해 리소스를 캐싱했는데... 정리 
- Service Worker 라이프사이클은 무엇이며, 어떻게 업데이트 될까?

## **TL;DR**

- **Service Worker란?**
  - 네트워크 요청을 가로채 수정하거나 캐싱할 수 있는 API
- **Service Worker의 LifeCycle**
  - Install : Service Worker 처음 실행시
  - (Waiting : 업데이트시만 발생) : Service Worker가 교체되기전 대기
  - Actice : Service Worker가 실행되어 Client를 제어할때

## 1. 서비스 워커란?

![middle-ware.png](/assets/service-worker/middle-ware.png)

- 웹 응용 프로그램(브라우저) ↔  네트워크 사이의 프록시 서버의 일종
- 주요한 기능
  - 네트워크 요청을 가로채서 수정하거나 리소스를 캐싱할수 있다!
  - 오프라인시, 캐싱된 자원 전송(서비스 워커에서 미리 캐싱한 자원)하여 UX 향상
  - **Push API**… **Background Fetch API**.. 다양한 작업을 할 수 있다..
- Worker / Web Workers / Shared Worker랑은 다르다!!
  - Worker는 Main Thread의 짐을 덜어준다고 생각하면 된다

## 2. 서비스 워커 용어

> Service Worker에 의해 제어되는 페이지(네트워크 요청을 가로 챌 수 있는 페이지)
>

### Scope

- Service Worker 등록되면 Control 할 수 있는 범위

    ```jsx
    Service Worker 호출 html 및 js path
    html: jooonho.com/foo/index.html
    swjs: jooonho.com/foo/sw.js
    
    서버스 워커 작동 범위
    1. jooonho.com (X)
    2. jooonho.com/foo (O)
    3. jooonho.com/foo/bar(O)
    ```


### Client

- Service Worker가 제어하는 페이지 === Client(like Window)
- 서비스 워커에서 Cient에 접근하는 방법은 [WindowClient](https://developer.mozilla.org/en-US/docs/Web/API/WindowClient)
  - 해당 서비스워커가 작동하면 **index.html → foo.html**로 redirect된다!! ([example](https://googlechrome.github.io/samples/service-worker/windowclient-navigate/))

    ```jsx
    self.addEventListener('activate', event => {
      event.waitUntil(self.clients.claim().then(() => {
        return self.clients.matchAll({type: 'window'});
      }).then(clients => {
        return clients.map(client => {
          // Check to make sure WindowClient.navigate() is supported.
          if ('navigate' in client) {
            return client.navigate('foo.html');
          }
        });
      }));
    });
    ```


## 3. Life Cycle

![lifecycle-1.png](/assets/service-worker/lifecycle-1.png)
![lifecycle-2.png](/assets/service-worker/lifecycle-2.png)

### 서비스 워커를 등록할때

**register**
- register 함수를 호출하면, 해당 파일을 서비스워커를 실행(다운로드 → 파싱 → 실행)
- register 함수를 호출하는 시기는 해당 Client의 페이지가 완전히 로드될때 실행해야한다

    ```jsx
    window.addEventListener('load', () => {
        // Is service worker available?
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js').then(() => {
            console.log('Service worker registered!');
          }).catch((error) => {
            console.warn('Error registering service worker:');
            console.warn(error);
          });
        }
      });
    ```

- **bandwidth contention** 방지하기 위해 … 같은 자원을 서로 요청할려고 할때..

![badwidth.png](/assets/service-worker/badwidth.png)

### 처음 Service Woker가 작동할때

**Install**
  - register된 Service Woker가 execute 될때
  - 클라이언트를 제어하기 전 리소스 미리 캐싱할 수 있다!

      ```jsx
      self.addEventListener('install', (event) => {
        const cacheKey = 'MyFancyCacheName_v1';
      
        event.waitUntil(caches.open(cacheKey).then((cache) => {
          // Add all the assets in the array to the 'MyFancyCacheName_v1'
          // `Cache` instance for later use.
          return cache.addAll([
            '/css/global.bc7b80b7.css',
            '/css/home.fe5d0b23.css',
            '/js/home.d3cc4ba4.js',
            '/js/jquery.43ca4933.js'
          ]);
        }));
      });
      ```

**Activate**
  - Service Worker가 정상적으로 등록이 되었다면 activate 이벤트가 발생 (아직.. 작동되는게 아니다)
  - 해당 페이지로 다시 접근한다면(리로드) 등록된 Service Worker가 작동할것!
  - 우리는 등록이 되면 바로 사용하고 싶으니까!! `clients.claim()` 호출
    - 이렇게 바로 실행하게 된다면, 네트워크를 통해 로드하는것과 다를 수 있기때문에..
    - 첫페이지에는 네트워크를 통해서 캐싱… 재방문시, 서비스워커를 통해 빠르게!!!!

      ```jsx
      self.addEventListener('activate', (event) => {
        event.waitUntil(clients.claim());
      });
      ```


### Service Worker가 업데이트 될때, 변경될때

- **업데이트 조건 (1번 제외하고 자동)**
    - 등록할때 update하라고 알려준다!! (수동)

        ```jsx
        navigator.serviceWorker.ready.then((registration) => {
          registration.update();
        });
        ```

    - 해당 페이지로 들어올때(기존 ServiceWorker와 `byte-different`를 통해 업데이트 처리)
    - `push` `sync` 같은 이벤트가 24시간 동안 동작안했을 경우…
    - ServiceWorker 파일명이 변경되었다면…? (동기화 x  기존 ServiceWorker 처리)
1. **Install : 초기 Service Worker 등록과 동일**
2. **Waiting**
    - Install이 완료되고, 기존 Service Worker가 종료될때까지(더이상 Client Control 하지 않을때)
    - 크롬 업데이트도 동일하다…. 탭을 다 닫을때까지… 기존버전을 유지 ㅠㅠ
3. **Activate :  초기 Service Worker 등록과 동일**
    - 기존 서비스 워커를 통해 캐싱된 리소스를 삭제해주자!

        ```jsx
        self.addEventListener('activate', (event) => {
          // Specify allowed cache keys
          const cacheAllowList = ['MyFancyCacheName_v2'];
        
          // Get all the currently active `Cache` instances.
          event.waitUntil(caches.keys().then((keys) => {
            // Delete all caches that aren't in the allow list:
            return Promise.all(keys.map((key) => {
              if (!cacheAllowList.includes(key)) {
                return caches.delete(key);
              }
            }));
          }));
        });
        ```

    - 우리가 원하는거는 업데이트 됬으면  Service Worker가 업데이트 되야한다!
    - install 이벤트에서 처리해주면, Waiting 없이 Service Worker가 교체된다.

        ```jsx
        self.addEventListener('install', event => {
          self.skipWaiting();
        });
        ```


## 참고

- [https://web.dev/learn/pwa/service-workers/](https://web.dev/learn/pwa/service-workers/)
- [https://developer.chrome.com/docs/workbox/service-worker-lifecycle/](https://developer.chrome.com/docs/workbox/service-worker-lifecycle/)
- [https://web.dev/service-worker-lifecycle/#devtools](https://web.dev/service-worker-lifecycle/#devtools)
- [https://developer.chrome.com/docs/workbox/caching-strategies-overview/](https://developer.chrome.com/docs/workbox/caching-strategies-overview/)
