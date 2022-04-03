---
title: "테이블에 앉을 수 있는 경우의 수(동적계획법)"
description: "동적계획법에 대한 정의와 생각하는 법 "
draft: false
template: "post"
category : "cs" 
tags:
  - 알고리즘
  - cs
date: 2020-03-08
---

## 1. 문제
  - 패밀리 레스토랑에 가서, 여러 개의 테이블에 사람을 나누어 앉게 하려고 합니다. 이때, 한 사람만 앉는 테이블이 없게 그룹을 지어야 합니다. 인원수를 나누는 패턴만 구하면 되며, 누가 어디에 앉는지 등은 고려하지 않아도 괜찮습니다. 한 개의 테이블에 앉을 수 있는 사람은 최대 10명입니다. 100명이 하나 이상의 테이블에 나누어 앉는 패턴을 구하시오

## 2. 생각하는 방법
1. 첫번째
- 일단 1번째 테이블에 앉을 사람 수를 결정하고, 남은 사람은 남은 테이블에 배치하면 됩니다. 1번째 테이블에 앉을 사람수를 결정하면, 테이블 수는 1개 줄게 되며,  남은 사람의 수는 전체에서 1번째 테이블에 앉은 사람의 수를 빼면 구할수있습니다.
- 그런데 테이블 수에는 딱히 제한이 없습니다. 현재 생각해야 하는 것은 사람 수를 나누는 패턴이므로, 이전 테이블에 배치한 인원수와 같거나 많게 반복해서 할당하면 될것입니다.
- 남은 사람 수와 이전 테이블에 배치한 사람 수만 알면, 재귀적으로 검색 할수 있습니다. 남은 사람 수와 이전 테이블에 배치한 사람 수를 매개 변수로 전달하면 됩니다. 

    ```js
    M = 10;
    N = 100;
    funciton check(remain, pre){
      // 배치할 사람이 더 이상 없다면 종료
      if(remain < 0) {return 0;}
      else if(remain === 0){return 1}

      let cnt = 0;
      for(let i = pre, i <= M; i++){
        cnt += check(remain - 1, i);
      }
      return cnt;
    }

    check(N, 2); /// 437,420가지
    ```

2. 두번째
 - 답을 구할 수는 있지만, 사람 수가 많아지면 처리 시간이 매우 오래 걸립니다. 처리 시간이 오래 걸리는 이유는 같은 사람 수를 분배하는 계산을 여러번 반복하기 때문입니다. 그렇다면, 한 번 계산한 결과를 메모해두고, 필요할 때, 새로 계산하지 않고 이를 사용하게 코드를 변경

      ```js
      M = 10;
      N = 100;

      const memo = {};
      function check(remain, pre){
      // 이전에 계산한 적 있다면, 메모했던 값을 반환합니다.
      if(memo[[remain, pre]]) return memo[[remain, pre]];

      // 배치할 사람이 더 이상 없다면 종료
      if(remain < 0) {return 0;}
      else if(remain === 0){return 1}

      let cnt = 0;

      for(let i = pre, i <= M; i++){
        cnt += check(remain - 1, i);
      }
      return memo[[remain, pre]] = cnt;
      }

      check(N, 2); /// 437,420가지
      ```

3. 세번째
-  재귀말고 이중 반복문을 통해서 풀어보자

      ```js
      M = 10;
      N = 100;

      const table = new Array(M + 1);
      for(let i = 0; i <= M; i++){
        table[i] = new Array(N + 1);
        for(let j = 0; j <= N; j++)table[i][j] = 0;
      }

      for(let i = 0; i <= M; i++){
        table[i][0] = 1;
      }

      for(let i = 1; i <= M; i++){
        for(let j = 2; j <= N; j++){
          if((i >= 2) && (j >= i)){
            table[i][j] = table[i][j-1];
          }
          if(i > 2){
          table[i][j] += table[i-1][j];
          }
        }
      }
      ```


## 3. 결론
동적계획법이란 반복문을 사용할 때, 한번 사용한 계산 결과를 저장해두고 활용하는 것
