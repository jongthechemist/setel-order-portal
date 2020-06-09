export function generateId(): string {
  return Math.floor((Math.random() * 1000)).toString()
}