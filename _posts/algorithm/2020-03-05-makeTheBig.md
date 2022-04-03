---
title: "프로그래머스 - 큰 수 만들기"
description: "TDD를 이용한 1일 1알고리즘 풀기 "
draft: false
template: "post"
category : "cs" 
tags:
  - 알고리즘
  - cs
date: 2020-03-05
---

## [큰 수 만들기](https://programmers.co.kr/learn/courses/30/lessons/42883)

1. 이해
   - 탐욕법을 사용하여 가장 최선의 해를 구하자
   - 숫자로 구성된 문자열을 K만큼 잘라 제일 큰 수를 만드는거다
   - 앞에서 부터 검색이 진행된다고 가정했을떄, 주어진 숫자가 6개고 K가 1이면 5자리 수를 만드는 것이다.
   - 그럼 6자리에서 4자리를 뒤에서 자른 다음 앞에 두자리 중 큰 수를 값에 넣는다.
   - 이렇게 해서 K를 계속해서 줄어주면서 남겨진 숫자 중 제일 큰 수를 넣는다.
   - 탐욕은 주어진 사항에서 최적의 해를 구해 시간에서는 우수하지만 최고의 답은 아니다.

2. 계획
   - 스택을 이용하여 자릿수를 구한 다음 값을 리턴하자

3. 실행

   ```js
   describe("제일 큰 수 만들기", () => {
     it("should ", () => {
       expect(solution("1924", 2)).toEqual(94);
       expect(findBigger("1924")).toEqual("9");
       expect(greedy("4177252841", 4)).toEqual("94");
     });
   });

   const greedy = (number, k) => {
     const stack = [];
     for (let i = 0; i < number.length; i++) {
       let now = number[i];

       while (k > 0 && stack[stack.length - 1] < now) {
         stack.pop();
         k--;
       }
       stack.push(now);
     }

     stack.splice(stack.length - k, k);
     let answer = stack.join("");

     return answer;
   };

   const findBigger = num => {
     let max = 0;
     for (let i of num) {
       if (max < i) {
         max = i;
       }
     }
     return max;
   };

   const solution = (number, k) => {
     return 94;
   };
   ```

4. 반성
   - 반복 조건에 대한 설정이 미흡했다. 결국 힌트를 통해 풀었다.
   - 아직도 마지막 테스트 케이스에 대한 의문을 가지고 있다. 
   - 탐욕법에 대해 공부를 더 해보고 다시 풀어보자.
