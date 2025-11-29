# AiApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**aiCourseGet**](#aicourseget) | **GET** /ai/course | 코스 경로 제공|
|[**recommendCourse**](#recommendcourse) | **GET** /ai/LLMrequest-coords | AI 코스 추천|
|[**recommendCourse_0**](#recommendcourse_0) | **GET** /ai/LLMrequest-coords | AI 코스 추천|

# **aiCourseGet**
> AiCourseGet200Response aiCourseGet()

출발지와 목적지의 위,경도가 주어지면 그 둘을 잇는 경로가 반환됩니다.

### Example

```typescript
import {
    AiApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AiApi(configuration);

let start: string; //출발지 위,경도 (optional) (default to undefined)
let end: string; //목적지 위,경도 (optional) (default to undefined)

const { status, data } = await apiInstance.aiCourseGet(
    start,
    end
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **start** | [**string**] | 출발지 위,경도 | (optional) defaults to undefined|
| **end** | [**string**] | 목적지 위,경도 | (optional) defaults to undefined|


### Return type

**AiCourseGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** |  |  -  |
|**400** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recommendCourse**
> RecommendCourse200Response recommendCourse()

사용자의 자연어 요청을 분석하여 적합한 자전거 코스를 추천합니다.

### Example

```typescript
import {
    AiApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AiApi(configuration);

let prompt: string; //사용자가 입력한 prompt (LLM이 사용) (optional) (default to undefined)

const { status, data } = await apiInstance.recommendCourse(
    prompt
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **prompt** | [**string**] | 사용자가 입력한 prompt (LLM이 사용) | (optional) defaults to undefined|


### Return type

**RecommendCourse200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 코스 추천 성공 |  -  |
|**400** | 잘못된 요청 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recommendCourse_0**
> RecommendCourse200Response recommendCourse_0()

사용자의 자연어 요청을 분석하여 적합한 자전거 코스를 추천합니다.

### Example

```typescript
import {
    AiApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AiApi(configuration);

let prompt: string; //사용자가 입력한 prompt (LLM이 사용) (optional) (default to undefined)

const { status, data } = await apiInstance.recommendCourse_0(
    prompt
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **prompt** | [**string**] | 사용자가 입력한 prompt (LLM이 사용) | (optional) defaults to undefined|


### Return type

**RecommendCourse200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 코스 추천 성공 |  -  |
|**400** | 잘못된 요청 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

