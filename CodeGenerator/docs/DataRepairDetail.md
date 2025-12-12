# DataRepairDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | 신고 고유 ID | [default to undefined]
**reporter_id** | **string** | 신고자 ID | [default to undefined]
**reporter_name** | **string** | 신고자 이름 | [default to undefined]
**type** | **string** | 신고 대상 (bike: 자전거, station: 대여소) | [default to undefined]
**bike_id** | **string** | 자전거 ID (type이 bike일 때만) | [optional] [default to undefined]
**station_id** | **string** | 대여소 ID (type이 station일 때만) | [optional] [default to undefined]
**category** | **string** | 고장 카테고리 | [default to undefined]
**description** | **string** | 고장 상세 설명 | [default to undefined]
**status** | **string** | 처리 상태 (pending: 대기 중, in-progress: 처리 중, completed: 완료) | [default to undefined]
**admin_note** | **string** | 관리자 메모 | [optional] [default to undefined]
**created_at** | **string** | 신고 접수 시간 | [default to undefined]
**completed_at** | **string** | 처리 완료 시간 | [optional] [default to undefined]
**updated_at** | **string** | 업데이트 시간 | [default to undefined]
**station_name** | **string** | 대여소 이름 | [default to undefined]
**reporterInfo** | [**DataRepairDetailAllOfReporterInfo**](DataRepairDetailAllOfReporterInfo.md) |  | [optional] [default to undefined]

## Example

```typescript
import { DataRepairDetail } from './api';

const instance: DataRepairDetail = {
    id,
    reporter_id,
    reporter_name,
    type,
    bike_id,
    station_id,
    category,
    description,
    status,
    admin_note,
    created_at,
    completed_at,
    updated_at,
    station_name,
    reporterInfo,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
