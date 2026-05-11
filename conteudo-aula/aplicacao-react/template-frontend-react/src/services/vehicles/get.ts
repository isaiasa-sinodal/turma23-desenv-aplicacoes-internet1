import type { Vehicle } from '@/types/vehicle'
import { delay } from '@/utils/delay'

type Response = Vehicle[]

const defaultVehicles: Vehicle[] = [
  {
    id: 1,
    chassi: '53K98WTBGJ4VT5754',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
  },
  {
    id: 2,
    chassi: '8WSBSFHK9NMJM3028',
    brand: 'Honda',
    model: 'Civic',
    year: 2021,
  },
  {
    id: 3,
    chassi: '6JZHPEKUKZ29L5647',
    brand: 'Ford',
    model: 'Focus',
    year: 2019,
  },
]

const execute = async (): Promise<Response> => {
  await delay()

  const list = localStorage.getItem('vehicle-list')

  if (!list) {
    localStorage.setItem('vehicle-list', JSON.stringify(defaultVehicles))
    return defaultVehicles
  }

  return JSON.parse(list)
}

export const getEndpoint = {
  execute: execute,
}
