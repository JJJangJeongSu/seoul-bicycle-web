# BikeApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createBike**](#createbike) | **POST** /admin/bikes | 자전거 추가|
|[**deleteBike**](#deletebike) | **DELETE** /admin/bikes/{bikeId} | 자전거 삭제|
|[**getAllBikesAdmin**](#getallbikesadmin) | **GET** /admin/bikes | 자전거 목록 조회|
|[**getBikeAdmin**](#getbikeadmin) | **GET** /admin/bikes/{bikeId} | 자전거 상세 조회|
|[**getBikeRentalRecords**](#getbikerentalrecords) | **GET** /admin/bikes/{bikeId}/rentals | 특정 자전거의 렌탈 내역 조회|

# **createBike**
> CreateBike201Response createBike()

관리자 전용. 자전거를 추가합니다. 정류장 id를 입력받습니다.

### Example

```typescript
import {
    BikeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BikeApi(configuration);

let stationId: string; //정류장 번호 (default to undefined)

const { status, data } = await apiInstance.createBike(
    stationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **stationId** | [**string**] | 정류장 번호 | defaults to undefined|


### Return type

**CreateBike201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 자전거 생성 성공 |  -  |
|**401** | 인증 필요 |  -  |
|**403** | 권한 없음 - 관리자만 접근 가능 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteBike**
> Success deleteBike()

관리자 전용. 자전거를 추가합니다. 정류장 id를 입력받습니다.

### Example

```typescript
import {
    BikeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BikeApi(configuration);

let bikeId: string; // (default to undefined)

const { status, data } = await apiInstance.deleteBike(
    bikeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bikeId** | [**string**] |  | defaults to undefined|


### Return type

**Success**

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

# **getAllBikesAdmin**
> GetAllBikesAdmin200Response getAllBikesAdmin()

관리자 전용. 전체 자전거 목록을 조회합니다. 검색 및 페이지네이션을 지원합니다.

### Example

```typescript
import {
    BikeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BikeApi(configuration);

let page: number; //페이지 번호 (optional) (default to 1)
let limit: number; //페이지당 항목 수 (optional) (default to 20)
let searchId: string; //자전거 번호 검색어 (optional) (default to undefined)

const { status, data } = await apiInstance.getAllBikesAdmin(
    page,
    limit,
    searchId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 페이지 번호 | (optional) defaults to 1|
| **limit** | [**number**] | 페이지당 항목 수 | (optional) defaults to 20|
| **searchId** | [**string**] | 자전거 번호 검색어 | (optional) defaults to undefined|


### Return type

**GetAllBikesAdmin200Response**

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

# **getBikeAdmin**
> GetBikeAdmin200Response getBikeAdmin()

관리자 전용, 특정 자전거의 정보만을 조회

### Example

```typescript
import {
    BikeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BikeApi(configuration);

let bikeId: string; // (default to undefined)

const { status, data } = await apiInstance.getBikeAdmin(
    bikeId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bikeId** | [**string**] |  | defaults to undefined|


### Return type

**GetBikeAdmin200Response**

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

# **getBikeRentalRecords**
> GetBikeRentalRecords200Response getBikeRentalRecords()

관리자 전용. 특정 자전거의 렌탈 내역을 조회합니다. 정렬 및 페이지네이션을 지원합니다.

### Example

```typescript
import {
    BikeApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BikeApi(configuration);

let bikeId: string; //자전거의 ID (default to undefined)
let page: number; //페이지 번호 (optional) (default to 1)
let limit: number; //페이지당 항목 수 (optional) (default to 20)
let sortBy: 'recent' | 'old'; //정렬기준 (optional) (default to undefined)

const { status, data } = await apiInstance.getBikeRentalRecords(
    bikeId,
    page,
    limit,
    sortBy
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bikeId** | [**string**] | 자전거의 ID | defaults to undefined|
| **page** | [**number**] | 페이지 번호 | (optional) defaults to 1|
| **limit** | [**number**] | 페이지당 항목 수 | (optional) defaults to 20|
| **sortBy** | [**&#39;recent&#39; | &#39;old&#39;**]**Array<&#39;recent&#39; &#124; &#39;old&#39;>** | 정렬기준 | (optional) defaults to undefined|


### Return type

**GetBikeRentalRecords200Response**

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

