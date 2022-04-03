---
title:  "Render Props"
description: "Render Props에 대해서 알아보자"
draft: false
template: "post"
category : "react"
tags:
  - js
  - react
date: 2020-12-06
---
### 1. Render Prop?

- props의 이름이 render.
- render는 해당 컴포넌트의 state를 props로 내린다.
- render prop은 무엇을 렌더링할지 컴포넌트에 알려주는 함수

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

### 2. 사용하는 이유?

- React 컴포넌트 간에 코드를 공유하기 위해
- Cross-Cutting Concerns을 위해 **(공통된 로직을 재사용하기 위해)**
  - 컴포넌트는 React에서 코드의 재사용성을 위해 사용하는 주요 단위
  - 컴포넌트에서 캡슐화된 상태나 동작을 같은 상태를 가진 다른 컴포넌트와 공유하는 방법이 항상 명확하지 않다.

### 3. 예제를 통해 이해하자

- 마우스 위치 추적 컴포넌트

```jsx
class MouseTracker extends React.Component {
 state = { x: 0, y: 0 };
  

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

- 마우스에 대한 로직은 분리 시키자
  - Mouse 컴포넌트는 마우스에 대한 행위를 `캡슐화`

      ```jsx
      class Mouse extends React.Component {
        state = { x: 0, y: 0 };
        

        handleMouseMove = (event) => {
          this.setState({
            x: event.clientX,
            y: event.clientY
          });
        }

        render() {
          return (
            <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
              <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
            </div>
          );
        }
      }

      class MouseTracker extends React.Component {
        render() {
          return (
            <>
              <h1>Move the mouse around!</h1>
              <Mouse />
            </>
          );
        }
      }
      ```

- P 태그가 아닌 고양이 사진을 넣어주려면?
  - 오로직 Cat 컴포넌트만 사용할 뿐 재사용하려면 계속해서 WithSomething을 만들어줘야한다.

      ```jsx
      class Cat extends React.Component {
        render() {
          const mouse = this.props.mouse;
          return (
            <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
          );
        }
      }

      class MouseWithCat extends React.Component {
        state = { x: 0, y: 0 };
        

        handleMouseMove = (event) => {
          this.setState({
            x: event.clientX,
            y: event.clientY
          });
        }

        render() {
          return (
            <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

              {/*
                여기서 <p>를 <Cat>으로 바꿀 수 있습니다. ... 그러나 이 경우
                Mouse 컴포넌트를 사용할 때 마다 별도의 <MouseWithSomethingElse>
                컴포넌트를 만들어야 합니다, 그러므로 <MouseWithCat>는
                아직 정말로 재사용이 가능한게 아닙니다.
              */}
              <Cat mouse={this.state} />
            </div>
          );
        }
      }

      class MouseTracker extends React.Component {
        render() {
          return (
            <div>
              <h1>Move the mouse around!</h1>
              <MouseWithCat />
            </div>
          );
        }
      }
      ```

- render Props를 통해 동적으로 렌더링을 할 수 있게 만들어주자
  - Mouse 역할 : 마우스 위치만 건네줄뿐!!! render는 props의 render값이 할 것!

      ```jsx
      class Cat extends React.Component {
        render() {
          const mouse = this.props.mouse;
          return (
            <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
          );
        }
      }

      class Mouse extends React.Component {
        state = { x: 0, y: 0 };
        

        handleMouseMove = (event) => {
          this.setState({
            x: event.clientX,
            y: event.clientY
          });
        }

        render() {
          return (
            <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

              {/*
                <Mouse>가 무엇을 렌더링하는지에 대해 명확히 코드로 표기하는 대신,
                `render` prop을 사용하여 무엇을 렌더링할지 동적으로 결정할 수 있습니다.
              */}
              {this.props.render(this.state)}
            </div>
          );
        }
      }

      class MouseTracker extends React.Component {
        render() {
          return (
            <div>
              <h1>Move the mouse around!</h1>
              <Mouse render={mouse => (
                <Cat mouse={mouse} />
              )}/>
            </div>
          );
        }
      }
      ```

  ### 주의사항

  - React.PureComponent에서 render props pattern을 사용할 땐 주의해주세요.
  - 얕은 prop 비교는 새로운 prop에 대해 항상 false를 반환합니다.
  - 이 경우 render마다 render prop으로 넘어온 값을 항상 새로 생성합니다.

    ```jsx
    class Mouse extends React.PureComponent {
      // 위와 같은 구현체...
    }
    class MouseTracker extends React.Component {
      render() {
        return (
          <div>
            <h1>Move the mouse around!</h1>

            {/*
              이것은 좋지 않습니다! `render` prop이 가지고 있는 값은
              각각 다른 컴포넌트를 렌더링 할 것입니다.
            */}
            <Mouse render={mouse => (
              <Cat mouse={mouse} />
            )}/>
          </div>
        );
      }
    }
    ```

  - 이 예제에서 <MouseTracker>가 render 될때마다, <Mouse render>의 prop으로 넘어가는 함수가 계속 새로 생성됩니다. 따라서 React.PureComponent를 상속받은 <Mouse> 컴포넌트 효과가 사라지게 됩니다.

    ```jsx
    class MouseTracker extends React.Component {
      // `this.renderTheCat`를 항상 생성하는 매서드를 정의합니다.
      // 이것은 render를 사용할 때 마다 *같은* 함수를 참조합니다.
      renderTheCat(mouse) {
        return <Cat mouse={mouse} />;
      }

      render() {
        return (
          <div>
            <h1>Move the mouse around!</h1>
            <Mouse render={this.renderTheCat} />
          </div>
        );
      }
    }
    ```
