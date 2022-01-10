export function copyObject<Type = Object>(object: Type): Type {
  return JSON.parse(JSON.stringify(object));
}

export function arrayToMap<Type = Object>(arr: Type[], key: string): { [key: string]: Type } {
  const map: { [key: string]: Type } = {}
  arr.forEach(item => map[item[key]] = item);
  return map;
}

export function groupBy<T, K extends keyof any>(arr: T[], getKey: (item: T) => K) {
  return arr.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) {
      previous[group] = [];
    }
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);
};

export function randomInt(upperBound: number) {
  return Math.floor(Math.random() * upperBound);
}

export function getLastElement<T>(arr: T[]): T {
  return arr.length > 0 ? arr[arr.length - 1] : null;
}