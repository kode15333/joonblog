---
title: '코드스피치 ES6+ 디자인패턴과 뷰패턴 3회차 정리'
description: '코드스피치 강의 ES6+ 디자인패턴과 뷰패턴 3회차 정리'
draft: false
template: 'post'
category: 'js'
tags:
    - js
date: 2021-02-12
---

> Loop Pattern

1. Iterator Pattern
    - 동일한 구조의 반복
    - Iteration은 언어에서 이미 제공 별도(Array, Set, Map, ...)
2. Composite Pattern
    - 알고리즘 전개에 따른 반복(Recursion 재귀)
    - 재귀호출을 이해했다 → 컴포지트 패턴

---

### COMPOSITE PATTERN은 언제 쓸까?

-   좌측 트리메뉴에 추가해주세요! → 좌측 트리메뉴에 아이콘/depth 추가 해주세요 ㅠㅠ
-   계속해서 요구사항이 증가된다 → 컴포지트패턴으로 해결!!
-   함수를 구현하게 된다며, 상태를 가지고 있지않기 때문에 요구사항이 늘어날수록 인자가 늘어남
-   객체화 시켜 재귀하는 로직을 감추는게 `컴포지트 패턴`이다

### Microsoft TODO List와 비슷한걸 만들면서 배워보자

1. **Domain 파악**

    - 리스트 안에 여러개의 TODO Task 항목들

        `도메인 훈련 : 화면(기획서)을 보고 데이터가 어떻게 생겼을까? (네이버 화면보고 HTML 파악)`

        `도메인을  파악하는 방법 (데이터베이스 기준)`

        1. 행위가 명사로 표현한다 → 엔티티(데이터 저장)
            - 엔티티 후보 : TODO List, TODO Task
            - 프론트앤드 관점에서 보면 하나의 객체로 표현할 수 있다 ⇒ 클래스
        2. 행위를 동사로 표현한다 → Behavior ?

2. **시나리오 작성 (개발 70% 완료)**

    - 시나리오를 보고 추측 할 수 있는 법(코드에는 없지만, 모델링을 한다)

        - 날짜는 현재시간 저장하는구나....
        - 리스트의 색상과 배경이 있는데, 기본값으로 설정되는구나...

            ```jsx
            const list1 = new TaskList('비사이드')
            list1.add('지라 설치')
            list1.add('지라 클라우드 설치')

            const list2 = new TaskList('s75')
            list2.add('2강 답안 작성')
            list2.add('3강 답안 작성')

            console.log(list1.byTitle())
            console.log(list2.byDate())
            ```

        `추측하는 것 → API 설계라고 한다`

        1. API 설계는 구조적인 설계와 다르다.
        2. 어떻게? 나의 프로그램의 결과(기능과 데이터)를 사용할 것인가?
        3. 사람들이 인식하기 쉽게! 사용하기 쉽게! 설계해야 한다
        4. 결국 이름이 제일 중요하다!!(상향식에서 리펙토링으로 만들자 : add → addTask)

3. **Concrete Class (구현)**

    - 엔티티를 파악하고 최대한 의존성이 없는것부터 작성한다(list 보다 task)
    - 기능상의 필요한 점을 보고 api를 도출한다 (정렬 기준 : taskSort의 sortTitle, sortDate)

        - 대부분의 api는 본인의 내장을 까지않고 캡슐화를 제공하기 위해서 (sortTitle, sortDate)

            `캡슐화 - 밖에 나의 행동을 추상적으로 표현한다 (ATM에서 돈 뽑는것)`
            `은닉 -  감추는 행위`

    - 기본적인 행동(behavior) : toggle

        ```jsx
        const Task = class{
          sortTitle(task){
            return this._title > task._title;
          }
          sortDate(task){
            return this._date > task._date;
          }
        	toggle () {this._isComplete = !this._isComplete}
        }
        const taskSort = {
          title : (a, b) => a.sortTitle(b),
          date: (a, b) => a.sortDate(b)
        }
        ....
        ```

4. **테스크의 서브 테스크의 형태(Optional)**

    - sub 항목이 없어도 **똑같은 데이터 구조로** 나타낸다.
    - 리스트에 task를 추가하는 **행위** `===` task에 sub task를 추가하는 **행위**
    - 행위는 추상적이라 인식하기 어렵다 (데이터가 일치하는게 아니라, **행위가 일치한다**) ⇒ **메서드 복사**

        `모델링 : 현상을 보고 데이터의 구조를 찾아내는것`

        ```jsx
        const list = list2.byDate()
        list[1].task.add('코드정리')
        list[1].task.add('다이어그램정리')
        ```

    - **리스트의 배열은 task의 집합**

        ```jsx
        const Task = class {
          constructor (title, date) {
            ...
            this._list = []
          }

          add (title, date = Date.now()) {this._list.push(new Task(title, date))};

          remove (task) {
            const list = this._list
            if (list.includes(task)) list.splice(list.indexOf(task), 1)
          }

          _getList (sort, stateGroup) {
            const list = this._list, s = taskSort[sort]
            return {
              task: this,
              sub: !stateGroup ? [...list].sort(s) : [
                ...list.filter(v => !v.isComplete()).sort(s),
                ...list.filter(v => v.isComplete()).sort(s)
              ]
            }
          }

          ...
        }

        const TaskList = class {
          constructor (title) {
            ...
            this._list = []
          }

          add (title, date = Date.now()) {this._list.push(new Task(title, date))};

          remove (task) {
            const list = this._list
            if (list.includes(task)) list.splice(list.indexOf(task), 1)
          }

          _getList (sort, stateGroup) {
            const list = this._list, s = taskSort[sort]
            return (!stateGroup ? [...list].sort(s) : [
              ...list.filter(v => !v.isComplete()).sort(s),
              ...list.filter(v => v.isComplete()).sort(s)
            ]).map(v => v._getList());
          }
          ...
        }
        ```

    - 리스트는 테스크를 보여줄 **책임 없다** → 테스크가 서브태스크가 보여줄 **책임이 있다**

        - 나는 호출만 했을 뿐이다!(**리스트와 태스크의 내부거래**)
        - 어떻게 아느냐? → 함수안에서 호출하는것이라서 밖에서는 모른다 **(캡슐화)**
        - 테스크에게 해당 테스크를 보여줄 역할을 위임 `v => v._getList()`

            ```jsx
              _getList (sort, stateGroup) {
                const list = this._list, s = taskSort[sort]
                return (!stateGroup ? [...list].sort(s) : [
                  ...list.filter(v => !v.isComplete()).sort(s),
                  ...list.filter(v => v.isComplete()).sort(s)
                ]).map(v => v._getList()); // 내부거래
              }
            ```

### 만약 서브의서브의서브의....테스트라면?

1. **모델링 (현상을 보고 데이터의 구조를 찾아내는것)**

    - **아래와 같은 데이터의 형태를 설계해야 하는것이 먼저다!**(모델링)
    - 부모 클래스를 만들자 → 상속을 통해 공통코드(중복)을 제거
    - 복잡한 모델을 가지고 와서 앱 전체를 표현하는것(우리의 목표)

        ```json
        {
          item: 's75',
          children: [
            {
              item: taskItem('3강교안작성'),
              children: [
                {
                  item: taskItem('코드정리'),
                  children: [
                    {
                      item: taskItem('subsub1'),
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
        ```

2. **실무에서는 꼬리에 꼬리를 물고 재귀가 확산한다 (하노이는 같은 것만 재귀)**

    - 컴포지트 패턴을 이용해서 재귀 문제를 풀어낸다!
    - 단, 컴포지트 패턴은 depth가 깊으면, stackoverflow가 발생가능성 높다
    - **컴포지트 패턴 핵심은 동일한 함수을 통해 부모와 자식의 문제를 해결한다!**

        - 본인이 처리할 부분과 자식이 처리할 부분이 똑같은 메소드로 처리한다
        - hook을 통해서 자기 자신의 사정을 해결하면 된다.(\_getResult 함수)
        - 자식 사정은 getResult로 해결하면 된다(컴포지트 패턴을 파악할 수 있다)

        ```jsx
        getResult (sort, stateGroup) {
            const list = this._list
            return {
              item: this._getResult(), // hook
              children: (!stateGroup ? [...list].sort(sort) : [
                ...list.filter(v => !v.isComplete()).sort(sort),
                ...list.filter(v => v.isComplete()).sort(sort)
              ]).map(v => v.getResult(sort, stateGroup)) // 컴포지트 패턴이구나
            }
          }
        ```

### Composition Rendering

1. **컴포지션은 전파된다(데이터가 컴포지션 → 렌더링도 컴포지션)**

    - 데이터가 구조가 재귀적으로 되있으니까, 렌더러도 똑같이 재귀적으로 그려야 한다

        `모델 Render  vs 증분 Render`

        1. 모델 Render : 데이터가 변화면, 현재 데이터를 기반으로 전체 다시 그려준다
            - 모델렌더는 mv 계열 프레임워크의 기본
        2. 증분 Render : 필요한 경우에만 다시 만들고 변화가 있으면 업데이트해준다(이벤트 기반)
            - 리엑트는 데이터가 바뀌면, 가상돔의 데이터가 바뀌고 증분을 계산해서 렌더링
            - 효율적으로 계산하기 어렵다(직접은 어렵다... 라이브러리, 프레임워크를 사용하자)

2. **도입함수(기초 렌더링 세팅) + 컴포지션 위임**

```jsx
const DomRender = class {
    constructor(list, parent) {
        this._parent = parent
        this._list = list
        this._sort = Task.title
    }

    add(parent, title, date) {
        parent.add(new TaskItem(title, date))
        this.render()
    }

    remove(parent, task) {
        parent.remove(task)
        this.render()
    }

    toggle(task) {
        if (task instanceof Task) {
            task.toggle()
            this.render()
        }
    }

    render() {
        // 초기세팅
        const parent = this._parent
        parent.innerHTML = ''
        parent.appendChild(
            'title,date'
                .split(',')
                .reduce(
                    (nav, c) => (
                        nav.appendChild(
                            el(
                                'button',
                                'innerHTML',
                                c,
                                '@fontWeight',
                                this._sort === c ? 'bold' : 'nomal',
                                'addEventListener',
                                [
                                    'click',
                                    (e) => (
                                        (this._sort = Task[c]), this.render()
                                    ),
                                ]
                            )
                        ),
                        nav
                    ),
                    el('nav')
                )
        )

        // 컴포지트 패턴
        this._render(parent, this._list, this._list.getResult(this._sort), 0)
    }

    _render(base, parent, { item, children }, depth) {
        const temp = []
        base.style.paddingLeft = depth * 10 + 'px'
        if (item instanceof TaskList) {
            temp.push(el('h2', 'innerHTML', item._title))
        } else {
            temp.push(
                el(
                    'h3',
                    'innerHTML',
                    item._title,
                    '@textDecoration',
                    item.isComplete() ? 'line-through' : 'none'
                ),
                el(
                    'time',
                    'innerHTML',
                    item._date.toString(),
                    'datetime',
                    item._date.toString()
                ),
                el('button', 'innerHTML', 'remove', 'addEventListener', [
                    'click',
                    (_) => this.remove(parent, item),
                ])
            )
        }
        const sub = el(
            'section',
            'appendChild',
            el('input', 'type', 'text'),
            'appendChild',
            el('button', 'innerHTML', 'addTask', 'addEventListener', [
                'click',
                (e) => this.add(item, e.target.previousElementSibling.value),
            ])
        )
        children.forEach((v) => {
            this._render(sub, item, v, depth + 1)
        })
        temp.push(sub)
        temp.forEach((v) => base.appendChild(v))
    }
}
```

### 참고사항

1. **함수의 시그니처란**
    - Parameter의 value와 type
    - 반환값과 타입
    - Exception
