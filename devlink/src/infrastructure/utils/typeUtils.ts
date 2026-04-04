export function is<T>(obj: unknown): obj is T {
  if (obj as T) {
    return true;
  }
  return false;
}
