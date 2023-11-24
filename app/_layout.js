// 3rd party
import React, { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { useNavigation } from 'expo-router/';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import uuid from 'react-native-uuid'

// local files
import { DummyMeals, MealContext } from "../src/context";
import { defaultColors } from '../src/styles/styles'

export default function Layout() {
    const navigation = useNavigation()

    // Define the in-memory data storage for the meals & the 2 helper functions for updating and deleting in-memory meals
    const [meals, setMeals] = useState(DummyMeals)
    const [deletingMeals, setDeletingMeals] = useState(false)
    const [editingMeals, setEditingMeals] = useState(false)

    const addMeal = (meal) => {
        setMeals({...meals, [uuid.v4()]: meal})
    }

    const deleteMeal = (uuid) => {
        delete meals[uuid]
        setMeals({...meals})
    }

    // Load in meals from the on-device local storage, 1x on component start up
    useEffect(() => {
        const fetchData = async () => {
            const data = await AsyncStorage.getItem('FlashMacrosMealsData')

            if (data == null) {
                throw new Error('No dummy data found. Throwing exception.')
            }
            else {
                setMeals(JSON.parse(data))
            }
        }

        // Call the fetchData function defined above
        // If it fails, default to the dummy data
        fetchData()
            .catch(err => {
                console.log(err)
                setMeals(DummyMeals)
            })
    }, [])

    // Update the permanent on-device local storage every time the in-memory meals changes
    useEffect(() => {
        AsyncStorage.setItem('FlashMacrosMealsData', JSON.stringify(meals))
    }, [meals])

    // Define the route layout of the app. Include the:
    //  > name of each screen
    //  > route-specific styling parameters
    //  > header options
    // Also, wrap the Drawer Component in the MealContext provider so the MealContext is accessible throughout the entire app
    return (
        <MealContext.Provider value={{ data: meals, addMeal, deleteMeal, deletingMeals, setDeletingMeals, editingMeals, setEditingMeals }}>
            <Drawer screenOptions={{
                headerTintColor: defaultColors.red.color,
            }}>
                <Drawer.Screen
                    options={{
                        headerShown: false,
                        // swipeEnabled: false, // TODO: uncomment in production
                        drawerItemStyle: { height: 0 },
                        unmountOnBlur: true
                    }}
                    name="index"
                />

                <Drawer.Screen
                    options={{
                        headerShown: false,
                        swipeEnabled: false,
                        drawerItemStyle: { height: 0 },
                        unmountOnBlur: true
                    }}
                    name="screens/ForgotPassword"
                />

                <Drawer.Screen
                    options={{
                        headerShown: false,
                        swipeEnabled: false,
                        drawerItemStyle: { height: 0 },
                        unmountOnBlur: true
                    }}
                    name="screens/SignUpScreen"
                />

                <Drawer.Screen
                    options={{
                        drawerLabel: "Home",
                        title: "Home",
                        drawerActiveTintColor: defaultColors.red.color,
                        drawerActiveBackgroundColor: defaultColors.lightRed.color,
                    }}
                    name="screens/HomeScreen"
                />
                <Drawer.Screen
                    options={{
                        drawerActiveTintColor: defaultColors.red.color,
                        drawerActiveBackgroundColor: defaultColors.lightRed.color,
                        drawerLabel: "Data",
                        title: "Data",
                    }}
                    name="screens/DataScreen"
                />
                <Drawer.Screen
                    options={{
                        drawerActiveTintColor: defaultColors.red.color,
                        drawerActiveBackgroundColor: defaultColors.lightRed.color,
                        drawerLabel: "Profile",
                        title: "Profile",
                    }}
                    name="screens/ProfileScreen"
                />

                {/* Customize the header to have an Add Meals & Delete Meals button for this screen */}
                <Drawer.Screen
                    options={{
                        drawerActiveTintColor: defaultColors.red.color,
                        drawerActiveBackgroundColor: defaultColors.lightRed.color,
                        drawerLabel: "Meals",
                        title: "Meals",
                        headerRight: () => (
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'baseline',
                                    gap: 3
                                }}
                            >
                                <Text
                                    onPress={() => Object.keys(meals).length > 0 ? setEditingMeals(true) : ''}
                                >
                                    <Ionicons name='pencil-outline' size={24} color={defaultColors.red.color} />
                                </Text>
                                <Text
                                    onPress={() => Object.keys(meals).length > 0 ? setDeletingMeals(true) : ''}
                                >
                                    <Ionicons name='trash-outline' size={26} color={defaultColors.red.color} />
                                </Text>
                                <Text
                                    style={{ color: defaultColors.red.color, fontSize: 30, marginRight: 10 }}
                                    onPress={() => navigation.navigate('screens/AddMeal')}
                                >+</Text>
                            </View>
                        )
                    }}
                    name="screens/MealScreen"
                />
                <Drawer.Screen
                    options={{
                        drawerActiveTintColor: defaultColors.red.color,
                        drawerActiveBackgroundColor: defaultColors.lightRed.color,
                        drawerLabel: "Reports",
                        title: "Reports",
                    }}
                    name="screens/ReportScreen"
                />
                <Drawer.Screen
                    options={{
                        drawerItemStyle: { height: 0 },
                        title: "Add Meal",
                        headerShown: false,
                    }}
                    name="screens/AddMeal"
                />
            </Drawer>
        </MealContext.Provider>
    )
}