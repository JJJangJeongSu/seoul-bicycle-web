# BoardApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createPost**](#createpost) | **POST** /board/posts | 게시글 작성|
|[**createPost_0**](#createpost_0) | **POST** /board/posts | 게시글 작성|
|[**deletePost**](#deletepost) | **DELETE** /board/posts/{postId} | 게시글 삭제|
|[**deletePost_0**](#deletepost_0) | **DELETE** /board/posts/{postId} | 게시글 삭제|
|[**getAllPosts**](#getallposts) | **GET** /board/posts | 게시글 목록 조회|
|[**getAllPosts_0**](#getallposts_0) | **GET** /board/posts | 게시글 목록 조회|
|[**getPostById**](#getpostbyid) | **GET** /board/posts/{postId} | 게시글 상세 조회|
|[**getPostById_0**](#getpostbyid_0) | **GET** /board/posts/{postId} | 게시글 상세 조회|
|[**updatePost**](#updatepost) | **PUT** /board/posts/{postId} | 게시글 수정|
|[**updatePost_0**](#updatepost_0) | **PUT** /board/posts/{postId} | 게시글 수정|

# **createPost**
> CreatePost201Response createPost(createPost)

새로운 게시글을 작성합니다. 로그인한 사용자만 작성할 수 있습니다. 작성자 정보는 JWT 토큰에서 자동으로 추출됩니다.

### Example

```typescript
import {
    BoardApi,
    Configuration,
    CreatePost
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let createPost: CreatePost; //

const { status, data } = await apiInstance.createPost(
    createPost
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPost** | **CreatePost**|  | |


### Return type

**CreatePost201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 게시글 작성 성공 |  -  |
|**400** | 잘못된 요청 - 필수 필드 누락 |  -  |
|**401** | 인증 필요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createPost_0**
> CreatePost201Response createPost_0(createPost)

새로운 게시글을 작성합니다. 로그인한 사용자만 작성할 수 있습니다. 작성자 정보는 JWT 토큰에서 자동으로 추출됩니다.

### Example

```typescript
import {
    BoardApi,
    Configuration,
    CreatePost
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let createPost: CreatePost; //

const { status, data } = await apiInstance.createPost_0(
    createPost
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createPost** | **CreatePost**|  | |


### Return type

**CreatePost201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 게시글 작성 성공 |  -  |
|**400** | 잘못된 요청 - 필수 필드 누락 |  -  |
|**401** | 인증 필요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deletePost**
> deletePost()

게시글을 삭제합니다. 작성자 본인 또는 관리자만 삭제할 수 있습니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let postId: string; //게시글 ID (default to undefined)

const { status, data } = await apiInstance.deletePost(
    postId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postId** | [**string**] | 게시글 ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | 게시글 삭제 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 작성자 또는 관리자만 삭제 가능 |  -  |
|**404** | 게시글을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deletePost_0**
> deletePost_0()

게시글을 삭제합니다. 작성자 본인 또는 관리자만 삭제할 수 있습니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let postId: string; //게시글 ID (default to undefined)

const { status, data } = await apiInstance.deletePost_0(
    postId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postId** | [**string**] | 게시글 ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | 게시글 삭제 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 작성자 또는 관리자만 삭제 가능 |  -  |
|**404** | 게시글을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllPosts**
> GetAllPosts200Response getAllPosts()

커뮤니티 게시판의 게시글 목록을 조회합니다. 카테고리별 필터링, 검색, 페이지네이션을 지원합니다. 공지사항(isPinned: true)은 상단에 고정됩니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let page: number; //페이지 번호 (optional) (default to 1)
let limit: number; //페이지당 항목 수 (optional) (default to 20)
let search: string; //제목 또는 내용 검색어 (optional) (default to undefined)
let category: 'notice' | 'info' | 'question' | 'free'; //게시글 카테고리 필터 (optional) (default to undefined)

const { status, data } = await apiInstance.getAllPosts(
    page,
    limit,
    search,
    category
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 페이지 번호 | (optional) defaults to 1|
| **limit** | [**number**] | 페이지당 항목 수 | (optional) defaults to 20|
| **search** | [**string**] | 제목 또는 내용 검색어 | (optional) defaults to undefined|
| **category** | [**&#39;notice&#39; | &#39;info&#39; | &#39;question&#39; | &#39;free&#39;**]**Array<&#39;notice&#39; &#124; &#39;info&#39; &#124; &#39;question&#39; &#124; &#39;free&#39;>** | 게시글 카테고리 필터 | (optional) defaults to undefined|


### Return type

**GetAllPosts200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 게시글 목록 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllPosts_0**
> GetAllPosts200Response getAllPosts_0()

커뮤니티 게시판의 게시글 목록을 조회합니다. 카테고리별 필터링, 검색, 페이지네이션을 지원합니다. 공지사항(isPinned: true)은 상단에 고정됩니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let page: number; //페이지 번호 (optional) (default to 1)
let limit: number; //페이지당 항목 수 (optional) (default to 20)
let search: string; //제목 또는 내용 검색어 (optional) (default to undefined)
let category: 'notice' | 'info' | 'question' | 'free'; //게시글 카테고리 필터 (optional) (default to undefined)

const { status, data } = await apiInstance.getAllPosts_0(
    page,
    limit,
    search,
    category
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 페이지 번호 | (optional) defaults to 1|
| **limit** | [**number**] | 페이지당 항목 수 | (optional) defaults to 20|
| **search** | [**string**] | 제목 또는 내용 검색어 | (optional) defaults to undefined|
| **category** | [**&#39;notice&#39; | &#39;info&#39; | &#39;question&#39; | &#39;free&#39;**]**Array<&#39;notice&#39; &#124; &#39;info&#39; &#124; &#39;question&#39; &#124; &#39;free&#39;>** | 게시글 카테고리 필터 | (optional) defaults to undefined|


### Return type

**GetAllPosts200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 게시글 목록 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPostById**
> GetPostById200Response getPostById()

특정 게시글의 상세 정보를 조회합니다. 조회 시 조회수(views)가 자동으로 1 증가합니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let postId: string; //게시글 ID (default to undefined)

const { status, data } = await apiInstance.getPostById(
    postId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postId** | [**string**] | 게시글 ID | defaults to undefined|


### Return type

**GetPostById200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 게시글 조회 성공 |  -  |
|**404** | 게시글을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getPostById_0**
> GetPostById200Response getPostById_0()

특정 게시글의 상세 정보를 조회합니다. 조회 시 조회수(views)가 자동으로 1 증가합니다.

### Example

```typescript
import {
    BoardApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let postId: string; //게시글 ID (default to undefined)

const { status, data } = await apiInstance.getPostById_0(
    postId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **postId** | [**string**] | 게시글 ID | defaults to undefined|


### Return type

**GetPostById200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 게시글 조회 성공 |  -  |
|**404** | 게시글을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePost**
> UpdatePost200Response updatePost(updatePost)

기존 게시글을 수정합니다. 작성자 본인만 수정할 수 있습니다.

### Example

```typescript
import {
    BoardApi,
    Configuration,
    UpdatePost
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let postId: string; //게시글 ID (default to undefined)
let updatePost: UpdatePost; //

const { status, data } = await apiInstance.updatePost(
    postId,
    updatePost
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePost** | **UpdatePost**|  | |
| **postId** | [**string**] | 게시글 ID | defaults to undefined|


### Return type

**UpdatePost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 게시글 수정 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 작성자만 수정 가능 |  -  |
|**404** | 게시글을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updatePost_0**
> UpdatePost200Response updatePost_0(updatePost)

기존 게시글을 수정합니다. 작성자 본인만 수정할 수 있습니다.

### Example

```typescript
import {
    BoardApi,
    Configuration,
    UpdatePost
} from './api';

const configuration = new Configuration();
const apiInstance = new BoardApi(configuration);

let postId: string; //게시글 ID (default to undefined)
let updatePost: UpdatePost; //

const { status, data } = await apiInstance.updatePost_0(
    postId,
    updatePost
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updatePost** | **UpdatePost**|  | |
| **postId** | [**string**] | 게시글 ID | defaults to undefined|


### Return type

**UpdatePost200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 게시글 수정 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 작성자만 수정 가능 |  -  |
|**404** | 게시글을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

