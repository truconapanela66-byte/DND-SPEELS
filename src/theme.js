// Design System baseado no Stitch MCP - Modern Dark Fantasy
export const theme = {
  colors: {
    // Surface colors
    surface: '#131313',
    surfaceDim: '#131313',
    surfaceBright: '#393939',
    surfaceContainerLowest: '#0e0e0e',
    surfaceContainerLow: '#1c1b1b',
    surfaceContainer: '#20201f',
    surfaceContainerHigh: '#2a2a2a',
    surfaceContainerHighest: '#353535',
    surfaceVariant: '#353535',
    
    // Primary colors (Metallic Gold)
    primary: '#f2ca50',
    onPrimary: '#3c2f00',
    primaryContainer: '#d4af37',
    onPrimaryContainer: '#554300',
    primaryFixed: '#ffe088',
    primaryFixedDim: '#e9c349',
    
    // Secondary colors (Crimson)
    secondary: '#ffb4a8',
    onSecondary: '#690000',
    secondaryContainer: '#920703',
    onSecondaryContainer: '#ff9a8a',
    
    // Tertiary colors
    tertiary: '#dacbc1',
    onTertiary: '#372f28',
    tertiaryContainer: '#beb0a6',
    onTertiaryContainer: '#4d433c',
    
    // Text colors
    onSurface: '#e5e2e1',
    onSurfaceVariant: '#d0c5af',
    
    // Outline
    outline: '#99907c',
    outlineVariant: '#4d4635',
    
    // Error colors
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',
    
    // Other
    background: '#131313',
    onBackground: '#e5e2e1',
    inverseSurface: '#e5e2e1',
    inverseOnSurface: '#313030',
    inversePrimary: '#735c00',
    surfaceTint: '#e9c349',
  },
  
  typography: {
    h1: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '40px',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '32px',
      fontWeight: '600',
      lineHeight: '1.3',
    },
    h3: {
      fontFamily: '"Noto Serif", serif',
      fontSize: '24px',
      fontWeight: '600',
      lineHeight: '1.4',
    },
    bodyLg: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '18px',
      fontWeight: '400',
      lineHeight: '1.6',
    },
    bodyMd: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.6',
    },
    labelCaps: {
      fontFamily: '"Manrope", sans-serif',
      fontSize: '12px',
      fontWeight: '700',
      lineHeight: '1',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  
  spacing: {
    xs: '4px',
    sm: '12px',
    base: '8px',
    md: '24px',
    lg: '40px',
    xl: '64px',
    gutter: '16px',
    margin: '24px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
}
