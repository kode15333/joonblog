---
title: 'Socket.io'
description: 'Socket.io를 이용하여 채팅프로그램 구현'
draft: false
template: 'post'
category: 'etc'
tags:
    - etc
    - sockeio
date: 2020-01-16
---

## socket.io

1. 정의 : 소켓통신

2. 함수

    - io.on('event name', callback)
        - event name : connect, disconnect (연결 성공 / 연결 해제)
        - callback 으로 통해 socket객체를 이용할수 있다.
    - socket.emit('event name', data)
        - event name : 사용자 정의
        - data : 값을 전달할수잇다. 단!!! JSON 형식 { 키 : 벨류}
    - socket.on('event name', callback)
        - event name : 사용자 정의
        - callback : callback을 통해서 socket.emit()으로 전해진 데이터를 받을 수 있다.
    - socket.broadcast.emit('event name', data)
        - 전체 소켓에게 전달() 단! 전달자 제외!
    - io.socket.emit('event name', data)
        - 전체 소켓에게 전달!!!

3. 코드 구현

    - 클라이언트

    ```js
    <body>
    <ul id="messages"></ul>
    <form action="">
      <input id="m" autocomplete="off" /><button>Send</button>
    </form>
    </body>
    <script src="/socket.io/socket.io.js"></script>
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
    <script>
    $(function () {
        var socket = io();
        $('form').submit(function(e){
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
        });
    });
    </script>
    ```

    - 서버

    ```js
    var app = require('express')()
    var http = require('http').createServer(app)
    var io = require('socket.io')(http)

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html')
    })

    io.on('connection', function (socket) {
        console.log('a user connected')
    })

    http.listen(3000, function () {
        console.log('listening on *:3000')
    })
    ```
