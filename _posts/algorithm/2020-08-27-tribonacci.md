---
title:  "Tribonacci Sequence"
description: "Tribonacci Sequence"
draft: false
template: "post"
category : "os"
tags:
  - os
date: 2020-08-27
---
## [Tribonacci Sequence](https://www.codewars.com/kata/556deca17c58da83c00002db/train/javascript)

1. 이해
    - 이름 그대로 앞에 세개가 더해져야지 다음수가 나온다
2. 계획
    - fibonacci를 이용해서 풀어보자(재귀함수) 
3. 실행
    ```js
    describe('Unique In Order', () => {
        it('최종', () => {
         expect(uniqueInOrder('AAAABBBCCDAABBB')).toEqual(['A', 'B', 'C', 'D', 'A', 'B'])
         expect(uniqueInOrder('ABBCcAD')).toEqual(['A', 'B', 'C', 'c', 'A', 'D'])
         expect(uniqueInOrder([1,2,2,3,3])).toEqual([1,2,3])
       });
    });

    const uniqueInOrder = function(input){
      if(!(input instanceof Array)){
        input = input.split('');
      }
      return input.reduce((acc, cur) => {
        if(acc.length === 0 || acc[acc.length - 1] !== cur){
          acc.push(cur)
        }
        return acc
      }, [])
    }

    ```

4. 반성
    - push()의 리턴값은 추가 된 length를 반환된다... 이것 때문에 시간이 오래걸렸다.
    - 다른사람의 답안을 봤는데 간단히 for문으로 해결했다. falsy를 이용했다. 부럽다...
        ```js
        function uniqueInOrder1(it) {
          var result = []
          var last
        
          for (var i = 0; i < it.length; i++) {
            if (it[i] !== last) {
              result.push(last = it[i])
            }
          }
        
          return result
        }
        var uniqueInOrder=function(iterable){
          return [...iterable].filter((a, i) => a !== iterable[i-1])
        }
        ```
