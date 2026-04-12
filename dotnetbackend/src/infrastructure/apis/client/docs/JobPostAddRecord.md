
# JobPostAddRecord


## Properties

Name | Type
------------ | -------------
`title` | string
`description` | string
`location` | string
`salaryRange` | string
`level` | string
`type` | string
`isRecruiterPosition` | boolean
`companyId` | string

## Example

```typescript
import type { JobPostAddRecord } from ''

// TODO: Update the object below with actual values
const example = {
  "title": null,
  "description": null,
  "location": null,
  "salaryRange": null,
  "level": null,
  "type": null,
  "isRecruiterPosition": null,
  "companyId": null,
} satisfies JobPostAddRecord

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as JobPostAddRecord
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


