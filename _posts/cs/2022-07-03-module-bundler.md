---
title:  "How to work Webpackr"
description: "Module bundler, Dependency Resolution, Packing"
template: "post"
category : "cs"
tags:
  - bundler
date: 2022-07-03
---
### TL;DR
- 번들러의 역할, 의존성 해결 및 패킹(하나의 파일로 만들기)
- **WebPack vs Rollup**
    - Webpack은 Module Map을 생성
    - Rollup은 Bundle 사이즈가 작으며, 변수/함수명 중복 방지를 위해 변경

## 1. Module bundler는 어떤 문제를 해결하기 위해 등장했을까?

1. 여러 개의 Script file을 로딩하는데, 하나의 script만 로딩하고 싶다.
2. Script 파일별로 의존성이 있는데 순서에 맞게 불러낼 수 있을까?
    - foo ← bar ← test  (의존성 순서대로 호출하지 않는다면, 에러 발생)
3. 동일한 변수/함수가 있다면?

    ```jsx
    <html>
      <script src="/src/foo.js"></script>
      <script src="/src/bar.js"></script>
      <script src="/src/baz.js"></script>
      <script src="/src/qux.js"></script>
      <script src="/src/quux.js"></script>
    </html>
    
    <html>
      <script src="/dist/bundle.js"></script>
    </html>
    ```


## 2. Module bundler란?

> 역할은 2가지 Dependency Resolution, Packing


### 1. Dependency Resolution

![Dependency Resolution](https://i.imgur.com/KViSEQ0.png)

- 의존성 해결을 해결하기 위해 **의존성 그래프**를 만든다!
    - 의존성을 해결하기 위해 필요한 Module 정보(**이름, 위치, 코드, 다른 파일과의 의존성**) 파악
    - Module의 정보를 가지고 의존성 그래프를 생성
- Module의 정보를 가지고 Module Object 만든다.
    - 모듈 오브젝트를 만들때 AST를 활용한다(참고 :  [Detective](https://github.com/browserify/detective) )
    - Document → Dom 으로 만드는것과 비슷한것 같다..

    ```jsx
    let ID = 0
    function createModuleObject(filepath) {
      const source = fs.readFileSync(filepath, 'utf-8')
      const requires = detective(source)
      const id = ID++
    
      return { id, filepath, source, requires }
    }
    ```

  ![module](https://i.imgur.com/6lUymZx.png)

- **Module Map**(hash 구조)을 활용하여 **key : path or name, value: unique key**를 만든다.

  ![module-map](https://i.imgur.com/DAteuaN.png)


- Module Map**을 가지고 의존성을 해결한다**
    - entry / root 모듈을 시작으로 재귀적으로 하위 모듈의 의존성을 탐색하여 Module Map을 만든다.
    - **require**시, 상대경로인지 / `node_modules` 인지는 어떻게 알까?
        - [resolve](https://www.npmjs.com/package/resolve) 모듈의 활용한다면.. 손쉽게 해당 모듈을 불러올수 있다.

        ```jsx
        function getModules(entry) {
          const rootModule = createModuleObject(entry)
          const modules = [rootModule]
        
          // Iterate over the modules, even when new 
          // ones are being added
          for (const module of modules) {
            module.map = {} // Where we will keep the module maps
        
            module.requires.forEach(dependency => {
              const basedir = path.dirname(module.filepath)
              const dependencyPath = resolve(dependency, { basedir })
        
              const dependencyObject = createModuleObject(dependencyPath)
        
              module.map[dependency] = dependencyObject.id
              modules.push(dependencyObject)
            })
          }
        
          return modules
        }
        ```


### 2. Packing

- 브라우저 내에서는 require , moduel.exports를 사용할 수 없는때문 팩토리 함수를 활용
    - 의존성을 외부에서 주입 === requrie 함수를 만들어서 주입
- 이렇게 만든 함수를 브라우저에서 IIFE로 실행해준다 (scope 오염방지)

  ![factory-injection](https://i.imgur.com/moN6kBq.png)

    ```jsx
    function pack(modules) {
      const modulesSource = modules.map(module => 
        `${module.id}: {
          factory: (module, require) => {
            ${module.source}
          },
          map: ${JSON.stringify(module.map)}
        }`
      ).join()
    
      return `(modules => {
        const require = id => {
          const { factory, map } = modules[id]
          const localRequire = name => require(map[name])
          const module = { exports: {} }
          factory(module, localRequire)
          return module.exports
        }
        require(0)
      })({ ${modulesSource} })`
    }
    ```


### 3. 예제 코드 및 결과

- 예제 코드

    ```jsx
    // entry
    const { printHello, hello} = require("./message");
    const { name } = require("./name");
    
    printHello(hello + name)
    
    // message
    module.exports = {
        hello: 'world',
        printHello: (input) => console.log(input)
    }
    
    //name 
    module.exports = {
        name :'junho'
    }
    
    // index
    const graph = getModules('./entry.js');
    const result = pack(graph);
    ```

- Bundle.js

    ```jsx
    ((modules) => {
      const require = (id) => {
        const { factory, map } = modules[id];
        const localRequire = (name) => require(map[name]);
        const module = { exports: {} };
    
        factory(module, localRequire);
    
        return module.exports;
      };
    
      require(0);
    })({
      0: {
        factory: (module, require) => {
          const { printHello, hello } = require('./message');
          const { name } = require('./name');
    
          printHello(hello + name);
        },
        map: { './message': 1, './name': 2 },
      },
      1: {
        factory: (module, require) => {
          module.exports = {
            hello: 'world',
            printHello: (input) => console.log(input),
          };
        },
        map: {},
      },
      2: {
        factory: (module, require) => {
          module.exports = {
            name: 'junho',
          };
        },
        map: {},
      },
    });
    ```


## 3. Webpack vs Rollup 번들 차이

- **"webpack way"**
    - 모듈 맵을 사용한다
    - 각 모듈별로 함수로 랩핑하기 때문에 고유의 Scope를 가진다.
    - 모든 모듈이 런타임 상에 올라간다.
- **"rollup way"**
    - 모든 모듈이 전역 스코프에 위치하며, 모듈을 함수에 감싸지 않는다.
    - 스코프로 인해 변수가 중복이 되기떄문에, 번들시, 변수와 함수 이름을 변경한다.
    - 의존성 순서문제가 있다(순환 의존성 )
- 예제 코드

    ```jsx
    // circle.js
    const PI = 3.141;
    export default function area(radius) {
      return PI * radius * radius;
    }
    
    // square.js
    export default function area(side) {
      return side * side;
    }
    
    //index.js
    import squareArea from './square';
    import circleArea from './circle';
    console.log('Area of square: ', squareArea(5));
    console.log('Area of circle', circleArea(5));
    ```

- Webpack Way

    ```jsx
    const modules = {
      'circle.js': function(exports, require) {
        const PI = 3.141;
        exports.default = function area(radius) {
          return PI * radius * radius;
        }
      },
      'square.js': function(exports, require) {
        exports.default = function area(side) {
          return side * side;
        }
      },
      'app.js': function(exports, require) {
        const squareArea = require('square.js').default;
        const circleArea = require('circle.js').default;
        console.log('Area of square: ', squareArea(5))
        console.log('Area of circle', circleArea(5))
      }
    }
    
    webpackStart({
      modules,
      entry: 'app.js'
    });
    
    function webpackStart({ modules, entry }) {
      const moduleCache = {};
      const require = moduleName => {
        // if in cache, return the cached version
        if (moduleCache[moduleName]) {
          return moduleCache[moduleName];
        }
        const exports = {};
        // this will prevent infinite "require" loop
        // from circular dependencies
        moduleCache[moduleName] = exports;
    
        // "require"-ing the module,
        // exported stuff will assigned to "exports"
        modules[moduleName](exports, require);
        return moduleCache[moduleName];
      };
    
      // start the program
      require(entry);
    }
    ```

- Rollup Way

    ```jsx
    const PI = 3.141;
    
    function circle$area(radius) {
      return PI * radius * radius;
    }
    
    function square$area(side) {
      return side * side;
    }
    
    console.log('Area of square: ', square$area(5));
    console.log('Area of circle', circle$area(5));
    ```


## 참고

- [https://lihautan.com/what-is-module-bundler-and-how-does-it-work/](https://lihautan.com/what-is-module-bundler-and-how-does-it-work/)
- [https://www.freecodecamp.org/news/lets-learn-how-module-bundlers-work-and-then-write-one-ourselves-b2e3fe6c88ae/](https://www.freecodecamp.org/news/lets-learn-how-module-bundlers-work-and-then-write-one-ourselves-b2e3fe6c88ae/)
- https://github.com/adamisntdead/wbpck-bundler
- [https://ak2316.user.srcf.net/2021/07/writing-a-module-bundler/](https://ak2316.user.srcf.net/2021/07/writing-a-module-bundler/)
