
# CompanyUpdateRecord


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`industry` | string
`website` | string
`description` | string

## Example

```typescript
import type { CompanyUpdateRecord } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "industry": null,
  "website": null,
  "description": null,
} satisfies CompanyUpdateRecord

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CompanyUpdateRecord
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


