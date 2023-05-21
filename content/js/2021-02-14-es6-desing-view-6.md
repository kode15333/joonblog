---
title: '코드스피치 ES6+ 디자인패턴과 뷰패턴 6회차 정리'
description: '코드스피치 강의 ES6+ 디자인패턴과 뷰패턴 6회차 정리'
draft: false
template: 'post'
category: 'js'
tags:
    - js
date: 2021-02-15
---

> MVC ) Model에 변화가 일어나면, View와 Controller가 변한다.

-   Model property가 이름이 변경(name → userName) → 모든 View 수정
-   Controller의 Method의 리턴값은 View 객체(부모에게 끼어넣는것 → 큰 제약(라우터의 제약))

### View가 Model을 모르게 하자

### 1. MVP

-   컴포넌트 기반으로 common view의 행태에서 자주 쓰인다(부트스트랩)

-   View가 말합니다!

    -   나는 Value Object (즉, getter/setter 제공)!!
    -   Presenter가 VO를 적극적으로!! 이용을 알아서 해라!!
    -   나는 더이상 Model 모르겠다 → 업데이트 : setter / 조회 : getter
    -   그림만 그릴 뿐!!

-   Presenter는 View를 알고 있으니까 만드는게 자연스럽다

    -   View를 알아야지 Filed의 getter/setter 알수있다.
    -   Presenter가 View를 만드는게 당연하다

-   Controller(Method)의 결과 값이 아니라, Presenter를 실행하고 뷰 객체를 만든다
    -   Presenter는 get view를 하면 Dom객체의 view를 리턴한다.
    -   Presenter의 view 객체를 넣어준다 → Presenter는 view를 가지고 있다
-   장점
    -   Model의 변화를 Presenter가 흡수(View 영향 x) - 의존성이 낮다
    -   View → Presenter 약한 Coupling (인터렉션 처리 위임 )
    -   View가 VO이기 때문에 테스트 하기 쉽다.
-   단점

    -   Presenter → View의 강한 Coupling(getter/setter 안다 → view의 지식이 있어야 한다)
    -   getter/setter을 호출할때마다 view를 그리므로, Round Trip이 발생한다.

        ```jsx
        const HomeBaseView = class extends View {
          constructor (presenter, isSingleton) {
            super(presenter, el('ul'), isSingleton)
          }

          set list (list) {
            const { _presenter: pres, view } = this
            append(el(view, 'innerHTML', ''), ...list.map(v => append(
              el('li'),
              el('a', 'innerHTML', v.title, 'addEventListener', ['click', _ => pres.$detail(v.id)]),
              el('button', 'innerHTML', 'x', 'addEventListener', ['click', _ => pres.$remove(v.id)])
            )))
          }
        }

        const HomeDetailView = class extends View {
          constructor (presenter, isSingleton) {
            super(presenter, el('section'), isSingleton)
            append(el(this.view, 'innerHTML', ''),
              ....
                ['click', _ => presenter.$editDetail()]),
              el('button', 'innerHTML', 'delete', 'addEventListener',
                ['click', _ => presenter.$removeDetail()]),
              el('button', 'innerHTML', 'list', 'addEventListener',
                ['click', _ => presenter.$list()])
            )
          }

          get title () {return sel('.title', this.view).value}

          set title (title) {sel('.title', this.view).value = title}

          get memo () {return sel('.memo', this.view).value}

          set memo (memo) {sel('.memo', this.view).value = memo}
        }

        const Home = class extends Presenter {
          constructor (isSingleton) {super(isSingleton)}

          listen (model) {
            switch (true) {
              case is(model, HomeModel): {
                prop(this._view, { list: model.list })
                break
              }
              case is(model, HomeDetailModel): {
                const { title, memo } = model
                prop(this._view, { title, memo })
                break
              }
            }
          }

          detail (id) {
            prop(this, { _id: id, _view: new HomeDetailView(this, true) })
            const model = new HomeModel(true).get(id)
            model.addPresenter(this)
            model.notify()
          }

          $removeDetail () {
            this.$remove(this._id)
            this.$list()
          }

          $editDetail () {
            const model = new HomeModel(true).get(this._id)
            model.addPresenter(this)
            const { title, memo } = this._view
            model.edit(title, memo)
          }

          base () {
            prop(this, { _view: new HomeBaseView(this, true) })
            const model = new HomeModel(true)
            model.addPresenter(this)
            model.notify()
          }

          $remove (id) {
            const model = new HomeModel(true)
            model.remove(id)
          }

          $list () {app.route('home')}

          $detail (id) {app.route('home:detail', id)}
        }

        ```

    > Protocol을 활용하여 decoupling 시켜주자!

    1. VO protocol (메모와 타이틀이라는 속성이 제공되는 인터페이스)
        - Presenters는 VO Protocol 바라보고, View 에서 VO Protocol 구상
    2. Command Protocol (remove detail edit가 제공되는 인터페이스)
        - View는 Command Protocol을 바라보고, Presenters에서 Command Protocol 구상

### 2. MVVM

-   View가 ViewModel을 구독하고 있는 형태 (like model)

    **`View가 말합니다!`**

    -   나는 ViewModel에게 관심이 아주아주 많다 **(나의 Subject)**
    -   **(한개 혹은 여러가지의)** ViewModel을 가지고 그림을 그린다.

-   ViewModel 시스템에서는 viewModel라는 중간 객체가 View의 subject이자 Model의 Observer

    **`ViewModel이 말합니다!`**

    -   나는 View를 모른다 관심없다 ⇒ **View가 나한테 관심이 많다**
    -   Model을 가지고 있으며, Model을 가지고 가공하여 내 자신을 만든다!

-   **View와 ViewModel이 서로 관계가 없기 때문에 라우터가 그림을 그린다?**

    **신문사가 ViewModel, 구독자들이 View (MVVM의 특징: 많은 쪽을 View로 본다)**

-   ViewModel이 View에 관심없으니까 ViewModel에 대해서 테스트하기 쉽다 .

    -   View가 아니더라도 수신 할 수 있으면 테스트 가능

    ```jsx
    const App = class {
        constructor(_parent = err()) {
            prop(this, { _parent, _table: new Map() })
        }
        add(k = err(), vm = err(), view = err()) {
            this._table.set(k, [vm, view])
        }
        route(path = err(), ...arg) {
            const [k, action = 'base'] = path.split(':')
            if (!this._table.has(k)) return
            const [vm, view] = this._table.get(k).map((f) => f())
            view.viewModel = vm
            vm[action](...arg)
            append(attr(sel(this._parent), 'innerHTML', ''), view.view)
        }
    }

    const ListVM = class extends ViewModel {
        constructor(isSingleton) {
            super(isSingleton)
        }
        base() {
            const model = new HomeModel(true)
            model.add(this.observer)
            model.notify()
        }
        listen(model) {
            if (!is(model, HomeModel)) err()
            this.notify(model.list)
        }
        $detail(id) {
            app.route('detail', id)
        }
        $remove(id) {
            const model = new HomeModel(true)
            model.remove(id)
        }
    }

    const DetailVM = class extends ViewModel {
        constructor(isSingleton) {
            super(isSingleton)
        }
        base(id) {
            prop(this, { _id: id })
            const model = new HomeModel(true).get(id)
            model.add(this.observer)
            model.notify()
        }
        listen(model) {
            if (!is(model, HomeDetailModel)) err()
            this.notify(model.title, model.memo)
        }
        $remove() {
            const model = new HomeModel(true)
            model.remove(this._id)
            this.$list()
        }
        $edit(title, memo) {
            const model = new HomeModel(true).get(this._id)
            model.edit(title, memo)
        }
        $list() {
            app.route('list')
        }
    }
    ```

### 참고사항

-   **Round Trip Time (RTT/ 왕복 시간)?**
    -   데이터 패킷이 대상으로 전송되는 데 걸리는 시간과 해당 패킷의 승인이 원본에서 다시 수신되는 데 걸리는 시간을 더한 것입니다. 네트워크와 서버 간의 RTT는 ping명령 을 사용하여 확인할 수 있습니다 .
