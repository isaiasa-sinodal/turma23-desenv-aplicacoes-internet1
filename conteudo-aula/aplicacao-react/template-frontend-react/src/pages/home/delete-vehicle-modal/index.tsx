import { Button } from '@/components/button'
import { Modal } from '@/components/modal'
import { vehicleService } from '@/services/vehicles'
import type { Vehicle } from '@/types/vehicle'

type Props = {
  vehicle?: Vehicle | null
  isOpen: boolean
  onClose: () => void
  onReload?: () => void
}

export function DeleteVehicleModal({
  vehicle,
  isOpen,
  onClose,
  onReload,
}: Props) {
  const handleConfirm = async () => {
    if (!vehicle) return
    try {
      await vehicleService.delete.execute(vehicle.id)

      onClose()
      onReload?.()
    } catch (error: any) {
      alert(error?.message || 'Algo deu errado')
    }
  }

  const vehicleDescription = vehicle ? (
    <>
      o veículo{' '}
      <strong>
        {vehicle.chassi} ({vehicle.brand} {vehicle.model} {vehicle.year})
      </strong>
    </>
  ) : (
    'este veículo'
  )

  return (
    <Modal title="Excluir Veículo" isOpen={isOpen} onClose={onClose}>
      <p style={{ lineHeight: 1.4 }}>
        Tem certeza de que deseja excluir {vehicleDescription}? Essa ação não
        poderá ser desfeita.
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 16,
          marginTop: 16,
        }}
      >
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm}>Confirmar</Button>
      </div>
    </Modal>
  )
}
