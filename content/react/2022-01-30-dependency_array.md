---
title: 'Dependency Array를 어떻게 비교할까?'
description: 'Effect의 dependencyArray 비교방법, componentDidUpdate?'
draft: false
template: 'post'
category: 'vdom'
tags:
    - react
    - vdom
date: 2022-01-30
---

### 0. 작성하는 이유

-   useEffect의 Dependency Array는 어떻게 비교를 해서 호출할까?
-   `componentDidUpdate` 처럼 사용하고 싶은데... 어떻게 하지?
-   referenceType일 경우, 별도의 작업없이 사용할 수 없을까? (custrom hook)

### 1. Component Render(ReRender) Flow

-   초기 Render : **init Component** → **useEffect**
-   Re-Render: **init Component → clean up useEffect** → **useEffect**

```jsx
const NumberComp = () => {
    console.log('init Component')

    const [state, setState] = useState(0)

    const handleClick = () => {
        setState((prev) => prev + 1)
    }

    useEffect(() => {
        console.log('useEffect')

        return () => {
            console.log('clean up useEffect')
        }
    }, [state])

    return (
        <div>
            <button onClick={handleClick}>Change State</button>
        </div>
    )
}
```

### 2. react-dom 코드

-   [useEffect 실행코드](https://github.com/facebook/react/blob/ddd1faa1972b614dfbfae205f2aa4a6c0b39a759/packages/react-reconciler/src/ReactFiberHooks.new.js#L1206)(update 조건 충족시)와 [dependency Check](https://github.com/facebook/react/blob/ddd1faa1972b614dfbfae205f2aa4a6c0b39a759/packages/react-reconciler/src/ReactFiberHooks.new.js#L296)부분을 확인해보자

    ```jsx
    function areHookInputsEqual(nextDeps, prevDeps) {
    	...
    	for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
        if (objectIs(nextDeps[i], prevDeps[i])) {
          continue;
        }
        return false;
      }

      return true;
    }

    function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
      ...

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }

      ...
      hook.memoizedState = pushEffect(HasEffect | hookFlags, create, destroy, nextDeps);
    }
    ```

-   [Object.is](http://Object.is) 함수를 활용하여, prev/next dependency reference 체크를 통해 Effect가 발생하는것을 확인할 수 있다!

    ```jsx
    const foo = {
        foo: 1,
    }
    const bar = foo
    Object.is(foo, { foo: 1 }) // false
    Object.is(foo, bar) // true
    Object.is(1, 1) // bar
    ```

### 3. Dependency Type에 따라 다르게 작동하는 Effect...

1. Number, String, Bool - **Primitive** 타입일 경우

    - State가 변경이 된다면, 함수가 새롭게 호출된다.
    - State가 변경이 안되었다면,(값이 이전 값과 동일하다면) 함수가 호출되지 않는다.

    ```jsx
    const Component = () => {
        const [state, setState] = useState(0)

        const handleClick = () => {
            setState((prev) => prev + 1)
        }

        const handleEqual = () => {
            setState((prev) => prev)
        }

        useEffect(() => {
            console.log('changing State call useEffect initialization')
        }, [])

        useEffect(() => {
            console.log('changing State call useEffect')
        }, [state])

        return (
            <div>
                <h1>Primitive</h1>
                <button onClick={handleClick}>
                    Change State(If state dont change, useEffect no call)
                </button>
                <button onClick={handleEqual}>
                    Equal State(useEffect no call)
                </button>
            </div>
        )
    }
    ```

2. Array, Object - **reference** 타입일 경우

    - Imutable하게 관리하기 때문에, 매번 새롭게 생성이 된다 → 함수가 새롭게 호출된다.
    - Object의 경우, JSON.stringigy(to JSON string)의 형태로 변경여부를 체크할 수 있지만,
      (JSON Object의 경우, 지원하지 않는 타입(undefined, Functions, Symbol...)이 있으므로, 주의)

        ```jsx
        const Component = () => {

        	const [state, setState] = useState({foo: {bar: 1}, test: 1})

          const changeState = () => {
            setState(prev => ({ ...prev, foo : {bar : 2}, bar: 1 }))
          }

          const handleImmutable = () => {
            setState(prev => ({foo: {bar: 1}, test: 1}))
          }

          const handleMutable = () => {
            setState(prev => {
              delete prev.foo.bar
              return prev
            })
          }

          useEffect(() =>{
            console.log('change State call useEffect initialization')
          }, [])

          useEffect(() => {
            console.log('change State call useEffect')
          }, [JSON.stringify(state)])

        return (
            <div>
              <h1>reference</h1>
              <button onClick={changeState}> Change State</button>
              <button onClick={handleImmutable}> Immutable State(Every useEffect call)</button>
              <button onClick={handleMutable}> mutable State(If use mutable Object, useEffect no call)</button>
            </div>
          )
        ```

3. Function일 경우

    - 함수의 경우, 매번 새롭게 생성되기 때문에 함수가 매번 호출된다
    - useCallback을 통해 함수를 Memorization을 해주면, 함수가 변경될때만 호출되게 된다.

        ```jsx
        const Component = () => {
            const [state, setState] = useState(0)

            const changeState = () => {
                setState((prev) => prev + 1)
            }

            const changeFunction = () => {
                console.log('call changeFunction')
            }

            const momeChangeFunction = useCallback(() => {
                console.log('call momeChangeFunction')
            }, [state])

            useEffect(() => {
                console.log('change Function call useEffect')
                return () => {
                    console.log('clean up useEffect')
                }
            }, [changeFunction])

            useEffect(() => {
                console.log('change Function call useEffect initialization')
                return () => {
                    console.log('clean up initialization')
                }
            }, [])

            return (
                <div>
                    <h1>Function</h1>
                    <button onClick={changeState}> Change State</button>
                </div>
            )
        }
        ```

### 4. referenceType일 경우, 간단하게 사용할 수 없을까? ([use-deep-compare-effect](https://www.npmjs.com/package/use-deep-compare-effect))

-   그 전의 값을 알고 있어야 하기 때문에! `useRef`를 활용해서 Memorization 하자
-   useEffect의 호출을 직접 다룰 수는 없지만, useEffect안에 있는 Effect를 다루자

    ```jsx
    function useDeepCompareMemoize(value) {
      const ref = React.useRef(value)
      const signalRef = React.useRef(0)

      if (!deepEqual(value, ref.current)) {
        ref.current = value
        signalRef.current += 1
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
      return React.useMemo(() => ref.current, [signalRef.current])
    }

    React.useEffect(callback, useDeepCompareMemoize(dependencies)

    ```

## 참고

-   [https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)
-   [https://sgwanlee.medium.com/useeffect의-dependency-array-ebd15f35403a](https://sgwanlee.medium.com/useeffect%EC%9D%98-dependency-array-ebd15f35403a)
-   [https://github.com/facebook/react/blob/ddd1faa1972b614dfbfae205f2aa4a6c0b39a759/packages/react-reconciler/src/ReactFiberHooks.new.js#L296](https://github.com/facebook/react/blob/ddd1faa1972b614dfbfae205f2aa4a6c0b39a759/packages/react-reconciler/src/ReactFiberHooks.new.js#L296)
-   https://github.com/kentcdodds/use-deep-compare-effect
