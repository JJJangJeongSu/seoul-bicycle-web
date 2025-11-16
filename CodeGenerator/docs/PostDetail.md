# PostDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | 게시글 고유 ID | [default to undefined]
**category** | **string** | 게시글 카테고리 (notice: 공지, info: 정보, question: 질문, free: 자유) | [default to undefined]
**title** | **string** | 게시글 제목 | [default to undefined]
**content** | **string** | 게시글 내용 | [default to undefined]
**author** | **string** | 작성자 이름 | [default to undefined]
**authorId** | **string** | 작성자 ID | [default to undefined]
**views** | **number** | 조회수 | [default to undefined]
**likes** | **number** | 좋아요 수 | [default to undefined]
**comments** | **number** | 댓글 수 | [default to undefined]
**createdAt** | **string** | 작성 시간 | [default to undefined]
**isPinned** | **boolean** | 공지사항 고정 여부 | [optional] [default to undefined]
**authorInfo** | [**PostDetailAllOfAuthorInfo**](PostDetailAllOfAuthorInfo.md) |  | [optional] [default to undefined]

## Example

```typescript
import { PostDetail } from './api';

const instance: PostDetail = {
    id,
    category,
    title,
    content,
    author,
    authorId,
    views,
    likes,
    comments,
    createdAt,
    isPinned,
    authorInfo,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
