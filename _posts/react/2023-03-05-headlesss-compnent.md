---
title:  "공통 컴포넌트에 대해서"
description: "UI Component vs Headless Component에 대해서 정리"
draft: false
template: "post"
category : "react"
tags:
  - react
date: 2023-03-05
---
## 0. 작성하게 된이유

- 공통 컴포넌트란 어떻게 구성해야 하는걸까?
- 공통 컴포넌트지만, 디자인이 다르다.. 방법을 찾기 위해..
- Headless Component에 대해서 정리

## ****TL;DR****

- 공통 컴포넌트를 만들때
    - UI Component : UI 변경 여부가 적다면,
    - HeadLess Component: UI 변경이 많고, 기능이 동일하다면
- HeadLess Component란?
    - UI가 없이 기능만 있는 컴포넌트
    - 라이브러리 : [headlessui](https://headlessui.com/), [React Aria](https://react-spectrum.adobe.com/react-aria/index.html), [radix-ui](https://www.radix-ui.com/), [Reach UI](https://reach.tech/)
- React-Window도 HeadLess Component다…

## 1. 공통 Component란?

- 재사용 가능 컴포넌트(소프트웨어 요소)
- 장점 :  재사용성이 향상되어 개발기간이 단축된다(반복적인 작업 x)
- 주의사항
    - 컴포넌트 설계시, Props에 대한 의존성이 생길 수 있으므로, 단순하게 해야 한다.
        - **기능은 단순하게**!
        - **Props는 필수적인것만**!
    - 재사용이라고 공통 컴포넌트를 만들었지만, 재사용이 안될수도 있다(코드 파편화..?)
        - 문서화를 통해(**팀원들에게 공유 필수**), 만들지말고, 있는걸 사용하도록 하자!!
    - 만약, 공통 컴포넌트를 수정하게 된다면, 기존의 코드를 전부 테스트해야 한다.

## 2.  공통 UI Component랑... 스타일이 다르다..  💩

### 1) **문제 발생**

- 공통 UI 컴포넌트에서 스타일을 수정해야 한다..

    ```tsx
    const CheckBox = ({ checked, onChange, label }: CheckBoxProps) => {
      return (
        <S.Label>
          <S.Input type="checkbox" checked={checked} onChange={onChange} />
          <S.Check />
          {label && <span>{label}</span>}
        </S.Label>
      );
    };
    ```


### 2) 해결책??

- `CheckBoxWrapper`를 통해 Style을 수정해주자!

    ```tsx
    <S.CheckBoxWrapper>
        <CheckBox checked={checked} onChange={onChange} label="!21121" />
    </S.CheckBoxWrapper>
    
    const CheckBoxWrapper = styled.div`
      input[type="checkbox"] {...}
      label {...}
    `;
    ```


## 3. 만약.. 공통 컴포넌트의 구조(MarkUp) / 스타일(css)가 달라진다면…?

### 1) 우리가 해야 할일…?

- [StoryBook](https://storybook.js.org/), Test Code가 있다면.. Quick하게 할것 같은데..?
    - 스타일 적용여부(storybook)
    - 기능 작동 여부(jest)
- 하지만.. 우리회사는 StoryBook은 사용 X ..(눈으로 확인해야지)

### 2) 공통 컴포넌트라고 만들었지만.. 재사용성이 ⬇️

- 이슈가 쌓인다면.. 공통 컴포넌트의 신뢰가 떨어질 것같다.

## 4. UI 컴포넌트는 재사용성과 효율성 높지만, 스타일 변화에 취약하다

### 1) UI 컴포넌트는 재사용성과 효율성 높인다(무조건 문제 ❌)

- Wrapper를 통해 스타일 문제를 해결 있다!
- Style 관련 Props를 추가하여 스타일을 동적으로 추가하여 문제를 해결 할 수 있다.

### 2) 스타일 변화가 많은 컴포넌트는 별도로 만들까?

- 기능은 있고, 스타일만 내가 만들어서 쓰면 안될까?
- 물론.. 이러한 문제를 해결하기 위해.. **Headless Component 가 이미 있다**
- 라이브러리 ([headlessui](https://headlessui.com/), [React Aria](https://react-spectrum.adobe.com/react-aria/index.html), [radix-ui](https://www.radix-ui.com/), [Reach UI](https://reach.tech/))

## 5. Headless Component란?

### 1) 정의

- Headless Component는 UI가 없이 기능만 있는 컴포넌트입니다.
- Headless Component를 사용하면 마크업과 스타일을 자유롭게 할 수 있습니다.
- Headless Component는 디자인 없이 기능만 필요한 경우에 사용됩니다.

### 2) 코드

- 기능만 있다 → 상태와 상태를 제어하는 함수만 제공한다
- 간단하게 Hook을 통해서 구현 할 수도 있다.

    ```tsx
    const useCheckbox = () => {
      const [isChecked, setIsChecked] = useState(false)
    
      return {
        isChecked,
        onChange: () => setIsChecked(!isChecked),
      }
    }
    
    function App() {
      const { isChecked, onChange } = useCheckbox()
      return (
        <label>
          <input type="checkbox" checked={isChecked} onChange={onChange} />
          <span>체크박스 만들기</span>
        </label>
      )
    }
    ```


### 3) 여러가지 패턴의 Headless Component

- **Compound Component**
    - 같이 사용되는 컴포넌트 상태를 공유할 수 있게 만들어주는 컴포넌트

    ```tsx
    const ToggleContext = React.createContext();
    
    function Toggle({ children }) {
      const [on, setOn] = useState(false);
    
      const toggle = () => setOn(!on);
    
      return (
        <ToggleContext.Provider value={{ on, toggle }}>
          {children}
        </ToggleContext.Provider>
      );
    }
    
    function ToggleButton() {
      return (
        <ToggleContext.Consumer>
          {({ on, toggle }) => (
            <button onClick={toggle}>
              {on ? 'ON' : 'OFF'}
            </button>
          )}
        </ToggleContext.Consumer>
      );
    }
    ```

- **Children Prop Pattern**

    ```tsx
    type CheckBoxProps = {
      isChecked: boolean;
      onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    };
    const CheckBox = (props: {
      children: (props: CheckBoxProps) => JSX.Element;
    }) => {
      const [checked, setChecked] = useState(false);
    
      if (typeof props.children !== "function") {
        throw new Error("children must be a function");
      }
    
      return (
        <>
          {props.children({
            isChecked: checked,
            onChange: () => setChecked(!checked),
          })}
        </>
      );
    };
    
    <CheckBox>
        {({ isChecked, onChange }) => (
          <div>
            <input type="checkbox" checked={isChecked} onChange={onChange} />
            <span>약관에 동의합니다.</span>
          </div>
        )}
    </CheckBox>
    ```


## 6. 기존에 모르고 사용했던 Headless Component

### React-Window

- Virtuallized **기능**만 제공할뿐 **UI**는 없다

    ```tsx
    import { FixedSizeList as List } from 'react-window';
     
    const Row = ({ index, style }) => (
      <div style={style}>Row {index}</div>
    );
     
    const Example = () => (
      <List
        height={150}
        itemCount={1000}
        itemSize={35}
        width={300}
      >
        {Row}
      </List>
    );
    Column 0Column 1Column 2Column 3Column 4Column 5
    Try it on CodeSandbox
    import { FixedSizeList as List } from 'react-window';
     
    const Column = ({ index, style }) => (
      <div style={style}>Column {index}</div>
    );
     
    const Example = () => (
      <List
        height={75}
        itemCount={1000}
        itemSize={100}
        layout="horizontal"
        width={300}
      >
        {Column}
      </List>
    );
    ```


## 참고

- [https://medium.com/@nirbenyair/headless-components-in-react-and-why-i-stopped-using-ui-libraries-a8208197c268](https://medium.com/@nirbenyair/headless-components-in-react-and-why-i-stopped-using-ui-libraries-a8208197c268)
- [https://www.howdy-mj.me/design/headless-components](https://www.howdy-mj.me/design/headless-components)
