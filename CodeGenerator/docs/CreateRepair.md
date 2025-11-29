# CreateRepair


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **string** | 신고 대상 | [default to undefined]
**bike_id** | **string** | 자전거 ID (type이 bike일 때 필수) | [optional] [default to undefined]
**station_id** | **string** | 대여소 ID (type이 station일 때 필수) | [optional] [default to undefined]
**category** | **string** | 고장 카테고리 | [default to undefined]
**description** | **string** | 고장 상세 설명 | [default to undefined]
**photos** | **Array&lt;string&gt;** | 첨부 사진 URL 목록 | [optional] [default to undefined]

## Example

```typescript
import { CreateRepair } from './api';

const instance: CreateRepair = {
    type,
    bike_id,
    station_id,
    category,
    description,
    photos,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
