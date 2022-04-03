---
title:  "TypeScript 기본타입과 interface"
description: "기본타입과 interface 관해서"
draft: false
template: "post"
category : "js"
tags:
  - js
date: 2020-07-29
---

## 1. 타입스크립트란?
  1. 정의
      - 타입스크립트를 컴파일하면 자바스크립트가 된다(자바스크립트의 확장판).
      - 어떤 OS, Browser, Host의 상관없이 작동한다.

  2. 이점
      - 생산성 : 타입을 통해 static checking and code refactoring이 간편해져 생산성을 높게 만들어준다.
      - 코드에 대한 높은 이해 : 타입을 통해 소프트웨어 구성 요소 간(지역변수, 매개변수, 리턴타입)의 인터페이스를 정의하고 기존 자바스크립트 라이브러리의 동작에 대한 높은 이해.
      - 호환성 : 자바스크립트의 최신 문법을 사용해도 컴파일 되면 ECMAScript 3 (or newer)로 변환되기 때문에 안심하고 써도 된다.

## 2. 기본타입
  1. Boolean
  2. Number
      - floating point value(자바스크립트의 number 특징과 동일)
  3. String
      - ', ", ` 의 value는 string type
      - 템플릿 문자열(``)의 expression은 값이 나오고 string으로 정의된다.
  4. Array
      - 타입을 정의하는 두가지 방법이 있으며, 동일하다.
        ```js
        let list: number[] = [1, 2, 3];

        let list: Array<number> = [1, 2, 3];
        ```
  5. Tuple
      - 고정된 배열이며, 각 요소의 타입을 정의해놓은것
        ```js

        // 방법1
        let arr : [string, number]

        // 방법2
        let arr: {
            0: string,
            1: number
        }


        arr = ['hello foo', 1];
        arr = ['typeIsOk', 'ThisIndexTypeisNumber So error occurrence'] // 2번째 요소의 타입이 맞지 않아 에러 발생
        ```
  6. Enum
      - 키들의 집합이며, 순서가 있지만(default : 0 시작) 변경가능
      - 키들의 value는 문자열이나, 숫자만 사용가능
        ```js
        enum Color {Red, Green, Blue}
        enum Color {Red = 1, Green, Blue}
        enum Color {Red = 1, Green = 2, Blue = 4}
        ```    
  7. Any : 자바스크립트처럼 작동한다. 타입이 유동적으로 변경된다.
  8. Void : 함수의 결과값을 정의하는데 return 값이 없다고 명시해주는 것
  9. Null and Undefined
  10. Never : 함수끝에 도달 할 수 없다(에러 및 무한 루프시)
      ```js
      // 에러를 발생하기 때문에 함수안의 코드를 다 실행 못 시킬시
      function error(message: string): never {
          throw new Error(message);
      }

      // 에러가 리턴 될때
      function fail() {
          return error("Something failed");
      }

      // 무한루프시
      function infiniteLoop(): never {
          while (true) {
          }
      }
      ```
  11. Object
  12. Type assertions
      ```js
      let someValue: any = "this is a string";
      let strLength1: number = (<string>someValue).length;
      let strLength2: number = (someValue as string).length;
      ```
      
## 3. Interface
  1. 정의
      - 인터페이스에 정의된 속성, 타입의 조건만 만족한다면 객체의 속성 갯수가 더 많아도 상관 없다는 의미. 또한, 인터페이스에 선언된 속성 순서를 지키지 않아도 됩니다

  2. 예졔
      ```js
      interface LabeledValue {
          label: string;
      }

      function printLabel(labeledObj: LabeledValue) {
          console.log(labeledObj.label);
      }

      let myObj = {size: 10, label: "Size 10 Object"};
      printLabel(myObj); // myObj의 size는 정의하지 않았지만, 에러가 발생하지 않는다.
      ```
  3. interface Optional Properties
      ```js
      interface OptionValue {
        // 속성을 선택적으로 적용
        color?: string;
        width?: number;

        // 상수 / const 처럼 적용
        readonly x: number;
        readonly y: number;
        
        //정의하지 않은 속성들을 추가로 사용하고 싶을때
        [propName: string]: any;

        //함수를 정의할때는 매개변수와 반환값을 정의
        (source: string, subString: string): boolean;
      }
      ```
  4. implements 와 extends
      - class에 interface implements
        ```js
        interface ClockConstructor {
          new (hour: number, minute: number);
        }

        class Clock implements ClockConstructor {
            currentTime: Date;
            constructor(h: number, m: number) { }
        }

        ```

      - interface에 interface를 extends로 확장 가능(다중 interface 확장 가능)
        ```js
        interface Shape {
          color: string;
        }

        interface PenStroke {
            penWidth: number;
        }

        interface Square extends Shape, PenStroke {
            sideLength: number;
        }
        ```

