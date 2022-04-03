---
title:  "SSR..Nextjs...Hydration"
description: "SSR(Nextjs)와 Hydration에 대해"
draft: false
template: "post"
category : "react"
tags:
  - react
  - hydration
date: 2022-02-20
---
## 0. 왜 작성하는가?
- 왜 SSR인가? 왜 Nextjs인가?
- 문제의 블로그 ...  [Hydration Style Issue](https://fourwingsy.medium.com/next-js-hydration-%EC%8A%A4%ED%83%80%EC%9D%BC-%EC%9D%B4%EC%8A%88-%ED%94%BC%ED%95%B4%EA%B0%80%EA%B8%B0-988ce0d939e7)

## 1. Nextjs

### 1. JSX 문법으로 SSR 할 수 있는 프레임워크

![csr-ssr](../../assets/hydration/csrssr.png)

1. 왜? 사용하나? 무엇이 이점일까? 
    - **사용자 친화적**?
        > Code Split, Skeleton UI 활용하면 CRA로 충분히 가능하지 않을까?
          - 더 빠른 화면을 보여준다
          - 깜박이는 현상을 제거할 수 있다 (js 다운받아 html 생성하기 때문)
    - **SEO**?
        > 최근에는 CSR도 가능하게 만든다고 한다.
          - SEO 점수를 높여야지 검색시, 먼저 노출되기 떄문
          - HTML 페이지의 정보가 필요하는데...없다(CSR)
2. Nextjs 동작원리
      - 기본적으로 모든 페이지를 pre-Render를 제공하고 있고,(서버에서 HTML 생성)
      - 이러한 페이지는 먼저 client에게 노출 후,(깜빡임 현상 제거 및 SEO 적용)
      - page에 필요한 js를 다운로드하여 적용한다.(Hydration)


### 2. CRA와 SSR의 Loading 속도 차이
> 인터넷 속도가 느린곳은 SSR을 지원할 충분한 증거
0. Loading 시점
   - DomContentLoaded : Render Tree 완성 시점
   - Loaded: 리소스(JS, CSS, 이미지) 다운로드 후 적용 시점
   
1. Static 파일(단순 문자열)
    - Throttle이 심해질수록(fast 3G -> slow 3G) Loading 시점의 차이가 큼
          - reactjs
           ![react](../../assets/hydration/first.png)
          - nextjs
           ![nextjs](../../assets/hydration/second.png)
    - `Code`
        ```jsx
        const Lorem = () => {
          return (
            <div>
              {Array(1000)
                .fill(1)
                .map((v, index) => {
                  return (
                    <div key={index}>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
                        corporis dolorum enim fugiat, harum illo impedit in inventore
                        nostrum placeat, porro possimus quam quibusdam quisquam
                        reprehenderit similique sint totam velit?
                      </p>
                    </div>
                  )
                })}
              )
            </div>
          )
        }
        ```

2. API 요청시
    - Throttle이 심해질수록(fast 3G -> slow 3G) Loading 시점의 차이가 큼
      - reactjs
      ![react](../../assets/hydration/third.png)
      - nextjs
      ![nextjs](../../assets/hydration/fourth.png)
    - `Code`
        ```jsx
        // next
        export const getStaticProps: GetStaticProps = async () => {
          const response = await fetch('https://jsonplaceholder.typicode.com/todos')
          const todos: Todo[] = await response.json()
        
          return {
            props: {
              todos,
            },
          }
        }
        
        function About({ todos }: Props) {
          return (
            <div>
              {todos.map((todo, index) => {
                return (
                  <div key={index}>
                    <p>{todo.title}</p>
                  </div>
                )
              })}
              )
            </div>
          )
        }
        
        // react
        const App = () => {
          const [todos, setTodos] = useState([])
          useEffect(() => {
            fetch('https://jsonplaceholder.typicode.com/todos')
              .then(response => response.json())
              .then(json => setTodos(json))
        
          }, [])
        
          return (
            <div>
              {todos
                .map((todo, index) => {
                  return (
                    <div key={index}>
                      <p>
                        {todo.title}
                      </p>
                    </div>
                  )
                })}
              )
            </div>
          )
        }
        ```
    
## 2. Hydration

> Server에서 받은 HTML에 Event를 달아주자


### 1. Server의 ReactDOMServer

> JSX는 HTML이 아니다... HTML로 바꿔주는 Method

`ReactDOMServer.renderToString(element)`

- `renderToString()`
    - Next(Node)에서 만든 Component(JSX)를 HTML로 만듬

### 2. Client의 ReactDOM
> ReactDOM은 아직 unMount상태이다!!

`ReactDOM.hydrate(element, container[, callback])`

- `hydrate()`
  - HTML(SSR) 이후 다운로드 받은 JS로 `ReactDom`(unMounted 상태)을 생성
  - HTML과 `ReactDOM`을 비교하여, Event를 등록한다. 
      - Hydrate의 역할은 이벤트를 달아주는거다. 
      - React Dom과 text, attribute(style, dataset)가 달라도 변경되지 않는다.
          - 이러한 이슈는 dev환경에서 Error로 노출된다.
          - 해결방법은 간단하다 → 한번 더 렌더링 하면된다.
              - 장점: 문제해결
              - 단점: 두번 렌더링 → 리소스, 시간 듬 → SSR할 필요가ㅏ..

## 3. React Hydration Error
> Server(HTML)랑 Client(ReactDom) 달라? 에러(dev환경)

- React.hydration 함수는 Server와 Client가 동일하다고 생각하고 이벤트를 등록

```jsx
function MyComponent() {
  const color = typeof window !== 'undefined' ? 'red' : 'blue'
  return <h1 style={{ color }}>Hello World!</h1>
}

export default MyComponent

//console.error
// Warning: Prop `style` did not match. Server: "color:blue" Client: "color:red"
```
1. **문제의 코드**
   ![hydration-result](../../assets/hydration/hydrationText.png)


```jsx
const Home = () => {
    return (
             <>
              <SSR />
              <CSR />
              <Always />
             </>
    )
}

export default function SSR() {
    if (process.browser) return null
  return <div style={{ color: 'red' }}>SSR</div>
}

export default function CSR() {
  const [visible, setVisible] = useState(false)
  useEffect(() => setVisible(true), [])

  if (!visible) return null
  return <div style={{ color: 'blue' }}>CSR</div>
}

export default function Always() {
  return <div style={{ color: 'green' }}>Always green component</div>
}

```



2. 작동원리
> ~~설명은 할 수 있으나, 100% 이해못함..~~

    1. Server에서 만든 HTML은 `SSR`,`ALWAYS` 컴포넌트 노출
    2. Client JS로 만든 ReactDOM은 `ALWAYS`만 노출
       -- hydration —
    3. React는 당연히 같은 태그니까 1  === 3 태그는 같다고 판단하여 tag를 그대로 두고 textContent를 교체
       - 속성은 변경되지 않는다.
    4. CSR의 useEffectf로 인해 추가!

  ```jsx
  <>
      <div></div> //ssr   - 1
      <div></div> //always - 2
  </>

  <>
      <div></div> always - 3
  </>
  ```



## 참고

- [https://nextjs.org/docs/basic-features/pages#pre-rendering](https://nextjs.org/docs/basic-features/pages#pre-rendering)
- [https://ko.reactjs.org/docs/react-dom-server.html](https://ko.reactjs.org/docs/react-dom-server.html)
- [https://nextjs.org/docs/messages/react-hydration-error](https://nextjs.org/docs/messages/react-hydration-error)
