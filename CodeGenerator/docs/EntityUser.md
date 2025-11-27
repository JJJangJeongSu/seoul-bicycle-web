# EntityUser


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | 사용자 고유 ID | [default to undefined]
**email** | **string** | 사용자 이메일 주소 (로그인 ID) | [default to undefined]
**name** | **string** | 사용자 이름 | [default to undefined]
**role** | **string** | 사용자 역할 (user: 일반 사용자, admin: 관리자) | [default to undefined]
**phone** | **string** | 전화번호 (형식: 010-XXXX-XXXX) | [default to undefined]
**status** | **string** | 상태 | [default to undefined]

## Example

```typescript
import { EntityUser } from './api';

const instance: EntityUser = {
    id,
    email,
    name,
    role,
    phone,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
