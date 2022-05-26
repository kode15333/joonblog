---
title:  "Array Fill 함수 이상하다?"
description: "Array prototype fill에 대해서"
draft: false
template: "post"
category : "js"
tags:
  - js
date: 2022-04-10
---
## 글을 작성하게 된 이유
- fill 함수가 이상하게 동작해서..


### 2차원 배열(5 * 5)을 만들자

```tsx
const matrix = Array(5).fill(new Array())

// output
[[], [], [], [], []]

```

### 0번재 배열 요소에 1을 할당해보자

- 나는... 0번째 배열에만 1을 할당했는데... 모든 배열에 1일 할당 됬다.

```tsx
matrix[0][0] = 1;

// output
// [ [ 1 ], [ 1 ], [ 1 ], [ 1 ], [ 1 ] ]
```

### 문제의 원인

- `Array.prototype.fill`  **Polyfill을** 찾아보면 원인을 쉽게 찾을  수 있었다.
- 같은 배열(즉, 같은 referece 참조)이기 때문에 문제가 발생하였다.

```tsx
if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {
      ... 
      // Step 12.
      while (k < finalValue) {
        O[k] = value; 
        k++;
      }

      // Step 13.
      return O;
    }
  });
}
```

### 해결방법

- `Array.from` 를 활용하여 매번 새롭게 배열을 생성

```tsx
const matrix = Array.from({length: 5}, _ => [])
matrix[0][0] = 1;

// output
// [ [ 1 ], [], [], [], [] ]
```
