---
title: 'React Custom Router'
description: 'React Router를 만들어보자'
draft: false
template: 'post'
category: 'react'
tags:
    - js
    - react
date: 2021-05-05
---

### 0. **이글을 작성하는 이유?**

-   React-Router는 어떻게 작동할까?

### 1. SPA란?

-   새로고침은 UX적으로 좋지않다.
-   새로운 페이지를 렌더링 하지 않고, 부분적으로 렌더링을 하자 (react)
-   URL도 변경되면서, '앞으로가기/뒤로가기'가 동작되면 좋겠다 (react-router)

### 2. History API

-   BOM의 History는 사용자의 방문기록 및 '앞/뒤(으)로 가기' 같은 API를 제공한다.
-   주요 메소드

    ```jsx
    // 뒤로 가기
    history.back()

    // 앞으로 가기
    history.forward()

    // history stack을 기준으로 특정 지점으로 이동할 수 있다.
    history.go(-1) // === history.back()
    history.go(1) // === history.forward()

    // history의 state(세션기록에) 해당 state를 넣으며 url을 변경해준다
    // 하지만, url로 변경하지만 탐색하지 않는다(단순히 url 변경)
    history.pushState(state, title, url)
    ```

### 3. Custom Router

1. 구성요소

    1. Route

        - popstate를 통해 navigation 변화가 발생하면 event.state값을 받아 다시 렌더링 하는 컴포넌트

    2. Link

        - pushState를 활용해 history를 저장하는 컴포넌트

    3. Router

        - Link와 Route컴포넌트 부모로써, Context API를 활용

2. 코드

    1. RouterContext

        - Context API를 활용하며, popstate이벤트가 생기면 리렌더링

    ```jsx
    export const HistoryContext = React.createContext({
        history: window.history,
    })

    export const Router = ({ routeList, children }) => {
        const [routes] = useState(() =>
            Object.keys(routeList).map((key) => routeList[key].path)
        )
        const [currentPath, setCurrentPath] = useState(
            () => window.location.pathname
        )

        const is404 = routes.indexOf(currentPath) === -1
        const handlePopStateEvent = useCallback(({ state }) => {
            if (state && state.to) {
                setCurrentPath(state.to)
            }
        }, [])

        useEffect(() => {
            window.addEventListener('popstate', handlePopStateEvent, false)
            return () => {
                window.removeEventListener(
                    'popstate',
                    handlePopStateEvent,
                    false
                )
            }
        }, [])

        return (
            <HistoryContext.Provider
                value={{
                    currentPath,
                    setCurrentPath,
                }}
            >
                {is404 ? <NotFound /> : children}
            </HistoryContext.Provider>
        )
    }
    ```

    2. Route

    ```jsx
    export const Route = ({ path, children, ...props }) => {
        const { currentPath } = useContext(HistoryContext)
        if (path !== currentPath) {
            return null
        }
        return <div {...props}>{children}</div>
    }
    ```

    3. Link

    ```jsx
    export const Link = ({ to, children, ...props }) => {
        const { currentPath, setCurrentPath } = useContext(HistoryContext)
        const handleLinkClick = useCallback(
            (e) => {
                e.preventDefault()
                if (currentPath === to) {
                    return
                }
                history.pushState({ to }, '', to)
                setCurrentPath(to)
            },
            [currentPath]
        )
        return (
            <a {...props} onClick={handleLinkClick}>
                {children}
            </a>
        )
    }
    ```

    4. NotFound

    ```jsx
    export const NotFound = () => {
        return (
            <div>
                <p>404 - NotFound</p>
                <Link to={routes.home.path}>Back to home</Link>
            </div>
        )
    }
    ```

### 출처

-   [https://dev.to/ogzhanolguncu/build-a-custom-react-router-from-scratch-180h](https://dev.to/ogzhanolguncu/build-a-custom-react-router-from-scratch-180h)
-   코드스쿼드
