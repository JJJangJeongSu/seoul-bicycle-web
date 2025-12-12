# PostDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | 게시글 고유 ID | [default to undefined]
**author_id** | **string** | 작성자 ID | [default to undefined]
**author_name** | **string** | 작성자 이름 | [default to undefined]
**category** | **string** | 게시글 카테고리 (notice: 공지, info: 정보, question: 질문, free: 자유) | [default to undefined]
**title** | **string** | 게시글 제목 | [default to undefined]
**content** | **string** | 게시글 내용 | [default to undefined]
**views** | **number** | 조회수 | [default to undefined]
**comment_count** | **number** | 댓글 수 | [default to undefined]
**is_pinned** | **number** | 공지사항 고정 여부 | [optional] [default to undefined]
**created_at** | **string** | 작성 시간 | [default to undefined]
**updated_at** | **string** | 수정 시간 | [default to undefined]
**comments** | [**Array&lt;Comment&gt;**](Comment.md) |  | [default to undefined]
**authorInfo** | [**PostDetailAllOfAuthorInfo**](PostDetailAllOfAuthorInfo.md) |  | [optional] [default to undefined]

## Example

```typescript
import { PostDetail } from './api';

const instance: PostDetail = {
    id,
    author_id,
    author_name,
    category,
    title,
    content,
    views,
    comment_count,
    is_pinned,
    created_at,
    updated_at,
    comments,
    authorInfo,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
