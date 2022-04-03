---
title:  "Error Boundary"
description: "Error Boundary에 대해서 알아보자"
draft: false
template: "post"
category : "react"
tags:
  - js
  - react
date: 2020-09-14 
---
## 렌더링 도중 'Life Cycle'에서 에러/예외가 발생한다면?

1. 애플리케이션 중단(모든 컴포넌트가 언마운트)
2. 잘못된 정보를 사용자에게 보여주는 것보다 아무것도 안 보여주는것이 더 나은 UX이기 때문

## 해결 및 방지책(Error Boundary 적용)

1. static getDerivedStateFromError와 componentDidCatch를 활용하여 에러를 처리할 수 있다.
    - 클래스 컴포넌트에서만 구현됬기때문에 함수형 컴포넌트에 적용불가
    - 현재는 Hook에 구현은 안되있지만, 업데이트나, 라이브러리로 지원 계획(공식 홈페이지)
2. 에러가 발생한다면, 위에 두 메서드를 구현한 가장 가까운 부모 컴포넌트를 찾는다.
    - static getDerivedStateFromError(error)
        - 에러 정보를 상태값에 저장해서 화면에 나타내는 용도로 사용된다.
    - componentDidCatch(error, info)
        - getDerivedStateFromError과 동일하게 에러 정보를 화면에 나타내는 용도로 사용되나,
        - 주로 서버로 전송하는 용도로 사용된다.
3. Root의 Error Boundary보다는 각 컴포넌트 그룹별로 구현한다
    - 페이스북 메신저는 사이드바, 정보 패널, 대화기록에 대해 각각 별도로 구현

```jsx
class ErrorBoundary extends React.Component{
	state = {error : null};
	
	static getDerivedStateFromErro(error){
		return {error};
	}
	
	componentDidCatch(error, info){
		sendToMyServer(error, info);
	}

	render(){
		const {error} = this. state;
		if(error){
			return <div>{error.toString()}</div>
		}
		return this.props.children;
	}
}

function App(){
	return (
		<ErrorBoundary>
			//...컴포넌트
		</ErrorBoundary>
	)
}
```

## ComponentDidCatch 메서드에서 에러를 서버로 전송하는 이유?

- 컴포넌트가 실제 돔에 반영될때 보내기 때문에 한번만 보낸다. (커밋단계)
- 렌더링 중 에러를 서버로 보내게 된다면, 같은 정보를 여러번 보낼 수 있기때문 (렌더단계)
- 리액트에서 데이터 변경에 의한 화면 업데이트 렌더 단계와 커밋 단계를 거친다.
    - 렌더단계 : 실제 돔에 반영할 변경 사항을 파악
    - 커밋단계 : 파악된 변경 사항을 실제 돔에 반영
- 커밋 단계의 메서드(렌더 단계의 메서드는 커밋단계를 제외하고 전부다)
    - getSnapshotBeforeUpdate
    - componentDidMount
    - componentDidUpdate
    - componentDidCatch

## Error Boundary로 포착하지 못하는 에러

1. 이벤트 핸들러
    - 사용자의 입력(즉, 비동기적인 작업)에 의해 생기는 오류는 생명주기와 연관이 없으므로 포착 불가
    - 이벤트 핸들러 내부에서 try/catch구문을 통하여 error의 상태값을 업데이트하여 포착하게 한다.
2. 비동기적 코드(setTimeout or requestAnimationFrame의 콜백함수)
3. 서버사이드 렌더링
4. Error Boundary를 구현한 컴포넌트에서 발생한 에러

## 컴포넌트 에러 스택

1. Create React App 프로젝트내에서 기본적으로 작동한다.
2. 콘솔을 통해 어떤 컴포넌트(파일이름, 줄번호)에서 에러가 발생했는지 출력해준다.
    - 컴포넌트 이름은 [Function.name](http://function.name) 프로퍼티에 따라 보여준다.

![error stack](https://reactjs.org/static/45611d4fdbd152829b28ae2348d6dcba/1e088/error-boundaries-stack-trace-line-numbers.png)
