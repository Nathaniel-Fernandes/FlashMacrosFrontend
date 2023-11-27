import React, { useEffect, useState, useContext } from 'react'
import { Text, View, Image, TextInput, Button, StyleSheet } from 'react-native'
import { defaultColors } from '../../src/styles/styles'
import { useNavigation } from 'expo-router/';

// dexcom authentication
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DexcomAuthContext, ProfileContext } from '../../src/context';

const ProfileScreen = (props) => {
    const navigation = useNavigation()

    const profileContext = useContext(ProfileContext)

    // 0. Profile data, state, helpers
    const [data, setData] = useState(profileContext.profileData)
    const [editable, setEditable] = useState(false)
    const [validInput, setValidInput] = useState(true)

    useEffect(() => {
        setData({...profileContext.profileData})
    }, [profileContext.profileData])

    // check if any fields are empty. If so, prevent saving.
    useEffect(() => {
        if ([data.name, data.email, data.heightFeet, data.heightInches, data.weight, data.race, data.age, data.sex].includes('')) {
            setValidInput(false)
        }
        else {
            setValidInput(true)
        }
    }, [data])

    // helper: save the user's input
    const handleChange = (e, type) => {
        const conversion = {
            'email': 'email',
            'name': 'name',
            'feet': 'heightFeet',
            'inches': 'heightInches',
            'weight': 'weight',
            'race': 'race',
            'age': 'age',
            'sex': 'sex'
        }

        setData({ ...data, [conversion[type]]: e })
    }

    // helper: save the in-memory form fields to on-device local storage
    const saveData = async (userData = null) => {
        if (userData === null) {
            profileContext.setProfileData({ ...data })
        }
        else {
            profileContext.setProfileData({ ...userData })
        }
    }

    // 1. Dexcom Authentication data, state, helpers
    // global context & component state
    dexcomAuthHelpers = useContext(DexcomAuthContext)

    const [authStatus, setAuthStatus] = useState(!!dexcomAuthHelpers.authCode && !!dexcomAuthHelpers.accessToken)

    // promptAsync is a f(x) that will open the Dexcom OAuth sign in modal
    // Any data sent from the Dexcom server will be stored in "response"
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: '3ljSynAhTDK6Uq8vxYz7cdzHZPtOEknS',
            clientSecret: '5wRd0vhpERTgwQS9', // [ECEN 404 TODO]: move the clientSecret to the server to be more secure
            redirectUri: makeRedirectUri({
                scheme: 'flashmacros',
                path: 'redirect'
            }),
            scopes: ['offline_access']
        },
        {
            authorizationEndpoint: 'https://sandbox-api.dexcom.com/v2/oauth2/login'
        }
    )

    // whenever the response changes (i.e., the user has completed the OAuth modal), test to see if request was successful or rejected
    useEffect(() => {
        if (!!response) {
            setAuthStatus(response.type)

            if (response.type === 'success') {
                const { code } = response.params;
                dexcomAuthHelpers.setAuthCode(code) // update global data store with new code
            }
        }
    }, [response]);

    // TODO: make it easier to enter text 
    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <View style={{ margin: 20 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={require('../../assets/johanna.png')}
                    ></Image>
                    <View style={{ marginLeft: 25 }}>
                        <TextInput editable={editable} style={{ fontWeight: 800, fontSize: 18 }} defaultValue={data.name} onChangeText={e => handleChange(e, 'name')}></TextInput>
                        <TextInput editable={editable} style={{ fontWeight: 900 }} defaultValue={data.email} onChangeText={e => handleChange(e, 'email')}></TextInput>
                    </View>
                </View>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Height</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput inputMode='numeric' editable={editable} defaultValue={data.heightFeet} onChangeText={e => handleChange(e, 'feet')}></TextInput>
                                <Text>'</Text>
                                <TextInput inputMode='numeric' editable={editable} defaultValue={data.heightInches} onChangeText={e => handleChange(e, 'inches')}></TextInput>
                                <Text>"</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Weight</Text>
                            <TextInput inputMode='decimal' editable={editable} defaultValue={data.weight} onChangeText={e => handleChange(e, 'weight')}></TextInput>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: editable ? defaultColors.darkGray.color : defaultColors.red.color, fontWeight: 800 }}>BMI</Text>
                            <Text style={{ color: editable ? defaultColors.darkGray.color : defaultColors.black.color }}>{Math.round(10 * 703 * (Number(data.weight) / (Number(data.heightFeet) * 12 + Number(data.heightInches)) ** 2)) / 10}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Race</Text>
                            <TextInput editable={editable} defaultValue={data.race} onChangeText={e => handleChange(e, 'race')}></TextInput>
                            {/* <RNPickerSelect
                                onValueChange={(value) => handleChange(value, 'race')}
                                items={[
                                    { label: 'American Indian or Alaskan Native', value: 'American Indian or Alaskan Native' },
                                    { label: 'Asian / Pacific Islander', value: 'Asian / Pacific Islander' },
                                    { label: 'Black or African American', value: 'Black or African American' },
                                    { label: 'Hispanic', value: 'Hispanic' },
                                    { label: 'White / Caucasian', value: 'White / Caucasian' },
                                    { label: 'Other', value: 'Other' },
                                ]}
                            ></RNPickerSelect> */}
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Age</Text>
                            <TextInput inputMode='decimal' editable={editable} defaultValue={data.age} onChangeText={e => handleChange(e, 'age')}></TextInput>
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Sex</Text>
                            <TextInput styles={{ width: '100%', backgroundColor: 'black' }} editable={editable} defaultValue={data.sex} onChangeText={e => handleChange(e, 'sex')}></TextInput>
                            {/* <RNPickerSelect
                                onValueChange={(value) => handleChange(value, 'sex')}
                                items={[
                                    { label: 'Male', value: 'M' },
                                    { label: 'Female', value: 'F' },
                                    { label: 'Prefer Not To Say', value: 'N/A' },
                                ]}
                            ></RNPickerSelect> */}
                        </View>
                    </View>

                    {(!validInput) ?
                        <Text style={{ textAlign: 'center' }}>Please ensure no fields are left blank.</Text>
                        :
                        ''
                    }
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 10}}>
                    {
                        (editable) ?
                            <Button
                                title="Save?"
                                color={validInput ? defaultColors.blue.color : defaultColors.lightGray.color}
                                disabled={!validInput}
                                onPress={() => { setEditable(false); saveData() }}
                            ></Button>
                            : <Button
                                title="Edit Profile?"
                                color={defaultColors.blue.color}
                                onPress={() => setEditable(true)}
                            ></Button>
                    }

                    <Button
                        title="Delete Profile"
                        color={defaultColors.red.color}
                        onPress={() => { profileContext.resetProfile(), navigation.navigate('screens/SignUpScreen')}}
                    ></Button>
                </View>

                <View style={{ borderBottomColor: defaultColors.black.color, borderBottomWidth: StyleSheet.hairlineWidth, marginVertical: 20}}></View>

                <View style={{ marginVertical: 10, borderBottomColor: defaultColors.darkGray.color, paddingBottom: 8 }}>
                    <Text style={{ color: defaultColors.red.color, fontWeight: 800, paddingBottom: 10, textAlign: 'center' }}>DexCom API Key</Text>

                    {
                        ((authStatus !== 'success' && authStatus !== true) || !!!dexcomAuthHelpers.accessToken || !!!dexcomAuthHelpers.authCode) ?
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#59a618',
                                    padding: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: '#59a618',
                                }}
                                disabled={!request}
                                onPress={promptAsync}
                            >
                                <Text style={{ color: defaultColors.white.color, fontWeight: '800' }}>
                                    Authorize Dexcom Data
                                </Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#dc3545',
                                    padding: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: '#dc3545'
                                }}
                                onPress={dexcomAuthHelpers.revokeAuthorization}
                            >
                                <Text style={{ color: defaultColors.white.color, fontWeight: '800' }}>
                                    Revoke Dexcom Authorization
                                </Text>
                            </TouchableOpacity>
                    }
                    {
                        (authStatus === 'error') ?
                            <Text style={{ color: defaultColors.red.color, marginTop: 10 }}>Authorization denied. Please try again to connect Dexcom account.</Text> : ''
                    }
                </View>
            </View>
        </View>
    )
}

export default ProfileScreen