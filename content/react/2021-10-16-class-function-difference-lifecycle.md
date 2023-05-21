---
title: 'useCallback과 useMemo는 언제 memorization 하지?'
description: 'Class vs Function Component Event Log'
draft: false
template: 'post'
category: 'react'
tags:
    - js
    - react
date: 2021-10-16
---

### 0. **이글을 작성하는 이유?**

-   useCallback과 useMemo는 언제 memorization을 하는지?
-   hook api가 언제 호출되는지 확실히 말할 수 있을까?
-   class Component의 life cycle이랑 비교하고 싶어서

### 1. useCallBack vs useMemo Memorization Timing

1. useCallback

    - 주로 함수(eventHandler 등)를 새로 만들지 않고 재사용하고 싶을 때
    - useCallback으로 감싼 함수를 호출할때, **Memoizing**
    - dependency의 따라 메모리제이션 된 함수를 리턴할지, 새로운 함수를 호출할지 결정된다.

    ```jsx
    // before Memorization
    const memoizedCallback = useCallback(() => {
        doSomething(a, b)
    }, [a, b])

    // Memoizing
    memoizedCallback()
    ```

2. useMemo

    - 주로 특정 결과값을 재사용 하며, 기능은 useCallback이랑 같음
    - useMemo는 컴포넌트 첫 렌더링시, **Memoizing**
    - dependency에 따라 작동하는건, **useCallback**과 동일
    - props 변경시, 컴포넌트가 새롭게 렌더링 되기 때문에, **Re-Memoizing**
    - `useCallback(fn, deps)` === `useMemo(() => fn, deps)`

    ```jsx
    // Memorization when first Rendering
    const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
    ```

### 2. 각 상황별 이벤트 로그(테스트 코드 참고)

![React-Event](../../assets/react-event.png)

-   비슷한 역할을 하는 함수
    -   `constructor` ===`useState Callback`
    -   `setState Callback` === `setState Callback`
    -   `shouldComponentUpdate` === `React.memo`
    -   `componentWillUnmount` === `useEffect cleanup function`

### 3. 테스트 코드

1. Class Component

    ```jsx
    class ClassLife extends React.Component {
        constructor(props) {
            super(props)
            console.log('1. constructor')
        }
        state = {
            number: 0,
        }

        shouldComponentUpdate(nextProps, nextState) {
            console.log('1-2 shouldComponentUpdate')
            return this.state.number !== nextState.number
        }

        componentDidUpdate(prevProps, prevState, snapshot) {
            console.log('3. componentDidUpdate')
        }

        componentDidMount() {
            console.log('4. componentDidMount')
        }

        componentWillUnmount() {
            console.log('5. componentWillUnmount')
        }

        handleClick = () => {
            console.log('1. handleClick')
            this.setState((prev) => {
                console.log('1-1-1. in setState')
                return {
                    ...prev,
                    number: this.state.number + 1,
                }
            })
        }

        handleEqual = () => {
            this.setState({
                number: this.state.number,
            })
        }

        handleToggle = () => {
            this.props.onrr()
        }

        render() {
            console.log('2. render')
            return (
                <div>
                    <h1> Class Component</h1>
                    <button onClick={this.handleClick}>UpdateState</button>
                    <button onClick={this.handleEqual}>Equal</button>
                    <button onClick={this.handleToggle}>handleToggle</button>
                    <div>number: {this.state.number}</div>
                </div>
            )
        }
    }
    ```

2. Function Component

    ```jsx
    const FunctionLife = (props) => {
        console.log('function component body first line')

        const [number, setNumber] = React.useState(() => {
            console.log('callback in useState')
            return 0
        })

        React.useEffect(() => {
            console.log('function in useEffect Callback noDependency')

            return () => {
                console.log('function in useEffect Callback dependency')
            }
        }, [])

        React.useEffect(() => {
            console.log('function in useEffect Callback dependency')

            return () => {
                console.log('cleanup function in useEffect dependency')
            }
        }, [number])

        const updateState = (foo) => {
            console.log('foo', foo)
            setNumber((prev) => {
                console.log('callback in setState')

                return prev + 1
            })
        }

        const updateStateUseCallback = React.useCallback(() => {
            console.log('function body in useCallback')

            updateState('useCallback')
            return () => {
                console.log('return updateStateUseCallback')
            }
        }, [])

        const updateStateUseMemo = React.useMemo(() => {
            console.log('callback in useMemo')
            return updateState
        }, [])

        const updateEqual = () => {
            setNumber((prev) => prev)
        }

        return (
            <div>
                <h1>FunctionLife</h1>
                <button onClick={updateState}>updateState</button>
                <button onClick={updateEqual}>updateEqual</button>
                <button onClick={updateStateUseCallback}>
                    updateStateUseCallback
                </button>
                <button onClick={updateStateUseMemo}>updateStateUseMemo</button>
                <button onClick={updateStateUseMemo}>updateStateUseMemo</button>
                <h3>{number}</h3>
            </div>
        )
    }

    export default React.memo(FunctionLife, (prev, next) => {
        console.log('callback in React memo')
        return JSON.stringify(prev) === JSON.stringify(next)
    })
    ```

### 참고

-   https://ko.reactjs.org/docs/hooks-reference.html
