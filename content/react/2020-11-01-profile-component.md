---
title: 'Profiler component'
description: 'Profiler component에 대해서 알아보자'
draft: false
template: 'post'
category: 'react'
tags:
    - js
    - react
date: 2020-11-01
---

## 도대체 몇번 렌더링하고, 렌더링하는 비용이 얼마?

-   이런 문제를 해결해줄 API <Profiler> 이다
-   Profier를 활용하여 최적 할 부분을 찾자 ⇒ 최적화 도구
-   Production build에서는 빠져있다 ⇒ 약간의 오버해드 발생

## 사용법

-   <Profiler>를 감쏴 해당 컴포넌트의 업데이트 "commit' 과정에서 호출된다

```jsx
render(
    <App>
        <Profiler id="Navigation" onRender={callback}>
            <Navigation {...props} />
        </Profiler>
        <Main {...props} />
    </App>
)

render(
    <App>
        <Profiler id="Panel" onRender={callback}>
            <Panel {...props}>
                <Profiler id="Content" onRender={callback}>
                    <Content {...props} />
                </Profiler>
                <Profiler id="PreviewPane" onRender={callback}>
                    <PreviewPane {...props} />
                </Profiler>
            </Panel>
        </Profiler>
    </App>
)
```

## onRender Callback

-   Profiler 컴포넌트 다양한 props를 받는다

```jsx
function onRenderCallback(
    id, // 방금 커밋된 Profiler 트리의 "id"
    phase, // "mount" (트리가 방금 마운트가 된 경우) 혹은 "update"(트리가 리렌더링된 경우)
    actualDuration, // 커밋된 업데이트를 렌더링하는데 걸린 시간
    baseDuration, // 메모이제이션 없이 하위 트리 전체를 렌더링하는데 걸리는 예상시간
    startTime, // React가 언제 해당 업데이트를 렌더링하기 시작했는지
    commitTime, // React가 해당 업데이트를 언제 커밋했는지
    interactions // 이 업데이트에 해당하는 상호작용들의 집합
) {
    // 렌더링 타이밍을 집합하거나 로그...
}
```

-   **`id: string`** - 방금 커밋된 `Profiler` 트리의 `id` prop. 복수의 프로파일러를 사용하고 있다면 트리의 어느 부분이 커밋되엇는지 식별하는데 사용할 수 있습니다.
-   **`phase: "mount" | "update"`** - 해당 트리가 방금 마운트된 건지 prop, state 혹은 hooks의 변화로 인하여 리렌더링 된 건지 식별합니다.
-   **`actualDuration: number`** - 현재 업데이트에 해당하는 `Profiler`와 자손 컴포넌트들을 렌더하는데 걸린 시간 이것은 하위 트리가 얼마나 메모이제이션을 잘 활용하고 있는지를 암시합니다 (e.g. `[React.memo](https://ko.reactjs.org/docs/react-api.html#reactmemo)`, `[useMemo](https://ko.reactjs.org/docs/hooks-reference.html#usememo)`, `[shouldComponentUpdate](https://ko.reactjs.org/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)`). 이상적으로 대다수의 자손 컴포넌트들은 특정 prop이 변할 경우에만 리렌더링이 필요하기 때문에 이 값은 초기 렌더링 이후에 상당 부분 감소해야 합니다.
-   **`baseDuration: number`** - `Profiler` 트리 내 개별 컴포넌트들의 가장 최근 `render` 시간의 지속기간 이 값은 렌더링 비용의 최악 케이스를 계산해줍니다(e.g. 초기 마운트 혹은 메모이제이션이 없는 트리)
-   **`startTime: number`** - React가 현재 업데이트에 대해 렌더링을 시작한 시간의 타임 스탬프.
-   **`commitTime: number`** - React가 현재 업데이트를 커밋한 시간의 타임 스탬프 이 값은 모든 프로파일러들이 공유하기 때문에 원한다면 그룹을 지을 수 있습니다.
-   **`interactions: Set`** - 업데이트가 계획되었을 때 추적하고 있던 [“상호작용”](https://fb.me/react-interaction-tracing)의 집합 (e.g. `render` 혹은 `setState`가 호출되었을 때).
