# Metadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**timestamp** | **string** | 응답 생성 시간 (ISO 8601) | [default to undefined]
**version** | **string** | API 버전 | [default to undefined]
**api** | **string** | API 이름 | [optional] [default to undefined]
**operation** | **string** | 작업 타입 | [optional] [default to undefined]
**requestId** | **string** | 요청 추적을 위한 고유 ID | [default to undefined]
**processingTime** | **number** | 처리 시간 (밀리초) | [optional] [default to undefined]

## Example

```typescript
import { Metadata } from './api';

const instance: Metadata = {
    timestamp,
    version,
    api,
    operation,
    requestId,
    processingTime,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
