import { createDrawerNavigator } from '@react-navigation/drawer';
import Index from './index';
import AddEquipment from './AddEquipment';
import AvailableEquipment from './AvailableEquipment';
import BorrowedEquipment from './BorrowedEquipment';
import ReturnHistory from './ReturnHistory';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { colors, fonts } from './theme';

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { 
          backgroundColor: colors.primary, 
          borderBottomWidth: 0, 
          elevation: 0, 
          shadowOpacity: 0 
        },
        headerTintColor: colors.secondary,
        headerTitleAlign: 'center',
        headerTitleStyle: { 
          fontFamily: fonts.primary, 
          fontSize: 20 
        },
        drawerActiveTintColor: colors.secondary,
        drawerInactiveTintColor: colors.white,
        drawerLabelStyle: { fontFamily: fonts.secondary },
        drawerStyle: { 
          backgroundColor: colors.primary,
          paddingVertical: 10,
        },
      }}
    >
      <Drawer.Screen name="Home" component={Index} />
      <Drawer.Screen name="Insert Equipment" component={AddEquipment} />
      <Drawer.Screen name="Available Equipment" component={AvailableEquipment} />
      <Drawer.Screen name="Borrowed Equipment" component={BorrowedEquipment} />
      <Drawer.Screen name="Return History" component={ReturnHistory} />
    </Drawer.Navigator>
  );
}
