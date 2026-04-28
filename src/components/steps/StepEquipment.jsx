import { useState, useEffect } from 'react';
import { fetchEquipment } from '../../services/dndApi';
import { useFetch } from '../../hooks/useFetch';
import './StepEquipment.css';

const StepEquipment = ({ character, onUpdate }) => {
  const { data: equipmentData, loading, error } = useFetch(fetchEquipment);
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (equipmentData && equipmentData.results) {
      setAvailableEquipment(equipmentData.results);
    }
  }, [equipmentData]);

  const handleEquipmentToggle = (equipment) => {
    const isSelected = character.equipment.some(e => e.index === equipment.index);
    if (isSelected) {
      onUpdate({
        equipment: character.equipment.filter(e => e.index !== equipment.index),
      });
    } else {
      onUpdate({
        equipment: [...character.equipment, equipment],
      });
    }
  };

  const handleRemoveEquipment = (equipmentIndex) => {
    onUpdate({
      equipment: character.equipment.filter(e => e.index !== equipmentIndex),
    });
  };

  if (loading) {
    return <div className="step-loading">Carregando equipamento...</div>;
  }

  if (error) {
    return <div className="step-error">Erro ao carregar equipamento: {error}</div>;
  }

  const filteredEquipment = availableEquipment.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categorize equipment
  const categorizeEquipment = (equipment) => {
    const name = equipment.name.toLowerCase();
    if (name.includes('sword') || name.includes('axe') || name.includes('mace') || name.includes('staff') || name.includes('bow') || name.includes('spear')) {
      return 'Armas';
    } else if (name.includes('armor') || name.includes('plate') || name.includes('mail') || name.includes('leather') || name.includes('robe')) {
      return 'Armaduras';
    } else if (name.includes('shield')) {
      return 'Escudos';
    }
    return 'Outros';
  };

  const equipmentByCategory = {};
  filteredEquipment.forEach(e => {
    const category = categorizeEquipment(e);
    if (!equipmentByCategory[category]) {
      equipmentByCategory[category] = [];
    }
    equipmentByCategory[category].push(e);
  });

  return (
    <div className="step-equipment">
      <div className="equipment-container">
        <h2>Equipamento</h2>
        <p className="subtitle">
          Escolha o equipamento que seu personagem carregará
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Pesquisar equipamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="equipment-content">
          <div className="equipment-selector">
            <h3>Equipamento Disponível</h3>
            <div className="equipment-list">
              {Object.entries(equipmentByCategory).length > 0 ? (
                Object.entries(equipmentByCategory).map(([category, items]) => (
                  <div key={category} className="equipment-category">
                    <h4 className="category-title">{category}</h4>
                    <div className="items-group">
                      {items.map((item) => {
                        const isSelected = character.equipment.some(e => e.index === item.index);
                        return (
                          <label key={item.index} className="equipment-item">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleEquipmentToggle(item)}
                              className="equipment-input"
                            />
                            <span className="item-label">{item.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results">Nenhum equipamento encontrado</p>
              )}
            </div>
          </div>

          <div className="equipment-selected">
            <h3>Meu Equipamento ({character.equipment.length})</h3>
            {character.equipment.length > 0 ? (
              <div className="selected-equipment-list">
                {character.equipment.map((item) => (
                  <div key={item.index} className="selected-item">
                    <span className="item-name">{item.name}</span>
                    <button
                      onClick={() => handleRemoveEquipment(item.index)}
                      className="remove-btn"
                      title="Remover"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-equipment">Nenhum equipamento selecionado</p>
            )}
          </div>
        </div>

        <div className="equipment-info">
          <h4>💡 Dicas sobre Equipamento</h4>
          <ul>
            <li>Escolha armas e armaduras apropriadas para sua classe</li>
            <li>Considere o tipo de aventura que seu personagem fará</li>
            <li>Não há limite de equipamento nesta fase</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StepEquipment;
