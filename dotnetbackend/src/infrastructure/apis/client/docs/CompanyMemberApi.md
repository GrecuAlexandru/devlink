# CompanyMemberApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiCompanyMemberAddMemberPost**](CompanyMemberApi.md#apicompanymemberaddmemberpost) | **POST** /api/CompanyMember/AddMember |  |
| [**apiCompanyMemberGetMembersGet**](CompanyMemberApi.md#apicompanymembergetmembersget) | **GET** /api/CompanyMember/GetMembers |  |
| [**apiCompanyMemberRemoveMemberUserIdDelete**](CompanyMemberApi.md#apicompanymemberremovememberuseriddelete) | **DELETE** /api/CompanyMember/RemoveMember/{userId} |  |
| [**apiCompanyMemberUpdateMemberRolePut**](CompanyMemberApi.md#apicompanymemberupdatememberroleput) | **PUT** /api/CompanyMember/UpdateMemberRole |  |



## apiCompanyMemberAddMemberPost

> RequestResponse apiCompanyMemberAddMemberPost(addMemberRequest)



### Example

```ts
import {
  Configuration,
  CompanyMemberApi,
} from '';
import type { ApiCompanyMemberAddMemberPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CompanyMemberApi(config);

  const body = {
    // AddMemberRequest (optional)
    addMemberRequest: ...,
  } satisfies ApiCompanyMemberAddMemberPostRequest;

  try {
    const data = await api.apiCompanyMemberAddMemberPost(body);
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
| **addMemberRequest** | [AddMemberRequest](AddMemberRequest.md) |  | [Optional] |

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


## apiCompanyMemberGetMembersGet

> CompanyMemberRecordListRequestResponse apiCompanyMemberGetMembersGet()



### Example

```ts
import {
  Configuration,
  CompanyMemberApi,
} from '';
import type { ApiCompanyMemberGetMembersGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CompanyMemberApi(config);

  try {
    const data = await api.apiCompanyMemberGetMembersGet();
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

[**CompanyMemberRecordListRequestResponse**](CompanyMemberRecordListRequestResponse.md)

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


## apiCompanyMemberRemoveMemberUserIdDelete

> RequestResponse apiCompanyMemberRemoveMemberUserIdDelete(userId)



### Example

```ts
import {
  Configuration,
  CompanyMemberApi,
} from '';
import type { ApiCompanyMemberRemoveMemberUserIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CompanyMemberApi(config);

  const body = {
    // string
    userId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
  } satisfies ApiCompanyMemberRemoveMemberUserIdDeleteRequest;

  try {
    const data = await api.apiCompanyMemberRemoveMemberUserIdDelete(body);
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


## apiCompanyMemberUpdateMemberRolePut

> RequestResponse apiCompanyMemberUpdateMemberRolePut(updateMemberRoleRequest)



### Example

```ts
import {
  Configuration,
  CompanyMemberApi,
} from '';
import type { ApiCompanyMemberUpdateMemberRolePutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: Bearer
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new CompanyMemberApi(config);

  const body = {
    // UpdateMemberRoleRequest (optional)
    updateMemberRoleRequest: ...,
  } satisfies ApiCompanyMemberUpdateMemberRolePutRequest;

  try {
    const data = await api.apiCompanyMemberUpdateMemberRolePut(body);
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
| **updateMemberRoleRequest** | [UpdateMemberRoleRequest](UpdateMemberRoleRequest.md) |  | [Optional] |

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

