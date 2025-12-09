# AdminApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createStation**](#createstation) | **POST** /admin/stations | 대여소 추가|
|[**createStation_0**](#createstation_0) | **POST** /admin/stations | 대여소 추가|
|[**deleteStation**](#deletestation) | **DELETE** /admin/stations/{stationId} | 대여소 삭제|
|[**deleteStation_0**](#deletestation_0) | **DELETE** /admin/stations/{stationId} | 대여소 삭제|
|[**deleteUserAdmin**](#deleteuseradmin) | **DELETE** /admin/users/{userId} | 회원 삭제|
|[**deleteUserAdmin_0**](#deleteuseradmin_0) | **DELETE** /admin/users/{userId} | 회원 삭제|
|[**getAdminStatistics**](#getadminstatistics) | **GET** /admin/statistics | 전체 시스템 통계 조회|
|[**getAdminStatistics_0**](#getadminstatistics_0) | **GET** /admin/statistics | 전체 시스템 통계 조회|
|[**getAllRepairsAdmin**](#getallrepairsadmin) | **GET** /admin/repairs | 고장 신고 목록 조회|
|[**getAllRepairsAdmin_0**](#getallrepairsadmin_0) | **GET** /admin/repairs | 고장 신고 목록 조회|
|[**getAllStationsAdmin**](#getallstationsadmin) | **GET** /admin/stations | 정류장 목록 조회|
|[**getAllStationsAdmin_0**](#getallstationsadmin_0) | **GET** /admin/stations | 정류장 목록 조회|
|[**getAllUsersAdmin**](#getallusersadmin) | **GET** /admin/users | 회원 목록 조회|
|[**getAllUsersAdmin_0**](#getallusersadmin_0) | **GET** /admin/users | 회원 목록 조회|
|[**updateRepairStatus**](#updaterepairstatus) | **PUT** /admin/repairs/{repairId} | 고장 처리 상태 업데이트|
|[**updateRepairStatus_0**](#updaterepairstatus_0) | **PUT** /admin/repairs/{repairId} | 고장 처리 상태 업데이트|
|[**updateStation**](#updatestation) | **PUT** /admin/stations/{stationId} | 대여소 정보 수정|
|[**updateStation_0**](#updatestation_0) | **PUT** /admin/stations/{stationId} | 대여소 정보 수정|
|[**updateUserStatus**](#updateuserstatus) | **PUT** /admin/users/{userId}/status | 회원 상태 변경|
|[**updateUserStatus_0**](#updateuserstatus_0) | **PUT** /admin/users/{userId}/status | 회원 상태 변경|

# **createStation**
> CreateStation201Response createStation()

관리자 전용. 새로운 대여소를 추가합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    CreateStation
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

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

# **createStation_0**
> CreateStation201Response createStation_0()

관리자 전용. 새로운 대여소를 추가합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    CreateStation
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let createStation: CreateStation; // (optional)

const { status, data } = await apiInstance.createStation_0(
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
> deleteStation()

관리자 전용. 대여소를 삭제합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let stationId: string; //대여소 ID (default to undefined)

const { status, data } = await apiInstance.deleteStation(
    stationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stationId** | [**string**] | 대여소 ID | defaults to undefined|


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
|**204** | 대여소 삭제 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |
|**404** | 대여소를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteStation_0**
> deleteStation_0()

관리자 전용. 대여소를 삭제합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let stationId: string; //대여소 ID (default to undefined)

const { status, data } = await apiInstance.deleteStation_0(
    stationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stationId** | [**string**] | 대여소 ID | defaults to undefined|


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
|**204** | 대여소 삭제 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |
|**404** | 대여소를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteUserAdmin**
> deleteUserAdmin()

관리자 전용. 회원을 완전히 삭제합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let userId: string; //사용자 ID (default to undefined)

const { status, data } = await apiInstance.deleteUserAdmin(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | 사용자 ID | defaults to undefined|


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
|**204** | 회원 삭제 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteUserAdmin_0**
> deleteUserAdmin_0()

관리자 전용. 회원을 완전히 삭제합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let userId: string; //사용자 ID (default to undefined)

const { status, data } = await apiInstance.deleteUserAdmin_0(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | 사용자 ID | defaults to undefined|


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
|**204** | 회원 삭제 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAdminStatistics**
> GetAdminStatistics200Response getAdminStatistics()

관리자 전용. 전체 시스템의 통계를 조회합니다. 총 사용자 수, 총 대여소 수, 총 자전거 수, 일일 대여 현황 등을 포함합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

const { status, data } = await apiInstance.getAdminStatistics();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetAdminStatistics200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 통계 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAdminStatistics_0**
> GetAdminStatistics200Response getAdminStatistics_0()

관리자 전용. 전체 시스템의 통계를 조회합니다. 총 사용자 수, 총 대여소 수, 총 자전거 수, 일일 대여 현황 등을 포함합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

const { status, data } = await apiInstance.getAdminStatistics_0();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetAdminStatistics200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 통계 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllRepairsAdmin**
> GetAllRepairsAdmin200Response getAllRepairsAdmin()

관리자 전용. 전체 고장 신고 목록을 조회합니다. 상태별 필터링 및 페이지네이션을 지원합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let status: 'pending' | 'in-progress' | 'completed'; //신고 상태 필터 (optional) (default to undefined)
let page: number; //페이지 번호 (optional) (default to 1)

const { status, data } = await apiInstance.getAllRepairsAdmin(
    status,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**&#39;pending&#39; | &#39;in-progress&#39; | &#39;completed&#39;**]**Array<&#39;pending&#39; &#124; &#39;in-progress&#39; &#124; &#39;completed&#39;>** | 신고 상태 필터 | (optional) defaults to undefined|
| **page** | [**number**] | 페이지 번호 | (optional) defaults to 1|


### Return type

**GetAllRepairsAdmin200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 신고 목록 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllRepairsAdmin_0**
> GetAllRepairsAdmin200Response getAllRepairsAdmin_0()

관리자 전용. 전체 고장 신고 목록을 조회합니다. 상태별 필터링 및 페이지네이션을 지원합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let status: 'pending' | 'in-progress' | 'completed'; //신고 상태 필터 (optional) (default to undefined)
let page: number; //페이지 번호 (optional) (default to 1)

const { status, data } = await apiInstance.getAllRepairsAdmin_0(
    status,
    page
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**&#39;pending&#39; | &#39;in-progress&#39; | &#39;completed&#39;**]**Array<&#39;pending&#39; &#124; &#39;in-progress&#39; &#124; &#39;completed&#39;>** | 신고 상태 필터 | (optional) defaults to undefined|
| **page** | [**number**] | 페이지 번호 | (optional) defaults to 1|


### Return type

**GetAllRepairsAdmin200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 신고 목록 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllStationsAdmin**
> GetAllStationsAdmin200Response getAllStationsAdmin()

관리자 전용. 전체 정류장 목록을 조회합니다. 검색 및 페이지네이션을 지원합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let page: number; //페이지 번호 (optional) (default to 1)
let limit: number; //페이지당 항목 수 (optional) (default to 20)
let search: string; //이름 또는 이메일 검색어 (optional) (default to undefined)

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
| **search** | [**string**] | 이름 또는 이메일 검색어 | (optional) defaults to undefined|


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

# **getAllStationsAdmin_0**
> GetAllStationsAdmin200Response getAllStationsAdmin_0()

관리자 전용. 전체 정류장 목록을 조회합니다. 검색 및 페이지네이션을 지원합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let page: number; //페이지 번호 (optional) (default to 1)
let limit: number; //페이지당 항목 수 (optional) (default to 20)
let search: string; //이름 또는 이메일 검색어 (optional) (default to undefined)

const { status, data } = await apiInstance.getAllStationsAdmin_0(
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
| **search** | [**string**] | 이름 또는 이메일 검색어 | (optional) defaults to undefined|


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

# **getAllUsersAdmin**
> GetAllUsersAdmin200Response getAllUsersAdmin()

관리자 전용. 전체 회원 목록을 조회합니다. 검색 및 페이지네이션을 지원합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let page: number; //페이지 번호 (optional) (default to 1)
let limit: number; //페이지당 항목 수 (optional) (default to 20)
let search: string; //이름 또는 이메일 검색어 (optional) (default to undefined)

const { status, data } = await apiInstance.getAllUsersAdmin(
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
| **search** | [**string**] | 이름 또는 이메일 검색어 | (optional) defaults to undefined|


### Return type

**GetAllUsersAdmin200Response**

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

# **getAllUsersAdmin_0**
> GetAllUsersAdmin200Response getAllUsersAdmin_0()

관리자 전용. 전체 회원 목록을 조회합니다. 검색 및 페이지네이션을 지원합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let page: number; //페이지 번호 (optional) (default to 1)
let limit: number; //페이지당 항목 수 (optional) (default to 20)
let search: string; //이름 또는 이메일 검색어 (optional) (default to undefined)

const { status, data } = await apiInstance.getAllUsersAdmin_0(
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
| **search** | [**string**] | 이름 또는 이메일 검색어 | (optional) defaults to undefined|


### Return type

**GetAllUsersAdmin200Response**

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

# **updateRepairStatus**
> updateRepairStatus(updateRepairStatus)

관리자 전용. 고장 신고의 처리 상태를 업데이트합니다. 관리자 메모를 추가할 수 있습니다.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    UpdateRepairStatus
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let repairId: string; //신고 ID (default to undefined)
let updateRepairStatus: UpdateRepairStatus; //

const { status, data } = await apiInstance.updateRepairStatus(
    repairId,
    updateRepairStatus
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateRepairStatus** | **UpdateRepairStatus**|  | |
| **repairId** | [**string**] | 신고 ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | 상태 업데이트 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |
|**404** | 신고를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateRepairStatus_0**
> updateRepairStatus_0(updateRepairStatus)

관리자 전용. 고장 신고의 처리 상태를 업데이트합니다. 관리자 메모를 추가할 수 있습니다.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    UpdateRepairStatus
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let repairId: string; //신고 ID (default to undefined)
let updateRepairStatus: UpdateRepairStatus; //

const { status, data } = await apiInstance.updateRepairStatus_0(
    repairId,
    updateRepairStatus
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateRepairStatus** | **UpdateRepairStatus**|  | |
| **repairId** | [**string**] | 신고 ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | 상태 업데이트 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |
|**404** | 신고를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateStation**
> UpdateStation200Response updateStation()

관리자 전용. 대여소 정보를 수정합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    UpdateStation
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

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

# **updateStation_0**
> UpdateStation200Response updateStation_0()

관리자 전용. 대여소 정보를 수정합니다.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    UpdateStation
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let stationId: string; //대여소 ID (default to undefined)
let updateStation: UpdateStation; // (optional)

const { status, data } = await apiInstance.updateStation_0(
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

# **updateUserStatus**
> UpdateUserStatus200Response updateUserStatus()

관리자 전용. 회원의 상태를 변경합니다. 활성화 또는 차단 상태로 설정할 수 있습니다.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    UpdateUserStatus
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let userId: string; //사용자 ID (default to undefined)
let updateUserStatus: UpdateUserStatus; // (optional)

const { status, data } = await apiInstance.updateUserStatus(
    userId,
    updateUserStatus
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserStatus** | **UpdateUserStatus**|  | |
| **userId** | [**string**] | 사용자 ID | defaults to undefined|


### Return type

**UpdateUserStatus200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 상태 변경 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUserStatus_0**
> UpdateUserStatus200Response updateUserStatus_0()

관리자 전용. 회원의 상태를 변경합니다. 활성화 또는 차단 상태로 설정할 수 있습니다.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    UpdateUserStatus
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let userId: string; //사용자 ID (default to undefined)
let updateUserStatus: UpdateUserStatus; // (optional)

const { status, data } = await apiInstance.updateUserStatus_0(
    userId,
    updateUserStatus
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateUserStatus** | **UpdateUserStatus**|  | |
| **userId** | [**string**] | 사용자 ID | defaults to undefined|


### Return type

**UpdateUserStatus200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 상태 변경 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

