# UsersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**changePassword**](#changepassword) | **PUT** /users/{userId}/password | 비밀번호 변경|
|[**changePassword_0**](#changepassword_0) | **PUT** /users/{userId}/password | 비밀번호 변경|
|[**getUser**](#getuser) | **GET** /users/profile | 사용자 정보 조회|
|[**getUserRentals**](#getuserrentals) | **GET** /users/{userId}/rentals | 사용자 대여 이력 조회|
|[**getUserStatistics**](#getuserstatistics) | **GET** /users/{userId}/statistics | 사용자 통계 조회|
|[**getUserStatistics_0**](#getuserstatistics_0) | **GET** /users/{userId}/statistics | 사용자 통계 조회|
|[**getUser_0**](#getuser_0) | **GET** /users/profile | 사용자 정보 조회|
|[**updateUser**](#updateuser) | **PUT** /users/{userId} | 사용자 정보 수정|
|[**updateUser_0**](#updateuser_0) | **PUT** /users/{userId} | 사용자 정보 수정|

# **changePassword**
> object changePassword(changePassword)

사용자의 비밀번호를 변경합니다. 현재 비밀번호 확인이 필요합니다.

### Example

```typescript
import {
    UsersApi,
    Configuration,
    ChangePassword
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: string; //사용자 ID (default to undefined)
let changePassword: ChangePassword; //

const { status, data } = await apiInstance.changePassword(
    userId,
    changePassword
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **changePassword** | **ChangePassword**|  | |
| **userId** | [**string**] | 사용자 ID | defaults to undefined|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 비밀번호 변경 성공 |  -  |
|**400** | 잘못된 요청 - 현재 비밀번호 불일치 |  -  |
|**401** | 인증 필요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **changePassword_0**
> object changePassword_0(changePassword)

사용자의 비밀번호를 변경합니다. 현재 비밀번호 확인이 필요합니다.

### Example

```typescript
import {
    UsersApi,
    Configuration,
    ChangePassword
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: string; //사용자 ID (default to undefined)
let changePassword: ChangePassword; //

const { status, data } = await apiInstance.changePassword_0(
    userId,
    changePassword
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **changePassword** | **ChangePassword**|  | |
| **userId** | [**string**] | 사용자 ID | defaults to undefined|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 비밀번호 변경 성공 |  -  |
|**400** | 잘못된 요청 - 현재 비밀번호 불일치 |  -  |
|**401** | 인증 필요 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUser**
> GetUser200Response getUser()

특정 사용자의 프로필 정보를 조회합니다.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.getUser();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 사용자 정보 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserRentals**
> GetUserRentals200Response getUserRentals()

특정 사용자의 대여 이력을 조회합니다. 페이지네이션을 지원하며, 최신 대여 순으로 정렬됩니다. 각 대여 기록에는 출발/도착 대여소, 이용 시간, 이동 거리가 포함됩니다.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: string; //사용자 ID (default to undefined)
let page: number; //페이지 번호 (1부터 시작) (optional) (default to 1)
let limit: number; //페이지당 항목 수 (optional) (default to 10)

const { status, data } = await apiInstance.getUserRentals(
    userId,
    page,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | 사용자 ID | defaults to undefined|
| **page** | [**number**] | 페이지 번호 (1부터 시작) | (optional) defaults to 1|
| **limit** | [**number**] | 페이지당 항목 수 | (optional) defaults to 10|


### Return type

**GetUserRentals200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 대여 이력 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserStatistics**
> GetUserStatistics200Response getUserStatistics()

사용자의 자전거 이용 통계를 조회합니다. 총 대여 횟수, 총 이동 거리, 총 이용 시간, 평균값 등을 포함합니다.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: string; //사용자 ID (default to undefined)

const { status, data } = await apiInstance.getUserStatistics(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | 사용자 ID | defaults to undefined|


### Return type

**GetUserStatistics200Response**

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
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserStatistics_0**
> GetUserStatistics200Response getUserStatistics_0()

사용자의 자전거 이용 통계를 조회합니다. 총 대여 횟수, 총 이동 거리, 총 이용 시간, 평균값 등을 포함합니다.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: string; //사용자 ID (default to undefined)

const { status, data } = await apiInstance.getUserStatistics_0(
    userId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] | 사용자 ID | defaults to undefined|


### Return type

**GetUserStatistics200Response**

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
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUser_0**
> GetUser200Response getUser_0()

특정 사용자의 프로필 정보를 조회합니다.

### Example

```typescript
import {
    UsersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

const { status, data } = await apiInstance.getUser_0();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 사용자 정보 조회 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUser**
> GetUser200Response updateUser(update)

사용자의 프로필 정보를 수정합니다. 본인 또는 관리자만 수정할 수 있습니다.

### Example

```typescript
import {
    UsersApi,
    Configuration,
    Update
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: string; //사용자 ID (default to undefined)
let update: Update; //

const { status, data } = await apiInstance.updateUser(
    userId,
    update
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **update** | **Update**|  | |
| **userId** | [**string**] | 사용자 ID | defaults to undefined|


### Return type

**GetUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 사용자 정보 수정 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateUser_0**
> GetUser200Response updateUser_0(update)

사용자의 프로필 정보를 수정합니다. 본인 또는 관리자만 수정할 수 있습니다.

### Example

```typescript
import {
    UsersApi,
    Configuration,
    Update
} from './api';

const configuration = new Configuration();
const apiInstance = new UsersApi(configuration);

let userId: string; //사용자 ID (default to undefined)
let update: Update; //

const { status, data } = await apiInstance.updateUser_0(
    userId,
    update
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **update** | **Update**|  | |
| **userId** | [**string**] | 사용자 ID | defaults to undefined|


### Return type

**GetUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 사용자 정보 수정 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 |  -  |
|**404** | 사용자를 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

