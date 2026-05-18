import type { UpdateVehicleDTO, Vehicle } from '@/types/vehicle'
import { delay } from '@/utils/delay'

type Response = { id: number }

const execute = async (
  id: number,
  payload: UpdateVehicleDTO,
): Promise<Response> => {
  await delay()

  const list = JSON.parse(
    localStorage.getItem('vehicle-list') || '[]',
  ) as Vehicle[]

  const index = list.findIndex((it) => it.id == id)

  if (index < 0) throw new Error(`ID ${id} não encontrado`)

  list[index] = { ...payload, id }

  localStorage.setItem('vehicle-list', JSON.stringify(list))

  return { id }
}

export const updateEndpoint = {
  execute: execute,
}
