---
title:  "Code Split"
description: "Code Split에 대해서 알아보자"
draft: false
template: "post"
category : "react"
tags:
  - js
  - react
date: 2020-08-31 
---
## 왜? 해야하나요?

CRA는 웹팩을 통해 여러개로 나누어진 파일(js, css)를 하나의 파일로 만든다(번들링)

- 이유

    - 여러번 요청하는게 아니라 한번에 파일을 받게 한다

    - 데이터기반으로 빠르게 UI를 변경시켜 사용자에게 좋은 UX를 제공한다(서버 요청 없이 페이지 변경) 

- 문제점

    - 번들링 된 파일이 거대해지면,  첫페이지를 로딩시간이 길어진다.

    - 번들링 된 파일에는 사용자가 불필요한 코드가 포함되어 있다.

## 방법

### 1. import()

- CRA는 기본적으로 Webpack에 codesplit이 설정이 되어있다.
- Webpack이 번들링할때, import()문을 만나면 나누어서 번들링을 한다.

```jsx
// 예제 1)
// 하나의 파일로 번들링이 된다.
import { add } from './math';

console.log(add(16, 26));

// dynamic import를 통해 파일이 분리가 된다.
import("./math").then(math => {
  console.log(math.add(16, 26));
});

// src/func.js

export function func() {
    console.log('hello world!')
}

// 예제 2)
// src/App.js
import React, { Component } from 'react';

class App extends Component {
    handleClick = () => {
        import('./func').then(result => {
            result.func();
            // 물론 export defualt로 내보내주면 result.default()가 됩니다.
        });
    };
    render() {
        return (
            <div className="App">
                <button onClick={this.handleClick}>불러오기</button>
            </div>
        );
    }
}

export default App;

//예제 3) 
// 함수와 달리 컴포넌트는 바로 호출하는 것이 아니고
// 있을 때 호출해야 하는 조건을 달아줘야 하므로 state로 관리
import React, { Component } from 'react';

class App extends Component {
    state = {
        Test: null
    };

    handleClick = () => {
        import('./Test').then(result => {
            this.setState({
                Test: result.default
            });
        });
    };

    render() {
        const { Test } = this.state;

        return (
            <div className="App">
                <button onClick={this.handleClick}>불러오기</button>
                {Test && <Test />}
            </div>
        );
    }
}

export default App;
```

- 또한 바벨 이용시 import를 통해서 코드스플릿이 되게 플러그인을 설치해준다.

```json
// $ npm install babel-plugin-syntax-dynamic-import
// .babelrc
{
  "plugins": ["syntax-dynamic-import"]
}
```

### 2. React.lazy, Suspense

- React.lazy / Suspense는 아직 서버 사이드 렌더링을 미지원(공식 문서)
- React.lazy는 default export를 가진 모듈을 반환한다.
- Suspense 컴포넌트의 children으로 React.lazy이다

    - fallback을 통해 해당 컴포넌트 로딩화면을 구현 할 수 있다.

    - 하나의 Suspense 컴포넌트 하위에 여러개의 React.lazy 컴포넌트를 구성할 수 있다.

```jsx
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

### 3. Loadable Components

- React.lazy보다 지원범위가 넘음

[Loadable 지원범위](https://www.notion.so/aba5111179cf4f09a502f24cfd852236)

- 사용법은 lazy와 동일하며, 두번째 매개변수로 fallback 구현 or fallback Props로 구현가능

```jsx
import React, { Suspense } from 'react';
import loadable from '@loadable/component'

const OtherComponent = loadable(() => import('./OtherComponent'), {
	fallback : <div>Loading...</div>
})

function MyComponent() {
  return (
    <div>
     <OtherComponent fallback={<div>Loading...</div>} />
    </div>
  );
}
```

### 4. 만약 Loading 중에 깜박거리는 느낌을 받는다면 ?

- 화면 전환을 지연시킨다(500ms의 지연을 겪게하여 오히려 편한 UX를 제공할 수 있다.)

```jsx
// npm inatall p-min-delay

import React, { Component } from 'react';
import loadable from '@loadable/component';
import pMinDelay from 'p-min-delay';

const Test = loadable(() => pMinDelay(import('./Test'), 500), {
    fallback: <div>Loading...</div>
});

class App extends Component {
    state = {
        visible: false
    };

    handleClick = () => {
        this.setState({
            visible: true
        });
    };

    render() {
        const { visible } = this.state;
        return (
            <div>
                <button onClick={this.handleClick}>댓글보기</button>
                {visible && <Test />}
            </div>
        );
    }
}

export default App;
```

## 언제 사용할까?

### Router 기반으로 CodeSplit 구현

```jsx
    import React, { Suspense, lazy } from 'react';
               import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

    const Home = lazy(() => import('./routes/Home'));
    const About = lazy(() => import('./routes/About'));

    const App = () => (
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
          </Switch>
        </Suspense>
      </Router>
    );
```

## 주의사항

1. React.lazy 같은 경우 default exports만 지원(공식문서)
2. names exports를 사용할 경우 default로 이름을 재정의해야 한다.

```jsx
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;

// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```
