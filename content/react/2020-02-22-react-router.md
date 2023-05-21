---
title: 'React_Router'
description: 'SPA에 위한 React_Router 정의와 사용법'
draft: false
template: 'post'
category: 'react'
tags:
    - js
    - react
date: 2020-01-16
---

## [리엑트 라우터에 대해서](https://reacttraining.com/)

1. 정의 : SPA 프로젝트를 만들기 위해서는 url을 기준으로 페이지를 보여주기 위해 라우터 사용

2. 사용법

    1. BrowserRouter as Router : 라우터를 사용할 곳!
    2. Switch : url에 따라 컴포넌트를 바꿔 보여주는 case문
    3. Route : Switch 안에서 쓰는 조건
        - exact : url이 정확히 동일 여부
        - path : url
        - component : 보여줄 컴포넌트
    4. Link : url을 변경 시켜주는 컴포넌트

        ```jsx
        import React from 'react'
        import {
            BrowserRouter as Router,
            Switch,
            Route,
            Link,
        } from 'react-router-dom'

        export default function BasicExample() {
            return (
                <Router>
                    <div>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/about">About</Link>
                            </li>
                        </ul>
                        <Switch>
                            <Route exact path="/">
                                <Home />
                            </Route>
                            <Route path="/about">
                                <About />
                            </Route>
                            <Route path="*">
                                {' '}
                                // 404 페이지 구현
                                <NoMatch />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            )
        }
        ```

3. Route를 통해서 보여지는 컴포넌트는 특별한 props를 상속받는다.

    - history
        - 페이지를 스택에 쌓아 놓은것을 우리가 조정할수 있다.
        - push / replace / go / goBack / goForward
    - location
        - 브라우져의 현재 정보를 가지고 잇다.
        - 쿼리스트링을 찾을수 잇다. location.search.substr(1)
    - match
        - url을 통하여 /:id path를 찾을수잇다.
        - const {id} = this.props.match.params;

4. [Route에서 컴포넌트로 props(history, location, match)와 별도의 props을 같이 내리는 방법](https://tylermcginnis.com/react-router-pass-props-to-components/)

-   Route 컴포넌트에서 props를 인자로 받아 컴포넌트에 props를 spread 연산자를 통해 다 넣어준다.(감탄!!!)
-   다시한번 리엑트는 자바스크립트를 잘 해야지 할 수 잇다는것을 알 수 있었다.

    ```jsx
    <Route
        path="/dashboard"
        render={(props) => <Dashboard {...props} isAuthed={true} />}
    />
    ```

5. 결론 : spa프로젝트를 만들려면 누구보다도 Router에 대해서 잘 알아야 한다!
