# RouteInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**startStation** | [**Station**](Station.md) |  | [default to undefined]
**endStation** | [**Station**](Station.md) |  | [default to undefined]
**distance** | **number** | 자전거 이동 거리 (km) | [default to undefined]
**duration** | **number** | 예상 소요 시간 (분) | [default to undefined]
**walkingDistanceToStart** | **number** | 출발지에서 출발 대여소까지 도보 거리 (km) | [default to undefined]
**walkingDistanceFromEnd** | **number** | 도착 대여소에서 목적지까지 도보 거리 (km) | [default to undefined]

## Example

```typescript
import { RouteInfo } from './api';

const instance: RouteInfo = {
    startStation,
    endStation,
    distance,
    duration,
    walkingDistanceToStart,
    walkingDistanceFromEnd,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
