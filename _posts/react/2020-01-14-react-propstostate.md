---
title:  "PropsToStateChange"
description: "PropsToStateChange"
draft: false
template: "post"
category : "react"
tags:
  - js
  - react
date: 2020-01-16
---
## Q1. update를 구현하는 방법에 대해서
1. 어떻게 동적으로 컴포넌트를 바꿔줄것인가?
    - 자식 컴포넌트를 만들어서 뿌려주자
2. props로 내려준 값을 수정할수는 없을가?
    - 억지로 만들어서 수정해서 다시 올려주자
3. 왜 value로 넣어줫는데 안되지?
    - 함수로 만들어볼까?
---

1. {컴포넌트} 버튼이 눌러지면 컴포넌트가 다른것이 반환될수있게 만들어준다.
    - 부품이라고 생각하자!!!

        ```js
        if(this.state.btn.value === 'update'){
            _component = <Update/>
        }else if(this.state.btn.value === 'Read'){
            _component = <List/>
        }

        return (
            <div>
            {_component}
            </div>
        )
        ```
2. props는 `read only` state만 수정이 가능하다.
    - props를 state로 받아서 setState() 함수로 수정해주자.

```jsx
this.state = {
    mode : this.props.todo.mode
}

<TodoItem value={this.setState({mode : '행복'})}>
```

3. onChange Method 구현해야 한다.
    - React 공식문서 참조[https://ko.reactjs.org/docs/forms.html]
