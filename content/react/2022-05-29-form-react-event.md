---
title: 'Form이벤트 및 React의 이벤트 시스템'
description: 'Form requestSubmit메서드와 React 이벤트 시스템에 대해서'
draft: false
template: 'post'
category: 'react'
tags:
    - react
date: 2022-05-29
---

## 0. 글을 작성하는 이유

-   채팅 입력창을 구현하다 `requestSubmit` 을 알게되어서 정리
-   react는 `stopImmediatePropagation`이 없다?

## \***\*TL;DR\*\***

-   **Form.requestSubmit**으로 submit **handler**를 호출
-   React에서 `stopImmediatePropagation` 를 쓰고 싶다면
    -   `e.nativeEvent.stopImmediatePropagation()`
-   React 이벤트 시스템은 **EventPlugin, EventPluginHub**으로 구성
    -   Native Event처럼 동작되는것 같지만, 아니다
    -   이벤트에 대한 콜백들의 결과(배열)로 받아와 실행

## 1. 문제의 상황

-   채팅 입력창을 구현 중 `Enter` 를 누르면 handleSubmit tigger 구현중..
-   문제 : 당연히 `Enter` 키를 누르면… handleSubmit 함수를 tirgger 할줄 알았지만, 새로고침..

    -   form태그의 submit 함수가 내가 알고 있던 기능대로 동작하지 않는다

        ```tsx
        const formRef = useRef<HTMLFormElement>(null)

        const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            console.log('submit')
        }

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.code === 'Enter') {
                formRef.current!.submit()
            }
        }

        return (
            <form ref={formRef} onSubmit={handleSubmit}>
                <input onKeyDown={handleKeyDown} />
            </form>
        )
        ```

## 2. **HTMLFormElement.requestSubmit()**

> MDN에서 친절하게 설명해주고 있었다…

### 1. **HTMLFormElement.submit()**

-   sumit 메소드는 submit 이벤트를 발생하지 않는다(즉 onSubmit함수를 trigger 하지 않음)
-   **Constraint validation**가 작동하지 않는다. (type=”URL | email”, pattern, min)

    ```tsx
    <input type="email" onKeyDown={handleKeyDown} />
    // email 형식을 체크하는 validation이 작동하지 않는다.
    ```

### 2. **HTMLFormElement.requestSubmit()**

-   submit이벤트를 발생한다!

    ```tsx
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') {
            formRef.current!.requestSubmit()
        }
    }
    ```

## 3. React는 NativeEvent가 아니라 SyntheticEvent ??

### 1.리엑트의 SyntheticEvent란?

-   리엑트는 모든 브라우저에서 동일한 이벤트를 구현하기 위해 \***\*SyntheticEvent 객체를 이용해서 NativeEvent를 감싸는 방식으로 한다.\*\***
-   nativeEvent를 사용하고 싶다면? `e.nativeEvent.stopImmediatePropagation()`

    ```tsx
    interface BaseSyntheticEvent<E = object, C = any, T = any> {
        nativeEvent: E
        currentTarget: C
        target: T
        bubbles: boolean
        cancelable: boolean
        defaultPrevented: boolean
        eventPhase: number
        isTrusted: boolean
        preventDefault(): void
        isDefaultPrevented(): boolean
        stopPropagation(): void
        isPropagationStopped(): boolean
        persist(): void
        timeStamp: number
        type: string
    }
    ```

### 2. 리엑트의 이벤트 전파 방

-   리엑트 17부터 RootElement에서 모든 이벤트를 감지한다(18은 root별로 지원..?)

![react-17](https://reactjs.org/static/bb4b10114882a50090b8ff61b3c4d0fd/1e088/react_17_delegation.png)

## 4. 리엑트의 이벤트 시스템은 EventPlugin, EventPluginHub

### 1. EventPlugin

-   컴포넌트에 등록된 이벤트와 이벤트 콜백

    ```tsx
    <button onClick={handleClick}/>

    //types
    onClick?: MouseEventHandler<T> | undefined;
    type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
    type EventHandler<E extends SyntheticEvent<any>> = { bivarianceHack(event: E): void }["bivarianceHack"];
    ```

### 2. EventPluginHub

-   앱/웹이 실행될때, 컴포넌트에 등록된 EventPlugine들이 주입되며 이벤트 대기열을 관리(수집, 저장, 삭제)
-   이벤트가 수신되면, 노드를 순회하면서 (버블링, 캡처링)
-   각 플러그인에 대해 SyntheticEvent를 수집하여 대기열에 저장하고 실행후 삭제한다.

    ![react-event](../../assets/react-event/react-event.png)

### 3. `stopPropagation`

-   이벤트의 전파를 막는게 아니다. SyntheticEvent Array를 비워주는것 뿐이다.

## 참고

-   [https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit)
-   [https://levelup.gitconnected.com/how-exactly-does-react-handles-events-71e8b5e359f2](https://levelup.gitconnected.com/how-exactly-does-react-handles-events-71e8b5e359f2)
-   [https://blog.mathpresso.com/react-deep-dive-react-event-system-1-759523d90341](https://blog.mathpresso.com/react-deep-dive-react-event-system-1-759523d90341)
