# Station1


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | 대여소 고유 ID | [default to undefined]
**name** | **string** | 대여소 이름 | [default to undefined]
**address** | **string** | 대여소 주소 | [default to undefined]
**latitude** | **number** | 위도 | [default to undefined]
**longitude** | **number** | 경도 | [default to undefined]
**bikeCount** | **number** | 현재 대여 가능한 자전거 수 | [default to undefined]
**capacity** | **number** | 대여소 최대 수용 대수 | [default to undefined]
**status** | **string** | 대여소 운영 상태 (active: 운영 중, inactive: 운영 중지) | [default to undefined]

## Example

```typescript
import { Station1 } from './api';

const instance: Station1 = {
    id,
    name,
    address,
    latitude,
    longitude,
    bikeCount,
    capacity,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
