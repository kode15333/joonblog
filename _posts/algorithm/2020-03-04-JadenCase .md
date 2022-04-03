---
title:  "프로그래머스 - JadenCase 문자열 만들기"
description: "TDD를 이용한 1일 1알고리즘 풀기 "
draft: false
template: "post"
category : "cs" 
tags:
  - 알고리즘
  - cs
date: 2020-03-04
---
## [JadenCase 문자열 만들기](https://programmers.co.kr/learn/courses/30/lessons/12951)

1. 이해
    - 각 단어의 첫번째 글은 대문자로 변환 그 외는 소문자로 변환하여 반환
2. 계획
    1. split()을 이용해서 각 단어로 나누자
    2. 반복문을 통하여 각 문자의 요소로 접근하여 대/소문자로 변경하자
3. 실행
    ```js
    describe('JadenCase 문자열 만들기', () => {
        it('should ', () => {
            expect(solution('3people unFollowed me')).toEqual('3people Unfollowed Me');
        });

        it('첫문자만 대문자로 바꾸기', () => {
            expect(chageCap('3or the last week')).toEqual('For The Last Week');
        });
    });

    const solution = s => {
        return '3people Unfollowed Me'
    }

    const chageCap = s => {
    
        const sArr = s.split(' ');

        let answer = '';
    
        for(let i = 0 ;i < sArr.length; i++){
            for(let j = 0; j < sArr[i].length; j++){
                if(j === 0){
                    answer += sArr[i][j].toUpperCase();
                }else{
                    answer += sArr[i][j].toLowerCase();
                }
            }
            if(i !== sArr.length - 1){
                answer += " "
            }
        }
    return answer
    }
    ```
4. 반성
    - 스트링은 유사배열이기 때문에 바로 반복문으로 통해 변환하려고 했다.
    - 스트링은 값이 변화려면 주소 자체를 바꿔야한다라는 것을 한시간 동안 고생하고 설마하는 마음에 알았다. 기초를 탄탄히 공부하자
    - toUpperCase() / toLowerCase() 는 원본의 값을 건들지 않는다
    - 나의 첫 계획은 아래와 같은 것이없지만, 아직도 map에 대해서 공부가 필요한것 같다.
    - 문제 주석 주어진 문자열을 공백으로 나누고 map을 통해 문자에 첫번째는 대문자로 나머지는 소문자로 변환해서 값을 리턴 그 다음 다시 조인
    ```js
    function solution(s) {
        return s.split(" ").map(v => v.charAt(0).toUpperCase() + v.substring(1).toLowerCase()).join(" ");
    }
    ```
