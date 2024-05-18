export function getRandomNumber(max: number) {
  return Math.floor(Math.random() * max);
}

export function getRandomElement<T>(arr: Array<T>): T {
  return arr[getRandomNumber(arr.length)];
}
