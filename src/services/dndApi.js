const API_BASE_URL = 'https://www.dnd5eapi.co/api/2014';

/**
 * Busca todas as raças disponíveis
 */
export const fetchRaces = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/races`);
    if (!response.ok) throw new Error('Failed to fetch races');
    return await response.json();
  } catch (error) {
    console.error('Error fetching races:', error);
    throw error;
  }
};

/**
 * Busca detalhes de uma raça específica
 */
export const fetchRaceDetails = async (raceIndex) => {
  try {
    const response = await fetch(`${API_BASE_URL}/races/${raceIndex}`);
    if (!response.ok) throw new Error('Failed to fetch race details');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching race details for ${raceIndex}:`, error);
    throw error;
  }
};

/**
 * Busca todas as classes disponíveis
 */
export const fetchClasses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes`);
    if (!response.ok) throw new Error('Failed to fetch classes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

/**
 * Busca detalhes de uma classe específica
 */
export const fetchClassDetails = async (classIndex) => {
  try {
    const response = await fetch(`${API_BASE_URL}/classes/${classIndex}`);
    if (!response.ok) throw new Error('Failed to fetch class details');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching class details for ${classIndex}:`, error);
    throw error;
  }
};

/**
 * Busca todas as habilidades disponíveis
 */
export const fetchAbilities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ability-scores`);
    if (!response.ok) throw new Error('Failed to fetch abilities');
    return await response.json();
  } catch (error) {
    console.error('Error fetching abilities:', error);
    throw error;
  }
};

/**
 * Busca detalhes de uma habilidade específica
 */
export const fetchAbilityDetails = async (abilityIndex) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ability-scores/${abilityIndex}`);
    if (!response.ok) throw new Error('Failed to fetch ability details');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ability details for ${abilityIndex}:`, error);
    throw error;
  }
};

/**
 * Busca todas as perícias disponíveis
 */
export const fetchSkills = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills`);
    if (!response.ok) throw new Error('Failed to fetch skills');
    return await response.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }
};

/**
 * Busca detalhes de uma perícia específica
 */
export const fetchSkillDetails = async (skillIndex) => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills/${skillIndex}`);
    if (!response.ok) throw new Error('Failed to fetch skill details');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching skill details for ${skillIndex}:`, error);
    throw error;
  }
};

/**
 * Busca todos os equipamentos disponíveis
 */
export const fetchEquipment = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipment`);
    if (!response.ok) throw new Error('Failed to fetch equipment');
    return await response.json();
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

/**
 * Busca detalhes de um equipamento específico
 */
export const fetchEquipmentDetails = async (equipmentIndex) => {
  try {
    const response = await fetch(`${API_BASE_URL}/equipment/${equipmentIndex}`);
    if (!response.ok) throw new Error('Failed to fetch equipment details');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching equipment details for ${equipmentIndex}:`, error);
    throw error;
  }
};

/**
 * Busca todos os alinhamentos disponíveis
 */
export const fetchAlignments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/alignments`);
    if (!response.ok) throw new Error('Failed to fetch alignments');
    return await response.json();
  } catch (error) {
    console.error('Error fetching alignments:', error);
    throw error;
  }
};
