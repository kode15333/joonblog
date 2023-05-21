---
title: '코드스피치 ES6+ 디자인패턴과 뷰패턴 4회차 정리'
description: '코드스피치 강의 ES6+ 디자인패턴과 뷰패턴 4회차 정리'
draft: false
template: 'post'
category: 'js'
tags:
    - js
date: 2021-02-13
---

> Composite Pattern의 확산 ⇒ 중복

-   데이터 구조를 컴포지트로 만들면 활용하는 쪽까지 컴포지트가 된다.
-   Task 데이터 컴포넌트 구조 → Renderer 컴포넌트 구조 **(행동의 중복)**

    -   행위가 중복이다 → 컴포지트는 개발하기 어렵다
    -   컴포지는 행동은 테스크만 가지고 있으면 되지 않나? 왜 렌더까지?

    ```jsx
    // Task 컴포넌트 패턴
    getResult (sort, stateGroup) {
        ...
        return {
          ...
          children: ([...]).map(v => v.getResult(sort, stateGroup))
        }
      }

    // Renderer 컴포넌트 패턴 (_render)
    _render (base, parent, { item, children }, depth) {
        ....
        children.forEach(v=>{this._render(sub, item, v, depth + 1)});
        ...
      }
    ```

-   Renderer 그림만 그릴래(순회하기 싫어 → 행위를 정의하고 싶지 않아 → 순회는 내역할 아니다)
-   순회시켜줘 → 거기에 방문해서 하고 싶은것만 할래 ⇒ **비지터 패턴**
-   **비지터를 사용하는 이유**
    -   컴포지트를 쓰면 전파 → 오염 / 반복 (**참조하고 있는 모두가 컴포지트 구현**)
    -   한쪽이 컴포지트이거나, 액션을 추가하거나, 그 액션에 따라서 무엇을 하고 싶으면 비지터로 처리
    -   Task가 컴포지트면, Render 의 액션은 비지터로 처리하자 ⇒ 분리하자!!
    -   컴포지트 패턴이 나오면 무조건 비지터 패턴이 나온다

---

### VISITOR PATTERN

1. **Task 클래스 accpet 메서드 구현 → 컴포지트가 확산이 된다 (accept를 다시 호출)**

    - 부모 계층에서 자료구조를 생성하기 때문에(캡슐화 ⇒ getResult )
    - 자식 계층에서는 똑같다 ( visitor pattern 전과 동일)

    ```jsx
    // Task Class
    accept(sort, stateGroup, visitor){
        visitor.start(sort, stateGroup, this);
        this.getResult(sort, stateGroup).children.forEach(
          ({item}) => item.accept(sort, stateGroup, visitor)
        );
        visitor.end(); // 상위 노드로 이동하기 위해서
    }

    // Renderer Class
    render () {
        this._visitor.reset()
        this._list.accept(Task[this._sort], true, this._visitor)
    }
    ```

    `트랜잭션이란 ⇒ 암묵적인 순서가 강제된 메서드`

    - start와 end사이에 자식들의 컴포지션 처리가 들어가야한다는 암묵적인 순서가 존재

2. **DOMRender 로직은 Dom + Render이다.**

    - Render가 그림을 그리는 일반적인 로직은 다 가지고 있다. 구체적인 로직은 비지터한테 넘기자
    - Render의 역할

        - 테스크와 협조하여 테스크에 대한 그림을 그릴 수 있게! 비지터를 중계하는 행위
        - 더이상 렌더러의 자식이 필요없다?
            - native API(DOM)때문에 구현했는데, Renderer가 Visitor에게 그 역할(자식클래스)을 이관
            - 렌더러에서 돔에 대한 로직을 없어졋다
            - 렌더러는 테스크랑만 놀자, 그리고 중계만 하자

        ```jsx
        const Renderer = class {
          constructor (_list = err(), _visitor = err()) {
            prop(this, { _list, _visitor: prop(_visitor, { renderer: this }), _sort: 'title' })
          }

          add (parent, title, date) {
            if (!is(parent, Task)) err()
            parent.add(new TaskItem(title, date))
            this.render()
          }

          remove (parent, task) {
            if (!is(parent, Task) || !is(task, Task)) err()
            parent.remove(task)
            this.render()
          }

          toggle (task) {
            if (!is(task, Task)) err()
            task.toggle()
            this.render()
          }

          render () {
            this._visitor.reset()
            this._list.accept(Task[this._sort], true, this._visitor)
          }
        }

        const DomVisitor = class extends Visitor {
          constructor (_parent) {
            super()
            prop(this, { _parent })
          }

          reset () {
            this._current = el(sel(this._parent), 'innerHTML', '')
          }

          start (sort, stateGroup, task) { // operator
            if (!is(this._renderer, Renderer)) err()
            switch (true) {
              case is(task, TaskItem):
                this._item(task)
                break
              case is(task, TaskList):
                this._list(task)
                break
            }
            this._current = this._current.appendChild(el('section',
              '@marginLeft', '15px',
              'appendChild', el('input', 'type', 'text'),
              'appendChild', el('button', 'innerHTML', 'addTask',
                'addEventListener', ['click', e => this._renderer.add(task, e.target.previousElementSibling.value)]
              ))
            )
          }
          end () { // operator
            this._current = this._current.parentNode;
          }

          _list (task) {
            this._current.appendChild(el('h2', 'innerHTML', task.title))
          }

          _item (task) {
            [
              el('h3', 'innerHTML', task.title, '@textDecoration', task.isComplete() ? 'line-through' : 'none'),
              el('time', 'innerHTML', task.date.toString(), 'datetime', task.date),
              el('button', 'innerHTML', task.isComplete() ? 'progress' : 'complete', 'addEventListener', ['click', _ => this._renderer.toggle(task)]),
              el('button', 'innerHTML', 'remove', 'addEventListener', ['click', _ => this._renderer.remove(parent, task)])
            ].forEach(v => this._current.appendChild(v));
          }
        ```

3. **DomVisitor \_item 메소드에 this.\_renderer를 넣어준 이유 ?**

    - Task에 대한 관리는 Renderer가 가지고 있기 때문에 Renderer에서 처리해준다
    - Renderer에게 테스크를 중계해주는 역할을 위임하기 위해( add, remove toggle )

        코드의 가독성은 알고리즘의 감춰지고, 커뮤니케이션이 일어날때 확보된다!

        - 변수의 이름이 좋다고 해서 가독성이 높아지는 것이 아니다.
        - 그 의미가 확실하도록, 함수화 시키거나, 객체화를 시켜라
        - 로직을 바라보는게 아니라, 커뮤니케이션을 바라보게 된다(readable code)

4. **Task를 순회 하면서 Visitor를 자기 노드에 초대해서 렌더링!**

    ```jsx
    render () {
        this._visitor.reset(); //라이프사이클
        this._list.accept(Task[this._sort], true, this._visitor);
      }
    ```

5. **Visitor의 라이프 사이클은 reset 후에 start end를 반복합니다.**

    - **DomVisitor** 역할은 start, end에 초대하서 그림만 그릴 게(컴포지트 로직이가 없다 → 테스크만 잇다)
    - **DOMRender**의 애매모호하게 가지고 있던 리스크 최초 초기화 및 관리 기능이 없어졋다.

    ```jsx
    accept(sort, stateGroup, visitor){
        visitor.start(sort, stateGroup, this);
        this.getResult(sort, stateGroup).children.forEach(
          ({item}) => item.accept(sort, stateGroup, visitor)
        );
        visitor.end();
      }
    ```

`객체가 어떠한 단계별로 실행이 될때, 실행되는 단계가 확정되있음 → LifeCycle`

6. **본인 자체가 Visitor가 되면 되는데 왜? DomVisitor를 구현햇나요?**

    - 변화율에 따라 따로 분리했다 변화율 때문에
    - 렌더러 로직이 바뀔 경우는 없다(왜? 테스크의 데이터에 대한 로직이기 떄문)
    - 돔 비지터는 폰트/이미지가 바뀐다!! 변화율이 높다

    **변화율이 다를때는 파일 채로 건들지 않게 해야 효과적이다.**

    - 만약? **Renderer**를 수정하게 된다면, 데이터 로직에 대해서도 다 테스트해야한다
    - **DomVisitor**만 수정하면 **DomVisitor**만 테스트만 하면 된다.
    - 변화율이 역할의 정체다→ 역할을 나누는 기준은 변화율이 큰 부분이다.

---

### start와 end 사이에서 구현을 해야한다라는 암묵적인 룰 (Operator사용 제약)

`Visitor의 start(), end()가 Operator이다`

1. 비지터에 대한 지식이 없는데 컴포지트에서 처리하는게 문제
    - 비지터에만 구제적인 사용 방법에 대해 정의되있다. **(start 와 end 사이에서 구현하자)**
    - 그 행위를 가지고 있는 애만 알고 잇는 지식 **(Visitor만 알고 있는 지식)**
    - 메서드(start, end)가 외부 메서드라도 결국에는 실패할 것이다.
2. accept 안에 getResult가 있다(composite 안에 compositee) → 2단 중복 / 내부 중복
    - Task의 두가지 역할을 가지고 잇다.
        - accept를 받아들이는 visitor를 loop 돌리는 역할
        - 원래 컴포지트의 역할
3. 역할이 다른 메서드가 다른 메서드를 참조하고 이기 때문에 오염된다.

    ```jsx
    accept(sort, stateGroup, visitor){
        visitor.start(sort, stateGroup, this);
        this.getResult(sort, stateGroup).children.forEach(
          ({item}) => item.accept(sort, stateGroup, visitor)
        );
        visitor.end();
      }
    ```

---

### Reverse visitor

-   Visitor에 대한 역할은 Visitor가 알아야 하고, TaskList가 getResult을 수행해야 할 역할

    ```jsx
    // Renderer class
    render () {
        this._visitor.reset();
    		// List가 vistor를 처리해야 한다는것을 의미한다.
        this._list.accept(Task[this._sort], true, this._visitor)
    }
    ```

-   Visitor가 오퍼레이션을 통해 리스트를 받아들이면 더 낫다!!(정답은 아니다 Task에 강하게 바인딩 되있다)

    `자료구조가 계속해서 변하고 이걸 처리한 비지터가 안정화되면 Reverse 를 할 필요 없다`

-   Visitor가 Task를 알고있는것 (**Task가 순수한 모델이면서 변화지 않기 때문**)
-   자료구조가 안정적이면서 뷰를 바꾼다 → 이 application에서는 이게 더 효율적이다.

    ```jsx
    render () {
        this._visitor.reset();
        this._visitor.operation(Task[this._sort], true, this._list);
    }

    // task에 대해서 강하게 바인딩되있다.
    operation(sort, stateGroup, task) {
        this._start(sort, stateGroup, task);
        task.getResult(sort, stateGroup).children.forEach(
          ({item}) => this.operation(sort, stateGroup, item)
        )
        this._end();
    }
    ```

---

### OBSERVER PATTERN

1. **this.render() 중복**

    - 데이터/모델에 대한 변경이 확실하 않다(조건을 충족못한다면 실행이 불가)
        - 모델에게 부탁만 했는데, 결과의 업데이트 여부를 확인 불가(캡슐화)
    - 캡슐화를 깨지않고 변화를 밖으로 통제할 방법이 필요해 ⇒ 옵저버

        ```jsx
        add (parent, title, date) {
            if (!is(parent, Task)) err()
            parent.add(new TaskItem(title, date))
            this.render()
          }

          remove (parent, task) {
            if (!is(parent, Task) || !is(task, Task)) err()
            parent.remove(task)
            this.render()
          }

          toggle (task) {
            if (!is(task, Task)) err()
            task.toggle()
            this.render()
          }
        ```

2. **Observer Class Concrete**

    **subject : 신문사 , observer 구독자**

    **OBSERVER PATTERN 작성시 주의사항**

    - 초기작성시, 인자를 보내지말자 ⇒ 통지만으로 충분하다(대부분)
    - 값을 보내면 동기화 문제 및 멀티쓰레드 문제가 생길수도 있다.
    - 값을 꼭 보내야하는 구조이며, 구조의 문제 일 수 도있다.

    ```jsx
    const Observer = class {
        observe() {
            override()
        }
    }
    const Subject = class {
        constructor() {
            this._observers = new Set()
        }

        addObserver(o) {
            if (!is(o, Observer)) err()
            this._observers.add(o)
        }

        removeObserver(o) {
            if (!is(o, Observer)) err()
            this._observers.delete(o)
        }
        // 신문을 뿌리는 행위
        notify() {
            this._observers.forEach((o) => o.observe())
        }
    }
    ```

3. **Task의 입장에서는 Observer이자, Subject의 경우기도 하다**

    - 다중상속 또는, 상속하나에 다중 소유로 해결한다.
    - 내자신을 참조하는 Observer를 만들어서 Observer를 직접 구현하지 않았지만,

        - 나를 알고있는 Observer를 소유하므로써 Observer에 대응
        - 부모가 자식의 변화를 알려면 항상 리스닝 하고 잇어야 한다 .

            ```jsx
            const TaskObserver = class extends Observer {
                constructor(_task) {
                    super()
                    prop(this, { _task })
                }
                observer() {
                    // 자식한테 통보를 받으면 나도 부모한테 notify 해주자
                    // 전파 -> 전파
                    this._task.notify()
                }
            }
            ```

4. **Task 확장 = Subject 상속**

    - 내 자식에 옵저버가 되서 자식이 변화하면 나의 notify가 호출된다 (taskObserver)
    - 자식 변화 → 나에게 notify → 부모에게 notify

        ```jsx
        const Task = class extends Subject {
          ...
          constructor (_title = err(), _date = new Date) {
            super();
            prop(this, { ..., _observer: new TaskObserver(this) })
          }
          ...
          add (task) {
            ...
            task.addObserver(this._observer); // 등록
            this.notify();
          }

          remove (task) {
            ...
            task.removeObserver(this._observer); // 삭제
            this.notify();
          }

          ...
        }
        ```

### 참고사항

-   eventDispatcher addEventListner, removeEventListner 안에 들어가는게 **Observer**이다.
    -   자바스크립트는 함수를 객체로 보내기때문에 가능
-   **Observer**의 다른 이름 **Listner**
-   addEventlistener은 옵저버패턴의 확장인 채널 패턴이라고 부른다. (event type에 따라서 옵저버)
-   push observer : subject가 observer로 밀어내고 있다.
    -   적은 노드를 잦은 통신할때
-   pull observer : 브라우저라고 생각 해당 페이지를 브라우저가 요청한다.
    -   많은 노드를 비정기적으로 비동기적으로 상대할때
-   컴포넌트 패턴 (여러가지 패턴의 활용)
-   `forEach, map, filter 함수의 콜백 또한 Visitor 패턴`
    -   **순회는 array 역할**
    -   **값만 받으면, 콜백은 처리만 한다!는 것이 역할**
    -   결국, 데려가주면 무언가를 할게 (구조, 순회 관심 없음 → 나의 역할이 아니다)
