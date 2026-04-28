import { theme } from '../theme'

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '' 
}) {
  const variants = {
    primary: {
      backgroundColor: theme.colors.primaryContainer,
      color: theme.colors.onPrimary,
      border: 'none',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primaryContainer}`,
    },
    danger: {
      backgroundColor: theme.colors.secondaryContainer,
      color: theme.colors.onSecondary,
      border: 'none',
    },
  }

  const style = {
    ...variants[variant],
    ...theme.typography.bodyMd,
    fontWeight: '600',
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
  }

  return (
    <button 
      className={`btn ${className}`}
      style={style} 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
