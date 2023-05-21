---
title: '코드스피치 ES6+ 디자인패턴과 뷰패턴 1회차 정리'
description: '코드스피치 강의 ES6+ 디자인패턴과 뷰패턴 1회차 정리'
draft: false
template: 'post'
category: 'js'
tags:
    - js
date: 2021-02-10
---

> 데이터를 활용하여, 테이블로 표현해보자

### 0. 데이터 분석

-   테이블 명 : title
-   column : header
-   row : Items (2차원 배열)

```json
{
    "title": "TIOBEIndex for June 2017",
    "header": [
        "Jun-17",
        "Jun-16",
        "Change",
        "Programming Language",
        "Ratings",
        "Change"
    ],
    "items": [
        [1, 1, "", "Java", "14.49%", "-6.30%"],
        [2, 2, "", "C", "6.85%", "-5.53%"],
        [3, 3, "", "C++", "5.72%", "-0.48%"],
        [4, 4, "", "Python", "4.33%", "0.43%"],
        [5, 5, "", "C#", "3.53%", "-0.26%"],
        [6, 9, "", "change", "Visual Basic .NET", "3.11%", "0.76%"],
        [7, 7, "", "JavaScript", "3.03%", "0.44%"],
        [8, 6, "change", "PHP", "2.77%", "-0.45%"],
        [9, 8, "change", "Perl", "2.31%", "-0.09%"],
        [10, 12, "change", "Assembly language", "2.25%", "0.13%"],
        [11, 10, "change", "Ruby", "2.22%", "-0.11%"],
        [12, 14, "change", "Swift", "2.21%", "0.38%"],
        [13, 13, "", "Delphi/Object Pascal", "2.16%", "0.22%"],
        [14, 16, "change", "R", "2.15%", "0.61%"],
        [15, 48, "change", "Go", "2.04%", "1.83%"],
        [16, 11, "change", "Visual Basic,2.01%", "-0.24%"],
        [17, 17, "", "MATLAB", "2.00%", "0.55%"],
        [18, 15, "change", "Objective-C", "1.96%", "0.25%"],
        [19, 22, "change", "Scratch", "1.71%", "0.76%"],
        [20, 18, "change", "PL/SQL", "1.57%", "0.22%"]
    ]
}
```

---

### 1. 코드 구현

1. **코드(함수명, 변수명)를 보고 의도를 파악할 수 있어야 한다 → 어떻게 동작할지**

    - 프로그래밍을 한다는 것은 나만의 단어와 의미체계를 만드는것
    - 코드 설명

        - private 변수 때문에 클로져로 구현(class만 알고 있어야 되는 것)
        - 클로져 상태의 클래스가 리턴하는 방식으로 하기 위해서 즉시실행함수 구현

            ```jsx
            //<section id="data"></section>

            const Tabel = ((_) => {
                return class {}
            })()
            const table = new Table('#data')
            table.load('71_1.json')
            ```

2. **코드를 사용하는 부분(호출하는 부분)을 먼저 작성한다** → 시나리오 작성 (의도를 만들고)
    - 호출하는 부분에서 이상이 있다면, 구현도 이상하다
    - 테스트 주도 개발과 비슷하다 사용할 코드를 만들고 → 구현
3. **그 다음**, 함수나 클래스를 구현해야 한다

    - 이유 1 - 구현된 클래스나 함수로 내가 안 짤수도 있다.
    - 이유 2 - 라이브러리나 사수가 짜줄수도 있기 때문

        ```jsx
        const Table = ((_) => {
            const Private = Symbol()
            return class {
                constructor(parent) {}

                async load(url) {}
            }
        })()
        const table = new Table('#data')
        table.load('71_1.json')
        ```

4. **구현을 하면서, 생각/로직을 확장한다.**

    - 데이터가 load되면 화면에 render 된다는 프로세스를 알고 있기때문에 render메소드를 구현
    - 데이터를 로딩하는것(load) ≠ 그림을 그리는 것(render) → 역할이 다름
        - load와 render 메소드를 별도 구현
    - table.load 밑에 render를 호출해주지 않을까?

        - load가 언제 완료될지 모르니까(비동기 로직)

        ```jsx
        const Table = ((_) => {
            const Private = Symbol()
            return class {
                constructor(parent) {}

                async load(url) {}
                render() {}
            }
        })()
        const table = new Table('#data')
        table.load('71_1.json')
        ```

5. **상세구현을 하기전에, 우리는 하고싶은일을 명시적으로 적는 일부터 하자!!**

    - 주석은 보장해주지 않는다 (오라클도 주석과 코드가 다르다)
        - 레거시 코드나 라이브러리를 보고 이걸 만든 의도로 파악해보자
    - 코드가 느려질 생각하지도 말고, 무조건 말을 코드로 만드는 연습을 하자
    - 부모가 될 셀렉터 문자열을 코드로 표현하면 아래와 같다

        ```jsx
        constructor (parent) {
                  if (typeof parent != 'string' || !parent) throw 'invalid param';
                  this[Private] = {parent};
                }
        ```

    - 내장을 보이기 싫다면,Symbol이나 WeakMap을 활용해보자(최대한 노력해보자)
    - 누군가 내장을 건드려서 바꿔서 사고가 나도, 잘못을 후회해도 소용없다.

        ```jsx
        const Private = Symbol();
        return class{
          constructor (parent) {
            if (typeof parent != 'string' || !parent) throw 'invalid param';
            this[Private] = {parent};
          }
        ```

    > 함수의 값을 넘기는 방법은 인자와 전역변수(지역참조)를 활용하는 것

    - 클래스 안에서의 내부함수(메서드)라면 **지역참조를 해야한다(클래스 변수)**
    - 지역참조 : 컨텍스트 ⇒ 인스턴스의 것만 참조해!!!

        - 클래스 안에 있는 메서드는 함수가 아니다.
        - 메서드란 인스턴스의 상태를 공유하는 함수의 집합이다.
        - \_render()함수로 인자로 보내지 않는 이유는 \_render는 메서드이기 때문이다.

        ```jsx
        Object.assign(this[Private], { title, header, items })
        this._render()
        ```

6. **외부의 노출되는 함수라면**, 외부에서 사용될거라면 인자를 받아서 처리한다.

    - 인자를 넘기면 값이 화이트리스트인지 아닌지 모르기 때문에 매번 validation을 해줘야한다.

7. **코드를 작성하기전,** 한번 중간언어로 고치자(의사코드)

    - 우리는 한국말이 편하다 하지만 순서가 이상해도 의미가 전달된다.
    - 하지만 컴퓨터는 그렇지 못하다

8. **의사코드란,** 해야할일이 아니라!!! 순서대로 할일!!

    - 부모, 데이터 체크

        - 왜 여기서 부모를 체크하나? render할때만 부모를 체크하면 된다
        - 부모가 통과하지 못하면 아래를 실행할 필요가 없으니까

        ```jsx
         _render () {
                // 부모, 데이터 체크
                // table 생성
                // 캡션을 title로
                // header를 thead로
                // items를 tr로
                // 부모에 table 삽입
              }
        ```

### 3. 코드 완성본(1차)

```jsx
const Table = ((_) => {
    const Private = Symbol()
    return class {
        constructor(parent) {
            if (typeof parent != 'string' || !parent) throw 'invalid param'
            this[Private] = { parent }
        }

        async load(url) {
            const response = await fetch(url)
            if (!response.ok) throw 'invalid response' // 데이터 validation
            const json = await response.json()
            const { title, header, items } = json
            if (!items.length) throw 'no items' //데이터 validation
            Object.assign(this[Private], { title, header, items })
            this._render()

            // Promise 기반
            // fetch(url).then(response => {
            //   return response.json();
            // }).then(json => {
            //   this._render();
            // })
        }

        _render() {
            // 부모, 데이터 체크
            const fields = this[Private],
                parent = document.querySelector(fields.parent)
            if (!parent) throw 'Invalid parent'
            if (!fields.items || !fields.items.length) {
                //이 부분은 데이터가 검증하는 부분과 동일하다!!! 반응하는 로직인데!! 중복이다!!
                parent.innerHTML = 'no data'
                return
            } else parent.innerHTML = ''
            // table 생성
            // 캡션을 title로
            const table = document.createElement('table')
            const caption = document.createElement('caption')
            caption.innerHTML = fields.title
            table.appendChild(caption)
            // header를 thead로
            table.appendChild(
                fields.header.reduce((thead, data) => {
                    const th = document.createElement('th')
                    th.innerHTML = data
                    thead.appendChild(th)
                    return thead
                }, document.createElement('thead'))
            )
            // items를 tr로
            // 부모에 table 삽입

            parent.appendChild(
                fields.items.reduce((table, row) => {
                    table.appendChild(
                        row.reduce((tr, data) => {
                            const td = document.createElement('td')
                            td.innerHTML = data
                            tr.appendChild(td)
                            return tr
                        }, document.createElement('tr'))
                    )
                    return table
                }, table)
            )
        }
    }
})()
const table = new Table('#data')
table.load('71_1.json')
```

---

### 0. 프로그래밍 세계에서 유일하게 변하지 않는 원칙

> 모든 프로그램은 변한다

-   이미 작성된 복잡하고 거대한 프로그램을 어떻게 변경할 수 있을 것인가?
-   바꿀 수 없다 → 다시 짠다 → 야근 → 요구사항 변경 → 롤백 → 야근

> 격리(Isolation) : Something 변화, Something Else 영향 X

-   격리 기본 전
    1. load 보다는 render가 변화율이 높다!
        - render가 변하면 Table클래스가 전체 영향이 받는다.
    2. 변환율이란 시간적인 대칭성
        - 변화의 원인과 주기별로 정리

> 실천수칙 : 강한 응집성 & 약한 의존성

-   Q. 데이터로딩을 왜 테이블에서 하지?? 강한 응집력이 때문에???
    -   A. 테이블은 로딩을 가질 역할/책임이 없다.
    -   A. 덩어리에서 어떻게 코드를 분리할것인가? → 역할을 기준으로 분리하자!!!
    -   A. 렌더링을 플랫폼 별로 나누어주자

`Rendeing을 도메인이라고 정의한다 (중립적인 렌더링) ⇒ 도메인 패턴`

---

### 1. 코드구현

1. **역할 분리**

    - Loader 역할 : 데이터를 받아서 json으로 만들어주는 역할
    - Renderer 역할 : json은 데이터를 받아서 그려주는 역할만 한다.
    - Loader와 Renderer는 분리되었기 때문에 인자로 보내는게 정답!! 별도의 객체이기 때문이다.

        ```jsx
        const loader = new Loader('71_1.json')
        loader.load((json) => {
            const renderer = new Renderer()
            renderer.setDate(json)
            renderer.render()
        })
        ```

2. **데이터의 화이트리스트(VO ⇒ Value Object)**

    - json 은 검증되지 않는 값 (화이트데이터를 보내줘야하는데 블랙데이터를 보내고 있다)
    - 정리되고 안정성이 되어 있는 데이터(VO)를 보내준다(value Object)

        ```jsx
        const data = new JsonData('71_1.json')
        const renderer = new Renderer()
        renderer.render(data)
        ```

3. **Data Load ⇒ Data Supply로 역할이 변경 되었다.**

    - 데이터 로드 : 작은역할
    - 주요한 역할 : 데이터를 제공
    - 렌더러에게 데이터를 제공해주는것이니까 이름을 바꾼다 ⇒ 역할이 바뀐다

4. **역할 모델 구현**

    - Loader ⇒ JsonData로 바꿨다.

        (Data 추상객체 ⇒ (JSON 서브객체)

    - 본질적인 로직은 Data 인터페이스(추상객체)가 있고, 파싱로직만 다른 서브 객체 이런게 역할모델이다(이름으로 추정한다)
    - 알고리즘이란 제어로직과 변수를 이용하여 원하는 값을 원하는것
    - 오브젝트가 메세지를 통해서 문제를 해결한다
    - 이러한 메세지를 객체망을 통해 통신한다

5. **타입체크 및 내부 프로토콜**

    - JsonData.protype ⇒ Data 이며, instanceof를 통해 해당 type을 체크하면서 유효성 검사를 대신한다.
        - 각각의 객체끼리는 타입으로 통신해야 한다(프로토콜 === VO)
        - 두 객체가 통신할때, 어떠한 약속을 한다 (프로토콜) ⇒ 어떠한 데이터가 온다
        - 객체의 타입이 존재하는 이유는 타입으로 알고리즘을 대체한다.(유효성 검증을 대신한다)
        - instanceof(타입체크)를 통해 유효성 검사를 해준다. 타입이 아니면 에러발생
        - 강타입을 특성을 활용한 type 프로그래밍 보증한다!!
    - getData가 async면 getData를 사용하는곳도 async로 되어있어야 한다(async 전파)

    ```jsx
    const Data = class {
        async getData() {
            throw 'getData mush Overide'
        }
    }

    const JsonData = class extends Data {
        constructor(data) {
            super()
            this._data = data
        }

        async getData() {
            if (typeof this._data === 'string') {
                const response = await fetch(this._data)
                return await response.json()
            } else return this._data
        }
    }

    const Renderer = class {
        constructor() {}
        async render(data) {
            if (!(data instanceof Data)) throw 'invalid data type'
            const json = await data.getData()
            console.log(json)
        }
    }
    ```

    - 내부 프로토콜인 info 역할로 유효성 화이트리스트에 대한 책임이 넘어간다.

    ```jsx
    const Info = class {
        constructor(json) {
            const { title, header, items } = json
            if (typeof title != 'string' || !title) throw 'invalid title'
            if (!Array.isArray(header) || !header.length) throw 'invalid header'
            if (!Array.isArray(items) || !items.length) throw 'invalid items'
            items.forEach((v, idx) => {
                if (!Array.isArray(v) || v.length != header.length) {
                    throw 'invalid items : ' + idx
                }
            })
            this._private = { title, header, items }
        }
        get title() {
            return this._private.title
        }
        get header() {
            return this._private.header
        }
        get items() {
            return this._private.items
        }
    }

    const Data = class {
        async getData() {
            throw 'getData mush Overide'
        }
    }

    const JsonData = class extends Data {
        constructor(data) {
            super()
            this._data = data
        }

        async getData() {
            let json
            if (typeof this._data === 'string') {
                const response = await fetch(this._data)
                json = await response.json()
            } else json = this._data
            return new Info(json)
        }
    }

    const Renderer = class {
        constructor() {}
        async render(data) {
            if (!(data instanceof Data)) throw 'invalid data type'
            const info = await data.getData()
            console.log(info.title, info.header, info.items)
        }
    }
    ```

6. **계약에 대해서(내부/외부)**

    - Data클래스의 getData()는 info를 보장하지 않는다.(계약사항이 아니다)
        - JsonData에서 구현된것이다 ⇒ 권한이 없다
    - 역할 재조정
        - 부모객체 역할 : 부모는 서브객체의 데이터 결과값을 받아 통신한다
        - 서브객체 역할 : 부모의 참고자료만을 만드는 역할
        - hook(\_getData)을 통해서 서브객체에서 참조데이터 결과를 받아서 Data에서 Info객체를 관리
    - 계약이란, 어떤 객체는 어떠한 역할을 해야한다는것을 정의하는것
        - 내부계약 Data와 JsonData의 관계 서브객체는 JSON으로 만들어줘야한다
        - 외부계약 Render와 Data의 관계에서는 JSON인거 몰라도 된다 그래서 Info를 통해서 애기한다.
    - 객체는 인자로 넘기지않는다, 컨텍스트로 넘긴다.(this.\_data)

    ```jsx
    const Info = class{...}

    const Data = class {
        async getData () {
          const json = await this._getData()
          return new Info(json)
        }
    		// hook
        async _getData () {throw 'getData mush Overide'}
      }

      const JsonData = class extends Data {
        constructor (data) {
          super()
          this._data = data
        }

        async _getData () {
          if (typeof this._data === 'string') {
            const response = await fetch(this._data)
            return await response.json()
          } else return this._data
        }
      }

      const Renderer = class {
        async render (data) {
          if (!(data instanceof Data)) throw 'invalid data type'
          const {_private : {title, header, items}} = await data.getData();
          Object.assign(this, {title, header, items})
          this._render()
        }

        _render () {
          throw '_render must override'
        }
      }

      const TableRenderer = class extends Renderer {
        constructor (parent) {
          if (typeof parent != 'string' || !parent) throw 'invalid param'
          super()
          this._parent = parent
        }

    		// hook
        _render () {....}
      }

      const data = new JsonData('71_1.json')
      const renderer = new TableRenderer("#data")
      renderer.render(data)
    ```

### 2. 요구사항과 수정 변화에 대응하려면 ?

-   어디까지가 경계의 역할을 보고 격리시킬지, 격리되있는것을 객체로 만들어서 협력하게 만들어라
-   템플릿메소드 패턴 : 부모와 자식과 협력
    -   훅을 끌어올려 부모쪽에서 대표메소드를 노출하고 자식쪽에서는 그 일부만 구현해서 서로 협력
-   데이터와 렌더러와의 협력 완전히 다른 집안이기 떄문에 프로토콜을 통해서 협력
    -   Info객체 : 중간에 서로 합의를 본 내용 = 프로토콜

### 참고사항

-   프로그램을 한다는 나만의 단어와 의미체계를 만든다는 것

-   fetch의 결과는 항상 promise며, then의 결과값도 promise (text를 제외한 모든 타입이)

-   \_함수명은 js 3.1부터 내려온 private 함수명의 표현이다

-   코드를 만드는것은 소저와 같다(진흙을 하나하나 붙어서 작품을 만드는것)

> 에러의 3단계

-   complie 에러 ⇒ 문법이 이상해!! (syntex err)

-   runtime 에러 ⇒ nullpointer ⇒ 해결방법 : throw날려서 그 지점을 찾자! (최후의 보루!!!)

-   context 에러 ⇒ 프로그램이 죽지않는다. 에러가 나오지 않는다 결과값만 다르다 (농부가 되자)
