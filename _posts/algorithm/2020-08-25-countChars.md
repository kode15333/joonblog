---
title:  "Count characters in your string"
description: "Count characters in your string"
draft: false
template: "post"
category : "os"
tags:
  - os
date: 2020-08-25
---
## [Count characters in your string](https://www.codewars.com/kata/52efefcbcdf57161d4000091/train/javascript)

1. 이해
    - 주어진 문자열의 갯수를 구하자 
2. 계획
    - 제한조건 "" => {} 먼저 false를 리턴해주자 
    - reduce를 활용하여 문자를 키값을 가진 객체를 만들어주어 반환하자
3. 실행
    ```js
    describe('Count characters in your string', () => {
        it('최종', () => {
          expect(countChars("aba")).toEqual({a : 2, b : 1})
          expect(countChars("")).toEqual({})
       });
    });

    const countChars = (str) => {
      if(!str.match(/[a-z]/i)) return {};
      return str.split('').reduce((acc, str) => {
        if(!acc[str]){
          acc[str] = 1
        }else{
          acc[str] += 1
        }
        return acc
      }, {})
    }
    ```

4. 반성
    - reduce를 작성할때 항상 return acc를 해주고 시작하자 안하면 오류발생
    - reduce와 정규표현식을 이용해서 최대한 풀어보자
   
