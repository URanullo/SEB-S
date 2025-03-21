import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Modal, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getEquipment, updateEquipmentStatus, deleteEquipment, updateEquipment } from './storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from './theme';

const AvailableEquipment = ({ navigation }) => {
  const [equipment, setEquipment] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

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
    setShowSuccessModal(true);
  };

  const handleEdit = (equipment) => {
    setSelectedEquipment(equipment);
    setEditName(equipment.name);
    setEditType(equipment.type);
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editType.trim()) {
      return;
    }
    await updateEquipment(selectedEquipment.name, { name: editName, type: editType });
    setEditModalVisible(false);
    fetchData();
  };

  return (
    <View style={styles.container}>
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

            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={() => handleEdit(item)}>
                <Ionicons name="pencil" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => {
                  setEquipmentToDelete(item);
                  setShowDeleteModal(true);
                }}
              >
                <Ionicons name="trash" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.borrowButton]} onPress={() => openBorrowModal(item)}>
                <Ionicons name="bag" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Borrow</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Borrow Modal */}
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

      {/* Edit Modal */}
      <Modal animationType="fade" transparent={true} visible={editModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Equipment</Text>
            <TextInput
              placeholder="Equipment Name"
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
              placeholderTextColor={colors.gray}
            />
            <TextInput
              placeholder="Equipment Type"
              value={editType}
              onChangeText={setEditType}
              style={styles.input}
              placeholderTextColor={colors.gray}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleSaveEdit}>
              <Text style={styles.modalButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal animationType="fade" transparent={true} visible={showSuccessModal}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalBox, { alignItems: 'center' }]}>
            <Ionicons name="checkmark-circle" size={60} color={colors.success} />
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalMessage}>Item borrowed successfully!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal animationType="fade" transparent={true} visible={showDeleteModal}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalBox, { width: 320 }]}>
            <Text style={styles.modalTitle}>Delete Equipment</Text>
            <Text style={styles.modalMessage}>Are you sure you want to delete this equipment?</Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await deleteEquipment(equipmentToDelete.name);
                  setShowDeleteModal(false);
                  fetchData();
                }}
              >
                <Text style={styles.deleteText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  card: {
    backgroundColor: colors.primary,
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textContainer: { marginBottom: 10 },
  equipmentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: fonts.primary,
  },
  equipmentType: { fontSize: 14, color: colors.gray },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  editButton: { backgroundColor: colors.secondary },
  deleteButton: { backgroundColor: colors.error },
  borrowButton: { backgroundColor: colors.success },
  buttonText: { color: colors.white, fontWeight: 'bold', marginLeft: 5, fontFamily: fonts.primary },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  modalBox: { backgroundColor: colors.primary, padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text, marginVertical: 10, fontFamily: fonts.primary, textAlign: 'center' },
  modalMessage: { color: colors.text, fontSize: 16, textAlign: 'center', marginBottom: 15, fontFamily: fonts.primary },
  input: { backgroundColor: colors.background, color: colors.text, padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16, width: '100%', fontFamily: fonts.primary },
  modalButton: { backgroundColor: colors.secondary, padding: 12, width: '100%', borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  cancelButton: { backgroundColor: colors.gray },
  modalButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold', fontFamily: fonts.primary },
  modalButtonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  cancelText: { fontSize: 14, fontWeight: 'bold', color: '#2196F3', marginRight: 25, fontFamily: fonts.primary },
  deleteText: { fontSize: 14, fontWeight: 'bold', color: '#D32F2F', fontFamily: fonts.primary },
  equipmentImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
});

export default AvailableEquipment;
