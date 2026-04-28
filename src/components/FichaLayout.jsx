import { useState, useRef } from 'react'
import { theme } from '../theme'
import { useCharacterStore } from '../store/characterStore'
import {
  EditHPModal,
  EditAttackModal,
  EditSpellModal,
  EditItemModal,
  EditCategoryModal,
  EditBasicInfoModal,
  EditCombatStatsModal,
  EditAttributeModal,
  EditSpellcastingModal,
  EditCurrencyModal,
  EditLoreModal,
  EditSpellSlotsModal,
  EditSavingThrowsModal,
  EditSkillsModal,
} from './EditModals'

export default function FichaLayout() {
  const [activeTab, setActiveTab] = useState('overview')
  const character = useCharacterStore((state) => state.character)
  const updateCharacter = useCharacterStore((state) => state.updateCharacter)
  const adjustHP = useCharacterStore((state) => state.adjustHP)
  const addTempHP = useCharacterStore((state) => state.addTempHP)
  const longRest = useCharacterStore((state) => state.longRest)
  const useSpellSlot = useCharacterStore((state) => state.useSpellSlot)
  const restoreSpellSlot = useCharacterStore((state) => state.restoreSpellSlot)
  const getSkillModifier = useCharacterStore((state) => state.getSkillModifier)
  const getSavingThrowModifier = useCharacterStore((state) => state.getSavingThrowModifier)
  const fileInputRef = useRef(null)

  // Estados dos modais
  const [editingHP, setEditingHP] = useState(false)
  const [editingAttack, setEditingAttack] = useState(null)
  const [editingSpell, setEditingSpell] = useState(null)
  const [editingItem, setEditingItem] = useState({ categoryId: null, item: null })
  const [editingCategory, setEditingCategory] = useState(null)
  const [addingCantrip, setAddingCantrip] = useState(false)
  const [editingCantrip, setEditingCantrip] = useState(null)
  const [editingBasicInfo, setEditingBasicInfo] = useState(false)
  const [editingCombatStats, setEditingCombatStats] = useState(false)
  const [editingAttribute, setEditingAttribute] = useState(null)
  const [editingSpellcasting, setEditingSpellcasting] = useState(false)
  const [editingSpellSlots, setEditingSpellSlots] = useState(false)
  const [editingCurrency, setEditingCurrency] = useState(false)
  const [editingLore, setEditingLore] = useState(false)
  const [editingSavingThrows, setEditingSavingThrows] = useState(false)
  const [editingSkills, setEditingSkills] = useState(false)

  // Funções de Export/Import
  const handleExport = () => {
    const dataStr = JSON.stringify(character, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${character.name.replace(/\s+/g, '_')}_backup.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result)
        updateCharacter(importedData)
        alert('Backup importado com sucesso!')
      } catch (error) {
        alert('Erro ao importar backup. Verifique se o arquivo é um JSON válido.')
        console.error('Import error:', error)
      }
    }
    reader.readAsText(file)
    // Limpa o input para permitir importar o mesmo arquivo novamente
    event.target.value = ''
  }

  // Helper para converter metros para quadrados (1 quadrado = 1.5m)
  const metersToSquares = (value) => {
    // Se for número direto
    if (typeof value === 'number') {
      const squares = value / 1.5
      const squaresFormatted = squares % 1 === 0 ? squares.toFixed(0) : squares.toFixed(1)
      return `${value}m (${squaresFormatted} quadrados)`
    }
    // Se for string com metros (ex: "18m", "4.5m")
    if (typeof value === 'string') {
      const match = value.match(/^(\d+\.?\d*)m?$/)
      if (match) {
        const meters = parseFloat(match[1])
        const squares = meters / 1.5
        const squaresFormatted = squares % 1 === 0 ? squares.toFixed(0) : squares.toFixed(1)
        return `${meters}m (${squaresFormatted} quadrados)`
      }
    }
    // Retorna valor original para casos como "Toque", "Pessoal", etc.
    return value
  }

  // Helper para criar long press sem hooks (para usar em loops e evitar erro de hooks condicionais)
  const createLongPressHandlers = (onLongPress, options = {}) => {
    let timeout = null
    const { hoverBg = null, hoverTransform = null } = options
    return {
      onMouseDown: () => {
        timeout = setTimeout(onLongPress, 500)
      },
      onMouseUp: (e) => {
        if (timeout) clearTimeout(timeout)
      },
      onMouseLeave: (e) => {
        if (timeout) clearTimeout(timeout)
        if (hoverBg && e.currentTarget) {
          e.currentTarget.style.backgroundColor = hoverBg
        }
        if (hoverTransform && e.currentTarget) {
          e.currentTarget.style.transform = hoverTransform
        }
      },
      onTouchStart: () => {
        timeout = setTimeout(onLongPress, 500)
      },
      onTouchEnd: () => {
        if (timeout) clearTimeout(timeout)
      },
    }
  }

  const styles = {
    container: {
      maxWidth: '480px',
      margin: '0 auto',
      padding: theme.spacing.gutter,
      color: theme.colors.onSurface,
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
      paddingBottom: '100px',
    },
    portraitContainer: {
      position: 'relative',
      width: '140px',
      height: '140px',
      margin: `${theme.spacing.lg} auto`,
      borderRadius: '50%',
      overflow: 'hidden',
      border: `4px solid ${theme.colors.primary}`,
      boxShadow: `0 0 32px ${theme.colors.primary}40, inset 0 0 24px ${theme.colors.primary}20`,
    },
    portrait: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    header: {
      ...theme.typography.h1,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
      color: theme.colors.primary,
    },
    subtitle: {
      ...theme.typography.bodyLg,
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.lg,
    },
    card: {
      backgroundColor: theme.colors.surfaceContainer,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      border: `1px solid ${theme.colors.outlineVariant}`,
    },
    sectionTitle: {
      ...theme.typography.h2,
      color: theme.colors.primary,
      fontSize: '20px',
      marginBottom: theme.spacing.sm,
    },
    infoRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing.md,
    },
    infoItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.xs,
    },
    label: {
      ...theme.typography.labelCaps,
      color: theme.colors.onSurfaceVariant,
      fontSize: '11px',
    },
    value: {
      ...theme.typography.bodyLg,
      color: theme.colors.onSurface,
      fontSize: '16px',
    },
    hpContainer: {
      marginBottom: theme.spacing.md,
    },
    hpLabel: {
      ...theme.typography.h3,
      color: theme.colors.primary,
      fontSize: '14px',
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
    },
    hpBar: {
      position: 'relative',
      height: '48px',
      backgroundColor: theme.colors.surfaceContainerHigh,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      border: `2px solid ${theme.colors.outlineVariant}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hpText: {
      ...theme.typography.h2,
      color: theme.colors.onSurface,
      fontSize: '24px',
      zIndex: 1,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    hpFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      backgroundColor: `${theme.colors.primary}30`,
      transition: 'width 0.3s ease',
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: theme.spacing.sm,
    },
    statBox: {
      textAlign: 'center',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceContainerHigh,
      borderRadius: theme.borderRadius.sm,
      border: `1px solid ${theme.colors.outlineVariant}`,
    },
    statLabel: {
      ...theme.typography.labelCaps,
      fontSize: '10px',
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.xs,
    },
    statValue: {
      ...theme.typography.h2,
      color: theme.colors.primary,
      fontSize: '20px',
    },
    attributesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: theme.spacing.sm,
    },
    attributeBox: {
      textAlign: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surfaceContainerHigh,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.outlineVariant}`,
    },
    attributeLabel: {
      ...theme.typography.labelCaps,
      fontSize: '11px',
      color: theme.colors.onSurfaceVariant,
      marginBottom: theme.spacing.xs,
    },
    attributeValue: {
      ...theme.typography.h1,
      color: theme.colors.onSurface,
      fontSize: '32px',
      marginBottom: theme.spacing.xs,
    },
    attributeModifier: {
      ...theme.typography.h3,
      color: theme.colors.primary,
      fontSize: '16px',
    },
    skillsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.xs,
    },
    skillItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceContainerHigh,
      borderRadius: theme.borderRadius.sm,
      border: `1px solid ${theme.colors.outlineVariant}`,
    },
    skillLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    proficiencyDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: theme.colors.primary,
    },
    skillName: {
      ...theme.typography.bodyMd,
      color: theme.colors.onSurface,
      fontSize: '14px',
    },
    skillModifier: {
      ...theme.typography.bodyMd,
      fontWeight: '700',
      color: theme.colors.primary,
      fontSize: '14px',
    },
    navbar: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '480px',
      width: '100%',
      backgroundColor: theme.colors.surfaceContainerHigh,
      borderTop: `1px solid ${theme.colors.outlineVariant}`,
      display: 'flex',
      justifyContent: 'space-around',
      padding: `${theme.spacing.sm} 0`,
      zIndex: 1000,
      boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.3)',
    },
    tabButton: {
      background: 'none',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing.xs,
      padding: theme.spacing.xs,
      cursor: 'pointer',
      color: theme.colors.onSurfaceVariant,
      transition: 'all 0.2s ease',
      flex: 1,
    },
    tabButtonActive: {
      color: theme.colors.primary,
    },
    tabIcon: {
      fontSize: '20px',
      lineHeight: '1',
    },
    tabLabel: {
      ...theme.typography.labelCaps,
      fontSize: '10px',
      letterSpacing: '0.1em',
    },
    editable: {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      userSelect: 'none',
    },
    hpControls: {
      display: 'flex',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
      justifyContent: 'center',
    },
    hpButton: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      backgroundColor: theme.colors.surfaceContainerHigh,
      border: `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.sm,
      color: theme.colors.primary,
      ...theme.typography.bodyMd,
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minWidth: '40px',
    },
    addButton: {
      padding: theme.spacing.sm,
      backgroundColor: 'transparent',
      border: `1px dashed ${theme.colors.primary}40`,
      borderRadius: theme.borderRadius.sm,
      color: theme.colors.primary,
      ...theme.typography.bodyMd,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },
    longRestButton: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      backgroundColor: theme.colors.surfaceContainerHigh,
      border: `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.sm,
      color: theme.colors.primary,
      ...theme.typography.bodyMd,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginTop: theme.spacing.sm,
      width: '100%',
    },
    editSectionButton: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      backgroundColor: 'transparent',
      border: `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.sm,
      color: theme.colors.onSurfaceVariant,
      ...theme.typography.labelCaps,
      fontSize: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    sectionTitleWithEdit: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
  }

  // HP efetivo = HP atual + HP temporário (pode ultrapassar máximo)
  const effectiveHp = character.hp.current + character.tempHp
  const hpPercentage = Math.min(100, (effectiveHp / character.hp.max) * 100)

  const tabs = [
    { id: 'overview', label: 'Geral', icon: '📋' },
    { id: 'combat', label: 'Combate', icon: '⚔️' },
    { id: 'spells', label: 'Magias', icon: '✨' },
    { id: 'inventory', label: 'Inventário', icon: '🎒' },
    { id: 'lore', label: 'História', icon: '📝' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'combat':
        return renderCombat()
      case 'spells':
        return renderSpells()
      case 'inventory':
        return renderInventory()
      case 'lore':
        return renderLore()
      default:
        return renderOverview()
    }
  }

  const renderOverview = () => (
    <>
      <div style={styles.portraitContainer}>
        {character.portrait ? (
          <img 
            src={character.portrait} 
            alt={character.name}
            style={styles.portrait}
          />
        ) : (
          <div style={{
            ...styles.portrait,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surfaceContainerHigh,
            color: theme.colors.onSurfaceVariant,
            fontSize: '48px',
          }}>
            👤
          </div>
        )}
      </div>

      <h1 style={styles.header}>{character.name}</h1>
      <div style={styles.subtitle}>
        {character.class} Nível {character.level} • {character.race}
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitleWithEdit}>
          <div style={styles.sectionTitle}>Informações Básicas</div>
          <button
            style={styles.editSectionButton}
            onClick={() => setEditingBasicInfo(true)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            ✎ Editar
          </button>
        </div>
        <div style={styles.infoRow}>
          <div style={styles.infoItem}>
            <div style={styles.label}>Antecedente</div>
            <div style={styles.value}>{character.background}</div>
          </div>
          <div style={styles.infoItem}>
            <div style={styles.label}>Alinhamento</div>
            <div style={styles.value}>{character.alignment}</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitleWithEdit}>
          <div style={styles.sectionTitle}>Combate</div>
          <button
            style={styles.editSectionButton}
            onClick={() => setEditingCombatStats(true)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            ✎ Editar
          </button>
        </div>
        <div style={styles.hpContainer}>
          <div style={styles.hpLabel}>Pontos de Vida (segure para editar)</div>
          <div
            style={{...styles.hpBar, ...styles.editable}}
            {...createLongPressHandlers(() => setEditingHP(true), { hoverTransform: 'scale(1)' })}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          >
            <div style={styles.hpText}>
              {effectiveHp} / {character.hp.max}
              {character.tempHp > 0 && <span style={{fontSize: '14px', marginLeft: theme.spacing.xs, color: theme.colors.tertiary}}>(+{character.tempHp} temp)</span>}
            </div>
            <div style={{ ...styles.hpFill, width: `${hpPercentage}%` }} />
          </div>
          <div style={styles.hpControls}>
            <button
              style={styles.hpButton}
              onClick={() => adjustHP(-5)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHighest)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            >
              -5
            </button>
            <button
              style={styles.hpButton}
              onClick={() => adjustHP(-1)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHighest)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            >
              -1
            </button>
            <button
              style={styles.hpButton}
              onClick={() => adjustHP(1)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHighest)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            >
              +1
            </button>
            <button
              style={styles.hpButton}
              onClick={() => adjustHP(5)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHighest)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            >
              +5
            </button>
            <button
              style={styles.longRestButton}
              onClick={longRest}
              onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHighest)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            >
              🌙 Descanso Longo
            </button>
          </div>
          <div style={{...styles.hpControls, marginTop: theme.spacing.xs}}>
            <button
              style={{...styles.hpButton, backgroundColor: `${theme.colors.tertiary}20`, border: `1px solid ${theme.colors.tertiary}`}}
              onClick={() => addTempHP(1)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = `${theme.colors.tertiary}30`)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = `${theme.colors.tertiary}20`)}
            >
              +1 🛡️
            </button>
            <button
              style={{...styles.hpButton, backgroundColor: `${theme.colors.tertiary}20`, border: `1px solid ${theme.colors.tertiary}`}}
              onClick={() => addTempHP(5)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = `${theme.colors.tertiary}30`)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = `${theme.colors.tertiary}20`)}
            >
              +5 🛡️
            </button>
            <button
              style={{...styles.hpButton, backgroundColor: `${theme.colors.tertiary}20`, border: `1px solid ${theme.colors.tertiary}`}}
              onClick={() => addTempHP(10)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = `${theme.colors.tertiary}30`)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = `${theme.colors.tertiary}20`)}
            >
              +10 🛡️
            </button>
          </div>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>CA</div>
            <div style={styles.statValue}>{character.ac}</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Iniciativa</div>
            <div style={styles.statValue}>
              {character.initiative > 0 ? `+${character.initiative}` : character.initiative}
            </div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Velocidade</div>
            <div style={styles.statValue}>{metersToSquares(character.speed)}</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitle}>Atributos (clique para editar)</div>
        <div style={styles.attributesGrid}>
          <div
            style={{ ...styles.attributeBox, ...styles.editable }}
            onClick={() => setEditingAttribute('str')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={styles.attributeLabel}>FOR</div>
            <div style={styles.attributeValue}>{character.attributes.str.value}</div>
            <div style={styles.attributeModifier}>
              {character.attributes.str.modifier > 0 ? '+' : ''}{character.attributes.str.modifier}
            </div>
          </div>
          <div
            style={{ ...styles.attributeBox, ...styles.editable }}
            onClick={() => setEditingAttribute('dex')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={styles.attributeLabel}>DES</div>
            <div style={styles.attributeValue}>{character.attributes.dex.value}</div>
            <div style={styles.attributeModifier}>
              {character.attributes.dex.modifier > 0 ? '+' : ''}{character.attributes.dex.modifier}
            </div>
          </div>
          <div
            style={{ ...styles.attributeBox, ...styles.editable }}
            onClick={() => setEditingAttribute('con')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={styles.attributeLabel}>CON</div>
            <div style={styles.attributeValue}>{character.attributes.con.value}</div>
            <div style={styles.attributeModifier}>
              {character.attributes.con.modifier > 0 ? '+' : ''}{character.attributes.con.modifier}
            </div>
          </div>
          <div
            style={{ ...styles.attributeBox, ...styles.editable }}
            onClick={() => setEditingAttribute('int')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={styles.attributeLabel}>INT</div>
            <div style={styles.attributeValue}>{character.attributes.int.value}</div>
            <div style={styles.attributeModifier}>
              {character.attributes.int.modifier > 0 ? '+' : ''}{character.attributes.int.modifier}
            </div>
          </div>
          <div
            style={{ ...styles.attributeBox, ...styles.editable }}
            onClick={() => setEditingAttribute('wis')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={styles.attributeLabel}>SAB</div>
            <div style={styles.attributeValue}>{character.attributes.wis.value}</div>
            <div style={styles.attributeModifier}>
              {character.attributes.wis.modifier > 0 ? '+' : ''}{character.attributes.wis.modifier}
            </div>
          </div>
          <div
            style={{ ...styles.attributeBox, ...styles.editable }}
            onClick={() => setEditingAttribute('cha')}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <div style={styles.attributeLabel}>CAR</div>
            <div style={styles.attributeValue}>{character.attributes.cha.value}</div>
            <div style={styles.attributeModifier}>
              {character.attributes.cha.modifier > 0 ? '+' : ''}{character.attributes.cha.modifier}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitleWithEdit}>
          <div style={styles.sectionTitle}>Testes de Resistência</div>
          <button
            style={styles.editSectionButton}
            onClick={() => setEditingSavingThrows(true)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            ✎ Editar
          </button>
        </div>
        <div style={styles.skillsList}>
          {Object.keys(character.savingThrows).map((attr) => {
            const modifier = getSavingThrowModifier(attr)
            const data = character.savingThrows[attr]
            const attributeNames = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' }
            return (
              <div key={attr} style={styles.skillItem}>
                <div style={styles.skillLeft}>
                  {data.proficient && <div style={styles.proficiencyDot} />}
                  <span style={styles.skillName}>{attributeNames[attr]}</span>
                </div>
                <span style={styles.skillModifier}>
                  {modifier > 0 ? `+${modifier}` : modifier}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionTitleWithEdit}>
          <div style={styles.sectionTitle}>Perícias</div>
          <button
            style={styles.editSectionButton}
            onClick={() => setEditingSkills(true)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            ✎ Editar
          </button>
        </div>
        <div style={styles.skillsList}>
          {character.skills.map((skill, index) => {
            const modifier = getSkillModifier(skill)
            return (
              <div key={index} style={styles.skillItem}>
                <div style={styles.skillLeft}>
                  {skill.proficient && <div style={styles.proficiencyDot} />}
                  {skill.expertise && <div style={{...styles.proficiencyDot, marginLeft: '-4px'}} />}
                  <span style={styles.skillName}>{skill.name}</span>
                </div>
                <span style={styles.skillModifier}>
                  {modifier > 0 ? `+${modifier}` : modifier}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )

  const renderCombat = () => (
    <>
      <h2 style={styles.header}>⚔️ Combate</h2>

      <div style={{...styles.card, marginBottom: theme.spacing.md}}>
        <div style={styles.sectionTitleWithEdit}>
          <div style={styles.sectionTitle}>Stats de Combate</div>
          <button
            style={styles.editSectionButton}
            onClick={() => setEditingCombatStats(true)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            ✎ Editar
          </button>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing.sm}}>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>CA</div>
            <div style={{...styles.statValue, fontSize: '28px'}}>{character.ac}</div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Iniciativa</div>
            <div style={{...styles.statValue, fontSize: '28px'}}>
              {character.initiative > 0 ? `+${character.initiative}` : character.initiative}
            </div>
          </div>
          <div style={styles.statBox}>
            <div style={styles.statLabel}>Velocidade</div>
            <div style={{...styles.statValue, fontSize: '28px'}}>{metersToSquares(character.speed)}</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={{...styles.sectionTitle, marginBottom: theme.spacing.md}}>Ataques & Armas</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: theme.spacing.sm}}>
          {character.attacks.map((attack) => (
            <div
              key={attack.id}
              style={{
                ...styles.skillItem,
                ...styles.editable,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              {...createLongPressHandlers(() => setEditingAttack(attack), { hoverBg: theme.colors.surfaceContainerHigh })}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
            >
              <div>
                <div style={{...styles.skillName, fontWeight: '700'}}>{attack.name}</div>
                <div style={{...theme.typography.labelCaps, fontSize: '10px', color: theme.colors.onSurfaceVariant}}>
                  {attack.type}
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{...styles.skillModifier}}>+{attack.bonus}</div>
                <div style={{fontSize: '12px', color: theme.colors.onSurfaceVariant}}>
                  {attack.damage}
                </div>
                <div style={{...theme.typography.labelCaps, fontSize: '9px', color: theme.colors.primary}}>
                  {attack.damageType}
                </div>
              </div>
            </div>
          ))}
          <button
            style={styles.addButton}
            onClick={() => setEditingAttack({})}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = `${theme.colors.primary}10`
              e.target.style.borderColor = theme.colors.primary
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
              e.target.style.borderColor = `${theme.colors.primary}40`
            }}
          >
            <span>+</span> Adicionar Ataque
          </button>
        </div>
      </div>
    </>
  )

  const renderSpells = () => {
    const spellsByLevel = {}
    character.spells.forEach((spell) => {
      if (!spellsByLevel[spell.level]) {
        spellsByLevel[spell.level] = []
      }
      spellsByLevel[spell.level].push(spell)
    })

    const levelNames = {
      1: 'Primeiro Círculo',
      2: 'Segundo Círculo',
      3: 'Terceiro Círculo',
      4: 'Quarto Círculo',
      5: 'Quinto Círculo',
      6: 'Sexto Círculo',
      7: 'Sétimo Círculo',
      8: 'Oitavo Círculo',
      9: 'Nono Círculo',
    }

    return (
      <>
        <h2 style={styles.header}>✨ Grimório</h2>

        <div style={{ ...styles.card, marginBottom: theme.spacing.md }}>
          <div style={styles.sectionTitleWithEdit}>
            <div style={styles.sectionTitle}>Stats de Conjuração</div>
            <button
              style={styles.editSectionButton}
              onClick={() => setEditingSpellcasting(true)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              ✎ Editar
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing.sm }}>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Atributo</div>
              <div style={{ ...theme.typography.h3, color: theme.colors.primary, fontSize: '16px' }}>
                {character.spellcasting.attribute === 'int' ? 'Inteligência' : character.spellcasting.attribute}
              </div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>CD de Magia</div>
              <div style={{ ...styles.statValue, fontSize: '24px' }}>{character.spellcasting.spellDC}</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statLabel}>Bônus Ataque</div>
              <div style={{ ...styles.statValue, fontSize: '24px' }}>+{character.spellcasting.attackBonus}</div>
            </div>
          </div>
        </div>

        <div style={{ ...styles.card, marginBottom: theme.spacing.md }}>
          <div style={styles.sectionTitleWithEdit}>
            <div style={styles.sectionTitle}>Espaços de Magia</div>
            <button
              style={styles.editSectionButton}
              onClick={() => setEditingSpellSlots(true)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              ✎ Editar
            </button>
          </div>
          <div style={{ display: 'flex', gap: theme.spacing.sm, flexWrap: 'wrap' }}>
            {character.spellSlots.map((slot, index) => (
              <div
                key={index}
                style={{
                  flex: '1',
                  minWidth: '100px',
                  backgroundColor: theme.colors.surfaceContainerHigh,
                  padding: theme.spacing.sm,
                  borderRadius: theme.borderRadius.sm,
                  border: `1px solid ${theme.colors.outlineVariant}`,
                }}
              >
                <div
                  style={{
                    ...theme.typography.labelCaps,
                    fontSize: '10px',
                    color: theme.colors.onSurfaceVariant,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {slot.level}º Círculo
                </div>
                <div style={{ display: 'flex', gap: theme.spacing.xs, marginBottom: theme.spacing.xs }}>
                  {Array.from({ length: slot.total }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        backgroundColor: i < slot.total - slot.used ? theme.colors.primary : 'transparent',
                        border: `1px solid ${theme.colors.outlineVariant}`,
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.xs }}>
                  <div style={{ ...theme.typography.bodyMd, fontSize: '12px', color: theme.colors.onSurface }}>
                    {slot.total - slot.used} / {slot.total}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: `1px solid ${theme.colors.primary}`,
                        backgroundColor: 'transparent',
                        color: theme.colors.primary,
                        cursor: slot.used < slot.total ? 'pointer' : 'not-allowed',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: slot.used < slot.total ? 1 : 0.3,
                        padding: 0,
                      }}
                      onClick={() => slot.used < slot.total && useSpellSlot(slot.level)}
                      disabled={slot.used >= slot.total}
                      title="Gastar espaço"
                    >
                      −
                    </button>
                    <button
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: `1px solid ${theme.colors.primary}`,
                        backgroundColor: 'transparent',
                        color: theme.colors.primary,
                        cursor: slot.used > 0 ? 'pointer' : 'not-allowed',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: slot.used > 0 ? 1 : 0.3,
                        padding: 0,
                      }}
                      onClick={() => slot.used > 0 && restoreSpellSlot(slot.level)}
                      disabled={slot.used <= 0}
                      title="Recuperar espaço"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.card, marginBottom: theme.spacing.md }}>
          <div style={{ ...styles.sectionTitle, marginBottom: theme.spacing.md }}>Truques</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            {character.cantrips.map((spell) => (
              <div
                key={spell.id}
                style={{
                  ...styles.skillItem,
                  ...styles.editable,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: theme.spacing.xs,
                }}
                {...createLongPressHandlers(() => setEditingCantrip(spell), { hoverBg: theme.colors.surfaceContainerHigh })}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
              >
                <div style={{ ...styles.skillName, fontWeight: '700' }}>{spell.name}</div>
                <div style={{ ...theme.typography.labelCaps, fontSize: '10px', color: theme.colors.onSurfaceVariant }}>
                  {spell.casting} • {metersToSquares(spell.range)} • {spell.components}
                </div>
              </div>
            ))}
            <button
              style={styles.addButton}
              onClick={() => setAddingCantrip(true)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${theme.colors.primary}10`
                e.target.style.borderColor = theme.colors.primary
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.borderColor = `${theme.colors.primary}40`
              }}
            >
              <span>+</span> Adicionar Truque
            </button>
          </div>
        </div>

        {character.spellSlots
          .filter(slot => slot.total > 0)
          .map((slot) => {
            const levelSpells = spellsByLevel[slot.level] || []
            return (
              <div key={slot.level} style={{ ...styles.card, marginBottom: theme.spacing.md }}>
                <div
                  style={{
                    ...styles.sectionTitle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                    marginBottom: theme.spacing.md,
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: `${theme.colors.primary}20`,
                      color: theme.colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}
                  >
                    {slot.level}
                  </div>
                  <span>{levelNames[slot.level]}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                  {levelSpells.map((spell) => (
                  <div
                    key={spell.id}
                    style={{
                      ...styles.skillItem,
                      ...styles.editable,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: theme.spacing.xs,
                    }}
                    {...createLongPressHandlers(() => setEditingSpell(spell), { hoverBg: theme.colors.surfaceContainerHigh })}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div style={{ ...styles.skillName, fontWeight: '700' }}>{spell.name}</div>
                      {spell.concentration && (
                        <span
                          style={{
                            ...theme.typography.labelCaps,
                            fontSize: '9px',
                            backgroundColor: `${theme.colors.surfaceContainerHighest}`,
                            color: theme.colors.onSurfaceVariant,
                            padding: '2px 6px',
                            borderRadius: theme.borderRadius.sm,
                          }}
                        >
                          C
                        </span>
                      )}
                    </div>
                    {spell.description && (
                      <div style={{ ...theme.typography.bodyMd, fontSize: '12px', color: theme.colors.onSurfaceVariant }}>
                        {spell.description}
                      </div>
                    )}
                    <div style={{ ...theme.typography.labelCaps, fontSize: '10px', color: theme.colors.onSurfaceVariant }}>
                      {spell.casting} • {metersToSquares(spell.range)} • {spell.components}
                    </div>
                  </div>
                ))}
                <button
                  style={styles.addButton}
                  onClick={() => setEditingSpell({ level: slot.level })}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = `${theme.colors.primary}10`
                    e.target.style.borderColor = theme.colors.primary
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.borderColor = `${theme.colors.primary}40`
                  }}
                >
                  <span>+</span> Adicionar Magia
                </button>
              </div>
            </div>
            )
          })}
      </>
    )
  }

  const renderInventory = () => (
    <>
      <h2 style={styles.header}>🎒 Inventário</h2>

      <div style={{ ...styles.card, marginBottom: theme.spacing.md }}>
        <div style={styles.sectionTitleWithEdit}>
          <div style={styles.sectionTitle}>Moedas</div>
          <button
            style={styles.editSectionButton}
            onClick={() => setEditingCurrency(true)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            ✎ Editar
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: theme.spacing.sm }}>
          <div style={{ textAlign: 'center', padding: theme.spacing.sm }}>
            <div style={{ ...theme.typography.labelCaps, fontSize: '10px', color: theme.colors.primary }}>OURO</div>
            <div style={{ ...theme.typography.h2, color: theme.colors.primary, fontSize: '28px' }}>{character.currency.gold}</div>
            <div style={{ ...theme.typography.bodyMd, fontSize: '12px', opacity: 0.7 }}>PO</div>
          </div>
          <div style={{ textAlign: 'center', padding: theme.spacing.sm }}>
            <div style={{ ...theme.typography.labelCaps, fontSize: '10px', color: theme.colors.onSurfaceVariant }}>PRATA</div>
            <div style={{ ...theme.typography.h2, fontSize: '28px' }}>{character.currency.silver}</div>
            <div style={{ ...theme.typography.bodyMd, fontSize: '12px', opacity: 0.7 }}>PP</div>
          </div>
          <div style={{ textAlign: 'center', padding: theme.spacing.sm }}>
            <div style={{ ...theme.typography.labelCaps, fontSize: '10px', color: theme.colors.onSurfaceVariant }}>COBRE</div>
            <div style={{ ...theme.typography.h2, fontSize: '28px' }}>{character.currency.copper}</div>
            <div style={{ ...theme.typography.bodyMd, fontSize: '12px', opacity: 0.7 }}>PC</div>
          </div>
        </div>
      </div>

      {character.inventoryCategories.map((category) => (
        <div key={category.id} style={{ ...styles.card, marginBottom: theme.spacing.md }}>
          <div
            style={{
              ...styles.sectionTitle,
              marginBottom: theme.spacing.md,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              ...styles.editable,
            }}
            {...createLongPressHandlers(() => setEditingCategory(category), { hoverBg: 'transparent' })}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
          >
            <span>{category.name}</span>
            <span style={{ fontSize: '14px', color: theme.colors.onSurfaceVariant }}>✎</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            {category.items.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.skillItem,
                  ...styles.editable,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: theme.spacing.xs,
                }}
                {...createLongPressHandlers(() => setEditingItem({ categoryId: category.id, item }), { hoverBg: theme.colors.surfaceContainerHigh })}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <div style={{ ...styles.skillName, fontWeight: '700' }}>{item.name}</div>
                  {item.rarity && (
                    <span
                      style={{
                        ...theme.typography.labelCaps,
                        fontSize: '9px',
                        backgroundColor: `${theme.colors.primary}20`,
                        color: theme.colors.primary,
                        padding: '2px 6px',
                        borderRadius: theme.borderRadius.sm,
                      }}
                    >
                      {item.rarity}
                    </span>
                  )}
                </div>
                {item.type && (
                  <div style={{ ...theme.typography.labelCaps, fontSize: '10px', color: theme.colors.onSurfaceVariant }}>
                    {item.type}
                  </div>
                )}
                {item.effect && (
                  <div style={{ ...theme.typography.bodyMd, fontSize: '12px', color: theme.colors.onSurfaceVariant }}>
                    {item.effect}
                  </div>
                )}
                {item.weight && (
                  <div style={{ ...theme.typography.labelCaps, fontSize: '10px', color: theme.colors.onSurfaceVariant }}>
                    Peso: {item.weight}
                  </div>
                )}
              </div>
            ))}
            <button
              style={styles.addButton}
              onClick={() => setEditingItem({ categoryId: category.id, item: null })}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${theme.colors.primary}10`
                e.target.style.borderColor = theme.colors.primary
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
                e.target.style.borderColor = `${theme.colors.primary}40`
              }}
            >
              <span>+</span> Adicionar Item
            </button>
          </div>
        </div>
      ))}

      <button
        style={styles.addButton}
        onClick={() => setEditingCategory({})}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = `${theme.colors.primary}10`
          e.target.style.borderColor = theme.colors.primary
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent'
          e.target.style.borderColor = `${theme.colors.primary}40`
        }}
      >
        <span>+</span> Nova Categoria
      </button>
    </>
  )

  const renderLore = () => (
    <>
      <div style={{...styles.portraitContainer, aspectRatio: '3/4', marginBottom: theme.spacing.md}}>
        <img src={character.portrait} alt={character.name} style={styles.portrait} />
      </div>

      <h1 style={styles.header}>{character.name}</h1>
      <div style={styles.subtitle}>
        {character.race} • {character.class} • {character.alignment}
      </div>

      <div style={{
        ...styles.card,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={styles.sectionTitleWithEdit}>
          <div style={styles.sectionTitle}>História & Personalidade</div>
          <button
            style={styles.editSectionButton}
            onClick={() => setEditingLore(true)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
          >
            ✎ Editar
          </button>
        </div>

        <div style={{ marginBottom: theme.spacing.md }}>
          <div style={{ ...theme.typography.h3, fontSize: '14px', color: theme.colors.primary, marginBottom: theme.spacing.xs }}>
            ⭐ Traços de Personalidade
          </div>
          <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurface }}>
            {character.lore.personality}
          </div>
        </div>

        <div style={{ marginBottom: theme.spacing.md }}>
          <div style={{ ...theme.typography.h3, fontSize: '14px', color: theme.colors.primary, marginBottom: theme.spacing.xs }}>
            💡 Ideais
          </div>
          <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurface }}>
            {character.lore.ideals}
          </div>
        </div>

        <div style={{ marginBottom: theme.spacing.md }}>
          <div style={{ ...theme.typography.h3, fontSize: '14px', color: theme.colors.primary, marginBottom: theme.spacing.xs }}>
            🔗 Vínculos
          </div>
          <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurface }}>
            {character.lore.bonds}
          </div>
        </div>

        <div>
          <div style={{ ...theme.typography.h3, fontSize: '14px', color: theme.colors.primary, marginBottom: theme.spacing.xs }}>
            ⚠️ Defeitos
          </div>
          <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurface }}>
            {character.lore.flaws}
          </div>
        </div>
      </div>

      {/* Botões de Backup */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: theme.spacing.sm, 
        marginTop: theme.spacing.md 
      }}>
        <button
          style={{
            ...styles.addButton,
            backgroundColor: theme.colors.primary,
            color: theme.colors.onPrimary,
            border: 'none',
            padding: theme.spacing.md,
            fontSize: '14px',
            fontWeight: '600',
          }}
          onClick={handleExport}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.colors.primaryContainer
            e.target.style.color = theme.colors.onPrimaryContainer
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.colors.primary
            e.target.style.color = theme.colors.onPrimary
          }}
        >
          💾 Exportar Backup
        </button>
        <button
          style={{
            ...styles.addButton,
            backgroundColor: theme.colors.surfaceContainerHigh,
            color: theme.colors.primary,
            border: `1px solid ${theme.colors.primary}`,
            padding: theme.spacing.md,
            fontSize: '14px',
            fontWeight: '600',
          }}
          onClick={() => fileInputRef.current?.click()}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.colors.primaryContainer
            e.target.style.borderColor = theme.colors.primary
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.colors.surfaceContainerHigh
            e.target.style.borderColor = theme.colors.primary
          }}
        >
          📂 Importar Backup
        </button>
      </div>

      {/* Input file invisível */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleImport}
      />
    </>
  )

  return (
    <div style={styles.container}>
      {renderTabContent()}

      <nav style={styles.navbar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.id ? styles.tabButtonActive : {}),
            }}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
            <span style={styles.tabLabel}>{tab.label}</span>
          </button>
        ))}
      </nav>

      <EditHPModal isOpen={editingHP} onClose={() => setEditingHP(false)} />
      
      <EditAttackModal
        isOpen={editingAttack !== null}
        onClose={() => setEditingAttack(null)}
        attack={editingAttack}
      />

      <EditSpellModal
        isOpen={editingSpell !== null}
        onClose={() => setEditingSpell(null)}
        spell={editingSpell}
        isCantrip={false}
      />

      <EditSpellModal
        isOpen={editingCantrip !== null || addingCantrip}
        onClose={() => {
          setEditingCantrip(null)
          setAddingCantrip(false)
        }}
        spell={editingCantrip}
        isCantrip={true}
      />

      <EditItemModal
        isOpen={editingItem.categoryId !== null}
        onClose={() => setEditingItem({ categoryId: null, item: null })}
        categoryId={editingItem.categoryId}
        item={editingItem.item}
      />

      <EditCategoryModal
        isOpen={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        category={editingCategory}
      />

      <EditBasicInfoModal
        isOpen={editingBasicInfo}
        onClose={() => setEditingBasicInfo(false)}
      />

      <EditCombatStatsModal
        isOpen={editingCombatStats}
        onClose={() => setEditingCombatStats(false)}
      />

      <EditAttributeModal
        isOpen={editingAttribute !== null}
        onClose={() => setEditingAttribute(null)}
        attributeKey={editingAttribute || 'str'}
      />

      <EditSpellcastingModal
        isOpen={editingSpellcasting}
        onClose={() => setEditingSpellcasting(false)}
      />

      <EditCurrencyModal
        isOpen={editingCurrency}
        onClose={() => setEditingCurrency(false)}
      />

      <EditSpellSlotsModal
        isOpen={editingSpellSlots}
        onClose={() => setEditingSpellSlots(false)}
      />

      <EditSavingThrowsModal
        isOpen={editingSavingThrows}
        onClose={() => setEditingSavingThrows(false)}
      />

      <EditSkillsModal
        isOpen={editingSkills}
        onClose={() => setEditingSkills(false)}
      />

      <EditLoreModal
        isOpen={editingLore}
        onClose={() => setEditingLore(false)}
      />
    </div>
  )
}
