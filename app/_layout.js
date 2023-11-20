import { Drawer } from 'expo-router/drawer';
import { defaultColors } from '../src/styles/styles'
import { Text } from 'react-native';

export default function Layout() {
    return ( 
      <Drawer screenOptions={{
        headerTintColor: defaultColors.red.color,
      }}>
            <Drawer.Screen
                options={{
                    headerShown: false,
                    // swipeEnabled: false,
                    drawerItemStyle: { height: 0 } 
                }}
                name="index"
            />
            <Drawer.Screen
                options={{ 
                    headerShown: false,
                    // swipeEnabled: false,
                    drawerItemStyle: { height: 0 },
                }}
                name="screens/ForgotPassword"
            />

            <Drawer.Screen
                options={{ 
                    headerShown: false,
                    // swipeEnabled: false,
                    drawerItemStyle: { height: 0 },
                }}
                name="screens/SignUpScreen"
            />

            <Drawer.Screen
                options={{ 
                    // headerShown: false,
                    drawerLabel: "Home",
                    title: "Home",
                    drawerActiveTintColor: defaultColors.red.color,
                    drawerActiveBackgroundColor: defaultColors.lightRed.color,
                }}
                name="screens/HomeScreen"
            />
            <Drawer.Screen
                options={{ 
                    // headerShown: false,
                    drawerActiveTintColor: defaultColors.red.color,
                    drawerActiveBackgroundColor: defaultColors.lightRed.color,
                    drawerLabel: "Data",
                    title: "Data"
                }}
                name="screens/DataScreen"
            />
            <Drawer.Screen
                options={{ 
                    // headerShown: false,
                    drawerActiveTintColor: defaultColors.red.color,
                    drawerActiveBackgroundColor: defaultColors.lightRed.color,
                    drawerLabel: "Profile",
                    title: "Profile"
                }}
                name="screens/ProfileScreen"
            />
            <Drawer.Screen
                options={{ 
                    // headerShown: false,
                    drawerActiveTintColor: defaultColors.red.color,
                    drawerActiveBackgroundColor: defaultColors.lightRed.color,
                    drawerLabel: "Meals",
                    title: "Meals",
                    headerRight: () => (
                        <Text
                          style={{ color: defaultColors.red.color, fontSize: 30, marginRight: 10 }}
                          onPress={() => setShowMealModal(true)}
                        >+</Text>) // TODO: make + functional
                }}
                name="screens/MealScreen"
            />
      </Drawer>
    )
}