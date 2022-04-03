---
title:  "프로토타입과 프로토타입 체인"
description: "프로토 타입에 관해.."
draft: false
template: "post"
category : "js"
tags:
  - js
date: 2020-07-16
---
## 프로토타입
- 정의 : 프로토 타입 == 원형 객체의 원형을 말함
- 자바스크립트 내에서는 유일한 생성자는 객체이다. 함수 또한 객체이기 때문이다.

## 프로토 타입은 언제 생길까?
  - 함수가 생성되면 함수의 Prototype이 같이 생성됨
  - Prototype 생기면서 __proto__ 동시에 생김(프로토 타입의 부모)
      ```js
      function Foo(){};


      let foo = new Foo();

      foo
        - Foo()
          - Constructor() // 프로토타입
          - __proto__ // 프로토 타입의 프로토타입 << 부모를 뜻함

      ```

## 프로토타입 체인은 무엇인가요?
  - 현재 객체에서 해당 변수나 메서드가 없으면 프로토타입을 확인하고 프로토타입에도 없으면 프로토타입의 프로토타입을 찾아 올라간다(체인)
  - 자바스크립트는 최상위 오브젝트는 Object이고 그 이후에는 null이기 때문에 종료조건은 __proto__ === null 이면 종료를 하고 undefined를 리턴한다.
      ```js
      let f = function () {
          this.a = 1;
          this.b = 2;
      }
      let o = new f(); // {a: 1, b: 2}

      // f 함수의 prototype 속성 값들을 추가 하자.
      f.prototype.b = 3;
      f.prototype.c = 4;

      console.log(o.z) // undefiend

      // 1. f() 생성자의 프로퍼티 확인
      // 2. 없다면 f().prototype 확인
      // 3. 없다면  f().prototype.prototype 확인
      // 4. 상위 프로토타입까지 찾고 null이면 undefined를 리턴한다.
      ```
## 클래스 문법은 프로토 타입과 다르게 상속으로 이루어져 있지 않나요?
  - 결론을 말하자면 자바스크립트는 프로토타입으로 구현한 상속을 구현한 것이지 자바처럼 상속을 지원하지 않는다(단순한 문법설탕 같은거)
  - 자바스크립트로 구현할 수 있는 상속은 총 3가지 위임형 상속, 연결형 상속, 함수형 상속이 있다.
  - 위임형 상속 : 프로토타입에 함수를 정의하여 메모리를 절약할 수 있다. 단점은 프로토타입이 변경되면 모든 메소드가 변경되어 위험하다.
      ```js
      class Greeter {
          constructor (name) {
            this.name = name || 'John Doe';
          }
          hello () {
            return `Hello, my name is ${ this.name }`;
          }
        }

        const george = new Greeter('George');
        const msg = george.hello();
        console.log(msg); // Hello, my name is George
      ```
  - 연결형 상속 : 프로토타입을 인용하는게 아니라 protytype을 꺼내어 하나의 객체를 만드는 것이다.
      ```js
      const proto = {
        hello: function hello() {
            return `Hello, my name is ${ this.name }`;
          }
        };

        const george = Object.assign({}, proto, {name: 'George'});
        const msg = george.hello();
        console.log(msg); // Hello, my name is George
      ```
  - 함수형 상속 : 기존 객체를 확장 시키며, 클로져를 통해 구현
    ```js
    const rawMixin = function () {
    const attrs = {};
    return Object.assign(this, {
          set (name, value) {
            attrs[name] = value;
            this.emit('change', {
              prop: name,
              value: value
            });
          },
          get (name) {
            return attrs[name];
          }
        }, Events.prototype);
      };

      const mixinModel = (target) => rawMixin.call(target);
      const george = { name: 'george' };
      const model = mixinModel(george);
      model.on('change', data => console.log(data));
      model.set('name', 'Sam');
      /*
      {
        prop: 'name',
        value: 'Sam'
      }
      */
    ```

## static 문법은 무엇인가요?
  - 인스턴스 없이 호출이 가능한 함수 주로 유틸함수에 많이 사용된다.
    ```js
    class Hello{
      static foo(){
          console.log('hello static')
      }
    }

    Hello.foo() // hello static

    let bar = new Hello();

    bar.foo() // uncatch typeErrors
    ```
