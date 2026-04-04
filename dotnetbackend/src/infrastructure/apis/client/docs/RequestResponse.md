
# RequestResponse


## Properties

Name | Type
------------ | -------------
`response` | string
`errorMessage` | [ErrorMessage](ErrorMessage.md)

## Example

```typescript
import type { RequestResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "response": null,
  "errorMessage": null,
} satisfies RequestResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RequestResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


