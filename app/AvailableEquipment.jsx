import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Modal, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getEquipment, updateEquipmentStatus } from './storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from './theme';

const AvailableEquipment = ({ navigation }) => {
  const [equipment, setEquipment] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    const data = await getEquipment();
    setEquipment(data.filter(item => item.status === 'Available'));
  };

  const openBorrowModal = (equipment) => {
    setSelectedEquipment(equipment);
    setModalVisible(true);
  };

  const handleBorrow = async () => {
    if (!studentName.trim() || !studentId.trim()) {
      return;
    }

    await updateEquipmentStatus(selectedEquipment.name, 'Borrowed', studentName, studentId);
    setModalVisible(false);
    setStudentName('');
    setStudentId('');
    fetchData();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Equipment</Text>

      <FlatList
        data={equipment}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.image && <Image source={{ uri: item.image }} style={styles.equipmentImage} />}
            <View style={styles.textContainer}>
              <Text style={styles.equipmentText}>{item.name}</Text>
              <Text style={styles.equipmentType}>{item.type}</Text>
            </View>
            <TouchableOpacity style={styles.borrowButton} onPress={() => openBorrowModal(item)}>
              <Text style={styles.buttonText}>Borrow</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Ionicons name="checkmark-circle" size={50} color={colors.secondary} />
            <Text style={styles.modalTitle}>Borrow Equipment</Text>
            <Text style={styles.modalMessage}>Equipment: {selectedEquipment?.name}</Text>

            <TextInput
              placeholder="Student Name"
              value={studentName}
              onChangeText={setStudentName}
              style={styles.input}
              placeholderTextColor={colors.gray}
            />

            <TextInput
              placeholder="Student ID"
              value={studentId}
              onChangeText={setStudentId}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor={colors.gray}
            />

            <TouchableOpacity style={styles.modalButton} onPress={handleBorrow}>
              <Text style={styles.modalButtonText}>Confirm Borrow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fonts.primary,
  },
  card: {
    backgroundColor: colors.primary,
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  equipmentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: fonts.primary,
  },
  equipmentType: {
    fontSize: 14,
    color: colors.gray,
  },
  borrowButton: {
    backgroundColor: colors.secondary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fonts.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalBox: {
    width: 300,
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 10,
    fontFamily: fonts.primary,
  },
  modalMessage: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: fonts.primary,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
    fontFamily: fonts.primary,
  },
  modalButton: {
    backgroundColor: colors.secondary,
    padding: 12,
    width: '100%',
    borderRadius: 5,
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
  },
});

export default AvailableEquipment;