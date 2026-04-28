import { useState } from 'react'
import { theme } from '../theme'

export default function FormField({ label, type = 'text', value, onChange, options, multiline, rows = 3, ...props }) {
  const styles = {
    field: {
      marginBottom: theme.spacing.md,
    },
    label: {
      ...theme.typography.labelCaps,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
      display: 'block',
    },
    input: {
      width: '100%',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceContainerHigh,
      border: `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.sm,
      color: theme.colors.onSurface,
      ...theme.typography.bodyMd,
      outline: 'none',
    },
    select: {
      width: '100%',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceContainerHigh,
      border: `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.sm,
      color: theme.colors.onSurface,
      ...theme.typography.bodyMd,
      outline: 'none',
      cursor: 'pointer',
    },
    textarea: {
      width: '100%',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceContainerHigh,
      border: `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.sm,
      color: theme.colors.onSurface,
      ...theme.typography.bodyMd,
      outline: 'none',
      resize: 'vertical',
      minHeight: `${rows * 24}px`,
    },
    checkbox: {
      width: '20px',
      height: '20px',
      marginRight: theme.spacing.sm,
      cursor: 'pointer',
      accentColor: theme.colors.primary,
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
    },
  }

  if (type === 'checkbox') {
    return (
      <div style={styles.field}>
        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            style={styles.checkbox}
            {...props}
          />
          <label style={{ ...styles.label, marginBottom: 0 }}>{label}</label>
        </div>
      </div>
    )
  }

  if (type === 'select') {
    return (
      <div style={styles.field}>
        <label style={styles.label}>{label}</label>
        <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.select} {...props}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (multiline) {
    return (
      <div style={styles.field}>
        <label style={styles.label}>{label}</label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.textarea}
          rows={rows}
          {...props}
        />
      </div>
    )
  }

  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        style={styles.input}
        {...props}
      />
    </div>
  )
}

export function FormButton({ children, onClick, variant = 'primary', type = 'button', ...props }) {
  const styles = {
    button: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.sm,
      border: 'none',
      ...theme.typography.bodyMd,
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      width: '100%',
    },
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.surfaceContainer,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: theme.colors.onSurfaceVariant,
      border: `1px solid ${theme.colors.outlineVariant}`,
    },
    danger: {
      backgroundColor: theme.colors.secondaryContainer,
      color: theme.colors.onSurface,
    },
  }

  const variantStyle = variant === 'danger' ? styles.danger : variant === 'secondary' ? styles.secondary : styles.primary

  return (
    <button type={type} onClick={onClick} style={{ ...styles.button, ...variantStyle }} {...props}>
      {children}
    </button>
  )
}
