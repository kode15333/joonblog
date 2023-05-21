---
title: 'JSX 없이 사용하는 React'
description: 'JSX 없이 사용하는 React에 대해서 알아보자'
draft: false
template: 'post'
category: 'react'
tags:
    - js
    - react
date: 2020-11-15
---

-   JSX를 사용하면 리엑트를 쉽게 구성할 수 있다
-   단! 필수는 아니지만, 추천한다

## JSX를 사용하면 직관적? 쉽게? 컴포넌트를 사용!

```jsx
class Hello extends React.Component {
    render() {
        return <div>Hello {this.props.toWhat}</div>
    }
}

ReactDOM.render(<Hello toWhat="World" />, document.getElementById('root'))
```

## Pure를 사용하면 React.Object를 만들어서 넣어줘야하기때문에 직관적이지 못함!

```jsx
class Hello extends React.Component {
    render() {
        return React.createElement('div', null, `Hello ${this.props.toWhat}`)
    }
}

ReactDOM.render(
    React.createElement(Hello, { toWhat: 'World' }, null),
    document.getElementById('root')
)
```

### 추천 및 관련 URI

[the online Babel compiler](https://babeljs.io/repl/#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG4B8AEhlogO5xnr0AhLQD0jVgG4iAXyJA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=react&prettier=false&targets=&version=7.12.7&externalPlugins=)
