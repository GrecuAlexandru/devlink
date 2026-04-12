# UserProfileApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiUserProfileGetMyProfileGet**](UserProfileApi.md#apiuserprofilegetmyprofileget) | **GET** /api/UserProfile/GetMyProfile |  |
| [**apiUserProfileGetProfileUserIdGet**](UserProfileApi.md#apiuserprofilegetprofileuseridget) | **GET** /api/UserProfile/GetProfile/{userId} |  |
| [**apiUserProfileUpdateProfilePut**](UserProfileApi.md#apiuserprofileupdateprofileput) | **PUT** /api/UserProfile/UpdateProfile |  |



## apiUserProfileGetMyProfileGet

> UserProfileRecordRequestResponse apiUserProfileGetMyProfileGet()



### Example

```ts
import {
  Configuration,
  UserProfileApi,
} from '';
import type { ApiUserProfileGetMyProfileGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserProfileApi(config);

  try {
    const data = await api.apiUserProfileGetMyProfileGet();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**UserProfileRecordRequestResponse**](UserProfileRecordRequestResponse.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiUserProfileGetProfileUserIdGet

> UserProfileRecordRequestResponse apiUserProfileGetProfileUserIdGet(userId)



### Example

```ts
import {
  Configuration,
  UserProfileApi,
} from '';
import type { ApiUserProfileGetProfileUserIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserProfileApi(config);

  const body = {
    // string
    userId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiUserProfileGetProfileUserIdGetRequest;

  try {
    const data = await api.apiUserProfileGetProfileUserIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**UserProfileRecordRequestResponse**](UserProfileRecordRequestResponse.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiUserProfileUpdateProfilePut

> RequestResponse apiUserProfileUpdateProfilePut(userProfileUpdateRecord)



### Example

```ts
import {
  Configuration,
  UserProfileApi,
} from '';
import type { ApiUserProfileUpdateProfilePutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserProfileApi(config);

  const body = {
    // UserProfileUpdateRecord (optional)
    userProfileUpdateRecord: ...,
  } satisfies ApiUserProfileUpdateProfilePutRequest;

  try {
    const data = await api.apiUserProfileUpdateProfilePut(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userProfileUpdateRecord** | [UserProfileUpdateRecord](UserProfileUpdateRecord.md) |  | [Optional] |

### Return type

[**RequestResponse**](RequestResponse.md)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

- **Content-Type**: `application/json`, `text/json`, `application/*+json`
- **Accept**: `text/plain`, `application/json`, `text/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

