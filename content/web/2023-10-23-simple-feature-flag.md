---
title: 'Simple Feature Flag'
description: 'Object Storage를 활용해서 Feature Flag를 만들어보자'
draft: false
template: 'post'
category: 'web'
tags:
    - Feature Flag
date: 2023-10-23
---

## 0. 작성하게 된이유

- (배경) 회사에서는 AWS AppConfig를 통해 Feature Flag를 사용하고 있음
- (계기) 사이드 프로젝트를 하던 와중, 일정 시간이 지나면 배포없이 뷰를 변경하고 싶었다.
- Object Storage(ncloud)를 통해 Feature Flag(only Boolean)를 만들고, 프로젝트에 적용한 경험을 공유하고 싶어서

## ****TL;DR****

- Object Storage를 활용해서 Flag Store를 만들어서 사용하자
- `children` Props 활용해서 FeatureFlagWrapper 만들자

    ```tsx
    <FeatureFlagWrapper flagKey={FLAG_KEY}>
      {({ flagValue }) => {
        if (flagValue) return <True />;
        return <False />;
      }}
    </FeatureFlagWrapper>
    ```


## 1. Feature Flag란?

- Feature Flag는 소프트웨어 개발 및 운영에서 사용되는 기술적인 개념입니다.
- Feature Flag는 Prod 환경에서 실시간으로 소프트웨어의 기능을 활성화 또는 비활성화하거나, 다양한 조건에 따라 특정 사용자 또는 그룹에게 특정 기능을 표시하도록 하는 기능을 제공합니다. 이것은 소프트웨어 업데이트, 테스트, 배포, 사용자 경험 관리, A/B 테스트 및 롤아웃 전략을 관리하는 데 사용됩니다.
- 간단히 말하면, Toggle 기능이라고 생각하면 된다 (기능 On/Off)

## 2. Flag Store 만들기

- 다른 플랫폼(AWS, 핵클)의 기능을 사용하면, 쉽게 적용할 수 있었지만, 사이드 프로젝트에 적용하기에는 공수 / 비용이 많이 들어 간단하게 Object Storage에  Bucket Store(flag.json)을 만든다.

    ```tsx
    // /test-bucket/feature-flag/flag.json
    
    {
      "main-show" : true
    }
    ```


## 3. Flag 값을 가지고 오기 위해(S3 연동) Node API 생성

- **Browser에서 Client를 통해 가져오지 않는 이유는 Cloud Access/Secret 키가 노출되기 때문에, 이러한 작업은 서버에서 처리**
- NextJs -  Page(App) API를 활용해서 S3 접근해서 가져오기

    ```tsx
    // Client 생성
    const s3 = new S3Client({
      endpoint: endpoint,
      region: region,
      credentials: {
        accessKeyId: access_key,
        secretAccessKey: secret_key,
      },
    });
    
    // Bucket 접근
    const getFeatureFlg = async () => {
      const response = await s3.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: `${FEATURE_FLAG_FOLDER}/${FLAG_FILE_NAME}`,
        }),
      );
    
      const str = (await response.Body?.transformToString()) || "";
    
      return JSON.parse(str);
    };
    
    // API (/feature-flag - GET METHOD)
    const { flagKey } = req.query;
    const data = await getFeatureFlg();
    
    const flagValue = data[flagKey];
    
    return res.json({
      data: {
        flagValue,
      },
    });
    ```


## 4. Browser Component에서 Flag 값 사용하기

- React-Query를 통해 FeatureFlag Hook를 만들어서  재사용한다.

    ```tsx
    export interface FeatureFlagProps {
      flagKey: FLAG_KEY_TYPE;
    }
    
    export const useFeatureFlag = ({ flagKey }: FeatureFlagProps) => {
      return useQuery({
        queryKey: ["featureFlag"],
        queryFn: () => getFeatureFlg({ flagKey }),
        select: (response) => response.data?.flagValue,
        refetchOnWindowFocus: false,
        refetchInterval: false,
      });
    };
    ```


## 5. 원하는것은 Flag값이 True/False에 따라 컴포넌트를 보여주고 싶다

- `children` Props를 활용해서 Wrapper를 만들어보자!!!

    ```tsx
    interface FeatureFlagProps {
      flagValue: boolean;
    }
    interface FeatureFlagWrapperProps {
      flagKey: FLAG_KEY_TYPE;
      children: (props: FeatureFlagProps) => ReactNode;
    }
    
    const FeatureFlagWrapper = ({ flagKey, children }: FeatureFlagWrapperProps) => {
      const { data = false, isLoading } = useFeatureFlag({
        flagKey,
      });
    
      if (isLoading) {
        return <Loader />;
      }
    
      if (typeof children !== "function") {
        throw new Error("children must be a function");
      }
    
      return (
        <>
          {children({
            flagValue: data,
          })}
        </>
      );
    };
    
    export default FeatureFlagWrapper;
    ```


## 6. FlagWrapper 사용하기

- Key를 Props를 받아 flagValue를 사용할 수 있다.

    ```tsx
    <FeatureFlagWrapper flagKey={FLAG_KEY.MAIN_SHOW}>
      {({ flagValue }) => {
        if (flagValue) return <True />;
        return <False />;
      }}
    </FeatureFlagWrapper>
    ```
