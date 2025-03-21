import AsyncStorage from '@react-native-async-storage/async-storage';

const EQUIPMENT_KEY = 'equipment_data';
const HISTORY_KEY = 'return_history';

// Generic Get
const getItem = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
};

// Generic Set
const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
  }
};

// Get all equipment
export const getEquipment = () => getItem(EQUIPMENT_KEY);

// Add new equipment
export const addEquipment = async (equipment) => {
  const currentData = await getEquipment();
  currentData.push({ 
    ...equipment, 
    status: 'Available',
    image: equipment.image, // ✅ Store Image URI
  });
  await setItem(EQUIPMENT_KEY, currentData);
};

// Update equipment status and borrower info
export const updateEquipmentStatus = async (name, newStatus, studentName = '', studentId = '') => {
  const currentData = await getEquipment();
  const updatedData = currentData.map(equip =>
    equip.name === name
      ? { 
          ...equip, 
          status: newStatus, 
          studentName, 
          studentId,
          image: equip.image // ✅ Keep Image URI
        }
      : equip
  );
  await setItem(EQUIPMENT_KEY, updatedData);
};

// Get return history
export const getReturnHistory = () => getItem(HISTORY_KEY);

// Add to history
export const addToHistory = async (equipment) => {
  const history = await getReturnHistory();
  history.push({ 
    ...equipment, 
    returnedAt: new Date().toISOString(),
    image: equipment.image // ✅ Keep Image URI in History
  });
  await setItem(HISTORY_KEY, history);
};
