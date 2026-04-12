
# ApplicationRecord


## Properties

Name | Type
------------ | -------------
`id` | string
`status` | [ApplicationStatusEnum](ApplicationStatusEnum.md)
`coverLetter` | string
`expectedSalary` | number
`userId` | string
`user` | [UserRecord](UserRecord.md)
`jobPostId` | string
`jobPost` | [JobPostRecord](JobPostRecord.md)

## Example

```typescript
import type { ApplicationRecord } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "status": null,
  "coverLetter": null,
  "expectedSalary": null,
  "userId": null,
  "user": null,
  "jobPostId": null,
  "jobPost": null,
} satisfies ApplicationRecord

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApplicationRecord
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


