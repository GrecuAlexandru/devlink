
# JobPostRecordListRequestResponse


## Properties

Name | Type
------------ | -------------
`response` | [Array&lt;JobPostRecord&gt;](JobPostRecord.md)
`errorMessage` | [ErrorMessage](ErrorMessage.md)

## Example

```typescript
import type { JobPostRecordListRequestResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "response": null,
  "errorMessage": null,
} satisfies JobPostRecordListRequestResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as JobPostRecordListRequestResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


