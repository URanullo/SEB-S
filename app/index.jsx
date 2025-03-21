// app/index.jsx

import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from './theme';

export default function Index({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/images/spor.jpg')} // Replace with your background image path
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Sports Equipment Borrowing System (SEB'S)</Text>
        <Text style={styles.subtitle}>
    
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Available Equipment')}>
          <Ionicons name="basketball-outline" size={20} color={colors.white} />
          <Text style={styles.buttonText}> Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    padding: 20,
    margin: 20,
  },
  title: {
    fontSize: 22,
    color: colors.secondary,
    textAlign: 'center',
    fontFamily: fonts.primary,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: fonts.secondary,
  },
  button: {
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.primary,
  },
});
