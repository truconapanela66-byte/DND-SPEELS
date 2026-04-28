import { theme } from '../theme'

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: theme.spacing.gutter,
      backdropFilter: 'blur(4px)',
    },
    modal: {
      backgroundColor: theme.colors.surfaceContainer,
      border: `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.lg,
      maxWidth: '500px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    },
    header: {
      ...theme.typography.h3,
      color: theme.colors.primary,
      padding: theme.spacing.md,
      borderBottom: `1px solid ${theme.colors.outlineVariant}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      backgroundColor: theme.colors.surfaceContainer,
      zIndex: 1,
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: theme.colors.onSurfaceVariant,
      fontSize: '24px',
      cursor: 'pointer',
      padding: theme.spacing.xs,
      lineHeight: '1',
      transition: 'all 0.2s ease',
    },
    content: {
      padding: theme.spacing.md,
    },
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <span>{title}</span>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => (e.target.style.color = theme.colors.primary)}
            onMouseLeave={(e) => (e.target.style.color = theme.colors.onSurfaceVariant)}
          >
            ×
          </button>
        </div>
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  )
}
