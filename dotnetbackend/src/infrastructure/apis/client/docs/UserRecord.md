
# UserRecord


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`email` | string
`role` | [UserRoleEnum](UserRoleEnum.md)

## Example

```typescript
import type { UserRecord } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "email": null,
  "role": null,
} satisfies UserRecord

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserRecord
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


