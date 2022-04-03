---
title:  "프로그래머스 - 올바른 괄호"
description: "TDD를 이용한 1일 1알고리즘 풀기 "
draft: false
template: "post"
category : "cs" 
tags:
  - 알고리즘
  - cs
date: 2020-03-02
---
## [최대값과 최솟값](https://programmers.co.kr/learn/courses/30/lessons/12909)

1. 이해
    - 문자열로 구성된 괄호들을 짝 찌어있는지 확인
2. 계획
    1. 스택을 이용해서 풀자
    2. peek()함수를 구현하는 것보다는 마지막에 있는 원소를 뽑아 확인하자
    3. length가 0 보다 크다면 false 0 이면 true를 반환하자
3. 실행
    ```js
    describe('올바른 괄호구하기', () => {
    test('should ', () => {
        expect(solution('(()(')).toBeTruthy();
        
        });
    });

    const solution = (s) => {
        const stack = [];
        for(let target of s){
            if(!stack.length){
                stack.push(target)
            }else if(stack[stack.length-1] === '('){
                if(target === ')'){
                    stack.pop();
                }else if(target === '('){
                    stack.push(target)
                }
            }else if(stack[stack.length-1] === ')'){
                stack.push(target)
            }
        }
        

        return stack.length > 0 ? false : true
    };
    ```
4. 반성
    - stack.length === 0 보다는 falsy 값을 이용하면 코드가 간결해진다
    - falsy : false, null, undefined, 0, NaN, ''(빈 문자열)
    - 처음 for문으로 돌릴때는 효율성이 안나와, for..of를 사용하였다.
    - for..of문은 유사배열을 원소를 하나씩 꺼내주는 특성이 있기 때문이다.
    - 다른분은 정규표현식을 이용해서 풀었다... 나도 정규표현식을 자주 사용해보자
    ```js
    function is_pair(s){
    var result = s.match(/(\(|\))/g);
    return result[0] == '(' && result.length % 2 == 0 ? true : false
    }
    ```
