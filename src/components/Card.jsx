import { theme } from '../theme'

export default function Card({ children, className = '', variant = 'default' }) {
  const variants = {
    default: {
      backgroundColor: theme.colors.surfaceContainer,
      border: `1px solid ${theme.colors.surfaceContainerHighest}`,
    },
    elevated: {
      backgroundColor: theme.colors.surfaceContainerHigh,
      border: `1px solid rgba(212, 175, 55, 0.2)`,
    },
    outlined: {
      backgroundColor: 'transparent',
      border: `1px solid ${theme.colors.outline}`,
    },
  }

  const style = {
    ...variants[variant],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.onSurface,
  }

  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  )
}
