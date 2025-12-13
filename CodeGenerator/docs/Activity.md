# Activity

카테고리와 사람이 읽을 수 있는 메시지를 포함하는 활동/알림 항목에 대한 스키마입니다.

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**category** | **string** | \&#39;rental\&#39;|\&#39;repair\&#39;|\&#39;registeration\&#39;|\&#39;board\&#39; | [default to undefined]
**content** | **string** | {사용자이름}이 {행동}을 했습니다 | [default to undefined]
**time** | **string** | 생성시간 | [default to undefined]

## Example

```typescript
import { Activity } from './api';

const instance: Activity = {
    category,
    content,
    time,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
