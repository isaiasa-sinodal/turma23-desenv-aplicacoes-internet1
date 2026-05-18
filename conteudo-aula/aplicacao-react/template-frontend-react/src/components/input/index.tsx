import styles from './styles.module.css'

type Props = {
  name: string
  label: string
  required?: boolean
  disabled?: boolean
  type?: React.HTMLInputTypeAttribute
}

export function Input({
  name,
  label,
  required,
  disabled,
  type = 'text',
}: Props) {
  const labelText = label + (required ? '*' : '')

  return (
    <div className={styles.inputContainer}>
      <label htmlFor={name}>{labelText}</label>

      <input name={name} type={type} required={required} disabled={disabled} />
    </div>
  )
}
