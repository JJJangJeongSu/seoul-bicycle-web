# Comment


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**comment_id** | **string** | 댓글 고유 ID | [default to undefined]
**author_id** | **string** | 작성자 ID | [default to undefined]
**author_name** | **string** | 작성자 이름 | [default to undefined]
**category** | **string** | 게시글 카테고리 (notice: 공지, info: 정보, question: 질문, free: 자유) | [default to undefined]
**created_at** | **string** | 작성 시간 | [default to undefined]

## Example

```typescript
import { Comment } from './api';

const instance: Comment = {
    comment_id,
    author_id,
    author_name,
    category,
    created_at,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
