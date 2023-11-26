// 3rd party
import React, { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { useNavigation } from 'expo-router/';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import uuid from 'react-native-uuid'
import { makeRedirectUri } from 'expo-auth-session';

// local files
import { DexcomAuthContext, DummyMeals, MealContext } from "../src/context";
import { defaultColors } from '../src/styles/styles'
import { tr } from 'date-fns/locale';

export default function Layout() {
    const navigation = useNavigation()

    // 0. Define the in-memory data storage for the Dexcom Acess Token & helper functions
    const [authCode, setAuthCode] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [refreshToken, setRefreshToken] = useState('')

    // Load in tokens/codes/expiration times from the persistent on-device local storage, one time on component start up
    useEffect(() => {
        const fetchData = async () => {
            AsyncStorage.getItem('DexcomAuthCode')
                .then(data => setAuthCode(data))
                .catch(err => console.log('DexcomAuthCode error', err))

            AsyncStorage.getItem('DexcomAccessToken')
                .then(data => setAccessToken(data))
                .catch(err => console.log('DexcomAccessToken error', err))

            AsyncStorage.getItem('DexcomRefreshToken')
                .then(data => setRefreshToken(data))
                .catch(err => console.log('DexcomRefreshToken', err))
        }

        // Call the fetchData function defined above
        fetchData()
            .catch(err => console.log('DexcomAuthHelpers error:', err))
    }, [])

    // Save the in-memory data to persistent storage every time a code or token updates
    useEffect(() => {
        if (!!authCode) {
            AsyncStorage.setItem('DexcomAuthCode', authCode)
        }

        if (!!accessToken) {
            AsyncStorage.setItem('DexcomAccessToken', accessToken)
        }

        if (!!refreshToken) {
            AsyncStorage.setItem('DexcomRefreshToken', refreshToken)
        }
    }, [authCode, accessToken, refreshToken])

    // automatically ask for a new acess token if we have an auth code w/o access token
    useEffect(() => {
        if (!!authCode && !!!accessToken) {
            getAccessToken()
        }
    }, [authCode, accessToken])

    const getAccessToken = async (refreshToken = null) => {
        console.log('trying to get access token')
        if (!!authCode) {
            console.log('trying to get access token: auth code')
            let config = {
                client_id: '3ljSynAhTDK6Uq8vxYz7cdzHZPtOEknS',
                client_secret: '5wRd0vhpERTgwQS9', // [ECEN 404 TODO]: move the clientSecret to the server to be more secure
                redirect_uri: makeRedirectUri({
                    scheme: 'flashmacros',
                    path: 'redirect'
                }),
                grant_type: (refreshToken == null) ? 'authorization_code' : 'refresh_token',
                refresh_token: refreshToken,
                code: authCode
            }

            const resp = await fetch(
                `https://sandbox-api.dexcom.com/v2/oauth2/token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(config).toString()
                }
            );

            const data = JSON.parse(await resp.text())

            if (data.access_token) {
                console.log('setting new tokens trying to get access token: auth code')
                setRefreshToken(data.refresh_token)
                setAccessToken(data.access_token)
            }
        }
    }

    const refreshAccessToken = async () => {
        try {
            if (!!refreshToken) {
                console.log('refreshing token')
                getAccessToken(refreshToken)
            }
            else {
                throw new Error('No refresh token available. Please reauthorize.')
            }
        }
        catch (e) {
            console.log('revoking authorization')
            revokeAuthorization()
        }
    }

    const revokeAuthorization = () => {
        setAuthCode('')
        setAccessToken('')
        setRefreshToken('')
    }

    // 1. Define the in-memory data storage for the meals & the 2 helper functions for updating and deleting in-memory meals
    const [meals, setMeals] = useState(DummyMeals)
    const [deletingMeals, setDeletingMeals] = useState(false)
    const [editingMeals, setEditingMeals] = useState(false)

    console.log('layout: ', deletingMeals, editingMeals)

    const addMeal = (meal, _uuid = null) => {
        if (_uuid === null) {
            setMeals({ ...meals, [uuid.v4()]: meal })
        }
        else {
            setMeals({ ...meals, [_uuid]: meal })
        }
    }

    const deleteMeal = (_uuid) => {
        delete meals[_uuid]
        setMeals({ ...meals })
    }

    const editMeal = (_uuid) => {
        setEditingMeals(false)
        setDeletingMeals(false)
        navigation.navigate('screens/EditMeal', { 'uuid': _uuid })
    }

    // Load in meals from the on-device local storage, one time on component start up
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
        <MealContext.Provider value={{
            data: meals,
            addMeal,
            deleteMeal,
            deletingMeals,
            setDeletingMeals,
            editingMeals,
            setEditingMeals,
            editMeal
        }}>
            <DexcomAuthContext.Provider value={{
                authCode,
                accessToken,
                refreshToken,
                setAuthCode,
                setAccessToken,
                setRefreshToken,
                getAccessToken,
                revokeAuthorization,
                refreshAccessToken
            }}>
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
                                        onPress={() => Object.keys(meals).length > 0 ? (setEditingMeals(true), setDeletingMeals(false)) : ''}
                                    >
                                        <Ionicons name='pencil-outline' size={24} color={defaultColors.red.color} />
                                    </Text>
                                    <Text
                                        onPress={() => Object.keys(meals).length > 0 ? (setDeletingMeals(true), setEditingMeals(false)) : ''}
                                    >
                                        <Ionicons name='trash-outline' size={26} color={defaultColors.red.color} />
                                    </Text>
                                    <Text
                                        style={{ color: defaultColors.red.color, fontSize: 30, marginRight: 10 }}
                                        onPress={() => { setDeletingMeals(false), setEditingMeals(false), navigation.navigate('screens/AddMeal') }}
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
                            drawerActiveTintColor: defaultColors.red.color,
                            drawerActiveBackgroundColor: defaultColors.lightRed.color,
                            drawerLabel: "Data",
                            title: "Data",
                        }}
                        unmountOnBlur={true}
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
                    <Drawer.Screen
                        options={{
                            drawerItemStyle: { height: 0 },
                            title: "Add Meal",
                            headerShown: false,
                        }}
                        name="screens/AddMeal"
                    />
                    <Drawer.Screen
                        options={{
                            drawerItemStyle: { height: 0 },
                            title: "Edit Meal",
                            headerShown: false,
                        }}
                        unmountOnBlur={true}
                        name="screens/EditMeal"
                    />
                </Drawer>
            </DexcomAuthContext.Provider>
        </MealContext.Provider>
    )
}