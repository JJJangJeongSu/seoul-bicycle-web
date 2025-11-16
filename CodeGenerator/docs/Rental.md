# Rental


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | 대여 고유 ID | [default to undefined]
**userId** | **string** | 사용자 ID | [default to undefined]
**bikeId** | **string** | 자전거 ID (Seoul Public Bike) | [default to undefined]
**startStationId** | **string** | 출발 대여소 ID | [default to undefined]
**endStationId** | **string** | 도착 대여소 ID (반납 시에만) | [optional] [default to undefined]
**rentalTime** | **string** | 대여 시작 시간 | [default to undefined]
**returnTime** | **string** | 반납 시간 | [optional] [default to undefined]
**duration** | **number** | 이용 시간 (분 단위) | [optional] [default to undefined]
**distance** | **number** | 이동 거리 (km) | [optional] [default to undefined]
**status** | **string** | 대여 상태 (rented: 대여 중, returned: 반납 완료) | [default to undefined]

## Example

```typescript
import { Rental } from './api';

const instance: Rental = {
    id,
    userId,
    bikeId,
    startStationId,
    endStationId,
    rentalTime,
    returnTime,
    duration,
    distance,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
