---
title: 'React children Component 최적화'
description: 'useMemo, useCallback, React.memo 비교 '
draft: false
template: 'post'
category: 'react'
tags:
    - js
    - react
date: 2021-11-10
---

> When updated React component
>
> -   state 변경될때
> -   props 변경될때
> -   forceUpdate 호출할때

### 0. 최적화 하기전

-   useCallback, useMemo, React.memo를 사용하기전! `profiling 필수`
-   무조건 Memorization 하게 된다면, 더 느려질수도 있다..
    1. 불필요한 연산과정
        - Props 비교 - React.memo
        - Dependency 비교 - useCallback, useMemo
    2. 불필요한 메모리 공간 차지
        - useCallback - 함수
        - useMemo - 값
-   **언제 최적화 해야 하나?**
    -   같은 props로 렌더링이 자주 일어나는 컴포넌트(로그인 버튼, Polling부분)

### 1. 함수를 props 넘길때, useCallback이 안되면?

-   `State Change` 버튼을 클릭마다, `Outer`, `Inner` 컴포넌트 렌더링

```jsx
const Inner = ({ number, fn }) => {
    console.log('Inner')

    return <div>Inner {number}</div>
}

const Outer = ({ number }) => {
    console.log('Outer')

    const handleConsole = () => {
        console.log('handleConsole')
    }

    return (
        <div>
            Outer {number}
            <Inner number={'1'} fn={handleConsole} />
        </div>
    )
}

const App = () => {
    const [number, setNumber] = useState(0)

    const handleClick = () => {
        setNumber(number + 1)
    }
    return (
        <>
            <button onClick={handleClick}>State Change</button>
            <Outer number={number} />
        </>
    )
}
```

### 2. Inner는 왜 호출되지? (number랑 fn은 언제나 같은데)

-   문제점 : 렌더링 할때마다, handleConsole 함수를 새롭게 만들기 때문
-   해결책 : useCallback을 이용하자**(함수 인스턴스를 유지시켜주자)**

```jsx
const Outer = ({ number }) => {
    console.log('Outer')

    const handleConsole = useCallback(() => {
        console.log('handleConsole')
    }, [])

    return (
        <div>
            Outer {number}
            <Inner number={'1'} fn={handleConsole} />
        </div>
    )
}
```

### 3. useCallback을 했는데도 왜 호출되지?

-   문제점 : Inner에서 props가 reference 타입이라서..(primitive 타입은 가능)
-   해결책 : React.memo를 활용하자

```jsx
const Inner = React.memo(({ number, fn }) => {
    console.log('Inner')

    return <div>Inner {number}</div>
})
```

### 4. React.memo를 쓰면 무조건 되나?

-   문제점 : prop가 reference Type이면 안된다
    -   React.memo는 shallowly compare
    -   기본형(number, string, undefined, bool)은 가능
    -   Symbol은 불가(CRA가 Bigint는 미지원)

```jsx
// 렌더링 하지 않는다.
<div>
  Outer {number}
  <Inner number={0} str={''} und={undefined} bol={false} fn={handleConsole}/>
</div>

// 항상 렌더링
<div>
  Outer {number}
  <Inner symbol={Symbol(1} fn={handleConsole}/>
</div>
```

### 5. 나는 특정 props가 바뀔때만 바꾸고싶은데?

-   해결책 : React.memo의 callback을 이용하자
    -   콜백의 인자에는 이전 props와 새로운 props가 들어와서 비교한다.
    -   callback의 결과값이 true면 렌더링 x / false면 리렌더링

```jsx
// Outer
;<div>
    Outer {number}
    <Inner number={number} foo={{ number: 1 }} fn={handleConsole} />
</div>

const Inner = React.memo(
    ({ number, fn, foo }) => {
        console.log('Inner')

        return <div>Inner {number}</div>
    },
    (prev, next) => {
        return prev.foo.number === next.foo.number
    }
)
```

### 6. 그럼 useMemo는 ?

-   useCallback는 함수를 리턴, useMemo는 값을 리턴
-   useMemo를 활용하면, Object, Array, Symbol 참조타입도 가능

```jsx
const Inner = React.memo(({ number, foo }) => {
    console.log('Inner')

    return <div>Inner {number} </div>
})

const Outer = ({ number }) => {
    console.log('Outer')

    const memoNumber = useMemo(() => ({ number: 1 }), []) // 렌더링 x
    // const memoNumber = {number:1} // Inner 렌더링

    return (
        <div>
            Outer {number}
            <Inner number={0} foo={memoNumber} />
        </div>
    )
}
```

### 7. useMemo가 값이면, React.memo가 필요없는가 아냐?

-   아니다.... useMemo 또한 React.memo를 해줘야지 렌더링 안된다.
    -   useCallBack을 이용해서 함수 인스턴스를 유지하는 것처럼
    -   useMemo를 이용해서 reference type을 유지

```jsx
// 렌더링 됨
const Inner = ({ number, foo }) => {
    console.log('Inner')

    return <div>Inner {number} </div>
}

// 렌더링 안됨
const Inner = React.memo(({ number, foo }) => {
    console.log('Inner')

    return <div>Inner {number} </div>
})

const Outer = ({ number }) => {
    console.log('Outer')

    const memoNumber = useMemo(() => ({ number: 1 }), [])
    // const memoNumber = {number:1}

    return (
        <div>
            Outer {number}
            <Inner number={0} foo={memoNumber} />
        </div>
    )
}
```

### 8. 결론

1. Props가 함수나 참조형 타입일 경우, 리렌더링 한다.
2. useCallback, useMemo를 사용해도 리렌더링 한다.
3. React.memo는 기본적으로 Prop 기본형 중 몇가지의 타입(number, string, undefined, bool)은 비교해서 렌더링을 막아준다
    - 단, Symbol, BigInt( CRA = 미지원), 참조형 타입은 비교할 수 없다
4. 함수는 useCallback, 값(참조타입, Symbol, BigInt)은 useMemo를 활용하여 Props로 넘겨주고, React.Memo를 활용하여, 리렌더링를 방지할 수 있다.

### 참고

-   [https://reactjs.org/docs/react-api.html#reactmemo](https://reactjs.org/docs/react-api.html#reactmemo)
-   [https://ui.toast.com/weekly-pick/ko_20190731](https://ui.toast.com/weekly-pick/ko_20190731)
