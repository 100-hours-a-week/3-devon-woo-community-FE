import styles from './EmptyState.module.css'

interface EmptyStateProps {
  message: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ message, icon, action }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      {icon && <div className={styles.emptyStateIcon}>{icon}</div>}
      <p className={styles.emptyStateMessage}>{message}</p>
      {action && (
        <button className={styles.emptyStateAction} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
