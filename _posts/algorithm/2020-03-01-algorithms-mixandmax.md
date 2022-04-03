---
title:  "프로그래머스 - 최대값과 최솟값"
description: "TDD를 이용한 1일 1알고리즘 풀기 "
draft: false
template: "post"
category : "cs" 
tags:
  - 알고리즘
  - cs
date: 2020-03-01
---
## [최대값과 최솟값](https://programmers.co.kr/learn/courses/30/lessons/12939)

1. 이해
    - 문자열로 구성된 input에서 제일 작은 수와 큰 수를 찾아 리턴
2. 계획
    1. 문자열을 배열로 바꿔준다. => Array.prototype.split()
    2. 배열을 오름차순 정렬해준다. => Array.prototype.sort()
    3. 첫번째 인자와 마지막 인자를 문자열로 만들어 리턴해준다.
3. 실행
    ```js
    describe('최대값과 최소값', () => {
        test('should', () => {
            expect(solution("1 2 3 4")).toEqual("1 4");
            expect(sortArr("-1")).toEqual("-1 -1");
        });
    });

    const solution = (s) => {
        return "1 4"
    }
    const sortArr = str => {
        const arr = str.split(' ').sort((a,b)=>a-b);
        return arr[0] + " " + arr[arr.length-1]
    }
    ```
4. 반성
    - 내장함수를 통하여 쉽게 풀수 있었다.
    - 다른 분들의 답을 보니 배열의 뿐만 아니라 Math를 통해서 최소 최대를 구하였다. 조금 더 쉽게 생각해서 풀어보자
    ```js
    function solution(s) {
        const arr = s.split(' ');

        return Math.min(...arr)+' '+Math.max(...arr);
    }
    ```
