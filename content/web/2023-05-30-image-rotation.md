---
title: '이미지 업로드시, 회전하는 이슈'
description: '이미지 업로드시, 회전하는 이슈 핸들링'
draft: false
template: 'post'
category: 'web'
tags:
    - image
date: 2023-05-30
---

## 0. 작성하게 된이유

- AI로 이미지를 보냈는데…? 이미지가 돌아가서 왔다…
- 이미지에는 여러가지의 정보가 들어있구나..

## ****TL;DR****

- 모바일(or 디지털 카메라)로 찍은 이미지는 여러 Meta(촬영 일시 및 시간)정보가 들어있다.
    - `Orientation` 값으로 인해 이미지가 돌아가는것이다.
- 이미지 MetaData를 바꿔주자
    - `blueimp-load-image` 이용하여 MetaData를 수정할 경우, Image 손실이 크다(약 50%이상)
    - File → Blob → File 같은 Flow Image 손실 적게 MetaData를 Reset 할 수 있다.

## 1. 이미지 Exif 정보란?

- 정의 : Exif는 "Exchangeable Image File Format"의 약자로, 디지털 카메라와 다른 디지털 이미지 캡처 장치에서 이미지와 함께 추가 정보를 저장하기 위해 사용되는 표준 형식

- Exif의 정보
    - 촬영 일시 및 시간
    - 카메라 모델 및 제조사
    - 렌즈 정보
    - 노출 시간 및 조리개 값
    - 촬영 모드 (자동, 수동 등)
    - 화이트 밸런스 설정
    - GPS 위치 정보
    - 이미지 해상도 및 크기
- `문제의 Exif - orientation`
    - 사진을 어떻게 찍던 모바일에서는 찰떡같이 바로 보여준다.
    - 이미지를 업로드하면, S3/Image 서버는 아래의 정보를 읽어서 이미지를 저장하는것같다…?

    ![orientation-info](/assets/image-rotation/image-rotation-1.png)


## 2.  이미지 Exif(Orientation)를 수정하자

- 이미지 MetaData데이터를 읽기 위해서는 라이브러리(`blueimp-load-image`)를 이용하자
- 문제의 이미지 Exif 정보 (274 = Orientationn 정보)

  ![exif](/assets/image-rotation/image-rotation-2.png)

- 코드

    ```jsx
    let file = e.target.files[0];
    
    loadImage(
      file,
      function (img, data) {
        if (data.imageHead && data.exif) {
    			// Orientation 정보를 Reset
          loadImage.writeExifData(data.imageHead, data, 'Orientation', 1)
          img.toBlob(function (blob) {
            loadImage.replaceHead(blob, data.imageHead, function (newBlob) {
    						// newBlob(Orientation 정보 reset)
            })
          }, 'image/jpeg', 1 // 이미지 Quality)
        }
      },
      { meta: true, orientation: true }
    )
    ```


## 3.  Exif 메타정보가 변경된 이미지는 화질이 너무 떨어진다

- 이미지 손실(2.7MB → 968KB)이 너무 심각해서.. 이미지를 다루는 서비스에서는 사용하기 어렵다.
- 간단한 프로필 이미지같은 경우에는 충분히 사용가능

## 4. Meta 정보가 필요없다면, Reset

- 이미지 Meta정보가 필요없다면, 아래와 같이 변경 할 수 도 있다.
- File → Blob → File로 변경하면 손실 없이 Meta정보를 변경(Reset)할 수 도 있다.

    ```jsx
    export const convertToNewFile = (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const image = new Image();
    
        const handleError = (error: unknown) => {
          reject(error);
        };
    
        const handleBlob: BlobCallback = (blob) => {
          if (!blob) return resolve(file);
    
          const newFile = new File([blob], file.name, { type: blob.type });
          resolve(newFile);
        };
    
        const handleLoad = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;
    
          canvas.width = image.width;
          canvas.height = image.height;
    
          ctx.drawImage(image, 0, 0);
    
          canvas.toBlob(handleBlob, file.type, 1);
        };
    
        reader.addEventListener("load", (event) => {
          image.addEventListener("load", handleLoad);
          image.addEventListener("error", handleError);
    
          image.src = event.target!.result as string;
        });
        reader.addEventListener("error", handleError);
    
        reader.readAsDataURL(file);
      });
    };
    ```


## 참고

- https://github.com/blueimp/JavaScript-Load-Image#setup
- [https://velog.io/@khy226/모바일-사진-업로드-시-90도-회전하는-문제-해결-feat.-Exif-메타데이터-blueimp-load-image](https://velog.io/@khy226/%EB%AA%A8%EB%B0%94%EC%9D%BC-%EC%82%AC%EC%A7%84-%EC%97%85%EB%A1%9C%EB%93%9C-%EC%8B%9C-90%EB%8F%84-%ED%9A%8C%EC%A0%84%ED%95%98%EB%8A%94-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0-feat.-Exif-%EB%A9%94%ED%83%80%EB%8D%B0%EC%9D%B4%ED%84%B0-blueimp-load-image)
