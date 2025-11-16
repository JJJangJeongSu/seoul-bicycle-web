# Create2


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** | 신고 대상 | [default to undefined]
**bikeId** | **string** | 자전거 ID (type이 bike일 때 필수) | [optional] [default to undefined]
**stationId** | **string** | 대여소 ID (type이 station일 때 필수) | [optional] [default to undefined]
**category** | **string** | 고장 카테고리 | [default to undefined]
**description** | **string** | 고장 상세 설명 | [default to undefined]
**photos** | **Array&lt;string&gt;** | 첨부 사진 URL 목록 | [optional] [default to undefined]

## Example

```typescript
import { Create2 } from './api';

const instance: Create2 = {
    type,
    bikeId,
    stationId,
    category,
    description,
    photos,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
