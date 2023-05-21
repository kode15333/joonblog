---
title: 'Windowing 기법'
description: 'Intersection Observer API부터 react-window까지'
draft: false
template: 'post'
category: 'react'
tags:
    - react
date: 2022-11-30
---

## 작성이유

-   초기속도 로딩 향상을 위해(코인리스트, 체결내역...)
-   Windowing 기법에 대해서 정리

## TL;DR

-   Windowing 기법이란?
    -   보여지는 부분만 렌더링만 시키자
-   방법
    -   **Intersection Observer API**
    -   [react-window](https://github.com/bvaughn/react-window) 와 [react-virtualized](https://github.com/bvaughn/react-virtualized)
-   개선결과 (테스트 조건 : 5,000개 이미지)
    -   **Dom Content Loaded** (0.45초 → 0.13초)
    -   **First Contentful Paint** ( 2.13초 → 0.47초)
    -   **Loaded**(241ms → 193ms)
    -   **Request Count**(5006개 → 18개)

## Windowing 기법이란?

-   스크롤 영역이나, 리스트가 화면을 다 넘어가면 다 보여줄 필요가 있을까?
-   보여지는 부분만 렌더링 시키고, 안보이는 부분은 데이터만 가지고 있자!
-   **Intersection Observer API**를 사용하면 보이는 부분 렌더링되게 처리할 수 있다.

## **Intersection Observer API**

-   HTML 요소가 부모 요소 또는 브라우저 뷰포트 자체와 교차할 때 콜백을 실행하는 방법
-   간단히 말해서 사용자가 페이지를 아래로 스크롤할 때 목록 항목이 화면에(또는 근처에) 있을 때 알려줍니다

    ```jsx
    interface Args extends IntersectionObserverInit {
      freezeOnceVisible?: boolean
    }

    function useIntersectionObserver(
      elementRef: RefObject<Element>,
      {
        threshold = 0,
        root = null,
        rootMargin = '0%',
        freezeOnceVisible = false,
      }: Args,
    ): IntersectionObserverEntry | undefined {
      const [entry, setEntry] = useState<IntersectionObserverEntry>()

      const frozen = entry?.isIntersecting && freezeOnceVisible

      const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
        setEntry(entry)
      }

      useEffect(() => {
        const node = elementRef?.current // DOM Ref
        const hasIOSupport = !!window.IntersectionObserver

        if (!hasIOSupport || frozen || !node) return

        const observerParams = { threshold, root, rootMargin }
        const observer = new IntersectionObserver(updateEntry, observerParams)

        observer.observe(node)

        return () => observer.disconnect()

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [elementRef?.current, JSON.stringify(threshold), root, rootMargin, frozen])

      return entry
    }

    const Section = (props: { title: string }) => {
      const ref = useRef<HTMLDivElement | null>(null)
      const entry = useIntersectionObserver(ref, {})
      const isVisible = !!entry?.isIntersecting

      console.log(`Render Section ${props.title}`, { isVisible })

      return (
        <div
          ref={ref}
          style={{
            minHeight: '100vh',
            display: 'flex',
            border: '1px dashed #000',
            fontSize: '2rem',
          }}
        >
          <div style={{ margin: 'auto' }}>{props.title}</div>
        </div>
      )
    }

    export default function Component() {
      return (
        <>
          {Array.from({ length: 5 }).map((_, index) => (
            <Section key={index + 1} title={`${index + 1}`} />
          ))}
        </>
      )
    }
    ```

## 간단하게 라이브러리를 사용해보자([react-window](https://github.com/bvaughn/react-window))

-   [react-virtualized](https://github.com/bvaughn/react-virtualized)의 경량화 버전(27.4KB → 6.4 KB)

    -   개발자([Brian Vaughn](https://github.com/bvaughn))가 같다.. 조금 더 쉽고 편하게 쓰기 위해

    ```jsx
    const App = () => {
        const [images, setImages] = useState<IMG[]>([]);
        const getImages = useCallback(
            async () => {
                const result = await fetch("https://jsonplaceholder.typicode.com/photos");
                const data = await result.json()
                setImages(data);
            },
            [],
        );

        useEffect(() => {
            void getImages();
        }, [])

        const Row = ({index, style}: { index: number, style: React.CSSProperties }) => {

            const image = images[index];
            return (
                <div style={style} key={image.id}>
                        <h5>{image.title}</h5>
                        <img src={image.thumbnailUrl} alt={image.title}/>
                        <a href={image.url}>Link</a>
                </div>)
        }

        return (
            <div>
                {images.length > 0 &&
                    <List itemSize={193} height={1000} itemCount={35} width={836}>
                        {Row}
                    </List>}
            </div>
        );
    };
    ```

## 출처

-   [https://usehooks-ts.com/react-hook/use-intersection-observer](https://usehooks-ts.com/react-hook/use-intersection-observer)
-   [https://dev.to/praekiko/what-is-windowing-also-i-have-heard-about-react-window-and-react-virtualized-2ja7](https://dev.to/praekiko/what-is-windowing-also-i-have-heard-about-react-window-and-react-virtualized-2ja7)
-   [https://gusruss89.medium.com/super-simple-list-virtualization-in-react-with-intersectionobserver-ca340fe98a34](https://gusruss89.medium.com/super-simple-list-virtualization-in-react-with-intersectionobserver-ca340fe98a34)
