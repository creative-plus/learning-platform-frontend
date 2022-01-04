export function copyObject<Type = Object>(object: Type): Type {
  return JSON.parse(JSON.stringify(object));
}