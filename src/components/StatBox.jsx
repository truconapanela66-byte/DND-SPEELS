import { theme } from '../theme'

export default function StatBox({ label, value, modifier, onClick }) {
  const isNegative = modifier && modifier < 0
  const displayModifier = modifier > 0 ? `+${modifier}` : modifier

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.surfaceContainerHigh,
        border: `2px solid ${theme.colors.primaryContainer}`,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        minWidth: '80px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
      className="stat-box"
    >
      <span
        style={{
          ...theme.typography.labelCaps,
          color: theme.colors.onSurfaceVariant,
          marginBottom: theme.spacing.xs,
        }}
      >
        {label}
      </span>
      <span
        style={{
          ...theme.typography.h2,
          color: theme.colors.primary,
          marginBottom: modifier ? theme.spacing.xs : 0,
        }}
      >
        {value}
      </span>
      {modifier !== undefined && (
        <span
          style={{
            ...theme.typography.bodyMd,
            fontWeight: '600',
            color: isNegative ? theme.colors.error : theme.colors.onSurface,
          }}
        >
          {displayModifier}
        </span>
      )}
    </div>
  )
}
