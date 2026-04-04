
# UserRecordPagedResponse


## Properties

Name | Type
------------ | -------------
`page` | number
`pageSize` | number
`totalCount` | number
`data` | [Array&lt;UserRecord&gt;](UserRecord.md)

## Example

```typescript
import type { UserRecordPagedResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "page": null,
  "pageSize": null,
  "totalCount": null,
  "data": null,
} satisfies UserRecordPagedResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserRecordPagedResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


