
# CompanyMemberRecord


## Properties

Name | Type
------------ | -------------
`id` | string
`userId` | string
`user` | [UserRecord](UserRecord.md)
`companyId` | string
`role` | string

## Example

```typescript
import type { CompanyMemberRecord } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "userId": null,
  "user": null,
  "companyId": null,
  "role": null,
} satisfies CompanyMemberRecord

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CompanyMemberRecord
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


