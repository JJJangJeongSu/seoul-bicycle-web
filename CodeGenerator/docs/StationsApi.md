# StationsApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllStations**](#getallstations) | **GET** /stations | 대여소 목록 조회|
|[**getAllStations_0**](#getallstations_0) | **GET** /stations | 대여소 목록 조회|
|[**getNearestStation**](#getneareststation) | **GET** /stations/nearest | 가장 가까운 대여소 찾기|
|[**getNearestStation_0**](#getneareststation_0) | **GET** /stations/nearest | 가장 가까운 대여소 찾기|
|[**getStationsStatus**](#getstationsstatus) | **GET** /stations/status | 대여소 실시간 현황 갱신|
|[**getStationsStatus_0**](#getstationsstatus_0) | **GET** /stations/status | 대여소 실시간 현황 갱신|

# **getAllStations**
> GetAllStations200Response getAllStations()

전체 대여소 목록을 조회합니다. 각 대여소의 위치, 주소, 현재 자전거 수, 운영 상태 등을 포함합니다. 필터링 및 검색 기능을 지원합니다.

### Example

```typescript
import {
    StationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StationsApi(configuration);

let district: string; //서울시 구 단위 필터 (예: 강남구, 서초구) (optional) (default to undefined)
let status: 'active' | 'inactive'; //대여소 운영 상태 필터 (optional) (default to undefined)
let search: string; //대여소명 또는 주소 검색어 (optional) (default to undefined)

const { status, data } = await apiInstance.getAllStations(
    district,
    status,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **district** | [**string**] | 서울시 구 단위 필터 (예: 강남구, 서초구) | (optional) defaults to undefined|
| **status** | [**&#39;active&#39; | &#39;inactive&#39;**]**Array<&#39;active&#39; &#124; &#39;inactive&#39;>** | 대여소 운영 상태 필터 | (optional) defaults to undefined|
| **search** | [**string**] | 대여소명 또는 주소 검색어 | (optional) defaults to undefined|


### Return type

**GetAllStations200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 대여소 목록 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllStations_0**
> GetAllStations200Response getAllStations_0()

전체 대여소 목록을 조회합니다. 각 대여소의 위치, 주소, 현재 자전거 수, 운영 상태 등을 포함합니다. 필터링 및 검색 기능을 지원합니다.

### Example

```typescript
import {
    StationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StationsApi(configuration);

let district: string; //서울시 구 단위 필터 (예: 강남구, 서초구) (optional) (default to undefined)
let status: 'active' | 'inactive'; //대여소 운영 상태 필터 (optional) (default to undefined)
let search: string; //대여소명 또는 주소 검색어 (optional) (default to undefined)

const { status, data } = await apiInstance.getAllStations_0(
    district,
    status,
    search
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **district** | [**string**] | 서울시 구 단위 필터 (예: 강남구, 서초구) | (optional) defaults to undefined|
| **status** | [**&#39;active&#39; | &#39;inactive&#39;**]**Array<&#39;active&#39; &#124; &#39;inactive&#39;>** | 대여소 운영 상태 필터 | (optional) defaults to undefined|
| **search** | [**string**] | 대여소명 또는 주소 검색어 | (optional) defaults to undefined|


### Return type

**GetAllStations200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 대여소 목록 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getNearestStation**
> GetNearestStation200Response getNearestStation()

주어진 좌표로부터 가장 가까운 대여소를 찾습니다. Haversine 공식을 사용하여 직선 거리를 계산합니다.

### Example

```typescript
import {
    StationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StationsApi(configuration);

let lat: string; //위도 (latitude) (default to undefined)
let lon: string; //경도 (longitude) (default to undefined)

const { status, data } = await apiInstance.getNearestStation(
    lat,
    lon
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lat** | [**string**] | 위도 (latitude) | defaults to undefined|
| **lon** | [**string**] | 경도 (longitude) | defaults to undefined|


### Return type

**GetNearestStation200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 가장 가까운 대여소 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getNearestStation_0**
> GetNearestStation200Response getNearestStation_0()

주어진 좌표로부터 가장 가까운 대여소를 찾습니다. Haversine 공식을 사용하여 직선 거리를 계산합니다.

### Example

```typescript
import {
    StationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StationsApi(configuration);

let lat: string; //위도 (latitude) (default to undefined)
let lon: string; //경도 (longitude) (default to undefined)

const { status, data } = await apiInstance.getNearestStation_0(
    lat,
    lon
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lat** | [**string**] | 위도 (latitude) | defaults to undefined|
| **lon** | [**string**] | 경도 (longitude) | defaults to undefined|


### Return type

**GetNearestStation200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 가장 가까운 대여소 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStationsStatus**
> GetStationsStatus200Response getStationsStatus()

모든 대여소의 실시간 자전거 수와 운영 상태를 조회합니다. 클라이언트의 자동 새로고침 기능에서 사용됩니다.

### Example

```typescript
import {
    StationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StationsApi(configuration);

const { status, data } = await apiInstance.getStationsStatus();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetStationsStatus200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 실시간 현황 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStationsStatus_0**
> GetStationsStatus200Response getStationsStatus_0()

모든 대여소의 실시간 자전거 수와 운영 상태를 조회합니다. 클라이언트의 자동 새로고침 기능에서 사용됩니다.

### Example

```typescript
import {
    StationsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StationsApi(configuration);

const { status, data } = await apiInstance.getStationsStatus_0();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**GetStationsStatus200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 실시간 현황 조회 성공 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

