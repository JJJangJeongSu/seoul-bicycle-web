# RoutesApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**calculateRoute**](#calculateroute) | **POST** /routes/calculate | 최적 경로 계산|
|[**calculateRoute_0**](#calculateroute_0) | **POST** /routes/calculate | 최적 경로 계산|
|[**geocodeAddress**](#geocodeaddress) | **GET** /geocode | 주소를 좌표로 변환|
|[**geocodeAddress_0**](#geocodeaddress_0) | **GET** /geocode | 주소를 좌표로 변환|

# **calculateRoute**
> CalculateRoute200Response calculateRoute(calculate)

출발지와 목적지 좌표를 기반으로 자전거 이용 최적 경로를 계산합니다. Haversine 공식을 사용하여 거리를 계산하고, 가장 가까운 대여소와 반납 대여소를 추천합니다.

### Example

```typescript
import {
    RoutesApi,
    Configuration,
    Calculate
} from './api';

const configuration = new Configuration();
const apiInstance = new RoutesApi(configuration);

let calculate: Calculate; //

const { status, data } = await apiInstance.calculateRoute(
    calculate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **calculate** | **Calculate**|  | |


### Return type

**CalculateRoute200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 경로 계산 성공 |  -  |
|**400** | 잘못된 좌표 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **calculateRoute_0**
> CalculateRoute200Response calculateRoute_0(calculate)

출발지와 목적지 좌표를 기반으로 자전거 이용 최적 경로를 계산합니다. Haversine 공식을 사용하여 거리를 계산하고, 가장 가까운 대여소와 반납 대여소를 추천합니다.

### Example

```typescript
import {
    RoutesApi,
    Configuration,
    Calculate
} from './api';

const configuration = new Configuration();
const apiInstance = new RoutesApi(configuration);

let calculate: Calculate; //

const { status, data } = await apiInstance.calculateRoute_0(
    calculate
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **calculate** | **Calculate**|  | |


### Return type

**CalculateRoute200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 경로 계산 성공 |  -  |
|**400** | 잘못된 좌표 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **geocodeAddress**
> GeocodeAddress200Response geocodeAddress()

주소 문자열을 위도/경도 좌표로 변환합니다. 현재는 해시 기반 모의 지오코딩을 사용합니다.

### Example

```typescript
import {
    RoutesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoutesApi(configuration);

let address: string; //변환할 주소 (default to undefined)

const { status, data } = await apiInstance.geocodeAddress(
    address
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **address** | [**string**] | 변환할 주소 | defaults to undefined|


### Return type

**GeocodeAddress200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 좌표 변환 성공 |  -  |
|**400** | 잘못된 주소 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **geocodeAddress_0**
> GeocodeAddress200Response geocodeAddress_0()

주소 문자열을 위도/경도 좌표로 변환합니다. 현재는 해시 기반 모의 지오코딩을 사용합니다.

### Example

```typescript
import {
    RoutesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoutesApi(configuration);

let address: string; //변환할 주소 (default to undefined)

const { status, data } = await apiInstance.geocodeAddress_0(
    address
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **address** | [**string**] | 변환할 주소 | defaults to undefined|


### Return type

**GeocodeAddress200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 좌표 변환 성공 |  -  |
|**400** | 잘못된 주소 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

