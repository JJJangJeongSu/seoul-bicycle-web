# RepairsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createRepair**](#createrepair) | **POST** /repairs | 고장 신고 등록|
|[**createRepair_0**](#createrepair_0) | **POST** /repairs | 고장 신고 등록|
|[**getMyRepairs**](#getmyrepairs) | **GET** /repairs/my | 내 신고 내역 조회|
|[**getMyRepairs_0**](#getmyrepairs_0) | **GET** /repairs/my | 내 신고 내역 조회|
|[**getRepairById**](#getrepairbyid) | **GET** /repairs/{repairId} | 신고 상세 조회|
|[**getRepairById_0**](#getrepairbyid_0) | **GET** /repairs/{repairId} | 신고 상세 조회|

# **createRepair**
> CreateRepair201Response createRepair(create2)

자전거 또는 대여소의 고장을 신고합니다. 신고 유형(자전거/대여소), 카테고리(브레이크, 타이어 등), 상세 설명을 포함해야 합니다. 사진 첨부는 선택사항입니다.

### Example

```typescript
import {
    RepairsApi,
    Configuration,
    Create2
} from './api';

const configuration = new Configuration();
const apiInstance = new RepairsApi(configuration);

let create2: Create2; //

const { status, data } = await apiInstance.createRepair(
    create2
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **create2** | **Create2**|  | |


### Return type

**CreateRepair201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 고장 신고 성공 |  -  |
|**400** | 잘못된 요청 - 필수 필드 누락 |  -  |
|**401** | 인증 필요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createRepair_0**
> CreateRepair201Response createRepair_0(create2)

자전거 또는 대여소의 고장을 신고합니다. 신고 유형(자전거/대여소), 카테고리(브레이크, 타이어 등), 상세 설명을 포함해야 합니다. 사진 첨부는 선택사항입니다.

### Example

```typescript
import {
    RepairsApi,
    Configuration,
    Create2
} from './api';

const configuration = new Configuration();
const apiInstance = new RepairsApi(configuration);

let create2: Create2; //

const { status, data } = await apiInstance.createRepair_0(
    create2
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **create2** | **Create2**|  | |


### Return type

**CreateRepair201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 고장 신고 성공 |  -  |
|**400** | 잘못된 요청 - 필수 필드 누락 |  -  |
|**401** | 인증 필요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyRepairs**
> GetMyRepairs200Response getMyRepairs()

현재 로그인한 사용자가 신고한 고장 내역을 조회합니다. 상태별 필터링을 지원합니다.

### Example

```typescript
import {
    RepairsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RepairsApi(configuration);

let status: 'pending' | 'in-progress' | 'completed'; //신고 상태 필터 (optional) (default to undefined)

const { status, data } = await apiInstance.getMyRepairs(
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**&#39;pending&#39; | &#39;in-progress&#39; | &#39;completed&#39;**]**Array<&#39;pending&#39; &#124; &#39;in-progress&#39; &#124; &#39;completed&#39;>** | 신고 상태 필터 | (optional) defaults to undefined|


### Return type

**GetMyRepairs200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 신고 내역 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getMyRepairs_0**
> GetMyRepairs200Response getMyRepairs_0()

현재 로그인한 사용자가 신고한 고장 내역을 조회합니다. 상태별 필터링을 지원합니다.

### Example

```typescript
import {
    RepairsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RepairsApi(configuration);

let status: 'pending' | 'in-progress' | 'completed'; //신고 상태 필터 (optional) (default to undefined)

const { status, data } = await apiInstance.getMyRepairs_0(
    status
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**&#39;pending&#39; | &#39;in-progress&#39; | &#39;completed&#39;**]**Array<&#39;pending&#39; &#124; &#39;in-progress&#39; &#124; &#39;completed&#39;>** | 신고 상태 필터 | (optional) defaults to undefined|


### Return type

**GetMyRepairs200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 신고 내역 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRepairById**
> GetRepairById200Response getRepairById()

특정 고장 신고의 상세 정보를 조회합니다. 처리 상태, 관리자 메모 등을 포함합니다.

### Example

```typescript
import {
    RepairsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RepairsApi(configuration);

let repairId: string; //신고 ID (default to undefined)

const { status, data } = await apiInstance.getRepairById(
    repairId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **repairId** | [**string**] | 신고 ID | defaults to undefined|


### Return type

**GetRepairById200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 신고 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**404** | 신고를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRepairById_0**
> GetRepairById200Response getRepairById_0()

특정 고장 신고의 상세 정보를 조회합니다. 처리 상태, 관리자 메모 등을 포함합니다.

### Example

```typescript
import {
    RepairsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RepairsApi(configuration);

let repairId: string; //신고 ID (default to undefined)

const { status, data } = await apiInstance.getRepairById_0(
    repairId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **repairId** | [**string**] | 신고 ID | defaults to undefined|


### Return type

**GetRepairById200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 신고 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**404** | 신고를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

