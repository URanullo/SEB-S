import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import { getEquipment, updateEquipmentStatus, addToHistory } from './storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from './theme';

const BorrowedEquipment = ({ navigation }) => {
  const [borrowed, setBorrowed] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [returnedItem, setReturnedItem] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    const data = await getEquipment();
    setBorrowed(data.filter(item => item.status === 'Borrowed'));
  };

  const handleReturn = async (name) => {
    const item = borrowed.find(e => e.name === name);
    if (!item) return;

    await updateEquipmentStatus(name, 'Available');
    await addToHistory({ ...item, returnedAt: new Date().toISOString() });

    fetchData();
    setReturnedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={borrowed}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && <Image source={{ uri: item.image }} style={styles.equipmentImage} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.equipmentName}>🔹 {item.name} - {item.type}</Text>
              <Text style={styles.info}>👤 Borrowed by: {item.studentName || 'Unknown'}</Text>
              <Text style={styles.info}>📌 Student ID: {item.studentId || 'Unknown'}</Text>
            </View>
            <TouchableOpacity style={styles.returnButton} onPress={() => handleReturn(item.name)}>
              <Text style={styles.buttonText}>Return</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.historyButton} 
        onPress={() => navigation.navigate('Return History')}
      >
        <Text style={styles.buttonText}>View Returned Items</Text>
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Ionicons name="checkmark-circle" size={50} color={colors.secondary} />
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>
              {returnedItem 
                ? `${returnedItem.name} has been returned by ${returnedItem.studentName} (${returnedItem.studentId}).`
                : 'No item selected.'
              }
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BorrowedEquipment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  card: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 6,
    borderLeftColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: fonts.primary,
  },
  info: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
    fontFamily: fonts.primary,
  },
  returnButton: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  historyButton: {
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fonts.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalBox: {
    width: 320,
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 10,
    fontFamily: fonts.primary,
  },
  modalMessage: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: fonts.primary,
  },
  modalButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fonts.primary,
  },
  equipmentImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
});
