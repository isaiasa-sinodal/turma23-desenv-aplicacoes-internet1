import styles from './styles.module.css'

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  size?: 'sm' | 'lg'
}

export function Button({ children, className, size = 'lg', ...props }: Props) {
  return (
    <button
      {...props}
      className={`${styles.button} ${className} ${styles[size]}`}
    >
      {children}
    </button>
  )
}
