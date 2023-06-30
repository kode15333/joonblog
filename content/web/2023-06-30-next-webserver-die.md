---
title: 'Next WebServer가 죽는 이슈'
description: 'Next 13.4.x 버전에서 WebServer가 죽는 이슈(socket hang up, ETIMEDOUT)'
draft: false
template: 'post'
category: 'web'
tags:
    - Next
date: 2023-06-30
---

## 0. 작성하게 된이유

- Next 13.4.x 버전에서 WebServer가 죽는 이슈가 있었다.
- 해결하는 과정을 정리하기전에 누군가 도움이 되었으면 좋겠다는 생각에 작성하게 되었다.


## 1. 문제 발생
- Nextjs Package Update (13.4.x 버전)
- Feature 배포 후, 5 ~ 12시간 시간 경과 후, 갑자기 WebServer가 느려지면서 죽는 현상이 발생했다.
- 쿠버네티스가 재시작을 하지 못한다?([링크](https://github.com/vercel/next.js/issues/45508#issuecomment-1580598124))

## 2. 해결방법
```js
// next.config.js
{
...
  experimental: {
    appDir: false 
    // this also controls running workers https://github.com/vercel/next.js/issues/45508#issuecomment-1597087133, which is causing
    // memory issues in 13.4.4 so until that's fixed, we don't want this.
  },
}
```

## 3. 로그
### 1. 에러 로그
```shell
Error: connect ETIMEDOUT 127.0.0.1:57665
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1494:16) {
  errno: -60,
  code: 'ETIMEDOUT',
  syscall: 'connect',
  address: '127.0.0.1',
  port: 57665
}
```

### 2. 에러 로그
```shell
Uncaught Exception 	
{
  errorType: 'Error',
  errorMessage: 'socket hang up',
  code: 'ECONNRESET',
  stack: [
    'Error: socket hang up',
    '    at connResetException (node:internal/errors:717:14)',
    '    at TLSSocket.socketOnEnd (node:_http_client:526:23)',
    '    at TLSSocket.emit (node:events:525:35)',
    '    at TLSSocket.emit (node:domain:489:12)',
    '    at endReadableNT (node:internal/streams/readable:1359:12)',
    '    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)',
  ],
}
 Unknown application error occurred Runtime.Unknown
```

### 문제 원인(추정)
- CPU / Memory 사용량이 급격히 증가하다가, WebServer가 죽는 현상이 발생했다.
- 주요한 원인은 과도하게 `processChild.js` 프로세스가 생성되기 때문이다. 
  - 부모 프로세스와 processChild.js 프로세스 사이에 TCP 연결이 설정
  - 부모 프로세스가 내부에 대기 중인 요청을 processChild.js 프로세스로 재전송/재시도










## 참고
- https://github.com/vercel/next.js/issues/45508#issuecomment-1580598124
- https://github.com/vercel/next.js/issues/45508
- https://github.com/vercel/next.js/issues/51560
