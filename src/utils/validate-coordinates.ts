export function isValidLatitude(value: number) {
  return Math.abs(value) <= 90
}

export function isValidLongitude(value: number) {
  return Math.abs(value) <= 180
}
