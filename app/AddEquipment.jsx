import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image } from 'react-native';
import { addEquipment } from './storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from './theme';

const AddEquipment = ({ route }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access the gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAdd = async () => {
    if (!name.trim() || !type.trim()) {
      setModalVisible(true);
      return;
    }

    await addEquipment({ name, type, image, status: 'Available' });
    route.params?.refreshEquipment();

    setName('');
    setType('');
    setImage(null);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Sport Item Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor={colors.gray}
      />

      {/* <TextInput
        placeholder="Type"
        value={type}
        onChangeText={setType}
        style={styles.input}
        placeholderTextColor={colors.gray}
      /> */}

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Ionicons name="camera" size={24} color={colors.white} />
        <Text style={styles.imagePickerText}>Upload Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add New Item</Text>
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Ionicons name="checkmark-circle" size={50} color={colors.secondary} />
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalMessage}>Equipment has been added.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
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
  input: {
    backgroundColor: colors.primary,
    color: colors.text,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: fonts.primary,
  },
  imagePicker: {
    backgroundColor: colors.accent,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imagePickerText: {
    color: colors.white,
    marginLeft: 10,
    fontFamily: fonts.primary,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: colors.secondary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
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
  modalButton: {
    backgroundColor: colors.secondary,
    padding: 10,
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
});

export default AddEquipment;