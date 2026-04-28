import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'
import FormField, { FormButton } from './FormField'
import { useCharacterStore } from '../store/characterStore'
import { theme } from '../theme'

export function EditHPModal({ isOpen, onClose }) {
  const character = useCharacterStore((state) => state.character)
  const updateHP = useCharacterStore((state) => state.updateHP)
  const adjustHP = useCharacterStore((state) => state.adjustHP)

  const [current, setCurrent] = useState(character.hp.current)
  const [tempHp, setTempHp] = useState(character.tempHp)
  
  // Refs para manter os valores mais recentes
  const currentValueRef = useRef(character.hp.current)
  const tempHpValueRef = useRef(character.tempHp)

  useEffect(() => {
    if (isOpen) {
      setCurrent(character.hp.current)
      setTempHp(character.tempHp)
      currentValueRef.current = character.hp.current
      tempHpValueRef.current = character.tempHp
    }
  }, [isOpen, character.hp.current, character.tempHp])

  // Atualiza refs quando os states mudam
  useEffect(() => {
    currentValueRef.current = current
  }, [current])

  useEffect(() => {
    tempHpValueRef.current = tempHp
  }, [tempHp])

  const handleSave = () => {
    updateHP(current, tempHp)
    onClose()
  }

  // Aplica dano considerando HP temporário como escudo
  const applyDamage = (damage) => {
    // Usa refs para garantir valores atualizados
    let newCurrent = currentValueRef.current
    let newTempHp = tempHpValueRef.current
    
    if (newTempHp > 0) {
      if (newTempHp >= damage) {
        // Dano totalmente absorvido pelo HP temporário
        newTempHp -= damage
      } else {
        // Dano excede HP temporário
        const remainingDamage = damage - newTempHp
        newTempHp = 0
        newCurrent = Math.max(0, newCurrent - remainingDamage)
      }
    } else {
      // Sem HP temporário, aplica dano direto
      newCurrent = Math.max(0, newCurrent - damage)
    }
    
    setCurrent(newCurrent)
    setTempHp(newTempHp)
  }

  const styles = {
    quickButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    quickButton: {
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surfaceContainerHigh,
      border: `1px solid ${theme.colors.outlineVariant}`,
      borderRadius: theme.borderRadius.sm,
      color: theme.colors.primary,
      ...theme.typography.h3,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    hpDisplay: {
      textAlign: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.surfaceContainerHigh,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    hpValue: {
      ...theme.typography.h1,
      color: theme.colors.primary,
      fontSize: '48px',
    },
    hpMax: {
      ...theme.typography.h3,
      color: theme.colors.onSurfaceVariant,
    },
    buttons: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✨ Editar Pontos de Vida">
      <div style={styles.hpDisplay}>
        <div style={styles.hpValue}>{current}</div>
        <div style={styles.hpMax}>/ {character.hp.max}</div>
      </div>

      <div style={styles.quickButtons}>
        <button
          style={styles.quickButton}
          onClick={() => applyDamage(10)}
          onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHighest)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
        >
          -10
        </button>
        <button
          style={styles.quickButton}
          onClick={() => applyDamage(5)}
          onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHighest)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
        >
          -5
        </button>
        <button
          style={styles.quickButton}
          onClick={() => setCurrent(Math.min(character.hp.max, current + 5))}
          onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHighest)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
        >
          +5
        </button>
        <button
          style={styles.quickButton}
          onClick={() => setCurrent(Math.min(character.hp.max, current + 10))}
          onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHighest)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
        >
          +10
        </button>
      </div>

      <FormField label="HP Atual" type="number" value={current} onChange={setCurrent} min={0} max={character.hp.max} />

      <FormField label="HP Temporário" type="number" value={tempHp} onChange={setTempHp} min={0} />

      <div style={{
        padding: theme.spacing.md,
        backgroundColor: `${theme.colors.tertiary}20`,
        border: `1px solid ${theme.colors.tertiary}`,
        borderRadius: theme.borderRadius.sm,
        marginTop: theme.spacing.md,
      }}>
        <div style={{
          ...theme.typography.labelCaps,
          color: theme.colors.tertiary,
          marginBottom: theme.spacing.xs,
        }}>
          🛡️ HP Temporário
        </div>
        <div style={{
          ...theme.typography.body,
          fontSize: '12px',
          color: theme.colors.onSurfaceVariant,
        }}>
          Funciona como escudo adicional que permite ultrapassar o HP máximo. Ao receber dano, consome primeiro o HP temporário, depois o HP atual.
        </div>
      </div>

      <div style={styles.buttons}>
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

export function EditAttackModal({ isOpen, onClose, attack = null }) {
  const addAttack = useCharacterStore((state) => state.addAttack)
  const updateAttack = useCharacterStore((state) => state.updateAttack)
  const deleteAttack = useCharacterStore((state) => state.deleteAttack)

  const [name, setName] = useState(attack?.name || '')
  const [type, setType] = useState(attack?.type || 'Mágica')
  const [bonus, setBonus] = useState(attack?.bonus || 0)
  const [damage, setDamage] = useState(attack?.damage || '')
  const [damageType, setDamageType] = useState(attack?.damageType || '')

  useEffect(() => {
    if (isOpen) {
      setName(attack?.name || '')
      setType(attack?.type || 'Mágica')
      setBonus(attack?.bonus || 0)
      setDamage(attack?.damage || '')
      setDamageType(attack?.damageType || '')
    }
  }, [isOpen, attack])

  const handleSave = () => {
    const attackData = { name, type, bonus, damage, damageType }
    if (attack) {
      updateAttack(attack.id, attackData)
    } else {
      addAttack(attackData)
    }
    onClose()
  }

  const handleDelete = () => {
    if (attack && confirm('Deletar este ataque?')) {
      deleteAttack(attack.id)
      onClose()
    }
  }

  const styles = {
    buttons: {
      display: 'grid',
      gridTemplateColumns: attack ? '1fr 1fr 1fr' : '1fr 1fr',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={attack ? '⚔️ Editar Ataque' : '⚔️ Novo Ataque'}>
      <FormField label="Nome" value={name} onChange={setName} placeholder="Ex: Espada Longa" />

      <FormField
        label="Tipo"
        type="select"
        value={type}
        onChange={setType}
        options={[
          { value: 'Mágica', label: 'Mágica' },
          { value: 'Corpo a Corpo', label: 'Corpo a Corpo' },
          { value: 'À Distância', label: 'À Distância' },
          { value: 'Truque', label: 'Truque' },
        ]}
      />

      <FormField label="Bônus de Ataque" type="number" value={bonus} onChange={setBonus} placeholder="Ex: 7" />

      <FormField label="Dano" value={damage} onChange={setDamage} placeholder="Ex: 1d8 + 4" />

      <FormField label="Tipo de Dano" value={damageType} onChange={setDamageType} placeholder="Ex: Cortante, Fogo" />

      <div style={styles.buttons}>
        {attack && (
          <FormButton variant="danger" onClick={handleDelete}>
            Deletar
          </FormButton>
        )}
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

export function EditSpellModal({ isOpen, onClose, spell = null, isCantrip = false }) {
  const addSpell = useCharacterStore((state) => state.addSpell)
  const updateSpell = useCharacterStore((state) => state.updateSpell)
  const deleteSpell = useCharacterStore((state) => state.deleteSpell)
  const addCantrip = useCharacterStore((state) => state.addCantrip)
  const deleteCantrip = useCharacterStore((state) => state.deleteCantrip)

  const [name, setName] = useState(spell?.name || '')
  const [level, setLevel] = useState(spell?.level || 1)
  const [school, setSchool] = useState(spell?.school || 'Evocação')
  const [casting, setCasting] = useState(spell?.casting || 'Ação')
  const [range, setRange] = useState(spell?.range || '18m')
  const [components, setComponents] = useState(spell?.components || 'V, S')
  const [concentration, setConcentration] = useState(spell?.concentration || false)
  const [description, setDescription] = useState(spell?.description || '')

  useEffect(() => {
    if (isOpen) {
      setName(spell?.name || '')
      setLevel(spell?.level || 1)
      setSchool(spell?.school || 'Evocação')
      setCasting(spell?.casting || 'Ação')
      setRange(spell?.range || '18m')
      setComponents(spell?.components || 'V, S')
      setConcentration(spell?.concentration || false)
      setDescription(spell?.description || '')
    }
  }, [isOpen, spell])

  const handleSave = () => {
    const spellData = {
      name,
      level: isCantrip ? 0 : level,
      school,
      casting,
      range,
      components,
      concentration,
      description,
    }

    if (isCantrip) {
      if (spell) {
        // Cantrips não tem update, precisa deletar e adicionar
        deleteCantrip(spell.id)
      }
      addCantrip(spellData)
    } else {
      if (spell) {
        updateSpell(spell.id, spellData)
      } else {
        addSpell(spellData)
      }
    }
    onClose()
  }

  const handleDelete = () => {
    if (spell && confirm('Deletar esta magia?')) {
      if (isCantrip) {
        deleteCantrip(spell.id)
      } else {
        deleteSpell(spell.id)
      }
      onClose()
    }
  }

  const styles = {
    buttons: {
      display: 'grid',
      gridTemplateColumns: spell ? '1fr 1fr 1fr' : '1fr 1fr',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={spell ? '✨ Editar Magia' : '✨ Nova Magia'}>
      <FormField label="Nome" value={name} onChange={setName} placeholder="Ex: Bola de Fogo" />

      {!isCantrip && (
        <FormField
          label="Círculo"
          type="select"
          value={level}
          onChange={setLevel}
          options={[
            { value: 1, label: '1º Círculo' },
            { value: 2, label: '2º Círculo' },
            { value: 3, label: '3º Círculo' },
            { value: 4, label: '4º Círculo' },
            { value: 5, label: '5º Círculo' },
            { value: 6, label: '6º Círculo' },
            { value: 7, label: '7º Círculo' },
            { value: 8, label: '8º Círculo' },
            { value: 9, label: '9º Círculo' },
          ]}
        />
      )}

      <FormField
        label="Escola"
        type="select"
        value={school}
        onChange={setSchool}
        options={[
          { value: 'Evocação', label: 'Evocação' },
          { value: 'Conjuração', label: 'Conjuração' },
          { value: 'Abjuração', label: 'Abjuração' },
          { value: 'Transmutação', label: 'Transmutação' },
          { value: 'Encantamento', label: 'Encantamento' },
          { value: 'Necromancia', label: 'Necromancia' },
          { value: 'Adivinhação', label: 'Adivinhação' },
          { value: 'Ilusão', label: 'Ilusão' },
        ]}
      />

      <FormField label="Tempo de Conjuração" value={casting} onChange={setCasting} placeholder="Ex: Ação, Reação" />

      <FormField label="Alcance" value={range} onChange={setRange} placeholder="Ex: 18, 4.5, Toque, Pessoal" />
      <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, fontSize: '12px', marginTop: '-8px', marginBottom: theme.spacing.sm }}>
        💡 Use apenas número (ex: 18, 4.5) ou texto (Toque, Pessoal)
      </div>

      <FormField label="Componentes" value={components} onChange={setComponents} placeholder="Ex: V, S, M" />

      <FormField label="Concentração" type="checkbox" value={concentration} onChange={setConcentration} />

      <FormField
        label="Descrição"
        value={description}
        onChange={setDescription}
        multiline
        rows={4}
        placeholder="Efeito da magia..."
      />

      <div style={styles.buttons}>
        {spell && (
          <FormButton variant="danger" onClick={handleDelete}>
            Deletar
          </FormButton>
        )}
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

export function EditItemModal({ isOpen, onClose, categoryId, item = null }) {
  const addItem = useCharacterStore((state) => state.addItem)
  const updateItem = useCharacterStore((state) => state.updateItem)
  const deleteItem = useCharacterStore((state) => state.deleteItem)

  const [name, setName] = useState(item?.name || '')
  const [type, setType] = useState(item?.type || '')
  const [rarity, setRarity] = useState(item?.rarity || '')
  const [weight, setWeight] = useState(item?.weight || '')
  const [effect, setEffect] = useState(item?.effect || '')
  const [description, setDescription] = useState(item?.description || '')

  useEffect(() => {
    if (isOpen) {
      setName(item?.name || '')
      setType(item?.type || '')
      setRarity(item?.rarity || '')
      setWeight(item?.weight || '')
      setEffect(item?.effect || '')
      setDescription(item?.description || '')
    }
  }, [isOpen, item])

  const handleSave = () => {
    const itemData = { name, type, rarity, weight, effect, description }
    if (item) {
      updateItem(categoryId, item.id, itemData)
    } else {
      addItem(categoryId, itemData)
    }
    onClose()
  }

  const handleDelete = () => {
    if (item && confirm('Deletar este item?')) {
      deleteItem(categoryId, item.id)
      onClose()
    }
  }

  const styles = {
    buttons: {
      display: 'grid',
      gridTemplateColumns: item ? '1fr 1fr 1fr' : '1fr 1fr',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? '🎒 Editar Item' : '🎒 Novo Item'}>
      <FormField label="Nome" value={name} onChange={setName} placeholder="Ex: Poção de Cura" />

      <FormField label="Tipo" value={type} onChange={setType} placeholder="Ex: Consumível, Armadura, Ferramenta" />

      <FormField label="Raridade" value={rarity} onChange={setRarity} placeholder="Ex: Comum, Incomum, Raro" />

      <FormField label="Peso (opcional)" value={weight} onChange={setWeight} placeholder="Ex: 2 lbs, 5" />

      <FormField label="Efeito (opcional)" value={effect} onChange={setEffect} placeholder="Ex: +2 CA, 2d4+2 HP" />

      <FormField
        label="Descrição (opcional)"
        value={description}
        onChange={setDescription}
        multiline
        rows={3}
        placeholder="Detalhes do item..."
      />

      <div style={styles.buttons}>
        {item && (
          <FormButton variant="danger" onClick={handleDelete}>
            Deletar
          </FormButton>
        )}
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

export function EditCategoryModal({ isOpen, onClose, category = null }) {
  const addInventoryCategory = useCharacterStore((state) => state.addInventoryCategory)
  const updateInventoryCategory = useCharacterStore((state) => state.updateInventoryCategory)
  const deleteInventoryCategory = useCharacterStore((state) => state.deleteInventoryCategory)

  const [name, setName] = useState(category?.name || '')

  useEffect(() => {
    if (isOpen) {
      setName(category?.name || '')
    }
  }, [isOpen, category])

  const handleSave = () => {
    if (category) {
      updateInventoryCategory(category.id, { name })
    } else {
      addInventoryCategory({ name })
    }
    onClose()
  }

  const handleDelete = () => {
    if (category && confirm('Deletar esta categoria e todos os itens nela?')) {
      deleteInventoryCategory(category.id)
      onClose()
    }
  }

  const styles = {
    buttons: {
      display: 'grid',
      gridTemplateColumns: category ? '1fr 1fr 1fr' : '1fr 1fr',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? '📦 Editar Categoria' : '📦 Nova Categoria'}>
      <FormField label="Nome da Categoria" value={name} onChange={setName} placeholder="Ex: 🏹 Munições, 🧪 Poções" />

      <div style={styles.buttons}>
        {category && (
          <FormButton variant="danger" onClick={handleDelete}>
            Deletar
          </FormButton>
        )}
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

// Modal para editar informações básicas
export function EditBasicInfoModal({ isOpen, onClose }) {
  const character = useCharacterStore((state) => state.character)
  const updateCharacter = useCharacterStore((state) => state.updateCharacter)
  const imageInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: character.name,
    race: character.race,
    class: character.class,
    level: character.level,
    background: character.background,
    alignment: character.alignment,
    portrait: character.portrait,
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: character.name,
        race: character.race,
        class: character.class,
        level: character.level,
        background: character.background,
        alignment: character.alignment,
        portrait: character.portrait,
      })
    }
  }, [isOpen, character])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verifica se é uma imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido.')
      return
    }

    // Verifica o tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('A imagem é muito grande. Por favor, use uma imagem menor que 2MB.')
      return
    }

    // Converte para base64
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, portrait: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, portrait: '' })
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const handleSave = () => {
    updateCharacter(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Informações Básicas">
      {/* Campo de imagem */}
      <div style={{ marginBottom: theme.spacing.md }}>
        <div style={{
          ...theme.typography.labelCaps,
          color: theme.colors.primary,
          marginBottom: theme.spacing.xs,
        }}>
          Retrato do Personagem
        </div>
        
        {formData.portrait && (
          <div style={{
            width: '150px',
            height: '200px',
            marginBottom: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            overflow: 'hidden',
            border: `2px solid ${theme.colors.outlineVariant}`,
          }}>
            <img
              src={formData.portrait}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: theme.spacing.xs }}>
          <button
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              backgroundColor: theme.colors.surfaceContainerHigh,
              border: `1px solid ${theme.colors.primary}`,
              borderRadius: theme.borderRadius.sm,
              color: theme.colors.primary,
              cursor: 'pointer',
              ...theme.typography.labelCaps,
              fontSize: '12px',
            }}
            onClick={() => imageInputRef.current?.click()}
            onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHighest)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
          >
            📷 {formData.portrait ? 'Trocar Imagem' : 'Adicionar Imagem'}
          </button>
          
          {formData.portrait && (
            <button
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                backgroundColor: theme.colors.surfaceContainerHigh,
                border: `1px solid ${theme.colors.error}`,
                borderRadius: theme.borderRadius.sm,
                color: theme.colors.error,
                cursor: 'pointer',
                ...theme.typography.labelCaps,
                fontSize: '12px',
              }}
              onClick={handleRemoveImage}
              onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHighest)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            >
              🗑️ Remover
            </button>
          )}
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />

        <div style={{
          ...theme.typography.body,
          fontSize: '11px',
          color: theme.colors.onSurfaceVariant,
          marginTop: theme.spacing.xs,
        }}>
          💡 Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 2MB
        </div>
      </div>

      <FormField
        label="Nome do Personagem"
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
      />
      <FormField
        label="Raça"
        value={formData.race}
        onChange={(value) => setFormData({ ...formData, race: value })}
      />
      <FormField
        label="Classe"
        value={formData.class}
        onChange={(value) => setFormData({ ...formData, class: value })}
      />
      <FormField
        label="Nível"
        type="number"
        value={formData.level}
        onChange={(value) => setFormData({ ...formData, level: parseInt(value) || 1 })}
      />
      <FormField
        label="Antecedente"
        value={formData.background}
        onChange={(value) => setFormData({ ...formData, background: value })}
      />
      <FormField
        label="Alinhamento"
        value={formData.alignment}
        onChange={(value) => setFormData({ ...formData, alignment: value })}
      />
      <div style={{ display: 'flex', gap: theme.spacing.sm }}>
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

// Modal para editar stats de combate
export function EditCombatStatsModal({ isOpen, onClose }) {
  const character = useCharacterStore((state) => state.character)
  const updateCharacter = useCharacterStore((state) => state.updateCharacter)

  const [formData, setFormData] = useState({
    ac: character.ac,
    initiative: character.initiative,
    speed: character.speed,
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ac: character.ac,
        initiative: character.initiative,
        speed: character.speed,
      })
    }
  }, [isOpen, character])

  const handleSave = () => {
    updateCharacter(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Stats de Combate">
      <FormField
        label="Classe de Armadura (CA)"
        type="number"
        value={formData.ac}
        onChange={(value) => setFormData({ ...formData, ac: parseInt(value) || 10 })}
      />
      <div style={{ 
        padding: theme.spacing.sm, 
        backgroundColor: theme.colors.surfaceContainerHigh, 
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.md 
      }}>
        <div style={{ ...theme.typography.labelCaps, color: theme.colors.onSurfaceVariant, fontSize: '11px' }}>
          ⚡ Iniciativa calculada automaticamente
        </div>
        <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, marginTop: '4px' }}>
          Iniciativa = Modificador de Destreza ({character.attributes.dex.modifier >= 0 ? '+' : ''}{character.attributes.dex.modifier})
        </div>
      </div>
      <FormField
        label="Velocidade (m)"
        type="number"
        value={formData.speed}
        onChange={(value) => setFormData({ ...formData, speed: parseFloat(value) || 9 })}
        step="0.5"
      />
      <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, fontSize: '12px', marginTop: '-8px', marginBottom: theme.spacing.sm }}>
        💡 Dica: Valores comuns - 6m, 9m, 12m, 15m, 18m
      </div>
      <div style={{ display: 'flex', gap: theme.spacing.sm }}>
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

// Modal para editar um atributo
export function EditAttributeModal({ isOpen, onClose, attributeKey = 'str' }) {
  const character = useCharacterStore((state) => state.character)
  const updateAttribute = useCharacterStore((state) => state.updateAttribute)

  const attributeNames = {
    str: 'Força',
    dex: 'Destreza',
    con: 'Constituição',
    int: 'Inteligência',
    wis: 'Sabedoria',
    cha: 'Carisma',
  }

  const [value, setValue] = useState(character.attributes[attributeKey]?.value || 10)

  useEffect(() => {
    if (isOpen) {
      setValue(character.attributes[attributeKey]?.value || 10)
    }
  }, [isOpen, character.attributes, attributeKey])

  const handleSave = () => {
    updateAttribute(attributeKey, value)
    onClose()
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar ${attributeNames[attributeKey]}`}>
      <FormField
        label={`Valor de ${attributeNames[attributeKey]}`}
        type="number"
        value={value}
        onChange={(value) => setValue(parseInt(value) || 10)}
      />
      <div
        style={{
          ...theme.typography.bodyMd,
          color: theme.colors.onSurfaceVariant,
          marginBottom: theme.spacing.md,
        }}
      >
        Modificador: {Math.floor((value - 10) / 2) >= 0 ? '+' : ''}
        {Math.floor((value - 10) / 2)}
      </div>
      <div style={{ display: 'flex', gap: theme.spacing.sm }}>
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

// Modal para editar stats de conjuração
export function EditSpellcastingModal({ isOpen, onClose }) {
  const character = useCharacterStore((state) => state.character)
  const updateCharacter = useCharacterStore((state) => state.updateCharacter)

  const [attribute, setAttribute] = useState(character.spellcasting.attribute)

  useEffect(() => {
    if (isOpen) {
      setAttribute(character.spellcasting.attribute)
    }
  }, [isOpen, character.spellcasting.attribute])

  const handleSave = () => {
    updateCharacter({ spellcasting: { ...character.spellcasting, attribute } })
    onClose()
  }
  
  // Calcula valores automáticos
  const spellMod = character.attributes[attribute]?.modifier || 0
  const proficiency = character.proficiency
  const calculatedDC = 8 + proficiency + spellMod
  const calculatedBonus = proficiency + spellMod


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Stats de Conjuração">
      <FormField
        label="Atributo de Conjuração"
        type="select"
        value={attribute}
        onChange={setAttribute}
        options={[
          { value: 'int', label: 'Inteligência' },
          { value: 'wis', label: 'Sabedoria' },
          { value: 'cha', label: 'Carisma' },
        ]}
      />
      
      <div style={{ 
        padding: theme.spacing.md, 
        backgroundColor: theme.colors.surfaceContainerHigh, 
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md 
      }}>
        <div style={{ ...theme.typography.labelCaps, color: theme.colors.onSurfaceVariant, marginBottom: theme.spacing.xs }}>
          ⚡ Calculado Automaticamente
        </div>
        <div style={{ display: 'flex', gap: theme.spacing.lg, marginTop: theme.spacing.sm }}>
          <div>
            <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant }}>CD de Magia</div>
            <div style={{ ...theme.typography.h2, color: theme.colors.primary }}>{calculatedDC}</div>
            <div style={{ ...theme.typography.labelCaps, color: theme.colors.onSurfaceVariant, fontSize: '10px' }}>
              8 + Prof({proficiency}) + Mod({spellMod >= 0 ? '+' : ''}{spellMod})
            </div>
          </div>
          <div>
            <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant }}>Bônus Ataque</div>
            <div style={{ ...theme.typography.h2, color: theme.colors.primary }}>+{calculatedBonus}</div>
            <div style={{ ...theme.typography.labelCaps, color: theme.colors.onSurfaceVariant, fontSize: '10px' }}>
              Prof({proficiency}) + Mod({spellMod >= 0 ? '+' : ''}{spellMod})
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: theme.spacing.sm }}>
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

// Modal para editar moedas
export function EditCurrencyModal({ isOpen, onClose }) {
  const character = useCharacterStore((state) => state.character)
  const updateCurrency = useCharacterStore((state) => state.updateCurrency)

  const [formData, setFormData] = useState({
    gold: character.currency.gold,
    silver: character.currency.silver,
    copper: character.currency.copper,
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        gold: character.currency.gold,
        silver: character.currency.silver,
        copper: character.currency.copper,
      })
    }
  }, [isOpen, character.currency])

  const handleSave = () => {
    updateCurrency(formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Moedas">
      <FormField
        label="Peças de Ouro (PO)"
        type="number"
        value={formData.gold}
        onChange={(value) => setFormData({ ...formData, gold: parseInt(value) || 0 })}
      />
      <FormField
        label="Peças de Prata (PP)"
        type="number"
        value={formData.silver}
        onChange={(value) => setFormData({ ...formData, silver: parseInt(value) || 0 })}
      />
      <FormField
        label="Peças de Cobre (PC)"
        type="number"
        value={formData.copper}
        onChange={(value) => setFormData({ ...formData, copper: parseInt(value) || 0 })}
      />
      <div style={{ display: 'flex', gap: theme.spacing.sm }}>
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

// Modal para editar história/lore
export function EditLoreModal({ isOpen, onClose }) {
  const character = useCharacterStore((state) => state.character)
  const updateCharacter = useCharacterStore((state) => state.updateCharacter)

  const [formData, setFormData] = useState({
    lore: {
      personality: character.lore.personality,
      ideals: character.lore.ideals,
      bonds: character.lore.bonds,
      flaws: character.lore.flaws,
    },
  })

  useEffect(() => {
    if (isOpen) {
      setFormData({
        lore: {
          personality: character.lore.personality,
          ideals: character.lore.ideals,
          bonds: character.lore.bonds,
          flaws: character.lore.flaws,
        },
      })
    }
  }, [isOpen, character.lore])

  const handleSave = () => {
    updateCharacter(formData)
    onClose()
  }


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="História & Personalidade">
      <FormField
        label="Traços de Personalidade"
        type="multiline"
        value={formData.lore.personality}
        onChange={(value) =>
          setFormData({ ...formData, lore: { ...formData.lore, personality: value } })
        }
      />
      <FormField
        label="Ideais"
        type="multiline"
        value={formData.lore.ideals}
        onChange={(value) =>
          setFormData({ ...formData, lore: { ...formData.lore, ideals: value } })
        }
      />
      <FormField
        label="Vínculos"
        type="multiline"
        value={formData.lore.bonds}
        onChange={(value) =>
          setFormData({ ...formData, lore: { ...formData.lore, bonds: value } })
        }
      />
      <FormField
        label="Defeitos"
        type="multiline"
        value={formData.lore.flaws}
        onChange={(value) =>
          setFormData({ ...formData, lore: { ...formData.lore, flaws: value } })
        }
      />
      <div style={{ display: 'flex', gap: theme.spacing.sm }}>
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

// Modal para editar espaços de magia
export function EditSpellSlotsModal({ isOpen, onClose }) {
  const character = useCharacterStore((state) => state.character)
  const updateSpellSlots = useCharacterStore((state) => state.updateSpellSlots)

  const [slots, setSlots] = useState(character.spellSlots)

  useEffect(() => {
    if (isOpen) {
      setSlots(character.spellSlots)
    }
  }, [isOpen, character.spellSlots])

  const handleSave = () => {
    updateSpellSlots(slots)
    onClose()
  }

  const updateSlot = (index, field, value) => {
    const newSlots = [...slots]
    newSlots[index] = { ...newSlots[index], [field]: parseInt(value) || 0 }
    // Garante que 'used' não seja maior que 'total'
    if (field === 'total' && newSlots[index].used > newSlots[index].total) {
      newSlots[index].used = newSlots[index].total
    }
    setSlots(newSlots)
  }

  const addSlot = () => {
    const newLevel = slots.length > 0 ? Math.max(...slots.map(s => s.level)) + 1 : 1
    if (newLevel <= 9) {
      setSlots([...slots, { level: newLevel, total: 0, used: 0 }])
    }
  }

  const removeSlot = (index) => {
    if (confirm('Remover este círculo de magia?')) {
      setSlots(slots.filter((_, i) => i !== index))
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Espaços de Magia">
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
        {slots.map((slot, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            <div style={{ ...theme.typography.labelMd, color: theme.colors.onSurface }}>
              {slot.level}º Círculo
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.sm }}>
              <FormField
                label="Total"
                type="number"
                value={slot.total}
                onChange={(value) => updateSlot(index, 'total', value)}
                min={0}
                max={9}
              />
              <FormField
                label="Usados"
                type="number"
                value={slot.used}
                onChange={(value) => updateSlot(index, 'used', value)}
                min={0}
                max={slot.total}
              />
            </div>
            {slots.length > 1 && (
              <button
                style={{
                  ...theme.typography.bodyMd,
                  color: theme.colors.error,
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: theme.spacing.xs,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => removeSlot(index)}
              >
                ✕ Remover Círculo
              </button>
            )}
          </div>
        ))}
      </div>
      
      {slots.length < 9 && (
        <button
          style={{
            ...theme.typography.bodyMd,
            color: theme.colors.primary,
            backgroundColor: 'transparent',
            border: `1px dashed ${theme.colors.primary}40`,
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.sm,
            cursor: 'pointer',
            marginTop: theme.spacing.md,
            width: '100%',
          }}
          onClick={addSlot}
        >
          + Adicionar Círculo
        </button>
      )}

      <div style={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
        <FormButton variant="secondary" onClick={onClose}>
          Cancelar
        </FormButton>
        <FormButton onClick={handleSave}>Salvar</FormButton>
      </div>
    </Modal>
  )
}

// Modal para editar testes de resistência
export function EditSavingThrowsModal({ isOpen, onClose }) {
  const character = useCharacterStore((state) => state.character)
  const updateSavingThrow = useCharacterStore((state) => state.updateSavingThrow)

  const attributeNames = {
    str: 'Força (FOR)',
    dex: 'Destreza (DES)',
    con: 'Constituição (CON)',
    int: 'Inteligência (INT)',
    wis: 'Sabedoria (SAB)',
    cha: 'Carisma (CAR)',
  }

  const toggleProficiency = (attribute) => {
    const current = character.savingThrows[attribute].proficient
    updateSavingThrow(attribute, { proficient: !current })
  }

  const calculateModifier = (attribute) => {
    const attrMod = character.attributes[attribute].modifier
    const profBonus = character.savingThrows[attribute].proficient ? character.proficiency : 0
    return attrMod + profBonus
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Testes de Resistência">
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
        {Object.keys(attributeNames).map((attr) => {
          const modifier = calculateModifier(attr)
          const isProficient = character.savingThrows[attr].proficient
          return (
            <div
              key={attr}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.surfaceContainerHigh,
                borderRadius: theme.borderRadius.sm,
                border: `1px solid ${theme.colors.outlineVariant}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <button
                  onClick={() => toggleProficiency(attr)}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${isProficient ? theme.colors.primary : theme.colors.outlineVariant}`,
                    backgroundColor: isProficient ? theme.colors.primary : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.colors.onPrimary,
                    fontSize: '12px',
                  }}
                >
                  {isProficient && '✓'}
                </button>
                <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurface }}>
                  {attributeNames[attr]}
                </div>
              </div>
              <div style={{ ...theme.typography.h3, color: theme.colors.primary, fontSize: '18px' }}>
                {modifier >= 0 ? '+' : ''}{modifier}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
        <FormButton onClick={onClose}>Fechar</FormButton>
      </div>
    </Modal>
  )
}

// Modal para editar perícias
export function EditSkillsModal({ isOpen, onClose }) {
  const character = useCharacterStore((state) => state.character)
  const updateSkill = useCharacterStore((state) => state.updateSkill)

  const toggleProficiency = (index) => {
    const skill = character.skills[index]
    if (!skill.proficient && !skill.expertise) {
      updateSkill(index, { proficient: true, expertise: false })
    } else if (skill.proficient && !skill.expertise) {
      updateSkill(index, { proficient: true, expertise: true })
    } else {
      updateSkill(index, { proficient: false, expertise: false })
    }
  }

  const calculateModifier = (skill) => {
    const attrMod = character.attributes[skill.attribute].modifier
    let profBonus = 0
    if (skill.expertise) {
      profBonus = character.proficiency * 2
    } else if (skill.proficient) {
      profBonus = character.proficiency
    }
    return attrMod + profBonus
  }

  const getProficiencyLabel = (skill) => {
    if (skill.expertise) return '⭐⭐'
    if (skill.proficient) return '⭐'
    return ''
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Perícias">
      <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, marginBottom: theme.spacing.md }}>
        Clique para alternar: Sem proficiência → Proficiente (⭐) → Especialização (⭐⭐)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
        {character.skills.map((skill, index) => {
          const modifier = calculateModifier(skill)
          return (
            <div
              key={index}
              onClick={() => toggleProficiency(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.surfaceContainerHigh,
                borderRadius: theme.borderRadius.sm,
                border: `1px solid ${theme.colors.outlineVariant}`,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHighest)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.surfaceContainerHigh)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, flex: 1 }}>
                <div style={{ width: '30px', ...theme.typography.bodyMd, color: theme.colors.primary }}>
                  {getProficiencyLabel(skill)}
                </div>
                <div style={{ ...theme.typography.bodyMd, color: theme.colors.onSurface }}>
                  {skill.name}
                </div>
                <div style={{ ...theme.typography.labelCaps, fontSize: '10px', color: theme.colors.onSurfaceVariant }}>
                  ({skill.attribute.toUpperCase()})
                </div>
              </div>
              <div style={{ ...theme.typography.h3, color: theme.colors.primary, fontSize: '18px' }}>
                {modifier >= 0 ? '+' : ''}{modifier}
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
        <FormButton onClick={onClose}>Fechar</FormButton>
      </div>
    </Modal>
  )
}

