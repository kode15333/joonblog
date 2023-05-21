---
title: '리눅스 명령어'
description: '리눅스 명령어'
draft: false
template: 'post'
category: 'etc'
tags:
    - etc
date: 2020-03-30
---

0. chmod(권한을 주자)

    ```
    chmod ugo+rwx 파일명
    모든 사용자에게 권한(user, group, other) 읽기 쓰기 실행 권한을 준다

    chmod 755 파일명
        read 4 write 2 excute 1 3개씩 권한을 더해서 권한을 준다.
    ```

1. pwd(pring working directory)

    - 현재 작업중인 디렉토리 정보 출력

2. cd(change directory)

    - 경로 이동

3. ls(list)
    - 디렉토리 목록 확인
    - 옵션
        - a (all) : 숨겨진 파일이나 디렉토리 까지
        - l (long) : 자세한 내용 출력
        - s (size) : 파일 크기 순으로
4. cp(copy)

    - 파일 혹은 디렉토리 복사
    - 디렉토리 복사할때는 -r

        ```bash
        $ ls
        testdir/  testfile


        $ cp testfile1 testfile_cp
        $ ls
        testdir/  testfile  testfile_cp


        $ cp -r testdir testdir_cp
        $ ls
        testdir/  testdir_cp/  testfile  testfile_cp
        ```

5. mv(move)

    - 파일 혹은 디렉토리 이동
    - 이름을 변경할때 사용한다

6. mkdir(make directory)

    - 디렉토리 생성

7. rm(remove)
    - 파일이나 디렉토리 삭제
    - 옵션
        - r 디렉터리를 삭제한다, 하위의 내용을 먼저 삭제한다. (하위에 존재하는 파일이 남아있으면 안 되기 때문에) ("recursive", 재귀적으로)
        - i 삭제를 할 때에 매번 삭제 여부를 사용자에게 묻는다. ("interactive", 대화식으로)
        - f 존재하지 않는 파일을 무시하고 어떠한 확인 메시지도 보여주지 않는다. ("force", 강제로)
        - v 삭제를 하는 동안 삭제되는 내용을 보여준다 ("verbose", 장황하게)
    - 디렉토리 삭제 -r
8. touch

    - 파일이나 디렉토리 업데이트 일자 갱신

9. cat(concatenate)

    - cat 파일 내용 출력

10. head / tail

    - head / tail 10줄을 출력

11. find

    - 파일이나 디렉토리 검색
    - find [검색결로] -name "파일명[확장자도 가능]"

12. which
    - 특정 명령어의 찾아준다.
