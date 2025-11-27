# EntityCourseInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **string** | 코스 이름 | [default to undefined]
**description** | **string** | 코스 설명 | [default to undefined]
**duration** | **number** | 예상 소요 시간 (분) | [default to undefined]
**calories** | **number** | 예상 칼로리 소모량 (kcal) | [default to undefined]
**difficulty** | **string** | 난이도 | [default to undefined]
**distance** | **number** | 총 거리 (km) | [default to undefined]
**highlights** | **Array&lt;string&gt;** | 코스 주요 특징 | [default to undefined]

## Example

```typescript
import { EntityCourseInfo } from './api';

const instance: EntityCourseInfo = {
    name,
    description,
    duration,
    calories,
    difficulty,
    distance,
    highlights,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
