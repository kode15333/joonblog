---
title: "Event Loop"
description: "EventLoop 특징 및 MicroTaskQueue는 왜 우선순위 높죠?" 
draft: false 
template: "post"
category : "Event Loop"
tags:
- EventLoop
- browser
date: 2022-03-13
---
> 브라우저 내에는 여러가지의 Event Loop가 있으며, 각 Event Loop들 끼리 협력한다?

## TL;DR

- MicroTaskQueue는 우선순위가 높은게 아니다
    - Event Loop의  실행 순서가 정해져 있다.
- JS Event Loop는 동시성을 지원한다
    - NonBlocking 특징으로 동시에 여러가지의 task 처리

## 1. JS Event Loop란?

> JS Spec이 아니라 HTML Spec이다...
>

![eventloop.png](../../assets/eventLoop/eventloop.png)
- 자바스크립트의 런타임 모델은 Event Loop 기반이다
- 특징
     1. **싱글쓰레드이다 (One Thread = One call stack = One thing at a time)**
        - Render Process의 Main쓰레드가 JS Engine이다
        - 하나의 콜스택을 가지고 있다.
        - 한번에 하나의 일만 처리 할 수  있다.
     2. **Queue(Task, MicroTask)를 가지고 있다.**

         > 이름만.. Queue ... Set의 형태이다..
         >
           - TaskQueue와 MicroTaskQueue는 다르지만, 같은 방법으로 생성된다([참고](https://html.spec.whatwg.org/multipage/webappapis.html#queuing-tasks))
           - MicroTaskQueue는 performing a microtask checkpoint를 통해 실행된다.
     3. **perform a Microtask checkpoint**의 초기값을 False

           ```jsx
           while (microtaskQueue.waitForMessage()) {
               //P**erform a Microtask checkpoint = true;**
             microtaskQueue.processNextMessage()
           }
           ```

           1. **MicrotaskQueue가 있다면?**
           2. P**erform a Microtask checkpoint = true**
           3. 가장 오래되면서 실행가능한 Microtask를 실행
           4. MicrotaskQueue가 비워질때까지 반복
           5. Perform a Microtask checkpoint = false
- FLOW
    1. UI or Interaction
    2. Call Stack Running OrQueuing Message(Asyncronous Logic)
        - Timer(setTimout/setInterfal)의 경우, 해당 시간이 지나고 난 다음, Queueing 한다.
        - Promise, **MutationObserver** 경우, MicroTaskQueue로 진입한다.(async는 Promise의 ***syntactic sugar***)

            ```jsx
            const response = await fetch(…);
            const json = await response.json();
            const foo = JSON.parse(json)
            
            // syntactic sugar
            fetch(…)
              .then(response => response.json())
              .then(json => {
                const foo = JSON.parse(json);
              });
            ```

    3. Call Stack Empty ([currently running task](https://html.spec.whatwg.org/multipage/webappapis.html#currently-running-task) === null)
    4. [Perform a microtask checkpoint](https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint) 실행
        - P**erform a Microtask checkpoint = true면, MicroTaskQueue 실행**
    5. TaskQueue 실행
        - Task 실행 후, 3번 ~ 5번 반복
    6. **Update the rendering**


## 2. Event Loop는 동시성이다??

> JavaScript는 단일 스레드이므로 동시성이 아니다..???
>
1. 동시성(Cuccent) vs 병렬성(Paraller)
    - 동시성 : 여러개의 쓰레드를 번갈아 가면서 실행하는것
    - 병렬성 : 여러개의  쓰레드를 각 자 실행하는 것

![sequece.png](../../assets/eventLoop/sequece.png)

2. JS engine의 특징
    - “Run to Completion”:
        - 실행한 함수가 다른 작업에 의해 선점될 일 없고, 다른 모든 코드의 실행이 우선이며, 중단될 일 없다.
        - 이러한 특징은 하나의 함수가 너무 크면,  UI가 멈추는 일이 있다.
    - “Non Blocking”
        - **Event 및 CallBack을 이용하여** Blocking 되지않고, 작업을 처리할수 있기 때문!
    - 이러한 특징으로 인해 **Concurrency(동시성)을 지원한다.**

        ```jsx
        console.log('before');
        setTimeout(()=> {
            console.log('Inside SetTimeout');
        },3000)
        console.log('after');
        ```


## 3. 용어 설명

![jsEventLoop.png](../../assets/eventLoop/jsEventLoop.png)

### 1. Stack === Call Stack

- **콜 스택**이란 컴퓨터 프로그램에서 현재 실행 중인 서브루틴에 관한 정보를 저장하는 스택 자료구조이다.
- 사용목적
    - 현재 실행중인 서브루틴의 실행이 끝났을때, 제어를 반환할 지점을 보관하기 위해
    - 서브 루틴별 컨텐스트를 가지고 있으며, 해당 컨텐스트 안에는 실행, 제어, 런타임 스택이 있다.

### 2. Heap

- 런타임 환경에서 사용되는 변수(reference)의 영역
- 사용자가 관리하는 영역이라, 자유럽게 메모리를 할당/해제 할 수 있으나, 이러한 자유도로 인해 메모리 누수가 생길 영향이 놓다.

### 3. Queue(Task Queue)

- 메서지의 대기열..?
- 기본적으로 비동기적인 작업을 Task라 부르며, 이러한 Task의 집합을 Task Queue다

    ```jsx
    setTimeout('메세지', 500)
    Promise.resolve().then('메세지')
    ```


### 4. 동기 vs 비동기 / Block vs Non-Block

- 동기 vs 비동기 : 함수의 **실행결과가** 바로 오는냐?(Sync) 안오냐?(Async)
- Block vs Non-Block : 제어권을 뺏기냐?(Block) 안 빼기냐?(NonBlock)

## 4. 참고

[https://html.spec.whatwg.org/multipage/webappapis.html#event-loops](https://html.spec.whatwg.org/multipage/webappapis.html#event-loops)

[https://ko.wikipedia.org/wiki/콜_스택](https://ko.wikipedia.org/wiki/%EC%BD%9C_%EC%8A%A4%ED%83%9D)

[https://innolitics.com/articles/javascript-decorators-for-promise-returning-functions/](https://innolitics.com/articles/javascript-decorators-for-promise-returning-functions/)

[https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)
