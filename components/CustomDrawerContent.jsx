import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { colors, fonts } from '../app/theme'; // Adjust path if needed

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      <View style={styles.header}>
        <FontAwesome5 name="chess-knight" size={30} color={colors.secondary} />
        <Text style={styles.headerText}>WELCOME TO SEB'S</Text>
      </View>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomColor: colors.accent,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontFamily: fonts.primary,
    color: colors.white,
    marginLeft: 10,
  },
});
