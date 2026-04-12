
# UserProfileRecord


## Properties

Name | Type
------------ | -------------
`id` | string
`bio` | string
`profilePictureUrl` | string
`linkedInUrl` | string
`gitHubUrl` | string
`userId` | string

## Example

```typescript
import type { UserProfileRecord } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "bio": null,
  "profilePictureUrl": null,
  "linkedInUrl": null,
  "gitHubUrl": null,
  "userId": null,
} satisfies UserProfileRecord

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserProfileRecord
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


