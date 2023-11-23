import React, { createContext, useContext, useEffect, useState } from 'react'
import { Drawer } from 'expo-router/drawer';
import { defaultColors } from '../src/styles/styles'
import { Text } from 'react-native';
import { DummyData, MealContext } from "../src/context";
import { useNavigation } from 'expo-router/';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
    const navigation = useNavigation()

    // Load in starting data
    const [meals, setMeals] = useState(DummyData)

    const addMeal = (meal) => {
        setMeals([...meals, meal])
    }

    const deleteMeal = (idx) => {
        temp = [...meals]
        setMeals([...temp.splice(idx, 1)])
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await AsyncStorage.getItem('FlashMacrosMealsData')

                if (data == null) {
                    throw new Error('No dummy data found. Throwing exception.')
                }
                else {
                    setMeals(JSON.parse(data))
                }
            }
            catch (e) {
                console.log(e)
                setMeals(DummyData)
            }
        }

        fetchData()
            .catch(e => setMeals(DummyData))
    }, [])

    useEffect(() => {
        AsyncStorage.setItem('FlashMacrosMealsData', JSON.stringify(meals))
    }, [meals])

    return (
        <MealContext.Provider value={{ data: meals, addMeal: addMeal, deleteMeal: deleteMeal }}>
            <Drawer screenOptions={{
                headerTintColor: defaultColors.red.color,
            }}>
                <Drawer.Screen
                    options={{
                        headerShown: false,
                        // swipeEnabled: false,
                        drawerItemStyle: { height: 0 },
                        unmountOnBlur: true

                    }}
                    name="index"
                />
                <Drawer.Screen
                    options={{
                        headerShown: false,
                        // swipeEnabled: false,
                        drawerItemStyle: { height: 0 },
                        unmountOnBlur: true
                    }}
                    name="screens/ForgotPassword"
                />

                <Drawer.Screen
                    options={{
                        headerShown: false,
                        // swipeEnabled: false,
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
                        unmountOnBlur: true
                    }}
                    name="screens/HomeScreen"
                />
                <Drawer.Screen
                    options={{
                        drawerActiveTintColor: defaultColors.red.color,
                        drawerActiveBackgroundColor: defaultColors.lightRed.color,
                        drawerLabel: "Data",
                        title: "Data",
                        unmountOnBlur: true
                    }}
                    name="screens/DataScreen"
                />
                <Drawer.Screen
                    options={{
                        drawerActiveTintColor: defaultColors.red.color,
                        drawerActiveBackgroundColor: defaultColors.lightRed.color,
                        drawerLabel: "Profile",
                        title: "Profile",
                        unmountOnBlur: true
                    }}
                    name="screens/ProfileScreen"
                />
                <Drawer.Screen
                    options={{
                        drawerActiveTintColor: defaultColors.red.color,
                        drawerActiveBackgroundColor: defaultColors.lightRed.color,
                        drawerLabel: "Meals",
                        title: "Meals",
                        unmountOnBlur: true,
                        headerRight: () => (
                            <Text
                                style={{ color: defaultColors.red.color, fontSize: 30, marginRight: 10 }}
                                onPress={() => navigation.navigate('screens/AddMeal')}
                            >+</Text>) // TODO: make + functional
                    }}
                    name="screens/MealScreen"
                />
                <Drawer.Screen
                    options={{
                        drawerActiveTintColor: defaultColors.red.color,
                        drawerActiveBackgroundColor: defaultColors.lightRed.color,
                        drawerLabel: "Reports",
                        title: "Reports",
                        unmountOnBlur: true
                    }}
                    name="screens/ReportScreen"
                />
                <Drawer.Screen
                    options={{
                        drawerItemStyle: { height: 0 },
                        title: "Add Meal",
                        headerShown: false,
                        unmountOnBlur: true
                    }}
                    name="screens/AddMeal"
                />
            </Drawer>
        </MealContext.Provider>
    )
}