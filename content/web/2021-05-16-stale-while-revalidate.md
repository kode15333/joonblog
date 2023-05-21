---
title: 'stale-while-revalidate'
description: 'Cache-Control 확장기능 중 stale-while-revalidate에 대해서'
draft: false
template: 'post'
category: 'web'
tags:
    - http
date: 2021-05-16
---

### 0. 글을 작성하는 이유

-   코드스쿼드 강의를 통해 알게 되었는데 더 알고싶어서...
-   Cache에 대해서 더 자세히 알고 싶어서...
-   요즘 유행 라이브러리(react-query, swr)의 작동방식을 알아보기 위해서

### 1. HTTP 통신이란?

-   클라이언트(브라우저)에서 서버로 리소스를 요청/응답받는 것

### 2. 요청/응답하는 리소스가 매번 같다면? Cache를 이용하자

1. **Cache란?**
    - 주어진 리소스의 복사복을 저장하고 있다가 요청시에 복사복을 제공하는 기술
    - 브라우저에서 요청을 중간에 가로쳐 서버까지 안가고 캐시에서 해당 리소스를 응답
    - http 기본적으로 GET Method에 대해서 기본적으로 캐싱하면 다른 메서드는 무시
    - 캐시는 해시구조로 되어있으며, 해당 URI를 키 값으로 구성
2. **Cache의 장점**
    - 서버의 부하를 완화하며, latency와 네트워크 트랙픽을 줄여준다.
    - 캐시는 상대적으로 클라이언트와 가깝기 때문에 빠른 응답속도를 제공하여 고객에서 좋은 UX를 제공할 수 있다.
    - 캐시가 만료가 된다면, eviction algorithm을 통해 자동으로 삭제된다

### 3. Cache 종류

1. 사설 브라우저 캐쉬(Chorme)

    - 브라우저에 저장하며, **브라우저 사용자**만 사용한다.
    - 브라우저 캐시는 앞으로가기, 뒤로가기, 소스보기를 할때 사용된다.
    - 또한 오프라인시, 오프라인 브라우징을 개선시 사용되기도 한다.

2. 공유 프록시 캐시(CDN)

    - 한명 이상 재사용되는 캐시입니다
    - 예시) 한국에 게임을 오픈한다(그러면, 한국 CDN에 다운로드 파일을 위치시킨다)

![https://mdn.mozillademos.org/files/13777/HTTPCachtType.png](https://mdn.mozillademos.org/files/13777/HTTPCachtType.png)

### 4. HTTP Cache-Control

**HTTP-Head의 필드로써, 요청/응답 양쪽에 있으며, cache정책을 정의한다.**

1. Cache-Control : no-store
    - 캐시를 저장하지 않는다. 매번 새롭게 요청된다.
2. Cache-Control : no-cache
    - 캐시는 하지만, 캐시된 파일의 유효성을 확인하기 위해 서버로 요청을 보낸다.
3. Cache-Control : private
    - Proxy일 경우, Private일 경우 저장할 수 없다(사용자의 인증 및 인가) ⇒ https에서 동일
4. Cache-Control : public
    - 모든 응답을 캐시에 저장한다.
5. Cache-Control : max-age=300
    - 해당 캐시 파일에 대한 유효시간을 알려준다.
6. Cache-Control: must-revalidate
    - 캐시는 사용하기전에 해당 파일에 대해서 검증을 해야한다.
    - 리스폰스 캐시가 현재도 유효한지 아닌지의 여부를 서버에 조회를 요구한다.
    - 프록시가 오리진 서버에 도달할 수 없고, 리소스를 다시 요구 할 수없을때는 504를 반환한다.
7. age : 10
    - age는 해당시간(캐시 유효시간)에 비례해서 얼마나 지난지 알려준다.

![https://mdn.mozillademos.org/files/13771/HTTPStaleness.png](https://mdn.mozillademos.org/files/13771/HTTPStaleness.png)

### 5. Cache-Control 확장기능 : stale-while-revalidate

1. **Cache-Control: max-age=1, stale-while-revalidate=59**

    - HTTP 요청이 1초 내에 반복적으로 발생할 경우, 캐시된 값을 별도의 검증없이 그대로 반환한다.
    - HTTP 요청이 1 ~ 60 초 사이에 반복적으로 발생할 경우, 캐시된 값은 이미 낡았지만(out-of-date) 캐싱된 값을 반환한다. 이와 동시에 백그라운드에서 향후 사용을 위해 캐시를 새로운 값으로 채우도록 재검증 요청이 이루어진다.
    - 60초 이후에 들어온 HTTP 요청에 대해선 다시 서버에 요청을 보낸다.
      ![https://web-dev.imgix.net/image/admin/C8lg2FSEqhTKR6WmYky3.svg](https://web-dev.imgix.net/image/admin/C8lg2FSEqhTKR6WmYky3.svg)

2. **간단요약 : Cache-Control: max-age=600, stale-while-revalidate=600**

    - 해당 캐시는 600초의 유효기간을 가지지만, 추가적으로 600초의 시간을 가진다.
    - 총 20분의 캐시 유효시간을 가진다.
    - 유효기간 동안은 block이 되지 않는다 → 새로운 요청이 없다

3. 브라우저 지원 범위

    - Chrome 75 이상,FireFox 68 이상 등 사용하기전 참고해야한다!

4. React-Query / SWR은 **stale-while-revalidate**를 이용

    - 캐시를 이용하여 API요청을 줄인다

### **6. 관련출처**

-   [https://jbee.io/react/thinking-about-global-state/](https://jbee.io/react/thinking-about-global-state/)
-   [https://datatracker.ietf.org/doc/html/rfc5861#section-3](https://datatracker.ietf.org/doc/html/rfc5861#section-3)
-   [https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
