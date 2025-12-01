# Rental


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | 대여 고유 ID | [default to undefined]
**user_id** | **string** | 사용자 ID | [default to undefined]
**bike_id** | **string** | 자전거 ID (Seoul Public Bike) | [default to undefined]
**start_station_id** | **string** | 출발 대여소 ID | [default to undefined]
**end_station_id** | **string** | 도착 대여소 ID (반납 시에만) | [default to undefined]
**rental_time** | **string** | 대여 시작 시간 | [default to undefined]
**return_time** | **string** | 반납 시간 | [default to undefined]
**duration** | **number** | 이용 시간 (분 단위) | [optional] [default to undefined]
**distance** | **string** | 이동 거리 (km) | [optional] [default to undefined]
**status** | **string** | 대여 상태 (rented: 대여 중, returned: 반납 완료) | [default to undefined]
**bike_model** | **string** | 자전거 모델 | [default to undefined]

## Example

```typescript
import { Rental } from './api';

const instance: Rental = {
    id,
    user_id,
    bike_id,
    start_station_id,
    end_station_id,
    rental_time,
    return_time,
    duration,
    distance,
    status,
    bike_model,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
