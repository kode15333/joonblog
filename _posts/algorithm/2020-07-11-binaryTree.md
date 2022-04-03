---
title:  "이진탐색 트리"
description: "이진탐색 트리 검색/ 삽입 / 삭제"
draft: false
template: "post"
category : "os"
tags:
  - os, js
date: 2020-07-11
---
## 이진탐색 트리 자바스크립트 구현(진행중)
```js
function BinarySearchTree(){
	var Node = function(key){
		this.key = key;
		this.left = null;
		this.right = null;
	}

	var root = null;

	this.insert = function(key) {
		var newNode = new Node(key);

		if(root == null){
			root = newNode
		}else{
			insertNode(root, newNode);
		}

	}

	
	this.inOrderTraverse = function(callback){
		inOrderTraverseNode(root, callback)
	}

	this.preOrderTraverse = function(callback){
		preOrderTraverseNode(root, callback)
	}

	this.postOrderTrave = function(callback){
		postOrderTraveNode(root, callback)
	}
	this.min = function(){
		console.log(minNode(root))
		return minNode(root);
	}
	this.max = function(){
		console.log(maxNode(root))
		return maxNode(root);
	}
	this.search = function(key){
		return searchNode(root, key);
	}
	this.remove = function(key){
		return removeNode(root, key);
	}
}

var removeNode = function(node, key){
	if(node === null){
		return null;
	}
	if(key < node.key){
		node.left = removeNode(node.left, key);
		return node;
	} else if(key > node.key){
		node.right = removeNode(node.right, key);
		return node;
	}else{
		if(node.left === null && node.right === null){
			node = null;
			return node;
		}
		if(node.left === null){
			node = node.right;
			return node;
		}else if(node.right === null){
			node = node.left;
			return node;
		}

		var aux = findMinNode(node.right);
		node.key = aux.key;
		node.right = removeNode(node.right, aux.key)
		return node
	}

}

var insertNode = function(node, newNode){
	if(newNode.key < node.key){
		if(node.left === null){
			node.left = newNode;
		}else{
			insertNode(node.left, newNode);
		}
	}else{
		if(node.right === null){
			node.right = newNode;
		}else{
			insertNode(node.right, newNode);
		}
	}
}


var inOrderTraverseNode = function(node, callback){
	console.log(node)
	if(node !== null){
		inOrderTraverseNode(node.left, callback);

		callback(node.key);

		inOrderTraverseNode(node.right, callback);

	}
}

var preOrderTraverseNode = function(node, callback){
	if(node !== null){
		callback(node.key)
		preOrderTraverseNode(node.left, callback);
		preOrderTraverseNode(node.right, callback)
	}
}

var postOrderTraveNode = function(node, callback){
	if(node !== null){
		postOrderTraveNode(node.left, callback)
		postOrderTraveNode(node.right, callback)
		callback(node.key)
	}
}

var minNode = function(node){
	if(node){
		while(node && node.left !== null){
			node = node.left
		}
		return node.key;
	}

	return null;
}

var maxNode = function(node){
	if(node){
		while(node && node.right !== null){
			node = node.right;
		}
		return node.key;
	}
	return null;
}
var searchNode = function(node, key){
	if(node === null){
		return false;
	}
	if(key < node.key){
		return searchNode(node.left, key)
	}else if(key > node.key){
		return searchNode(node.right, key)
	}else{
		return true;
	}
}

function printNode(value){
	console.log(value)
}
var tree = new BinarySearchTree();
tree.insert(11);
tree.insert(7);
tree.insert(15);
tree.insert(5);
tree.insert(3);
tree.insert(9);
tree.insert(8);
tree.insert(10);
tree.insert(13);
tree.insert(12);
tree.insert(14);
tree.insert(20);
tree.insert(18);
tree.insert(25);
tree.insert(6);
tree.inOrderTraverse(printNode);
tree.preOrderTraverse(printNode)
tree.postOrderTrave(printNode)
tree.min();
tree.max();
console.log(tree.search(1))
```
