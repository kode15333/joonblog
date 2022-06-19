---
title:  "TLS/SSL HandShake"
description: "HTTPS Flow, TLS/SSL HandShake"
draft: false
template: "post"
category : "cs"
tags:
  - network
date: 2022-06-19
---

## 작성하는 이유
 - 브라우저는 인증서를 언제 체크를 할까?
 - TLS HandShake 정리

## TL;DR
- **HTTPS**
  - 보안이 강화된 HTTP
  - TLS는 SSL의 발전 형태(동의어로 사용된다)
- **TLS Handshake**
  - HTTPS 암호화 통신을 하기 위해(TCP 이후에 작동) 검증하는 과정
  - Flow **(Packet 메시지)**
    - Clinet Hello : 가능한 알고리즘 전달
    - Server Hello : 알고리즘 선택
    - Server Hello Done: 인증서 전달 및 인증서 확인
    - Client Key Exchange : 대칭키 전달
    - Change Cipher  Spec : 대칭키 변경


## 1. HTTPS란?

- 보안이 강화된 HTTP(**HTTP over TLS, HTTP over SSL**)
- HTTPS 암호화 통신을 하기 위해  **TLS Handshake**로 협상을 한다.
- HTTPS는 소켓통신에서 **텍스트**를 이용하는 대신, TLS 프로토콜을 통해 세션 데이터를 암호화

  ![tcp-layer](/assets/tls/layer.png)
  


### 1-1. IP / TCP란

1. **IP(Internet Protocal) - Network / Internet Layer**
   - 관심사: 목적지까지 정보 패킷을 보내는 것
2. **TCP(Transmission Control Protocol) - Transport Layer**
   - 관심사: 패킷의 순서 및 누락여부
   - TCP 연결과정(TCP 제어 플래그는 여러개가 있다… [참고](https://ko.wikipedia.org/wiki/%EC%A0%84%EC%86%A1_%EC%A0%9C%EC%96%B4_%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C))
     ![tcp-flow](/assets/tls/tcp-flow.png)

       - 클라이언트가 “**SYN”** 최초요청 패킷을 대상 서버로 호출
       - 대상서버는 이 연결을 동의하기  위해 **“SYC/ACK”** 패킷을 보낸다
       - 클라이언트는 **“ACK”** 패킷을 보내고 서버와 연결
       - 도착한 패킷들의 정리(순서, 누락데이터 여부 및 끝까지 왔는지)를 TCP가 관리
         ![tcp](/assets/tls/tcp.png)
3. **예시) TCP/IP를 이용해서 이메일을 보내면?**
   - 편재를 잘개 쪼개서 조각들을 해당 목적지로 보낸다 - (IP)
   - 도착한 조각들을 순서대로 맞추고, 누락여부를 확인하여 재 요청 - (TCP)
   - 마지막 조각이 올때까지 발신자와 접속을 유지 - (TCP)

### 1-2. TLS/SSL

- **TLS란?**
  - 인터넷 상의 커뮤니케이션을 위한 개인정보와 데이터 보안을 용이하기 위해 설계된 **보안 프로토콜** 
  - 웹사이트를 로드하는 웹브라우저(응용프로그램)와 서버간의 커뮤니케이션을 암호화하는 것
  - 암호화 대상 : HTTP 데이터 및 이메일, 메시지, 보이스오버(Voip) 포함
- **TLS / SSL의 차이점** 
  - TLS는 SSL의 발전 형태 (TLS 1.0은 SSL 3.1으로 부터 개발)

## 2. 먼저, 서버는 TLS(SSL)인증서를 발급받아야 한다.

1. (서버) 서버는 Publick Key와 Private Key를 생성
2. (서버 → CA) 서버는 CA에게 인증서를 발급받기 위해 Publick Key와 서버 정보들 제공
3. (CA) CA는 서버로 부터 받은 정보를 가지고 TLS 인증서를 발급 및 암호화
   - **CA는 발급한 인증서를 CA Private Key를 가지고 암호화**
   - (CA → 서버) 암호화화 TLS 인증서를 서버에게 전달

     ![certificate](/assets/tls/certificate.png)


### 2-1 대칭 vs 비대칭 암호 알고리즘

1. **대칭키** : 암호화/복호화 할때 사용되는 키가 동일

![pair](/assets/tls/pair.png)

2. **비대칭키(공개키, 비밀키)**

![not-pair](/assets/tls/not-pair.png)

  - 정의: 암호화하는 키와 복호화하는 키가 다름
  - **공개키(Publick Key)**: 사람들에게 공개된 키
    - 공개키로 암호할 경우, Data의 보안을 중점
  - **개인키(Private Key):** 사용자만 알고 있는 키
    - 개인키로 암호할 경우, 인증과정의 중점(HTTPS 인증서)
    - 개인키로 암호화한 인증서를 공개키로 해독할 수 있으면, 메시지의 발신자의 보증

### 2-2 단방향/양방향 SSL

1. 단방향 / **Server Certificate Authentication**
  - 클라이언트만 서버를 확인한다.
  - 서버는 클라이언트가 누군지 중요하지 않는다.

![one-way](/assets/tls/one-way.png)

2. 양방향 / **Client Authentication (공인인증서랑 비슷…)**
  - 서버는 클라인트를 확인하고, 클라이언트는 서버를 확인한다.
  - FLOW
    - Client → Server 요청
    - Server → Clinet  **Server 인증서**를 보냄
    - Clinet가 서버 SSL 인증서를 확인합니다.
    - Clinet가 Server로 **Clinet 인증서**를 보냄
    - Server가 **Clinet 인증서**를 확인
    - Server가 **Clinet** 인증서의 사용자 이름을 참조하여 사용자 인증

![two-way](/assets/tls/two-way.png)


## 3. **TLS Handshake**

- 서버와 클라이언트가 주고받을 데이터 암호화 알고리즘 결정
- 서버와 클라이언트가 주고받을 데이터 암호화를 위한 대칭키를 얻는 과정

![handShake.png](/assets/tls/handShake.png)

### 1) Client → Server (Client Hello)

- 클라이언트에서 서버에게 연결을 시도
- 해당 패킷에는 세션ID, 프로토콜 버전, 사용가능한 [Cipher suite](https://en.wikipedia.org/wiki/Cipher_suite) 목록 등이 포함되어 있다.

![client-hello.png](/assets/tls/client-hello.png)


### 2) Server→ Client (Server Hello)

- Client Hello의 대한 응답
- Client에서 보내온 Cipher 목록 중에 하나를 선택하여 보내준다

![server-hello.png](/assets/tls/server-hello.png)


### 3) Server → Client (Certificate, Server Key Exchange, Server Hello Done)

- Certificate
  - Server가 자신의 SSL 인증서(**Server의 Publick 포함 Server Key Exchange**)를 Client를 전달
  - Client는 SSL 인증서를 **CA의 공개키**를 통해 복호화해서 성공하면 인증서를 검증

![server-hello-done-certificate.png](/assets/tls/server-hello-done-certificate.png)

- Server Key Exchange
  - SSL 인증서에 서버의 공개키가 없을 경우만 해당하며, 있다면 해당 프로토콜은 진행하지 않는다!

![server-hello-done-key-exchange.png](/assets/tls/server-hello-done-key-exchange.png)

### 4) Client → Server 대칭키 전달 (Client Key Exchange)

- Client와 Server와 데이터를 안전하게 전달하기 위해 **대칭키**를 생성한다.
- **Client는 생성한 대칭키를 SSL의 포함된 공개키로 암호화해서 서버에게 전달한다**

![client-key-exchange.png](/assets/tls/client-key-exchange.png)

### 5) Server → Client (Change Cipher Spec)

- Server에서 암호화된 대칭키를 받아 Client/Server 모두 동일한 대칭키를 갖게 됨
- 통신 준비가 완료되면, Change Cipher Spec을 보내고 SSL Handshake 완료의 의미
  ![change-cipher-spec.png](/assets/tls/change-cipher-spec.png)


## 참고

[https://www.cloudflare.com/ko-kr/learning/ssl/what-is-ssl/](https://www.cloudflare.com/ko-kr/learning/ssl/what-is-ssl/)

[https://www.cloudflare.com/ko-kr/learning/ssl/transport-layer-security-tls/](https://www.cloudflare.com/ko-kr/learning/ssl/transport-layer-security-tls/)

[https://docs.solace.com/Security/Two-Way-SSL-Authentication.htm](https://docs.solace.com/Security/Two-Way-SSL-Authentication.htm)

[https://sectigo.com/resource-library/public-key-vs-private-key](https://sectigo.com/resource-library/public-key-vs-private-key)

[https://ko.wikipedia.org/wiki/전송_제어_프로토콜](https://ko.wikipedia.org/wiki/%EC%A0%84%EC%86%A1_%EC%A0%9C%EC%96%B4_%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C)

[https://nuritech.tistory.com/25](https://nuritech.tistory.com/25)
