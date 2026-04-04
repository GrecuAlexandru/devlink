# CompanyApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiCompanyAddPost**](CompanyApi.md#apicompanyaddpost) | **POST** /api/Company/Add |  |
| [**apiCompanyDeleteIdDelete**](CompanyApi.md#apicompanydeleteiddelete) | **DELETE** /api/Company/Delete/{id} |  |
| [**apiCompanyGetByIdIdGet**](CompanyApi.md#apicompanygetbyididget) | **GET** /api/Company/GetById/{id} |  |
| [**apiCompanyGetMyCompanyGet**](CompanyApi.md#apicompanygetmycompanyget) | **GET** /api/Company/GetMyCompany |  |
| [**apiCompanyUpdatePut**](CompanyApi.md#apicompanyupdateput) | **PUT** /api/Company/Update |  |



## apiCompanyAddPost

> RequestResponse apiCompanyAddPost(companyAddRecord)



### Example

```ts
import {
  Configuration,
  CompanyApi,
} from '';
import type { ApiCompanyAddPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CompanyApi(config);

  const body = {
    // CompanyAddRecord (optional)
    companyAddRecord: ...,
  } satisfies ApiCompanyAddPostRequest;

  try {
    const data = await api.apiCompanyAddPost(body);
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
| **companyAddRecord** | [CompanyAddRecord](CompanyAddRecord.md) |  | [Optional] |

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


## apiCompanyDeleteIdDelete

> RequestResponse apiCompanyDeleteIdDelete(id)



### Example

```ts
import {
  Configuration,
  CompanyApi,
} from '';
import type { ApiCompanyDeleteIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CompanyApi(config);

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiCompanyDeleteIdDeleteRequest;

  try {
    const data = await api.apiCompanyDeleteIdDelete(body);
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


## apiCompanyGetByIdIdGet

> CompanyRecordRequestResponse apiCompanyGetByIdIdGet(id)



### Example

```ts
import {
  Configuration,
  CompanyApi,
} from '';
import type { ApiCompanyGetByIdIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CompanyApi(config);

  const body = {
    // string
    id: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiCompanyGetByIdIdGetRequest;

  try {
    const data = await api.apiCompanyGetByIdIdGet(body);
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

[**CompanyRecordRequestResponse**](CompanyRecordRequestResponse.md)

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


## apiCompanyGetMyCompanyGet

> CompanyRecordRequestResponse apiCompanyGetMyCompanyGet()



### Example

```ts
import {
  Configuration,
  CompanyApi,
} from '';
import type { ApiCompanyGetMyCompanyGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CompanyApi(config);

  try {
    const data = await api.apiCompanyGetMyCompanyGet();
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

[**CompanyRecordRequestResponse**](CompanyRecordRequestResponse.md)

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


## apiCompanyUpdatePut

> RequestResponse apiCompanyUpdatePut(companyUpdateRecord)



### Example

```ts
import {
  Configuration,
  CompanyApi,
} from '';
import type { ApiCompanyUpdatePutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CompanyApi(config);

  const body = {
    // CompanyUpdateRecord (optional)
    companyUpdateRecord: ...,
  } satisfies ApiCompanyUpdatePutRequest;

  try {
    const data = await api.apiCompanyUpdatePut(body);
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
| **companyUpdateRecord** | [CompanyUpdateRecord](CompanyUpdateRecord.md) |  | [Optional] |

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

