export type Vehicle = {
  id: number
  chassi: string
  brand: string
  model: string
  year: number
}

export type CreateVehicleDTO = {
  chassi: string
  brand: string
  model: string
  year: number
}

export type UpdateVehicleDTO = {
  chassi: string
  brand: string
  model: string
  year: number
}
