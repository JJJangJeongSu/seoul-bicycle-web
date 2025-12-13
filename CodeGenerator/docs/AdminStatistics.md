# AdminStatistics


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total_users** | **number** | 총 사용자 수 | [default to undefined]
**total_stations** | **number** | 총 대여소 수 | [default to undefined]
**total_bikes** | **number** | 총 자전거 수 | [default to undefined]
**active_rentals** | **number** | 현재 대여 중인 자전거 수 | [default to undefined]
**today_rentals_today** | **number** | 오늘 대여 건수 | [default to undefined]
**total_repairs_pending** | **number** | 오늘 수리 건수 | [default to undefined]
**recent_activities** | [**Array&lt;Activity&gt;**](Activity.md) | 최근 활동(회원가입/대여/게시글 작성 등등) (최신순 5개) | [default to undefined]
**bike_status** | [**AdminStatisticsBikeStatus**](AdminStatisticsBikeStatus.md) |  | [default to undefined]
**station_status** | [**AdminStatisticsStationStatus**](AdminStatisticsStationStatus.md) |  | [default to undefined]
**repair_status** | [**AdminStatisticsRepairStatus**](AdminStatisticsRepairStatus.md) |  | [default to undefined]
**time_population** | **Array&lt;Array&lt;AdminStatisticsTimePopulationInnerInner&gt;&gt;** | 시간대별 대여량(반납 아님) | [default to undefined]
**popular_stations** | [**AdminStatisticsPopularStations**](AdminStatisticsPopularStations.md) |  | [default to undefined]

## Example

```typescript
import { AdminStatistics } from './api';

const instance: AdminStatistics = {
    total_users,
    total_stations,
    total_bikes,
    active_rentals,
    today_rentals_today,
    total_repairs_pending,
    recent_activities,
    bike_status,
    station_status,
    repair_status,
    time_population,
    popular_stations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
