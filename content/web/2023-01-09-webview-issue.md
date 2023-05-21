---
title: '채팅 서비스 Webview 이슈'
description: 'visualViewport, Webview Scroll, IOS input buffer, Webview Force Touch'
draft: false
template: 'post'
category: 'CS'
tags:
    - version
date: 2023-01-09
---

## 0. 작성이유

-   Webview는 경험이다!
-   다시한번 정리하기 위해

## TL;DR

-   Visual Viewport : 디스플레이에서 보여지는 부분
-   IOS 이슈
    -   키패드 이슈 : window.visualViewport.onresize 이벤트 활용!
    -   input 버퍼 : hidden input을 만들어 버퍼를 지워주자!
-   IOS/Android 이슈
    -   Force Touch 이슈 : window.visualViewport.onscroll 이벤트 활용!

## 1. Layout Viewport vs Visual Viewport

-   **Layout Viewport**
    -   방향이나, 확대/축소랑 상관없이 항상 동일
    -   크기나 모양이 변경되지 않는 큰 이미지

![layout](/assets/webview-issue/layout.jpeg)

-   **Visual Viewport**
    -   방향이나, 확대/축소에 따라 달라짐
    -   큰 이미지의 일부분만 보여짐

![visual](/assets/webview-issue/visual.jpeg)

## 2. 모바일 키패드(소프트 키보드) 이슈

-   IOS의 사파리에서 키보드가 표시되면 `레이아웃 뷰포트`는 같은 크기로 유지, `시각적 뷰포트` 는 축소
    -   `Android`는 해당 키패드만큼 자동으로 줄여준다
-   해당 키패드 만큼 `body` 태그가 올라간다고 생각하면 된다.
    -   키보드를 열기전 : 화면의 높이
    -   키보드를 열었을 때 : 화면의 높이 + 키보드의 높이

![keyboard](/assets/webview-issue/keyboard.png)

## 2. Trouble Shooting

> 채팅기능을 Webview로 제공…플랫폼(ios, androd, 모바일)에서 문제 발생…

### 0. Code

```jsx
// css
.message-list {
  background: red;
  overflow-y: auto;
  height: calc(100vh - 30px);
}

.input-container {
  display: flex;
  height: 30px;
}

// jsx
<div className="container">
  <div className="message-list" ref={ref}>
        {Array(50).fill(0).map((_, i) => <div key={i}>{i}</div>)}
  </div>
	<div className="input-container">
        <input className="input" onChange={handleChangeInput} value={Message}/>
        <button className="button" onClick={handleClick}>전송</button>
  </div>
</div>
```

### 1. 모바일 키패드(소프트 키보드) 이슈(IOS)

-   문제 : 키패드가 열렸을때 스크롤 하면 input 창이 밀려버린다…
-   동영상
    `video: /assets/webview-issue/scroll_before.mp4`

-   해결책

    -   visialViewport API를 통해 메시지 리스트 영역의 크기를 `input` 제외하고 줄여주자

        ```jsx
        useEffect(() => {
            function handleVisualViewportResize() {
                if (window.visualViewport && ref.current) {
                    const currentVisualViewport = window.visualViewport.height

                    ref.current.style.height = `${currentVisualViewport - 30}px`
                    window.scrollTo(0, 0)
                }
            }

            if (window.visualViewport) {
                window.visualViewport.onresize = handleVisualViewportResize
            }
        }, [])
        ```

-   동영상
    `video: /assets/webview-issue/scroll_after.mp4`

### 2. Force Touch 이슈

> touch의 종류가 다양…

-   문제: force touch를 사용하면 해당 지점으로 스크롤이 이동하기 떄문에.. 안좋은 UX를 제공한다.
-   동영상
    `video: /assets/webview-issue/force_touch_before.mp4`

-   해결책

    -   window.visualViewport.onscroll를 이용하여 scroll을 강제로 고정!

        ```jsx
        window.visualViewport.onscroll = () => {
            window.scrollTo(0, 0)
        }
        ```

-   동영상
    `video: /assets/webview-issue/force_touch_after.mp4`

### 3. Input buffer 문제(IOS)

-   문제: Input에 `각각각` 을 입력하고 `ㅏ` 를 입력하여 `가` 가 나오는문제
-   해결

    -   hidden input을 통해 focus를 이동시켜서, buffer를 지워준다

        ```jsx
        function handleClickSendButton() {
            inputRef.current.focus()
            hiddenInputRef.current.focus()

            sendMessage(message)
        }

        ;<div>
            <input ref={inputRef} />
            <input ref={hiddenInputRef} />
        </div>
        ```

## 출처 및 참고

-   [https://www.bram.us/2021/09/13/prevent-items-from-being-hidden-underneath-the-virtual-keyboard-by-means-of-the-virtualkeyboard-api/](https://www.bram.us/2021/09/13/prevent-items-from-being-hidden-underneath-the-virtual-keyboard-by-means-of-the-virtualkeyboard-api/)
-   [https://rdavis.io/articles/dealing-with-the-visual-viewport](https://rdavis.io/articles/dealing-with-the-visual-viewport)
-   [https://www.quirksmode.org/mobile/viewports2.html](https://www.quirksmode.org/mobile/viewports2.html)
-   [https://channel.io/ko/blog/cross_browsing_ios15](https://channel.io/ko/blog/cross_browsing_ios15)
