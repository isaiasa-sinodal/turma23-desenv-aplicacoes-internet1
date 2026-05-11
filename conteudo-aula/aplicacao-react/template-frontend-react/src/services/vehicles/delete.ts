import type { Vehicle } from '@/types/vehicle'
import { delay } from '@/utils/delay'

type Response = { id: number }

const execute = async (id: number): Promise<Response> => {
  await delay()

  const list = JSON.parse(
    localStorage.getItem('vehicle-list') || '[]',
  ) as Vehicle[]

  const index = list.findIndex((it) => it.id == id)

  if (index < 0) throw new Error(`ID ${id} não encontrado`)

  list.splice(index, 1)

  localStorage.setItem('vehicle-list', JSON.stringify(list))

  return { id }
}

export const deleteEndpoint = {
  execute: execute,
}
