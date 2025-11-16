# AiApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**recommendCourse**](#recommendcourse) | **POST** /ai/recommend-course | AI 코스 추천|
|[**recommendCourse_0**](#recommendcourse_0) | **POST** /ai/recommend-course | AI 코스 추천|

# **recommendCourse**
> RecommendCourse200Response recommendCourse(recommendCourse)

사용자의 자연어 요청을 분석하여 적합한 자전거 코스를 추천합니다. 난이도, 소요 시간, 거리, 칼로리 소모량, 주요 경유지 등을 포함합니다. 현재는 키워드 기반 모의 AI를 사용합니다.

### Example

```typescript
import {
    AiApi,
    Configuration,
    RecommendCourse
} from './api';

const configuration = new Configuration();
const apiInstance = new AiApi(configuration);

let recommendCourse: RecommendCourse; //

const { status, data } = await apiInstance.recommendCourse(
    recommendCourse
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recommendCourse** | **RecommendCourse**|  | |


### Return type

**RecommendCourse200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 코스 추천 성공 |  -  |
|**400** | 잘못된 요청 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **recommendCourse_0**
> RecommendCourse200Response recommendCourse_0(recommendCourse)

사용자의 자연어 요청을 분석하여 적합한 자전거 코스를 추천합니다. 난이도, 소요 시간, 거리, 칼로리 소모량, 주요 경유지 등을 포함합니다. 현재는 키워드 기반 모의 AI를 사용합니다.

### Example

```typescript
import {
    AiApi,
    Configuration,
    RecommendCourse
} from './api';

const configuration = new Configuration();
const apiInstance = new AiApi(configuration);

let recommendCourse: RecommendCourse; //

const { status, data } = await apiInstance.recommendCourse_0(
    recommendCourse
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **recommendCourse** | **RecommendCourse**|  | |


### Return type

**RecommendCourse200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 코스 추천 성공 |  -  |
|**400** | 잘못된 요청 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

