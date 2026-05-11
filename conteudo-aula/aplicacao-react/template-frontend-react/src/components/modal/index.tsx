import React, { useEffect, useRef } from 'react'
import styles from './styles.module.css'

type Props = {
  title?: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ title, isOpen, onClose, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const openModal = () => {
    dialogRef.current?.showModal()
  }

  const closeModal = () => {
    dialogRef.current?.close()
  }

  useEffect(() => {
    if (isOpen) {
      openModal()
      dialogRef.current?.addEventListener('close', onClose)
    } else {
      closeModal()
    }

    return () => {
      dialogRef.current?.removeEventListener('close', onClose)
    }
  }, [isOpen])

  return (
    <dialog className={styles.modal} ref={dialogRef}>
      <button className={styles.close} onClick={onClose}>
        X
      </button>

      {title ? <h2 className={styles.title}>{title}</h2> : null}

      {children}
    </dialog>
  )
}
