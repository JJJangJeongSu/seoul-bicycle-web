# UserStatistics


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**totalRentals** | **number** | 총 대여 횟수 | [default to undefined]
**totalDistance** | **number** | 총 이동 거리 (km) | [default to undefined]
**totalDuration** | **number** | 총 이용 시간 (분) | [default to undefined]
**averageDistance** | **number** | 평균 이동 거리 (km) | [default to undefined]
**averageDuration** | **number** | 평균 이용 시간 (분) | [default to undefined]
**monthly_usage** | **Array&lt;number&gt;** | 월별 사용시간 | [default to undefined]
**weekly_usage** | **Array&lt;number&gt;** | 요일번 사용시간 | [default to undefined]
**commonly_used_station** | [**Array&lt;StationUsageCount&gt;**](StationUsageCount.md) | 대여 or 반납 자주 하는 정류장 | [default to undefined]

## Example

```typescript
import { UserStatistics } from './api';

const instance: UserStatistics = {
    totalRentals,
    totalDistance,
    totalDuration,
    averageDistance,
    averageDuration,
    monthly_usage,
    weekly_usage,
    commonly_used_station,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
