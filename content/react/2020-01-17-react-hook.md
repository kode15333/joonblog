---
title: 'Hook'
description: '클래스 컴포넌트 -> 함수형 컴포넌트(함수형 프로그래밍)'
draft: false
template: 'post'
category: 'react'
tags:
    - js
    - react
date: '2020-01-16'
---

## [HOOK](https://ko.reactjs.org/docs/hooks-intro.html)

### 클래스 컴포넌트 -> 함수형 컴포넌트(함수형 프로그래밍)

1. useState `(== setState)`

    - 상태 유지 값과 그 값을 갱신하는 함수를 반환합니다.

    ```js
    const [state, setState] = useState(initialState)

    setState(newState)
    ```

2. useEffect `(== componentDidMount / componentDidUpdate )`

    ```js
    useEffect(didUpdate)

    useEffect(() => {
        const subscription = props.source.subscribe()
        return () => {
            // Clean up the subscription
            subscription.unsubscribe()
        }
    })

    // 조건부  useEffect의 두번째 인자에 들어오온 인자(props.source)가 변경될때만 작동
    useEffect(() => {
        const subscription = props.source.subscribe()
        return () => {
            subscription.unsubscribe()
        }
    }, [props.source])
    ```

3. useContext

    ```js
    const value = useContext(MyContext)
    ```

4. useReducer `(== Redex.reducer())`

    ```js
    const [state, dispatch] = useReducer(reducer, initialArg, init)

    const initialState = { count: 0 }

    function reducer(state, action) {
        switch (action.type) {
            case 'increment':
                return { count: state.count + 1 }
            case 'decrement':
                return { count: state.count - 1 }
            default:
                throw new Error()
        }
    }

    function Counter() {
        const [state, dispatch] = useReducer(reducer, initialState)
        return (
            <>
                Count: {state.count}
                <button onClick={() => dispatch({ type: 'decrement' })}>
                    -
                </button>
                <button onClick={() => dispatch({ type: 'increment' })}>
                    +
                </button>
            </>
        )
    }
    ```

5. useCallback `( == shouldComponentUpdate)`

    ```js
    const memoizedCallback = useCallback(() => {
        doSomething(a, b)
    }, [a, b])
    ```

6. useMemo `( == useCallback)`

    ```js
    const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
    ```

7. useRef `(React.createRef())`

    - useRef는 .current 프로퍼티로 ref에 접근가능!(.focus()로 많이 사용)

        ```js
        const refContainer = useRef(initialValue)

        function TextInputWithFocusButton() {
            const inputEl = useRef(null)
            const onButtonClick = () => {
                // `current` points to the mounted text input element
                inputEl.current.focus()
            }
            return (
                <>
                    <input ref={inputEl} type="text" />
                    <button onClick={onButtonClick}>Focus the input</button>
                </>
            )
        }
        ```
