---
title:  "코드스피치 ES6+ 디자인패턴과 뷰패턴 2회차 정리"
description: "코드스피치 강의 ES6+ 디자인패턴과 뷰패턴 2회차 정리"
draft: false
template: "post"
category : "js"
tags:
  - js
date: 2021-02-11
---
> 디자인패턴은 어떠한 철학을 가지고 있는가?

1. 디자인패턴을 이해하기 위해선
    - 객체의 역할모델에 대한 전반적인 이해
    - 구조를 이해하는게 먼저(더나은 구조를 찾기 전)
    - `디자인패턴은 **역할모델**과 **객체지향**에 대해서 먼저 이해하고 써야 한다.`
2. 디자인 패턴 분류
    - 생성패턴 : 객체를 만들때 이런식으로 만드는게 좋아!
    - 구조패턴 : 객체끼리 관계를 이런식으로 하는게 좋아!
    - 행동패턴 : 알고리즘적인 문제를 객체간 협력으로 풀어보자!
3. 객체지향설계를 학습할 수 있는 분류
    - 다형성
    - 캡슐화
    - 변화율
    - 객체 관계
    - **역할모델 : 중점적으로 다룰 주제!!**
4. 알고리즘이 변화하는 이유? **(대부분 통제불가요소이다.)**
    - 비지니스 변화
    - 연관 라이브러리 변화
    - 호스트측 변화
5. 기존 제어문 기반의 알고리즘이 갖는 문제
    - 알고리즘이 변화한 부분만 수정하고 나머지는 건드리고 싶지 않다면?
    - 최대한 개별 알고리즘을 함수로 분리한다.

        ```jsx
        // 수정하면 전체가 컴파일 됨
        if(case == 1){
        ...
        }else if(case == 2){
        ...
        }else if(case == 3){
        ...
        }

        // 최대한 개별 알고리즘을 함수로 분리
        if(case == 1){
        	case1();
        }else if(case == 2){
        	case2();
        }else if(case == 3){
        	case3();
        }
        ```

    - 하지만 함수로 최대한 분리를 해도, 아래와 같이 변경된다면, 문제가 발생한다.

        ```jsx

        // 문제1. 경우가 변경될떄
        if(case == 1){
        ...
        }else if(case == 2){
        ...
        }else if(case == 3){
        ...
        }else if(case == 4){
        ...
        }

        // 문제2. 함수 간 공통부분
        if(case == 1){
        	common();
        	case1();
        }else if(case == 2){
        	common();
        	case2();
        }else if(case == 3){
        	case3();
        }
        ```

6. 변화에 대응하는 프로그래밍으로 해결하자 ⇒  적응형 프로그래밍 중에 객체지향 프로그래밍
    - 최소한의 변화를 일으키는 부분을 분리해서 격리!
    - 알고리즘 분화시 객체지향에서 선택할 수 있는 두 가지 방법(격리를 어떻게 해줄것인가?)

        1) 상속 위임

            - **내부 계약관계로 추상층에서 공통 요소를 해결하고 상태를 공유할 수 있음**
            - 부모와 자식관의 대화는 속성으로 한다.(인자가 아니라, 속성)
            - 변경되는 부분(분기 case)을 자식에서 해결한다.
            - 상속 위임으로 관계 - 관계 간의 역할을 분리하는 것이 첫번째!!!

        2) 소유 위임

            - **외부 계약관계로 각각이 독립적인 문제를 해결하며 메세지를 주고 받는 것으로 문제를 해결함**
            - Data가 Renderer 소유하거나 Renderer가 Data를 소유하는 것
            - 자기가 가지고 있는 문제의 일부분을 다른 객체한테 넘겨주는 것
            - Gof 디자인 패턴 방향성은 소유위임이다
    - 부가적인 형이 많음 (하나의 테이블에서 여러가지의 클래스로 나뉬다)
    - 변화율이 많을것같다!!! ⇒ 역할을 나누어준다(각 case별로 클래스를 나누어준다)
        - 변화율을 파악하려면 도메인에 대해서 분석을 해야한다
        - 예) 보험상품 → 밑값은 변경되지 않는다. 하지만, 상품은 여러개로 파생되서 역할을 나누어줘야 한다.
    - 변화는 알고리즘이 아니라 비즈니스에서 오는 거라서 알 수 있다.

---

### 상속위임 (Template Method Pattern)

- 위임하는 부분을 호출하는 곳을 template Method 라고 한다.
- 위임한 부분을 hook
- 실행시점선택지를 case별로 서브 클래스를 만들어간다(if 처럼)

  `hook을 콘크리트(구현)해주세요! hook 함수를 정의하고 바디를 적으면 된다`

    ```jsx
    const Github = class{  // 정의시점 변하지 않는 부분
      constructor (id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`;
      }
      load(path){ // Template Method 공통부분!!!!!!
        const id = 'callback' + Github._id++;
        const f = Github[id] = ({data : {content}}) => {
          delete Github[id];
          document.head.removeChild(s);
          this._loaded(content); // 위임부분
        };
        const s = document.createElement('script');
        s.src = `${this._base + path}?callback=Github.${id}`;
        document.head.appendChild(s);
      }
      _loaded(v) {throw 'overrid';} // Hook
    }
    Github._id = 0;

    // const ImageLoader = class extends  Github{ // 실행시점선택지 - 변하는 부분
    //   _loaded(v){...} // 위임 구현
    // }

    // 변하는 부분에 대해서 각 class 처리
    const ImageLoader = class extends Github {
      constructor (id, repo, target) {
        super(id, repo)
        this._target = target
      }

      _loaded (v) {
        this._target.src = 'data:text/plain;base64,' + v
      }
    }

    // 변하는 부분에 대해서 각 class 처리
    const MdLoader = class extends Github {
      constructor (id, repo, target) {
        super(id, repo)
        this._target = target
      }

      _loaded (v) {
        this._target.innerHTML = this._parseMD(v)
      }

      _parseMD (v) {
        return d64(v).split('\n').map(v => {
          let i = 3
          while (i--) {if (v.startsWith('#'.repeat(i + 1))) return `<h${i + 1}>${v.substr(i + 1)}</h${i + 1}>`}
          return v
        }).join('<br>')
      }
    }

    const d64 = v => decodeURIComponent(atob(v).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    ```

- 정의시점과 실행시점
    - 자바스크립트는 컴파일이 없지만, 정의시점의 파일은 컴파일 된거랑 같다고 생각할 수 잇다.
    - 정의시점에 내가 무엇을 할지 미리 만들어놓지 않고, 케이스별로 처리할  처리기만 만든다 (imageLoader, Mdloader)

    ```jsx
    // 정의 시점
    <script src="Github.js"></script>
    <script src="ImageLoader.js"></script>
    <script src="MdLoader.js"></script>

    // 실행시점선택
    <script>
    const img = new ImageLoader(...);
    img.load(...);

    const md = new MdLoader(...);
    md.load(...);
    </script>
    ```

### 소유위임 (STARATEGY PATTERN)

- 소유한(사용하기 전 해당 객체/함수에 대해서 소유)객체(함수)한테 문제의 일부분 위임만 한다
- 함수가 위임객체이면, 상속위임 보다는 클래스 정의가 줄어든다(클래스를 넘겨준다면 비슷)
- 함수면 type에 대해서 처리할 수 없기 때문에 valdiation 처리 필요(안정성을 담보 할 수 없다)
- 위임하는 일이 중요도에 따라 높으면 클래스, 아님 함수
- 위임객체를 Starategy Object - 전략객체라고 한다
- 전략객체을 소유하고 있는 class를 host, invoke(실행기)라고 한다.

    ```jsx
    const Github = class { // 정의시점 - 변하지 않는 부분
      constructor (id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`
      }

      load (path) {
        if(!this._parser) return;
        const id = 'callback' + Github._id++
        const f = Github[id] = ({ data: { content } }) => {
          delete Github[id]
          document.head.removeChild(s)
          this._parser(content) // 위임부분
        }
        const s = document.createElement('script')
        s.src = `${this._base + path}?callback=Github.${id}`
        document.head.appendChild(s)
      }
      set parser(v){this._parser = v} // 위임객체 // STARATEGY OBJECT //실행시점 선택지 - 변하는 부분

    }

    const el = v => document.querySelector(v);
    const parseMD = (v) => {
      return d64(v).split('\n').map(v => {
        let i = 3
        while (i--) {if (v.startsWith('#'.repeat(i + 1))) return `<h${i + 1}>${v.substr(i + 1)}</h${i + 1}>`}
        return v
      }).join('<br>')
    }

    const loader = new Github('kode15333', 'Calculator');
    // 전략객체만 바꿔준다 img 처리 함수로
    const img =v=>el('#a').src = 'data:text/plain;base64,' + v;
    loader.parser = img;
    loader.load('./public/guide.png');

    // 전략객체만 바꿔준다 md 처리 함수로
    const md = v => el('#b').innerHTML = parseMD(v);
    loader.parser = md;
    loader.load('README.md')
    ```

- 자유변수를 통한 확장 (외부의 상태값을 같이 저장하여 사용한다)

    ```jsx
    const Github = class {
      constructor (id, repo) {
        this._base = `https://api.github.com/repos/${id}/${repo}/contents/`
      }

      load (path) {
        if(!this._parser) return;
        const id = 'callback' + Github._id++
        const f = Github[id] = ({ data: { content } }) => {
          delete Github[id]
          document.head.removeChild(s)
          this._parser[0](content, ...this._parser[1]) // 변경부분
        }
        const s = document.createElement('script')
        s.src = `${this._base + path}?callback=Github.${id}`
        document.head.appendChild(s)
      }
      setParser(f, ...arg){ //외부의 상태값을 같이 저장한다.
        this._parser = [f, arg]
      } 

    }

    Github._id = 0;

    const loader = new Github('kode15333', 'Calculator');
    const img =(v, el)=>el.src = 'data:text/plain;base64,' + v;
    loader.setParser(img, el('#a'));
    loader.load('./public/guide.png');

    const md = (v, el) => el.innerHTML = parseMD(v);
    ```

- 소유위임은 클래스 하나의 전략객체만 바꾸는 거라 휠씬 짧다

    ```jsx
    // 정의 시점
    <script src="Github.js"></script>
    <script src="img.js"></script>
    <script src="md.js"></script>

    // 실행시점선택
    <script>
    const loader = new Github('kode15333', 'Calculator');
    loader.setParser(img, el('#a'));
    loader.load('./public/guide.png');

    const md = new MdLoader(...);
    loader.setParser(md, el('#b'));
    loader.load('README.md')
    </script>
    ```

### 실행시점 선택 위임

- 발생가능한 경우의 수를 값으로 기술(라우팅 테이블을 이용 / Loader의 코드는 변경되지 않는다)
- if를 값으로 바꾸려면, 라우터를 이용하자(object or hashmap을 이용)(if 문, router 값)
- 그래서 코드를 안건드리고 값을 추가만 할수 있다.

    ```jsx
    const Loader = class {
      constructor (id, repo) {
        this._git = new Github(id, repo);
        this._router = new Map; // 라우팅테이블
      }
      add(ext, f, ...arg) {
        ext.split(',').forEach(v => this._router.set(v, [f, ...arg]))
      }
      load(v){
        const ext = v.split('.').pop();
        if(!this._router.has(ext)) return;
        this._git.setParser(...this._router.get(ext)); // 확장자 경우에 따라 자동분기
        this._git.load(v)
      }
    }

    const el = v => document.querySelector(v);
    const loader = new Loader('kode15333', 'Calculator');
    loader.add('jpg,png,gif', img, el('#a'));
    loader.add('md', parseMD, el('#b'));

    loader.load('./public/guide.png');
    loader.load('README.md')
    ```

  상태에 대한 분기는 사라지지 않는다. 그  분기가 필요해서 태어났기 때문!!

1. **정의시점에 제거하는 방법**
    - 분기 수 만큼 객체를 만들고(상속/소유 위임 , Template / Staratege)
    - 실행시점에 경우의 수를 공급(실행시점 선택 위임, Builder???)

2. **실행시점으로 분기를 옮길 때의 장단점**

    1) 장점

        - 정의 시점에 모든 경우를 몰라도 됨
        - 정의 시점에 그 경우를 처리하는 방법도 몰라도 됨
        - 일정한 통제 범위 내에서 확장가능한  알고리즘 설계 가능

    2) 단점

        - 실행시점에 모든 경우를 반드시 기술해야 함
        - 실행시점마다 알고리즘의 안정성을 담보해야함
        - 매 호스트코드마다 안정성을 따로 담보해야 함

### 참고사항

- data URL 형식 data:[minetype];base64,'+base64 + base64로 이미지의 URL

- 용량은 알고리즘을 대체할 수 있고, 알고리즘은 용량을 대체할 수 있다. 자바스크립트는 프로토타입은 용량이 부족해서 연산으로 찾는거다!
