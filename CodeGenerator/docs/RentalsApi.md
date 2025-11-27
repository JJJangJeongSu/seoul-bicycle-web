# RentalsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createRental**](#createrental) | **POST** /rentals | 자전거 대여|
|[**createRental_0**](#createrental_0) | **POST** /rentals | 자전거 대여|
|[**getUserRentals**](#getuserrentals) | **GET** /users/{userId}/rentals | 사용자 대여 이력 조회|
|[**getUserRentals_0**](#getuserrentals_0) | **GET** /users/{userId}/rentals | 사용자 대여 이력 조회|
|[**returnRental**](#returnrental) | **PUT** /rentals/{rentalId}/return | 자전거 반납|
|[**returnRental_0**](#returnrental_0) | **PUT** /rentals/{rentalId}/return | 자전거 반납|

# **createRental**
> CreateRental201Response createRental(createRental)

지정된 대여소에서 자전거를 대여합니다. 사용자는 한 번에 하나의 자전거만 대여할 수 있습니다. 대여소에 자전거가 없거나 이미 대여 중인 경우 실패합니다. 관리자는 대여할 수 없습니다.

### Example

```typescript
import {
    RentalsApi,
    Configuration,
    CreateRental
} from './api';

const configuration = new Configuration();
const apiInstance = new RentalsApi(configuration);

let createRental: CreateRental; //

const { status, data } = await apiInstance.createRental(
    createRental
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createRental** | **CreateRental**|  | |


### Return type

**CreateRental201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 대여 성공 |  -  |
|**400** | 대여 불가 - 이미 대여 중이거나 자전거 없음 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자는 대여할 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createRental_0**
> CreateRental201Response createRental_0(createRental)

지정된 대여소에서 자전거를 대여합니다. 사용자는 한 번에 하나의 자전거만 대여할 수 있습니다. 대여소에 자전거가 없거나 이미 대여 중인 경우 실패합니다. 관리자는 대여할 수 없습니다.

### Example

```typescript
import {
    RentalsApi,
    Configuration,
    CreateRental
} from './api';

const configuration = new Configuration();
const apiInstance = new RentalsApi(configuration);

let createRental: CreateRental; //

const { status, data } = await apiInstance.createRental_0(
    createRental
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createRental** | **CreateRental**|  | |


### Return type

**CreateRental201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 대여 성공 |  -  |
|**400** | 대여 불가 - 이미 대여 중이거나 자전거 없음 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자는 대여할 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUserRentals**
> GetUserRentals200Response getUserRentals()

특정 사용자의 대여 이력을 조회합니다. 페이지네이션을 지원하며, 최신 대여 순으로 정렬됩니다. 각 대여 기록에는 출발/도착 대여소, 이용 시간, 이동 거리가 포함됩니다.

### Example

```typescript
import {
    RentalsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RentalsApi(configuration);

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

# **getUserRentals_0**
> GetUserRentals200Response getUserRentals_0()

특정 사용자의 대여 이력을 조회합니다. 페이지네이션을 지원하며, 최신 대여 순으로 정렬됩니다. 각 대여 기록에는 출발/도착 대여소, 이용 시간, 이동 거리가 포함됩니다.

### Example

```typescript
import {
    RentalsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RentalsApi(configuration);

let userId: string; //사용자 ID (default to undefined)
let page: number; //페이지 번호 (1부터 시작) (optional) (default to 1)
let limit: number; //페이지당 항목 수 (optional) (default to 10)

const { status, data } = await apiInstance.getUserRentals_0(
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

# **returnRental**
> ReturnRental200Response returnRental(returnRental)

대여한 자전거를 지정된 대여소에 반납합니다. 반납 시 이용 시간과 이동 거리가 자동으로 계산됩니다. 반납 정보는 사용자의 대여 이력에 저장됩니다.

### Example

```typescript
import {
    RentalsApi,
    Configuration,
    ReturnRental
} from './api';

const configuration = new Configuration();
const apiInstance = new RentalsApi(configuration);

let rentalId: string; // (default to undefined)
let returnRental: ReturnRental; //

const { status, data } = await apiInstance.returnRental(
    rentalId,
    returnRental
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **returnRental** | **ReturnRental**|  | |
| **rentalId** | [**string**] |  | defaults to undefined|


### Return type

**ReturnRental200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 반납 성공 |  -  |
|**400** | 반납 불가 - 대여 중인 자전거 없음 |  -  |
|**401** | 인증 필요 |  -  |
|**404** | 대여 기록을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **returnRental_0**
> ReturnRental200Response returnRental_0(returnRental)

대여한 자전거를 지정된 대여소에 반납합니다. 반납 시 이용 시간과 이동 거리가 자동으로 계산됩니다. 반납 정보는 사용자의 대여 이력에 저장됩니다.

### Example

```typescript
import {
    RentalsApi,
    Configuration,
    ReturnRental
} from './api';

const configuration = new Configuration();
const apiInstance = new RentalsApi(configuration);

let rentalId: string; // (default to undefined)
let returnRental: ReturnRental; //

const { status, data } = await apiInstance.returnRental_0(
    rentalId,
    returnRental
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **returnRental** | **ReturnRental**|  | |
| **rentalId** | [**string**] |  | defaults to undefined|


### Return type

**ReturnRental200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 반납 성공 |  -  |
|**400** | 반납 불가 - 대여 중인 자전거 없음 |  -  |
|**401** | 인증 필요 |  -  |
|**404** | 대여 기록을 찾을 수 없음 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

