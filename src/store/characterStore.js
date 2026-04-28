import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Store persistente que simula MMKV (usa localStorage)
export const useCharacterStore = create(
  persist(
    (set, get) => ({
      // Dados do personagem (inicialização vazia)
      character: {
        name: 'Novo Personagem',
        class: '',
        level: 1,
        race: '',
        background: '',
        alignment: '',
        hp: { current: 10, max: 10 },
        tempHp: 0,
        ac: 10,
        initiative: 0,
        speed: 9,
        proficiency: 2,
        inspiration: false,
        attributes: {
          str: { value: 10, modifier: 0 },
          dex: { value: 10, modifier: 0 },
          con: { value: 10, modifier: 0 },
          int: { value: 10, modifier: 0 },
          wis: { value: 10, modifier: 0 },
          cha: { value: 10, modifier: 0 },
        },
        savingThrows: {
          str: { proficient: false },
          dex: { proficient: false },
          con: { proficient: false },
          int: { proficient: false },
          wis: { proficient: false },
          cha: { proficient: false },
        },
        skills: [
          { name: 'Acrobacia', attribute: 'dex', proficient: false, expertise: false },
          { name: 'Arcanismo', attribute: 'int', proficient: false, expertise: false },
          { name: 'Atletismo', attribute: 'str', proficient: false, expertise: false },
          { name: 'Atuação', attribute: 'cha', proficient: false, expertise: false },
          { name: 'Enganação', attribute: 'cha', proficient: false, expertise: false },
          { name: 'Furtividade', attribute: 'dex', proficient: false, expertise: false },
          { name: 'História', attribute: 'int', proficient: false, expertise: false },
          { name: 'Intimidação', attribute: 'cha', proficient: false, expertise: false },
          { name: 'Intuição', attribute: 'wis', proficient: false, expertise: false },
          { name: 'Investigação', attribute: 'int', proficient: false, expertise: false },
          { name: 'Lidar com Animais', attribute: 'wis', proficient: false, expertise: false },
          { name: 'Medicina', attribute: 'wis', proficient: false, expertise: false },
          { name: 'Natureza', attribute: 'int', proficient: false, expertise: false },
          { name: 'Percepção', attribute: 'wis', proficient: false, expertise: false },
          { name: 'Persuasão', attribute: 'cha', proficient: false, expertise: false },
          { name: 'Prestidigitação', attribute: 'dex', proficient: false, expertise: false },
          { name: 'Religião', attribute: 'int', proficient: false, expertise: false },
          { name: 'Sobrevivência', attribute: 'wis', proficient: false, expertise: false },
        ],
        portrait: '',
        attacks: [],
        spellcasting: {
          attribute: 'int',
          spellDC: 10,
          attackBonus: 0,
        },
        spellSlots: [],
        cantrips: [],
        spells: [],
        currency: {
          gold: 0,
          silver: 0,
          copper: 0,
        },
        inventoryCategories: [],
        lore: {
          summary: '',
          personality: [],
          ideals: '',
          bonds: '',
          flaws: '',
        },
      },

      // Actions para atualizar dados
      updateCharacter: (updates) =>
        set((state) => {
          const newChar = { ...state.character, ...updates }
          
          // Atualiza proficiência baseado no nível
          if (updates.level !== undefined) {
            const proficiency = Math.floor((updates.level - 1) / 4) + 2
            newChar.proficiency = proficiency
            
            // Atualiza iniciativa baseada em DEX
            const dexMod = state.character.attributes.dex.modifier
            newChar.initiative = dexMod
            
            // Atualiza CD e bônus de magia
            const spellAttr = state.character.spellcasting.attribute
            const spellMod = state.character.attributes[spellAttr].modifier
            newChar.spellcasting = {
              ...state.character.spellcasting,
              spellDC: 8 + proficiency + spellMod,
              attackBonus: proficiency + spellMod,
            }
          }
          
          // Se mudou atributo de conjuração, recalcula CD e bônus
          if (updates.spellcasting?.attribute) {
            const proficiency = state.character.proficiency
            const newAttr = updates.spellcasting.attribute
            const spellMod = state.character.attributes[newAttr].modifier
            newChar.spellcasting = {
              ...newChar.spellcasting,
              spellDC: 8 + proficiency + spellMod,
              attackBonus: proficiency + spellMod,
            }
          }
          
          return { character: newChar }
        }),

      updateHP: (current, temp = null) =>
        set((state) => ({
          character: {
            ...state.character,
            hp: { ...state.character.hp, current },
            ...(temp !== null && { tempHp: temp }),
          },
        })),

      addTempHP: (amount) =>
        set((state) => ({
          character: {
            ...state.character,
            tempHp: state.character.tempHp + amount,
          },
        })),

      adjustHP: (delta) =>
        set((state) => {
          let newCurrent = state.character.hp.current
          let newTempHp = state.character.tempHp
          
          if (delta < 0) {
            // Ao tomar dano, consome primeiro HP temporário
            const damage = Math.abs(delta)
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
              newCurrent = Math.max(0, newCurrent + delta)
            }
          } else {
            // Ao curar, soma no HP atual (até o máximo)
            newCurrent = Math.min(state.character.hp.max, newCurrent + delta)
          }
          
          return {
            character: {
              ...state.character,
              hp: { ...state.character.hp, current: newCurrent },
              tempHp: newTempHp,
            },
          }
        }),

      updateAttribute: (attr, value) =>
        set((state) => {
          const modifier = Math.floor((value - 10) / 2)
          const newChar = {
            ...state.character,
            attributes: {
              ...state.character.attributes,
              [attr]: { value, modifier },
            },
          }
          
          // Atualiza iniciativa automaticamente se mudou DEX
          if (attr === 'dex') {
            newChar.initiative = modifier
          }
          
          // Atualiza CD e bônus de magia se mudou o atributo de conjuração
          if (attr === state.character.spellcasting.attribute) {
            const proficiency = Math.floor((state.character.level - 1) / 4) + 2
            newChar.spellcasting = {
              ...state.character.spellcasting,
              spellDC: 8 + proficiency + modifier,
              attackBonus: proficiency + modifier,
            }
          }
          
          return { character: newChar }
        }),

      toggleProficiency: (type, key) =>
        set((state) => ({
          character: {
            ...state.character,
            [type]: {
              ...state.character[type],
              [key]: {
                ...state.character[type][key],
                proficient: !state.character[type][key].proficient,
              },
            },
          },
        })),

      updateSkill: (index, updates) =>
        set((state) => {
          const newSkills = [...state.character.skills]
          newSkills[index] = { ...newSkills[index], ...updates }
          return {
            character: { ...state.character, skills: newSkills },
          }
        }),

      updateSavingThrow: (attribute, updates) =>
        set((state) => ({
          character: {
            ...state.character,
            savingThrows: {
              ...state.character.savingThrows,
              [attribute]: { ...state.character.savingThrows[attribute], ...updates },
            },
          },
        })),

      addAttack: (attack) =>
        set((state) => ({
          character: {
            ...state.character,
            attacks: [...state.character.attacks, { ...attack, id: Date.now().toString() }],
          },
        })),

      updateAttack: (id, updates) =>
        set((state) => ({
          character: {
            ...state.character,
            attacks: state.character.attacks.map((a) => (a.id === id ? { ...a, ...updates } : a)),
          },
        })),

      deleteAttack: (id) =>
        set((state) => ({
          character: {
            ...state.character,
            attacks: state.character.attacks.filter((a) => a.id !== id),
          },
        })),

      addSpell: (spell) =>
        set((state) => ({
          character: {
            ...state.character,
            spells: [...state.character.spells, { ...spell, id: Date.now().toString() }],
          },
        })),

      updateSpell: (id, updates) =>
        set((state) => ({
          character: {
            ...state.character,
            spells: state.character.spells.map((s) => (s.id === id ? { ...s, ...updates } : s)),
          },
        })),

      deleteSpell: (id) =>
        set((state) => ({
          character: {
            ...state.character,
            spells: state.character.spells.filter((s) => s.id !== id),
          },
        })),

      addCantrip: (cantrip) =>
        set((state) => ({
          character: {
            ...state.character,
            cantrips: [...state.character.cantrips, { ...cantrip, id: Date.now().toString() }],
          },
        })),

      deleteCantrip: (id) =>
        set((state) => ({
          character: {
            ...state.character,
            cantrips: state.character.cantrips.filter((c) => c.id !== id),
          },
        })),

      useSpellSlot: (level) =>
        set((state) => ({
          character: {
            ...state.character,
            spellSlots: state.character.spellSlots.map((slot) =>
              slot.level === level ? { ...slot, used: Math.min(slot.total, slot.used + 1) } : slot
            ),
          },
        })),

      restoreSpellSlot: (level) =>
        set((state) => ({
          character: {
            ...state.character,
            spellSlots: state.character.spellSlots.map((slot) =>
              slot.level === level ? { ...slot, used: Math.max(0, slot.used - 1) } : slot
            ),
          },
        })),

      updateSpellSlots: (spellSlots) =>
        set((state) => ({
          character: {
            ...state.character,
            spellSlots: spellSlots,
          },
        })),

      longRest: () =>
        set((state) => ({
          character: {
            ...state.character,
            hp: { ...state.character.hp, current: state.character.hp.max },
            tempHp: 0,
            spellSlots: state.character.spellSlots.map((slot) => ({ ...slot, used: 0 })),
          },
        })),

      addInventoryCategory: (category) =>
        set((state) => ({
          character: {
            ...state.character,
            inventoryCategories: [
              ...state.character.inventoryCategories,
              { ...category, id: Date.now().toString(), items: [] },
            ],
          },
        })),

      updateInventoryCategory: (id, updates) =>
        set((state) => ({
          character: {
            ...state.character,
            inventoryCategories: state.character.inventoryCategories.map((cat) =>
              cat.id === id ? { ...cat, ...updates } : cat
            ),
          },
        })),

      deleteInventoryCategory: (id) =>
        set((state) => ({
          character: {
            ...state.character,
            inventoryCategories: state.character.inventoryCategories.filter((cat) => cat.id !== id),
          },
        })),

      addItem: (categoryId, item) =>
        set((state) => ({
          character: {
            ...state.character,
            inventoryCategories: state.character.inventoryCategories.map((cat) =>
              cat.id === categoryId
                ? { ...cat, items: [...cat.items, { ...item, id: Date.now().toString() }] }
                : cat
            ),
          },
        })),

      updateItem: (categoryId, itemId, updates) =>
        set((state) => ({
          character: {
            ...state.character,
            inventoryCategories: state.character.inventoryCategories.map((cat) =>
              cat.id === categoryId
                ? { ...cat, items: cat.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)) }
                : cat
            ),
          },
        })),

      deleteItem: (categoryId, itemId) =>
        set((state) => ({
          character: {
            ...state.character,
            inventoryCategories: state.character.inventoryCategories.map((cat) =>
              cat.id === categoryId ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) } : cat
            ),
          },
        })),

      updateCurrency: (type, amount) =>
        set((state) => ({
          character: {
            ...state.character,
            currency: {
              ...state.character.currency,
              [type]: Math.max(0, amount),
            },
          },
        })),

      // Helpers para cálculos dinâmicos
      getSkillModifier: (skill) => {
        const state = get()
        const char = state.character
        const attrMod = char.attributes[skill.attribute].modifier
        const prof = char.proficiency
        const bonus = skill.proficient ? (skill.expertise ? prof * 2 : prof) : 0
        return attrMod + bonus
      },

      getSavingThrowModifier: (attr) => {
        const state = get()
        const char = state.character
        const attrMod = char.attributes[attr].modifier
        const prof = char.proficiency
        const bonus = char.savingThrows[attr].proficient ? prof : 0
        return attrMod + bonus
      },
    }),
    {
      name: 'grimorio-storage', // Nome da chave no localStorage (simula MMKV)
      version: 1,
    }
  )
)
