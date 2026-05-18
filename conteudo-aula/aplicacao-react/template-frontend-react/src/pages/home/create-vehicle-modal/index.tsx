import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Modal } from '@/components/modal'
import { vehicleService } from '@/services/vehicles'
import type { CreateVehicleDTO } from '@/types/vehicle'

type Props = {
  isOpen: boolean
  onClose: () => void
  onReload?: () => void
}

export function CreateVehicleModal({ isOpen, onClose, onReload }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset()
    }
  }, [isOpen])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formRef.current) return

    try {
      const formData = new FormData(formRef.current)
      const formValues = Object.fromEntries(formData)

      const data: CreateVehicleDTO = {
        chassi: formValues.chassi.toString().toLocaleUpperCase(),
        brand: formValues.brand.toString(),
        model: formValues.model.toString(),
        year: Number(formValues.year.toString()),
      }

      await vehicleService.create.execute(data)

      formRef.current.reset()
      onClose()
      onReload?.()
    } catch (error: any) {
      alert(error?.message || 'Algo deu errado')
    }
  }

  return (
    <Modal title="Cadastro de Veículo" isOpen={isOpen} onClose={onClose}>
      <form ref={formRef} onSubmit={handleSubmit}>
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
