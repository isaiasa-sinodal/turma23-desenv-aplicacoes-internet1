import type { Vehicle } from '@/types/vehicle'
import { delay } from '@/utils/delay'

type Response = Vehicle

const execute = async (id: number): Promise<Response> => {
  await delay()

  const list = JSON.parse(
    localStorage.getItem('vehicle-list') || '[]',
  ) as Vehicle[]

  const data = list.find((it) => it.id === id)

  if (!data) throw new Error('Veículo não encontrado')

  return data
}

export const getByIdEndpoint = {
  execute: execute,
}
