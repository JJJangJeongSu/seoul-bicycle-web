# DataStation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | 대여소 고유 ID | [default to undefined]
**name** | **string** | 대여소 이름 | [default to undefined]
**address** | **string** | 대여소 주소 | [default to undefined]
**latitude** | **string** | 위도 | [default to undefined]
**longitude** | **string** | 경도 | [default to undefined]
**bike_count** | **number** | 현재 대여 가능한 자전거 수 | [default to undefined]
**capacity** | **number** | 대여소 최대 수용 대수 | [default to undefined]
**status** | **string** | 대여소 운영 상태 (active: 운영 중, inactive: 운영 중지) | [default to undefined]
**created_at** | **string** |  | [default to undefined]
**updated_at** | **string** |  | [default to undefined]

## Example

```typescript
import { DataStation } from './api';

const instance: DataStation = {
    id,
    name,
    address,
    latitude,
    longitude,
    bike_count,
    capacity,
    status,
    created_at,
    updated_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
