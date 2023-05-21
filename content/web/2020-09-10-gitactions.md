---
title: 'Git Actions 설명'
description: 'Git Actions yml 파일 설명 '
draft: false
template: 'post'
category: 'web'
tags:
    - GitAction
date: 2020-09-10
---

```yaml
# Git Actions YML 파일
# 파일 위치 : 프로젝트 폴더 /.github/workflows/main.yml
name: git action test - build and push master
# 액션의 이름!! 여러개의 WorkFlow를 연결 할 수 있기때문에 라벨링이라고 생각하면 된다.

on:
# 이벤트 리스너라고 생각하면 된다!
  push:
	# push라는 이벤트가 발생하였을때!
    branches: [ master ]
	# 어떤 브런치에서?

	schedule:
	# 예약된 작업을 설정 할 수 있다.
    - cron: '0 * * * *'

#작업에 대한 라벨링
jobs:
  # build1라는 작업!!
  build1:
    # 우리가 올린 소스를 어디서 실행을 할까?
	# 일반적으로 우분트에서 실행이 되지만, Node환경도 추가 가능
    runs-on: ubuntu-latest
    defaults:
    # 실행시 default 값 설정 가능
      run:
        shell: bash
        # 터미널은 bash 사용
        working-directory: scripts
        # build1이라는 작업은 scripts 폴더에서 진행

	# 작업 순서
    steps:
      # actions시 브랜치 이동
      - uses: actions/checkout@master

      # Name은 작업 이름이고 run은 커멘드에서 실행될 명령어
      - name: Run a one-line script
        run: echo Hello, world!

	  # 여러줄의 명령어
      - name: Run a multi-line script
        run: |
          echo Add other actions to build,
          echo test, and deploy your project.name: CI Build

  build2:
    runs-on: ubuntu-latest

	# 전역 변수
    strategy:
      matrix:
        node-version: [ 12.x ]

    steps:
      - uses: actions/checkout@master

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
		# action 마켓에 있는 노드 환경 설정 워크플로우 다운!
        with:
		# setup-node 함수 실행시 필요한 매개변수
          node-version: ${{ matrix.node-version }}
          registry-url: "https://npm.pkg.github.com"

      - name: Cache node modules
        # node_module을 설치하는데 시간이 오래걸리니까 캐싱!!
        uses: actions/cache@v2
        env:
          cache-name: cache-node-modules
        with:
        # npm cache files are stored in `~/.npm` on Linux/macOS
          path: ~/.npm
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-build-${{ env.cache-name }}-
            ${{ runner.os }}-build-
            ${{ runner.os }}-


	  - name: Install dependencies
        run: yarn install
		# 환경 변수
        env:
          CI: true

      - name: Run Build
        run: yarn build

      - name: push
        uses: github-actions-x/commit@v2.7
		# action 마켓에 있는 commit and push 워크플로우 다운!
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          push-branch: 'master'
          commit-message: 'publish'
          force-add: 'true'
          files: build/
          name: will
          email: kode15333@gmail.com
          rebase: 'true'
```

[GitHub Actions Documentation](https://docs.github.com/en/actions)
