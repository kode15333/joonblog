---
title:  "Make HashTag"
description: "Make HashTag"
draft: false
template: "post"
category : "os"
tags:
  - os
date: 2020-08-24
---
## [The Hashtag Generator](https://www.codewars.com/kata/52449b062fb80683ec000024/train/javascript)

1. 이해
    - 첫 글자만 대문자로 바꿔 한 단어로 만들자
2. 계획
    - 제한조건으로 먼저 false를 리턴해주자 
    - reduce를 활용하여 문자열의 첫번째 글자를 대문자로 만들어주고 합쳐주자
3. 실행
    ```js
    describe('make hashtag', () => {
        it('최종', () => {
          expect(makeHashtag('Do We have A Hashtag')).toBe('#DoWehaveAHashtag');

       });
    });

     const makeHashtag = (arg) => {
       if(!arg.length){
         return false;
       }else{
        const result = arg.replace(/\b[a-z]/g, str => str.toUpperCase())
               .split(' ')
               .reduce((acc, cur) => acc += cur, '');
         const len = result.length
         return len > 0 && len < 140 &&'#' + result
       }
     }
    ```

4. 반성
    - 제한조건에 대해서 이해가 부족하였다. 제한조건 최종단어의 글자수는 140 이하여야 한다!!
    - 문제에 대해서 2번씩 읽고 시작해야 할것같다.
   
