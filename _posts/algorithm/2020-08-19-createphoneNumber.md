---
title:  "Create Phone Number"
description: "Create Phone Number"
draft: false
template: "post"
category : "os"
tags:
  - os
date: 2020-08-19
---
## [Create Phone Number](https://www.codewars.com/kata/525f50e3b73515a6db000b83)

1. 이해
    - 주어진 숫자배열로 전화번호처럼 만들어라
2. 계획
    - 숫자를 하나씩 빼면서 인덱스를 기준으로 원하는 기호 `(, ), -`를 넣어주자
3. 실행
    ```js
    describe('전화번호 만들기', () => {
        it('최종', () => {
            expect(makePhoneNumber([1,2,3,4,5,6,7,8,9])).toEqual('(123) 456-7890');
        });
    });

    const makePhoneNumber = (numArr) => {
        return numArr.reduce((acc, cur,index, arr) => {
            let accLen = acc.length;
            if(accLen === 0){
                acc.push("(");
            }
            if(accLen === 4){
                acc.push(") ")
            }
            if(accLen === 8){
                acc.push("-")
            }
            acc.push(cur);
            return acc
        }, []).join("")
    }
   
    function createPhoneNumber(numArr){
          let format = "(xxx) xxx-xxxx";
        return numArr.reduce((acc, cur) => {
         return acc.replace('x', cur)
        }, format)
    }
    ```

4. 반성
    - 첫번째 문제를 풀때는 쉽게 생각해서 index를 기준으로 특수문자를 넣어 완성하였다.
    - 하지만, 풀고나서 이것보다는 조금더 효율적인 방법이 있을것 같아 찾아보니 아래와 비슷한 방법이 있었다.
    - 그래서 나는 reduce를 활용하여 string.prototype.replace()를 이용하여 풀었다.
    - string, Array의 내장객체를 이용하여 풀자!! 제일 효율적이다.
   
