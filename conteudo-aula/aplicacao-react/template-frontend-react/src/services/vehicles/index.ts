import { createEndpoint } from './create'
import { deleteEndpoint } from './delete'
import { getEndpoint } from './get'
import { getByIdEndpoint } from './get-by-id'
import { updateEndpoint } from './update'

export const vehicleService = {
  get: getEndpoint,
  getByIdEndpoint: getByIdEndpoint,
  create: createEndpoint,
  update: updateEndpoint,
  delete: deleteEndpoint,
}
