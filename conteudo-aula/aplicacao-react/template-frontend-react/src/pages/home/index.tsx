import { useEffect, useState } from 'react'
import { Button } from '@/components/button'
import { vehicleService } from '@/services/vehicles'
import type { Vehicle } from '@/types/vehicle'
import { CreateVehicleModal } from './create-vehicle-modal'
import { DeleteVehicleModal } from './delete-vehicle-modal'
import { EditVehicleModal } from './edit-vehicle-modal'
import styles from './styles.module.css'

export function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [vehicleToEdit, setVehicleToEdit] = useState<number | null>(null)
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null)
  const [reload, setReload] = useState(Date.now())

  const handleFetchVehicles = async () => {
    try {
      const response = await vehicleService.get.execute()
      setVehicles(response)
    } catch (error: any) {
      alert(error?.message || 'Algo deu errado')
    }
  }

  useEffect(() => {
    handleFetchVehicles()
  }, [reload])

  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <h1>Lista de Veículos</h1>

        <Button onClick={() => setIsCreateModalOpen(true)}>Novo veículo</Button>
      </div>

      {vehicles.length ? (
        <table border={1}>
          <thead>
            <tr>
              <th>Chassi</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Ano</th>
              <th className={styles.actionsHeader}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.chassi}>
                <td>{vehicle.chassi.toUpperCase()}</td>
                <td>{vehicle.brand}</td>
                <td>{vehicle.model}</td>
                <td>{vehicle.year}</td>
                <td className={styles.actions}>
                  <Button
                    size="sm"
                    onClick={() => setVehicleToEdit(vehicle.id)}
                  >
                    Editar
                  </Button>
                  <Button size="sm" onClick={() => setVehicleToDelete(vehicle)}>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.emptyList}>
          <p>Não há veículos cadastrados</p>
        </div>
      )}

      <CreateVehicleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onReload={() => setReload(Date.now())}
      />
      <EditVehicleModal
        isOpen={!!vehicleToEdit}
        onClose={() => setVehicleToEdit(null)}
        onReload={() => setReload(Date.now())}
        id={vehicleToEdit}
      />
      <DeleteVehicleModal
        isOpen={!!vehicleToDelete}
        onClose={() => setVehicleToDelete(null)}
        onReload={() => setReload(Date.now())}
        vehicle={vehicleToDelete}
      />
    </div>
  )
}
