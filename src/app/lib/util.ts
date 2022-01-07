export function copyObject<Type = Object>(object: Type): Type {
  return JSON.parse(JSON.stringify(object));
}

export function arrayToMap<Type = Object>(arr: Type[], key: string): { [key: string]: Type } {
  const map: { [key: string]: Type } = {}
  arr.forEach(item => map[item[key]] = item);
  return map;
}