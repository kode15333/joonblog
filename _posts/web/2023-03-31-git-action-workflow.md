---
title: "Git WorkFlow 중복 개선"
description: "paths와 workflow_call 이벤트를 활용하여 Git WorkFlow 중복 개선기" 
draft: false 
template: "post"
category : "web"
tags:
- version
date: 2023-03-31
---

### 0. 작성하는 이유

- 현재 회사에서 모노레포 환경(프론트, 백)에서  git Action을 이용하여 CI/CD 구성하고 있다.
- CI 같은 경우, 프로젝트명만 다르고 동일한 Workflow동작한다.
- 프로젝트가 많아질수록 중복되는 Workflow가 생성되고 있다.

### TL;DR

- `dorny/paths-filter@2` plugIn을 이용하여 path를 filter하자
- `workflow_call` 이벤트를 활용하여 WorkFlow를 재사용할 수 있다.
    - `workflow_call` Job이다.. 제약사항을 확인하자
- WorkFlow 적용 레포([링크](https://github.com/kode15333/morerepo-setting/tree/main/.github/workflows))

### 1. Git Action란?

- Git 이벤트를 Hooking 하여, 정의된 Workflow를 실행시켜준다.([링크](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow))
- 해당 워크 플로우는 Main 브런치로 Pull_Request 이벤트가 발생하면 Jobs 실행하여 `1`을 보여준다.

    ```yaml
    name: A Service CI
    on:
      pull_request:
        branches:
          - main
    
    jobs:
      test:
    		runs-on: ubuntu-latest
    		steps:
    		- name: echo number
    			run: echo 1
    		    
    ```


### 2.  Workflow실행시, 프로젝트명을 알 수 없을까?

- **workflow** trigger 환경을 `branch` 뿐만 아니라 `paths` 조건을 추가 할 수 있다.
    - 아래 **workflow**는 `service/**` 변경시에만 작동된다
    - 하지만 **service**의 **foo** 폴더가 바뀌었는지, **bar** 폴더가 바뀌었는지는 확인하지 못한다.

        ```yaml
        name: A Service CI
        on:
          pull_request:
            branches:
              - main
        		paths:
        			- service/**
        ```

- `dorny/paths-filter@2` action plugin을 사용하자
    - paths-filter를 사용하면 filter의 output으로 관리 할 수 있다.

        ```yaml
        ...
        
        jobs:
          path:
            runs-on: ubuntu-latest
            steps:
            - uses: actions/checkout@v3
            - uses: dorny/paths-filter@v2
              id: filter
              with:
                filters: |
                  foo:
                    - service/foo/**
                  bar:
                    - service/bar/**
        		- if: steps.filter.outputs.foo == 'true'
              run: echo foo
        
        		- if: steps.filter.outputs.bar == 'true'
              run: echo bar
        ```

    - if step에서 환경변수를 정해주자
        - set-output을 사용하고 싶었지만, git workflow에서는 권장하지 않는다([링크](https://github.blog/changelog/2022-10-11-github-actions-deprecating-save-state-and-set-output-commands/))

        ```yaml
        ...
        
        env:
        	SERVICE: ''
        
        ...
        		- if: steps.filter.outputs.foo == 'true'
              run: echo "SERVICE=foo" >> $GITHUB_ENV
        
        		- name: echo service
        			run: echo ${{ env.SERVICE }}
        
        ```


    ### 3. 공통 패키지가 변경된다면, 모든 Workflow를 실행 시켜줘야 한다..
    
    - `dorny/paths-filter@2` 로는 문제를 해결하지 못한다.
        
        ```yaml
        - path 필터는 결국 하나의 액션에 하나의 워크플로우 실행시켜주는것 (1 -> 1)
        - 공통 패키지가 변경된다면, 하나의 액션에 여러 워크플로우를 실행시켜줘야한다 (1 -> N)
        ```
        
    
    ### 4. **Reusing workflows .. workflow를 재사용하자**
    
    - `on` 이벤트 trigger `workflow_call` 이용해보자
    - caller(호출하는 **workflow**)
        
        ```yaml
        jobs:
          로컬-Repo-Workflow-호출:
            uses: octo-org/this-repo/.github/workflows/workflow-1.yml@172239021f7ba04fe7327647b213799853a9eb89
        		with:
        			foo: 'local-repo'
          프로젝트-workflows폴더-workflow호출:
            uses: ./.github/workflows/workflow-2.yml
        		with:
        			foo: 'my-repo'
          다른사람이-정의한-레포-Workflow-호출:
            uses: octo-org/another-repo/.github/workflows/workflow.yml@v1
        		with:
        			foo: 'remote-repo'
        ```
        
    - callee(호출당하는 **workflow === Reusing workflows )**
        
        ```yaml
        name: Reusable workflow example
        
        on:
          workflow_call:
            inputs:
              foo:
                required: true
                type: string
        
        jobs:
          triage:
            runs-on: ubuntu-latest
            steps:
            - name: echo input foo
        			run: echo ${{ inputs.foo }}
        ```
        
    
    ### 5. **Reusing Workflow가 안된다면?**
    
    1. RepoSettion → Actions → Actions permissions 확인해보자.
    2. Reusing Workflow는 Job이다!! step에서 호출 할 수 없다.
    3. Reusing Workflow에 대한 [제한사항](https://docs.github.com/en/actions/using-workflows/reusing-workflows#limitations)을 확인하자.

## 출처 및 참고
- [https://docs.github.com/en/actions](https://docs.github.com/en/actions)
- [https://github.com/dorny/paths-filter](https://github.com/dorny/paths-filter)
