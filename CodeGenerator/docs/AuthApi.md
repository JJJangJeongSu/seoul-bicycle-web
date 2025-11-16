# AuthApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**checkEmailAvailability**](#checkemailavailability) | **GET** /auth/check-email | 이메일 중복 확인|
|[**checkEmailAvailability_0**](#checkemailavailability_0) | **GET** /auth/check-email | 이메일 중복 확인|
|[**loginUser**](#loginuser) | **POST** /auth/login | 사용자 로그인|
|[**loginUser_0**](#loginuser_0) | **POST** /auth/login | 사용자 로그인|
|[**signupUser**](#signupuser) | **POST** /auth/signup | 회원가입|
|[**signupUser_0**](#signupuser_0) | **POST** /auth/signup | 회원가입|

# **checkEmailAvailability**
> CheckEmailAvailability200Response checkEmailAvailability()

회원가입 시 이메일 중복 여부를 확인합니다. 사용 가능한 이메일인 경우 available: true를 반환합니다.

### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let email: string; //확인할 이메일 주소 (default to undefined)

const { status, data } = await apiInstance.checkEmailAvailability(
    email
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **email** | [**string**] | 확인할 이메일 주소 | defaults to undefined|


### Return type

**CheckEmailAvailability200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 이메일 확인 완료 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **checkEmailAvailability_0**
> CheckEmailAvailability200Response checkEmailAvailability_0()

회원가입 시 이메일 중복 여부를 확인합니다. 사용 가능한 이메일인 경우 available: true를 반환합니다.

### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let email: string; //확인할 이메일 주소 (default to undefined)

const { status, data } = await apiInstance.checkEmailAvailability_0(
    email
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **email** | [**string**] | 확인할 이메일 주소 | defaults to undefined|


### Return type

**CheckEmailAvailability200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 이메일 확인 완료 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **loginUser**
> LoginUser200Response loginUser(login)

이메일과 비밀번호를 사용하여 로그인합니다. admin@admin.com으로 로그인하면 관리자 권한을 부여받습니다. 성공 시 JWT 토큰과 사용자 정보를 반환합니다.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    Login
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let login: Login; //

const { status, data } = await apiInstance.loginUser(
    login
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **login** | **Login**|  | |


### Return type

**LoginUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 로그인 성공 |  -  |
|**401** | 인증 실패 - 잘못된 이메일 또는 비밀번호 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **loginUser_0**
> LoginUser200Response loginUser_0(login)

이메일과 비밀번호를 사용하여 로그인합니다. admin@admin.com으로 로그인하면 관리자 권한을 부여받습니다. 성공 시 JWT 토큰과 사용자 정보를 반환합니다.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    Login
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let login: Login; //

const { status, data } = await apiInstance.loginUser_0(
    login
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **login** | **Login**|  | |


### Return type

**LoginUser200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | 로그인 성공 |  -  |
|**401** | 인증 실패 - 잘못된 이메일 또는 비밀번호 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **signupUser**
> SignupUser201Response signupUser(signup)

새로운 사용자 계정을 생성합니다. 모든 신규 가입자는 일반 사용자(role: user) 권한으로 생성됩니다. 이메일 중복 확인 후 계정을 생성하며, 성공 시 JWT 토큰과 사용자 정보를 반환합니다.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    Signup
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let signup: Signup; //

const { status, data } = await apiInstance.signupUser(
    signup
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signup** | **Signup**|  | |


### Return type

**SignupUser201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 회원가입 성공 |  -  |
|**400** | 잘못된 요청 - 필수 필드 누락 또는 형식 오류 |  -  |
|**409** | 이메일 중복 - 이미 사용 중인 이메일 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **signupUser_0**
> SignupUser201Response signupUser_0(signup)

새로운 사용자 계정을 생성합니다. 모든 신규 가입자는 일반 사용자(role: user) 권한으로 생성됩니다. 이메일 중복 확인 후 계정을 생성하며, 성공 시 JWT 토큰과 사용자 정보를 반환합니다.

### Example

```typescript
import {
    AuthApi,
    Configuration,
    Signup
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let signup: Signup; //

const { status, data } = await apiInstance.signupUser_0(
    signup
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **signup** | **Signup**|  | |


### Return type

**SignupUser201Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | 회원가입 성공 |  -  |
|**400** | 잘못된 요청 - 필수 필드 누락 또는 형식 오류 |  -  |
|**409** | 이메일 중복 - 이미 사용 중인 이메일 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

