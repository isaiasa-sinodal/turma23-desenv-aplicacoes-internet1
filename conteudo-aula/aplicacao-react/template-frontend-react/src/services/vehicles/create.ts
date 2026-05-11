import type { CreateVehicleDTO, Vehicle } from '@/types/vehicle'
import { delay } from '@/utils/delay'

type Response = { id: number }

const execute = async (payload: CreateVehicleDTO): Promise<Response> => {
  await delay()

  const list = JSON.parse(
    localStorage.getItem('vehicle-list') || '[]',
  ) as Vehicle[]

  const newId = list.length ? Math.max(...list.map((it) => it.id)) + 1 : 1

  list.push({ ...payload, id: newId })

  localStorage.setItem('vehicle-list', JSON.stringify(list))

  return { id: newId }
}

export const createEndpoint = {
  execute: execute,
}
