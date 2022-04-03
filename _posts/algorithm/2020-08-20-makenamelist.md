---
title:  "Format a String name"
description: "Format a String name"
draft: false
template: "post"
category : "os"
tags:
  - os
date: 2020-08-20
---
## [Format a string name](https://www.codewars.com/kata/53368a47e38700bd8300030d/train/javascript)

1. 이해
    - name : 'jun'의 형태로 구성된 객체에서 주어진 이름 포멧으로 바꾸기 
2. 계획
    - index를 기준으로 마지막 앞에 있는 글자에 특수문자를 넣어주자
3. 실행
    ```js
    describe('이름 만들기', () => {
        it('최종', () => {
          expect(makeFormat(['Joon','Kim'])).toEqual('Joon & Kim');
          expect(makeFormat(['Joon','Kim','Hong'])).toEqual('Joon, Kim & Hong');
       });
    });

    const makeFormat = (names) => { 
     const namesLen = names.length;

      return names.map(man => man.name).reduce((acc, cur, index) =>{
        if(index === 0) return cur;
        if(index === namesLen - 1) {
          return acc + " & "  + cur
        }
        return acc + ', ' + cur
      }, '')

    }
    ```

4. 반성
    - 문제이 답이 있었는데 어렵게 풀려고 해서 시간이 예상보다 많이 소요됬다.
    - 쉽게 생각하고, 여러 함수로 나누어서(기능을 작제 쪼개서) 만들어보자
   
