
# JobPostRecord


## Properties

Name | Type
------------ | -------------
`id` | string
`title` | string
`description` | string
`location` | string
`salaryRange` | string
`level` | string
`type` | string
`isRecruiterPosition` | boolean
`company` | [CompanyRecord](CompanyRecord.md)
`companyId` | string

## Example

```typescript
import type { JobPostRecord } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "title": null,
  "description": null,
  "location": null,
  "salaryRange": null,
  "level": null,
  "type": null,
  "isRecruiterPosition": null,
  "company": null,
  "companyId": null,
} satisfies JobPostRecord

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as JobPostRecord
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


