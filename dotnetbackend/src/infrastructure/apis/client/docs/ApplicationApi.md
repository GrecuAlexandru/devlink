# ApplicationApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiApplicationApplyPost**](ApplicationApi.md#apiapplicationapplypost) | **POST** /api/Application/Apply |  |
| [**apiApplicationGetJobApplicationsJobPostIdGet**](ApplicationApi.md#apiapplicationgetjobapplicationsjobpostidget) | **GET** /api/Application/GetJobApplications/{jobPostId} |  |
| [**apiApplicationGetMyApplicationsGet**](ApplicationApi.md#apiapplicationgetmyapplicationsget) | **GET** /api/Application/GetMyApplications |  |
| [**apiApplicationUpdateStatusPut**](ApplicationApi.md#apiapplicationupdatestatusput) | **PUT** /api/Application/UpdateStatus |  |



## apiApplicationApplyPost

> RequestResponse apiApplicationApplyPost(applicationAddRecord)



### Example

```ts
import {
  Configuration,
  ApplicationApi,
} from '';
import type { ApiApplicationApplyPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ApplicationApi(config);

  const body = {
    // ApplicationAddRecord (optional)
    applicationAddRecord: ...,
  } satisfies ApiApplicationApplyPostRequest;

  try {
    const data = await api.apiApplicationApplyPost(body);
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
| **applicationAddRecord** | [ApplicationAddRecord](ApplicationAddRecord.md) |  | [Optional] |

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


## apiApplicationGetJobApplicationsJobPostIdGet

> ApplicationRecordListRequestResponse apiApplicationGetJobApplicationsJobPostIdGet(jobPostId)



### Example

```ts
import {
  Configuration,
  ApplicationApi,
} from '';
import type { ApiApplicationGetJobApplicationsJobPostIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ApplicationApi(config);

  const body = {
    // string
    jobPostId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiApplicationGetJobApplicationsJobPostIdGetRequest;

  try {
    const data = await api.apiApplicationGetJobApplicationsJobPostIdGet(body);
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
| **jobPostId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**ApplicationRecordListRequestResponse**](ApplicationRecordListRequestResponse.md)

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


## apiApplicationGetMyApplicationsGet

> ApplicationRecordListRequestResponse apiApplicationGetMyApplicationsGet()



### Example

```ts
import {
  Configuration,
  ApplicationApi,
} from '';
import type { ApiApplicationGetMyApplicationsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ApplicationApi(config);

  try {
    const data = await api.apiApplicationGetMyApplicationsGet();
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

[**ApplicationRecordListRequestResponse**](ApplicationRecordListRequestResponse.md)

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


## apiApplicationUpdateStatusPut

> RequestResponse apiApplicationUpdateStatusPut(applicationUpdateRecord)



### Example

```ts
import {
  Configuration,
  ApplicationApi,
} from '';
import type { ApiApplicationUpdateStatusPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new ApplicationApi(config);

  const body = {
    // ApplicationUpdateRecord (optional)
    applicationUpdateRecord: ...,
  } satisfies ApiApplicationUpdateStatusPutRequest;

  try {
    const data = await api.apiApplicationUpdateStatusPut(body);
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
| **applicationUpdateRecord** | [ApplicationUpdateRecord](ApplicationUpdateRecord.md) |  | [Optional] |

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

