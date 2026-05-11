import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Modal } from '@/components/modal'
import { vehicleService } from '@/services/vehicles'
import type { UpdateVehicleDTO } from '@/types/vehicle'

type Props = {
  id?: number | null
  isOpen: boolean
  onClose: () => void
  onReload?: () => void
}

export function EditVehicleModal({ id, isOpen, onClose, onReload }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleFetchVehicle = async () => {
    if (!formRef.current || !id) return
    try {
      const data = await vehicleService.getByIdEndpoint.execute(id)

      const elements = formRef.current.elements as any
      elements['chassi'].value = data.chassi
      elements['brand'].value = data.brand
      elements['model'].value = data.model
      elements['year'].value = data.year.toString()
    } catch (error: any) {
      alert(error?.message || 'Algo deu errado')
      onClose()
    }
  }

  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset()
    } else {
      handleFetchVehicle()
    }
  }, [isOpen])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current || !id) return

    try {
      const formData = new FormData(formRef.current)
      const formValues = Object.fromEntries(formData)

      const data: UpdateVehicleDTO = {
        chassi: formValues.chassi.toString().toLocaleUpperCase(),
        brand: formValues.brand.toString(),
        model: formValues.model.toString(),
        year: Number(formValues.year.toString()),
      }

      await vehicleService.update.execute(id, data)

      formRef.current.reset()
      onClose()
      onReload?.()
    } catch (error: any) {
      alert(error?.message || 'Algo deu errado')
    }
  }

  return (
    <Modal title="Editar Veículo" isOpen={isOpen} onClose={onClose}>
      <form ref={formRef} onSubmit={handleSubmit} method="dialog">
        <Input name="chassi" label="Chassi" required />
        <Input name="brand" label="Marca" required />
        <Input name="model" label="Modelo" required />
        <Input name="year" label="Ano" type="number" required />

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 16,
            marginTop: 32,
          }}
        >
          <Button type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  )
}
