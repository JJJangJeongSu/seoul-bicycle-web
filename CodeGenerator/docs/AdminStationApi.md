# AdminStationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createStation**](#createstation) | **POST** /admin/stations | 대여소 추가|
|[**deleteStation**](#deletestation) | **DELETE** /admin/stations/{stationId} | 대여소 삭제|
|[**getAllStationsAdmin**](#getallstationsadmin) | **GET** /admin/stations | 대여소 목록 조회|
|[**getStationAdmin**](#getstationadmin) | **GET** /admin/stations/{stationId} | 대여소 상세 조회|
|[**updateStation**](#updatestation) | **PUT** /admin/stations/{stationId} | 대여소 정보 수정|

# **createStation**
> CreateStation201Response createStation()

관리자 전용. 새로운 대여소를 추가합니다.

### Example

```typescript
import {
    AdminStationApi,
    Configuration,
    CreateStation
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminStationApi(configuration);

let createStation: CreateStation; // (optional)

const { status, data } = await apiInstance.createStation(
    createStation
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createStation** | **CreateStation**|  | |


### Return type

**CreateStation201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 대여소 추가 성공 |  -  |
|**400** | 잘못된 요청 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteStation**
> DeleteStation200Response deleteStation()

관리자 전용. 대여소를 삭제합니다

### Example

```typescript
import {
    AdminStationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminStationApi(configuration);

let stationId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteStation(
    stationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stationId** | [**string**] |  | defaults to undefined|


### Return type

**DeleteStation200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 대여소 추가 성공 |  -  |
|**400** | 잘못된 요청 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllStationsAdmin**
> GetAllStationsAdmin200Response getAllStationsAdmin()

관리자 전용. 전체 정류장 목록을 조회합니다. 검색 및 페이지네이션을 지원합니다.

### Example

```typescript
import {
    AdminStationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminStationApi(configuration);

let page: number; //페이지 번호 (optional) (default to 1)
let limit: number; //페이지당 항목 수 (optional) (default to 20)
let search: string; //대여소 이름 (optional) (default to undefined)

const { status, data } = await apiInstance.getAllStationsAdmin(
    page,
    limit,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 페이지 번호 | (optional) defaults to 1|
| **limit** | [**number**] | 페이지당 항목 수 | (optional) defaults to 20|
| **search** | [**string**] | 대여소 이름 | (optional) defaults to undefined|


### Return type

**GetAllStationsAdmin200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 회원 목록 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStationAdmin**
> GetStationAdmin200Response getStationAdmin()

관리자 전용. 특정 대여소의 상세 정보를 조회합니다

### Example

```typescript
import {
    AdminStationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminStationApi(configuration);

let stationId: string; // (default to undefined)

const { status, data } = await apiInstance.getStationAdmin(
    stationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stationId** | [**string**] |  | defaults to undefined|


### Return type

**GetStationAdmin200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 회원 목록 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateStation**
> UpdateStation200Response updateStation()

관리자 전용. 대여소 정보를 수정합니다.

### Example

```typescript
import {
    AdminStationApi,
    Configuration,
    UpdateStation
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminStationApi(configuration);

let stationId: string; //대여소 ID (default to undefined)
let updateStation: UpdateStation; // (optional)

const { status, data } = await apiInstance.updateStation(
    stationId,
    updateStation
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateStation** | **UpdateStation**|  | |
| **stationId** | [**string**] | 대여소 ID | defaults to undefined|


### Return type

**UpdateStation200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 대여소 수정 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |
|**404** | 대여소를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

