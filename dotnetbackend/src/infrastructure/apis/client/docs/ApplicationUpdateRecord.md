
# ApplicationUpdateRecord


## Properties

Name | Type
------------ | -------------
`id` | string
`status` | [ApplicationStatusEnum](ApplicationStatusEnum.md)
`coverLetter` | string
`expectedSalary` | number

## Example

```typescript
import type { ApplicationUpdateRecord } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "status": null,
  "coverLetter": null,
  "expectedSalary": null,
} satisfies ApplicationUpdateRecord

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApplicationUpdateRecord
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


