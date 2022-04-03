---
title:  "JS Function.prototype.call()"
description: "Function.prototype.call()에 대한 정리"
draft: false
template: "post"
category : "js"
tags:
  - js
date: 2020-02-13
---
## Function.prototype.call()

* call() 메소드는 주어진 this 값 및 각각 전달될 인수와 함께 함수를 호출  
  `apply() 거의 동일하지마느 중요안 차이는 call 인수 목록 / apply 인수 배열 하나`

1. 객체 생성자 연결에 call 사용
  - 자바와 비슷하게 객체 생성자 연결에 call 사용

    ~~~js
    // 전체 객체 생성자 함수 만듬
    function Product(name, price){
      this.name  = name;
      this.price = price;

      if(price < 0){
        throw RangeError(this.name + 'is a Negative price')
      }
    }
    // call을 통해 Food안에 Product를 담는다.
    function Food(name, price){
      Product.call(this, name, price);
      this.category = 'food'
    }
    ~~~
    
2. 익명 함수 호출에 call 사용
    ~~~js
    var animals = [
    { species: 'Lion', name: 'King' },
    { species: 'Whale', name: 'Fail' }];

    for (var i = 0; i < animals.length; i++) {
    (function(i) {
      this.print = function() {
        console.log('#' + i + ' ' + this.species
                    + ': ' + this.name);
      }
      this.print();
    }).call(animals[i], i);
    }
    ~~~
3. 함수 호출 및 'this'를 위한 문맥 지정에 call 사용
    ~~~js
    function greet() {
    var reply = [this.animal, 'typically sleep between', this.sleepDuration].join(' ');
    console.log(reply);
    }

    var obj = {
      animal: 'cats', sleepDuration: '12 and 16 hours'
    };

    greet.call(obj); 
    // cats typically sleep between 12 and 16 hours
    ~~~
 4. 첫번째 인수 지정 없이 함수 호출에 call 사용
    - this가 전역 객체로 바인딩
    ~~~js
    var sData = 'Wisen';            
      function display(){
        console.log('sData value is %s ', this.sData);
      }

      display.call();  // sData value is Wisen
    ~~~
