---
title:  "JS Request_Object"
description: "자바스크립트 Request_Object 정리"
draft: false
template: "post"
category : "js"
tags:
  - HTTP프로토콜
  - js
date: 2020-02-12
---
## [Request](https://developer.mozilla.org/ko/docs/Web/API/Request)

1. Request.Request() 생성자 메소드를 통해 HTTP Request 객체를 만들어준다
2. var myRequest = new Request(input, [init]);
    - parameter
        1. input: url
        2. init : 옵션

        |옵션|정의|
        |---|---|
        |method|GET, POST과 같은 리퀘스트 메소드.|
        |headers| Headers객체 또는 ByteString를 포함하는 리퀘스트에 추가하는 헤더.|
        |body|리퀘스트에 추가할 바디.  Blob이나, BufferSource, FormData, URLSearchParams, USVString, 또한 ReadableStream 객체를 사용할 수 있습니다.Request객체가 GET이나 HEAD메서드를 사용하는 경우, 바디를 포함하지 않습니다.|
        |mode| Request에서 사용할 모드. cors, no-cors, same-origin, 또한 navigate이 사용 가능하며, 기본값은 cors입니다. 47버전 이전의 크롬에서는 기본값이 no-cors 이며 크롬 47버전 이후로 same-origin가 사용 가능하게 되었습니다.|
        |credentials|Request에서 사용할 자격 증명서(Request Credential)입니다.omit,  same-origin, 또는 include를 사용할 수 있습니다.기본값은 omit.이며, 크롬 47 이전의 기본값은 same-origin 입니다. 크롬 47 이후로부터include가 사용 가능하게 되었습니다.
        |cache|Request에서 사용할 cache mode 입니다.|
        |redirect|Request에서 사용할 리다이렉트 모드입니다. follow, error, manual.이 사용 가능합니다. 크롬 47 이전 버전에서의 기본값은 manual 이며, 47 이후로부터 follow 가 사용 가능하게 되었습니다.|
        |referrer|no-referrer나 client, URL을 지정하는 USVString입니다.. 기본값은 client입니다.|
        |integrity|sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=같은 Request의 하위 리소스 무결성(subresource integrity) 값을 포함합니다.|


    ```js
    //Request() 생성자를 사용하여 새로운 Request를 생성하여 프로퍼티를 반환합니다.
    const myRequest = new Request('http://localhost/flowers.jpg');

    const myURL = myRequest.url; // http://localhost/flowers.jpg
    const myMethod = myRequest.method; // GET
    const myCred = myRequest.credentials; // omit

    //  Request() 생성자를 사용하여 초기 데이터와 Body의 컨텐츠를 읽어올 수 있습니다.
    const myRequest = new Request('http://localhost/api', {method: 'POST', body: '{"foo":"bar"}'});
    
    const myURL = myRequest.url; // http://localhost/api
    const myMethod = myRequest.method; // POST
    const myCred = myRequest.credentials; // omit
    const bodyUsed = myRequest.bodyUsed; // true

    // fetch API를 통하여 Request객체로 api 요청 가능
    fetch(myRequest)
    .then(response => {
        if (response.status === 200) {
            // fetch는 status를 통해서 구분한다. 400, 500 error도 resolve 객체 반환
        return response.json();
        } else {
        throw new Error('Something went wrong on api server!');
        }
    })
    .then(response => {
        console.debug(response);
        // ...
    }).catch(error => {
        console.error(error);
    });

    ```

