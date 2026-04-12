# JobPostApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiJobPostAddPost**](JobPostApi.md#apijobpostaddpost) | **POST** /api/JobPost/Add |  |
| [**apiJobPostDeleteIdDelete**](JobPostApi.md#apijobpostdeleteiddelete) | **DELETE** /api/JobPost/Delete/{id} |  |
| [**apiJobPostGetAllAllGet**](JobPostApi.md#apijobpostgetallallget) | **GET** /api/JobPost/GetAll/all |  |
| [**apiJobPostGetByIdIdGet**](JobPostApi.md#apijobpostgetbyididget) | **GET** /api/JobPost/GetById/{id} |  |
| [**apiJobPostGetMyCompanyJobsGet**](JobPostApi.md#apijobpostgetmycompanyjobsget) | **GET** /api/JobPost/GetMyCompanyJobs |  |
| [**apiJobPostUpdatePut**](JobPostApi.md#apijobpostupdateput) | **PUT** /api/JobPost/Update |  |



## apiJobPostAddPost

> RequestResponse apiJobPostAddPost(jobPostAddRecord)



### Example

```ts
import {
  Configuration,
  JobPostApi,
} from '';
import type { ApiJobPostAddPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new JobPostApi(config);

  const body = {
    // JobPostAddRecord (optional)
    jobPostAddRecord: ...,
  } satisfies ApiJobPostAddPostRequest;

  try {
    const data = await api.apiJobPostAddPost(body);
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
| **jobPostAddRecord** | [JobPostAddRecord](JobPostAddRecord.md) |  | [Optional] |

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


## apiJobPostDeleteIdDelete

> RequestResponse apiJobPostDeleteIdDelete(id)



### Example

```ts
import {
  Configuration,
  JobPostApi,
} from '';
import type { ApiJobPostDeleteIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new JobPostApi(config);

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiJobPostDeleteIdDeleteRequest;

  try {
    const data = await api.apiJobPostDeleteIdDelete(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**RequestResponse**](RequestResponse.md)

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


## apiJobPostGetAllAllGet

> JobPostRecordListRequestResponse apiJobPostGetAllAllGet()



### Example

```ts
import {
  Configuration,
  JobPostApi,
} from '';
import type { ApiJobPostGetAllAllGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new JobPostApi(config);

  try {
    const data = await api.apiJobPostGetAllAllGet();
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

[**JobPostRecordListRequestResponse**](JobPostRecordListRequestResponse.md)

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


## apiJobPostGetByIdIdGet

> JobPostRecordRequestResponse apiJobPostGetByIdIdGet(id)



### Example

```ts
import {
  Configuration,
  JobPostApi,
} from '';
import type { ApiJobPostGetByIdIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new JobPostApi(config);

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiJobPostGetByIdIdGetRequest;

  try {
    const data = await api.apiJobPostGetByIdIdGet(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**JobPostRecordRequestResponse**](JobPostRecordRequestResponse.md)

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


## apiJobPostGetMyCompanyJobsGet

> JobPostRecordListRequestResponse apiJobPostGetMyCompanyJobsGet()



### Example

```ts
import {
  Configuration,
  JobPostApi,
} from '';
import type { ApiJobPostGetMyCompanyJobsGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new JobPostApi(config);

  try {
    const data = await api.apiJobPostGetMyCompanyJobsGet();
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

[**JobPostRecordListRequestResponse**](JobPostRecordListRequestResponse.md)

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


## apiJobPostUpdatePut

> RequestResponse apiJobPostUpdatePut(jobPostUpdateRecord)



### Example

```ts
import {
  Configuration,
  JobPostApi,
} from '';
import type { ApiJobPostUpdatePutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new JobPostApi(config);

  const body = {
    // JobPostUpdateRecord (optional)
    jobPostUpdateRecord: ...,
  } satisfies ApiJobPostUpdatePutRequest;

  try {
    const data = await api.apiJobPostUpdatePut(body);
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
| **jobPostUpdateRecord** | [JobPostUpdateRecord](JobPostUpdateRecord.md) |  | [Optional] |

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

