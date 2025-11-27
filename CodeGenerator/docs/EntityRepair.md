# EntityRepair


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | 신고 고유 ID | [default to undefined]
**type** | **string** | 신고 대상 (bike: 자전거, station: 대여소) | [default to undefined]
**bikeId** | **string** | 자전거 ID (type이 bike일 때만) | [optional] [default to undefined]
**stationId** | **string** | 대여소 ID (type이 station일 때만) | [optional] [default to undefined]
**category** | **string** | 고장 카테고리 | [default to undefined]
**description** | **string** | 고장 상세 설명 | [default to undefined]
**reporter** | **string** | 신고자 이름 | [default to undefined]
**reporterId** | **string** | 신고자 ID | [default to undefined]
**status** | **string** | 처리 상태 (pending: 대기 중, in-progress: 처리 중, completed: 완료) | [default to undefined]
**createdAt** | **string** | 신고 접수 시간 | [default to undefined]
**completedAt** | **string** | 처리 완료 시간 | [optional] [default to undefined]
**adminNote** | **string** | 관리자 메모 | [optional] [default to undefined]

## Example

```typescript
import { EntityRepair } from './api';

const instance: EntityRepair = {
    id,
    type,
    bikeId,
    stationId,
    category,
    description,
    reporter,
    reporterId,
    status,
    createdAt,
    completedAt,
    adminNote,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
