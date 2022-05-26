---
title: "WebWorker를 이용한 병렬처리 - 개선"
description: "WebWorker, SharedWorker, Worker.js 파일 만들지 않기" 
draft: false 
template: "post"
category : "WebAPI"
tags:
- Web-Worker
date: 2022-05-16
---

## 0. 글을 작성하는 이유

- 약 10,000개의 데이터를 가지고 계산하는 로직을... 개선하고 싶어서
    - 모바일 팀은 해당 로직을 백그라운드 쓰레드를 사용한다고 한다!
    - Front도 WebWorker를 사용하면 Main 스레드와 분리해서 병렬처리 할 수 있다!
- WebWorker에 대해서 조금 더 정리하기 위해

## 1. 개선  결과

- Web Worker를 통해 UX를 개선할 수 있었다.
    - Total Bloking Time 10% 감소
    - 개선하면서, 불필요한 Memory를 제거 (outDate)
- 데이터량이 증가해도 Bloking 걱정이 없어졌다.

## 2. WebWorker

### 0. When use Web Worker

- UI 쓰레드에 방해 없이 지속적으로 수행해야 하는 작업
- 매우 복잡한 수학적 계산 작업 (D3, graphic)

### 1. Web Worder에서 할 수 있는 것

- [XMLHttpRequest](https://developer.mozilla.org/en-US/nsIXMLHttpRequest) 를 사용하여 I/O작업을 수행
- [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)과 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 등.

### 2. 제약사항

- Worker는 Parent와 메모리 공유하지 않는다
    - Message Data 타입 : 어떠한 데이터 타입도 전달가능 ([참고](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm))
    - WebWorker는 전달받은 data를 해당 쓰레드 메모리에 저장
- Worker는 Dom에 접근할 수 없다.
    - Dom API(getElementID, querySelector .. )를 사용불가
- Worker는 Parent Page에 직접 접근 할 수 없다
    - postMessage, onmessage를 활용하여 통신할 수 있다.
  > 메모리를 공유할수 있게 `SharedArrayBuffer` 사용하면 되지만 레이스 컨디션(race condition)이 발생한다. [추천하지 않는다.](http://hacks.mozilla.or.kr/2017/11/avoiding-race-conditions-in-sharedarraybuffers-with-atomics/) 관련해서 궁금하다면, Atomics 객체를 확인해보길 바란다.


### 3. 사용법 (예시)

- 메인 스레드와 웹 워커로 생성된 쓰레드 사이에는 **`MessageEvent` 를 통해 데이터를 주고 받을 수 있다.**
    - message에서 알아서 serialize해서 전달해주면 deserialize해서 데이터를 복사한다.

    ```tsx
    // worker.js
    
    onmessage = function(e) {
      console.log('Worker: Message received from main script');
      postMessage(`from: ${e.data[1]}, to:main`);
    }
    
    // main.js
    
    const myWorker = new Worker('worker.js');
    
    myWorker.postMessage(['hello worder', 'worker']);
    
    myWorker.onmessage = function({data}){
    	console.log(data) // from : worker, to: main
    }
    ```


### 4. IMG Main Color 계산

- 복잡한 계산 주체는 Worker로 전달하여 Main 스레드의 일을 줄여준다 🙂
    - `Worker.js` Image  Data를 전달받아 계산 후 결과값을 전달

        ```tsx
        self.onmessage = function (e) {
            const result = getAverageColor(e.data)
            postMessage(result)
        
        }
        
        function getAverageColor(imageData) {
            const data = imageData.data;
            let r = 0;
            let g = 0;
            let b = 0;
        
            for (let i = 0, l = data.length; i < l; i += 4) {
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
            }
        
            r = Math.floor(r / (data.length / 4));
            g = Math.floor(g / (data.length / 4));
            b = Math.floor(b / (data.length / 4));
        
            return {r: r, g: g, b: b};
        }
        ```

    - `Main.js` Image Data를 생성하여 Worker에게 전달

        ```tsx
        <img 
        	id="img" 
        	src="https://source.unsplash.com/user/erondu/1000x960"  
        	onload="load()" 
        	crossOrigin="anonymous"/>
        <div id="main-color"></div>
        
        // script
        const myWorker = new Worker("worker.js");
        
        const load =  async () => {
            const img = document.getElementById('img');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
        		ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, 100,100);
        }
        
        myWorker.onmessage = (e) =>{
            const {r,g,b} = e.data;
            document.querySelector('#main-color').style.backgroundColor = `rgba(${r}, ${g}, ${b})`
        }
        
        ```


## 3. ShareWorker

- 하나의 워커로 message를 수신하고 싶다면 `SharedWorker`를 사용하면 된다.
- 단!!! `SharedWorker`는 safari, webviews는 지원하지 않는다.

    ```tsx
    /// A.html
    const worker = new SharedWorker('worker.js');
      const log = document.getElementById('log');
      worker.port.addEventListener('message', function(e) {
        log.textContent += '\n' + e.data;
      }, false);
      worker.port.start();
      worker.port.postMessage('ping');
    
    // B.html
    const worker = new SharedWorker('worker.js');
      const log = document.getElementById('log');
      worker.port.onmessage = function(e) {
       log.textContent += '\n' + e.data;
      }
    
    // worker.js
    onconnect = function(e) {
      var port = e.ports[0];
      port.postMessage('Hello World!');
    }
    ```


## 4. Worker.js 파일을 별도로 만들지 않고 싶다면...

- `Blob` `URL.createObjectURL` 을 활용하면 된다!

    ```tsx
    const workerCode = `self.onmessage = function (e) {
                                const result = getAverageColor(e.data)
                                postMessage(result)
                        
                            }
                       .... 
                       }`;
        
    const workerBlob = new Blob([workerCode], {type: 'application/javascript'});
    const workerUrl = URL.createObjectURL(workerBlob)
    const myWorker = new Worker(workerUrl);
    ```


## 5. 참고

- [https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [http://hacks.mozilla.or.kr/2017/11/a-cartoon-intro-to-arraybuffers-and-sharedarraybuffers/](http://hacks.mozilla.or.kr/2017/11/a-cartoon-intro-to-arraybuffers-and-sharedarraybuffers/)
- [http://hacks.mozilla.or.kr/2017/11/avoiding-race-conditions-in-sharedarraybuffers-with-atomics/](http://hacks.mozilla.or.kr/2017/11/avoiding-race-conditions-in-sharedarraybuffers-with-atomics/)
- [https://blog.rhostem.com/posts/2021-01-03-image-load-by-web-worker](https://blog.rhostem.com/posts/2021-01-03-image-load-by-web-worker)
- [https://github.com/markuslerner/d3-webworker-pixijs/blob/master/js/index.js](https://github.com/markuslerner/d3-webworker-pixijs/blob/master/js/index.js)
