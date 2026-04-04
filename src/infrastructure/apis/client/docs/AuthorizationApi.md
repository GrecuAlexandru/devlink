# AuthorizationApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiAuthorizationLoginPost**](AuthorizationApi.md#apiauthorizationloginpost) | **POST** /api/Authorization/Login |  |



## apiAuthorizationLoginPost

> LoginResponseRecordRequestResponse apiAuthorizationLoginPost(loginRecord)



### Example

```ts
import {
  Configuration,
  AuthorizationApi,
} from '';
import type { ApiAuthorizationLoginPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthorizationApi(config);

  const body = {
    // LoginRecord (optional)
    loginRecord: ...,
  } satisfies ApiAuthorizationLoginPostRequest;

  try {
    const data = await api.apiAuthorizationLoginPost(body);
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
| **loginRecord** | [LoginRecord](LoginRecord.md) |  | [Optional] |

### Return type

[**LoginResponseRecordRequestResponse**](LoginResponseRecordRequestResponse.md)

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

