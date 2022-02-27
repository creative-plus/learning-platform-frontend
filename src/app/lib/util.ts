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

export function fileToBase64(file: File): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function base64toFile(base64: string, filename: string) {
  let arr = base64.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}