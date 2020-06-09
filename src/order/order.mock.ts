import { Order } from './order.model'
import { Status } from 'src/status/status.enum'
import { generateId } from 'src/helpers/generate-id'

function randomEnum<T>(anEnum: T): T[keyof T] {
  const enumValues = Object.keys(anEnum)
    .map(n => anEnum[n]) as unknown as T[keyof T][]
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  const randomEnumValue = enumValues[randomIndex]
  return randomEnumValue;
}

export function generateRandomOrder(id: string): Order {
  return {
    id,
    details: {},
    createdBy: ['Matt', 'John', 'Keith'][Math.floor(Math.random() * 3)],
    createdById: generateId(),
    createdDate: new Date(),
    status: randomEnum(Status)
  }
}