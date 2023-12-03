import React, { useEffect, useState, useContext } from 'react'
import { Text, View, TextInput, Button, StyleSheet, Modal, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { defaultColors } from '../../src/styles/styles'
import { useNavigation } from 'expo-router/';
import { SelectList } from 'react-native-dropdown-select-list';

// dexcom authentication
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DexcomAuthContext, MealContext, ProfileContext } from '../../src/context';
import * as MediaLibrary from 'expo-media-library';

import Camera from '../../src/components/camera';

const ProfileScreen = (props) => {
    const navigation = useNavigation()

    const mealHelpers = useContext(MealContext)
    const profileContext = useContext(ProfileContext)

    // profile options
    const raceOptions = [
        { key: 0, value: "African American" },
        { key: 1, value: "White" },
        { key: 2, value: "Asian" },
        { key: 3, value: "Hispanic or Latino" },
        { key: 4, value: "Native American" },
        { key: 5, value: "Pacific Islander" },
    ]

    const genderOptions = [
        { key: 0, value: 'Male' },
        { key: 1, value: 'Female' },
        { key: 2, value: 'Prefer Not To Say' }
    ]

    // camera
    const [openCamera, setOpenCamera] = useState(false)
    const [imgTempURI, setImgTempURI] = useState(profileContext.profileData.img.URI)
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    // 0. Profile data, state, helpers
    const [data, setData] = useState(profileContext.profileData)
    const [editable, setEditable] = useState(false)
    const [validInput, setValidInput] = useState(true)
    const [gdprReq, setGdprReq] = useState(false)

    useEffect(() => {
        setData({ ...profileContext.profileData })
    }, [profileContext.profileData])

    // check if any fields are empty. If so, prevent saving.
    useEffect(() => {
        if ([data.name, data.email, data.heightInches, data.weight, data.race, data.age, data.sex].includes('')) {
            setValidInput(false)
        }
        else {
            setValidInput(true)
        }
    }, [data])

    const requestAllData = () => {
        // [ECEN 404 TODO]: Make Request to Server to delete GDPR data
        setGdprReq(true)
    }

    // helper: save the user's input
    const handleChange = (e, type) => {
        const conversion = {
            // 'email': 'email',
            'name': 'name',
            // 'feet': 'heightFeet',
            'inches': 'heightInches',
            'weight': 'weight',
            'race': 'race',
            'age': 'age',
            'sex': 'sex'
        }

        setData({ ...data, [conversion[type]]: e })
    }

    console.log('open camera: ', openCamera, editable)

    // helper: save the in-memory form fields to on-device local storage
    const saveData = async (userData = null) => {
        if (userData === null) {
            if (imgTempURI === '' || imgTempURI === profileContext.profileData.img.URI) {
                profileContext.setProfileData({ ...data })
            }

            else {
                // console.log('saving meal method 2')

                // get media library permission
                let mediaLibraryPermission = await requestPermission()

                if (mediaLibraryPermission['status'] === 'granted') {
                    await MediaLibrary.createAssetAsync(imgTempURI).then((asset) => {
                        profileContext.setProfileData({ ...data, img: { URI: asset.uri } })
                    })
                }
                else {
                    profileContext.setProfileData({ ...data })
                }
            }
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
            <ScrollView style={{ margin: 20 }}>
                <View style={{ flexDirection: 'row' }}
                >
                    <TouchableOpacity
                        onPress={() => { editable ? setOpenCamera(true) : '' }}
                    >
                        <Image
                            source={imgTempURI}
                            style={{
                                width: 60,
                                height: 60,
                                marginTop: 10,
                                alignSelf: 'center',
                                borderRadius: 50
                            }}
                            alt="Profile Image"
                        ></Image>
                    </TouchableOpacity>
                    <View style={{ marginLeft: 25 }}>
                        <TextInput editable={editable} style={{ fontWeight: 800, fontSize: 18 }} defaultValue={data.name} onChangeText={e => handleChange(e, 'name')}></TextInput>
                        <TextInput editable={false} style={{ fontWeight: 900 }} defaultValue={data.email} onChangeText={e => handleChange(e, 'email')}></TextInput>
                    </View>
                </View>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', alignItems: 'center', width: 125, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Height (in)</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TextInput style={{width: 50, textAlign: 'right', paddingRight: 3}} inputMode='decimal' editable={editable} defaultValue={data.heightInches} onChangeText={e => handleChange(e, 'inches')}></TextInput>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', alignItems: 'center', width: 125, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Weight (lb)</Text>
                            <TextInput style={{width: 50, textAlign: 'right', paddingRight: 5}} inputMode='decimal' editable={editable} defaultValue={data.weight} onChangeText={e => handleChange(e, 'weight')}></TextInput>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 125, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: editable ? defaultColors.darkGray.color : defaultColors.red.color, fontWeight: 800, marginTop: editable ? 19 : '' }}>BMI</Text>
                            <Text style={{ color: editable ? defaultColors.darkGray.color : defaultColors.black.color, marginTop: editable ? 18 : '' }}>{Math.round(10 * 703 * (Number(data.weight) / (Number(data.heightInches)) ** 2)) / 10}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 125, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800, marginTop: editable ? 16 : '' }}>Race</Text>

                            {
                                (editable) ?
                                    <SelectList
                                        setSelected={(val) => handleChange(val, 'race')}
                                        data={raceOptions}
                                        boxStyles={{
                                            borderWidth: 0,
                                        }}
                                        dropdownStyles={{
                                            marginHorizontal: 10
                                        }}
                                        search={false}
                                    >
                                    </SelectList> :
                                    (data.race !== '') ? <Text style={{ width: 80, textAlign: 'right', paddingRight: 3}} numberOfLines={1}>{raceOptions[Number(data.race)]?.value}</Text> : ''
                            }
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 125, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800, marginTop: editable ? 16 : '' }}>Age</Text>
                            <TextInput
                                inputMode='decimal'
                                style={{alignSelf: 'baseline', marginTop: editable ? 16 : '', width: 50, textAlign: 'right', paddingRight: 3}}
                                editable={editable}
                                defaultValue={data.age}
                                onChangeText={e => handleChange(e, 'age')}
                            ></TextInput>
                        </View>
                        <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 125, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8 }}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800, marginTop: editable ? 15 : '' }}>Sex</Text>
                            {(editable) ?
                                <SelectList
                                    setSelected={(val) => handleChange(val, 'sex')}
                                    data={genderOptions}
                                    boxStyles={{
                                        borderWidth: 0,
                                    }}
                                    dropdownStyles={{
                                        marginHorizontal: 10
                                    }}
                                    search={false}
                                    defaultValue
                                >
                                </SelectList> :
                                (data.sex !== '') ? <Text style={{ width: 80}} numberOfLines={1}>{genderOptions[Number(data.sex)]?.value}</Text> : ''
                            }
                        </View>
                    </View>

                    {(!validInput) ?
                        <Text style={{ textAlign: 'center' }}>Please ensure no fields are left blank.</Text>
                        :
                        ''
                    }
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 15 }}>
                    {
                        (editable) ?
                            <TouchableOpacity
                                onPress={() => { setEditable(false); saveData() }}
                                disabled={!validInput}
                                
                            >
                                <Text
                                    style={{
                                        color: validInput ? defaultColors.blue.color : defaultColors.lightGray.color,
                                        fontWeight: 800,
                                        fontSize: 15,
                                        margin: 0,
                                        padding: 0
                                    }}
                                
                                >Save?</Text>
                            </TouchableOpacity>
                            : <TouchableOpacity
                            onPress={() => setEditable(true)}
                            
                            >
                                <Text
                                    style={{
                                        fontWeight: 800,
                                        fontSize: 16,
                                        color: defaultColors.blue.color
                                    }}
                                >Edit Profile?</Text>
                            </TouchableOpacity> 
                    }
                    <TouchableOpacity
                       
                        onPress={() => navigation.navigate('index') }
                    >
                        <Text  style={{
                            fontWeight: 800,
                            color: defaultColors.green.color,
                            fontSize: 16,
                        }}>Logout</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ borderBottomColor: defaultColors.black.color, borderBottomWidth: StyleSheet.hairlineWidth, marginVertical: 20 }}></View>
                <View>
                    <Text style={{ fontWeight: 800 }}>Privacy Compliance</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: defaultColors.black.color,
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                borderWidth: 2,
                                marginTop: 10,
                                borderColor: defaultColors.black.color,
                            }}
                            onPress={requestAllData}
                        >
                            <Text style={{ color: defaultColors.white.color, fontWeight: '800' }}>
                                Request All Data
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#dc3545',
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                borderWidth: 2,
                                marginTop: 10,
                                borderColor: '#dc3545',
                            }}
                            onPress={async () => { profileContext.resetProfile(), mealHelpers.deleteMeal({}), dexcomAuthHelpers.setAuthCode(''), dexcomAuthHelpers.setAccessToken(''), navigation.navigate('screens/SignUpScreen') }}
                        >
                            <Text style={{ color: defaultColors.white.color, fontWeight: '800' }}>
                                Delete Profile & All Data
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {(gdprReq) ? '' :
                        <Text style={{ marginTop: 10 }}>You will receive an email with all the data we have on file shortly.</Text>}
                </View>
                <View style={{ borderBottomColor: defaultColors.black.color, borderBottomWidth: StyleSheet.hairlineWidth, marginVertical: 20 }}></View>

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
                                <Text style={{ color: defaultColors.white.color, fontWeight: '800', fontSize: 15 }}>
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
                                <Text style={{ color: defaultColors.white.color, fontWeight: '800', fontSize: 15 }}>
                                    Revoke Dexcom Authorization
                                </Text>
                            </TouchableOpacity>
                    }
                    {
                        (authStatus === 'error') ?
                            <Text style={{ color: defaultColors.red.color, marginTop: 10 }}>Authorization denied. Please try again to connect Dexcom account.</Text> : ''
                    }
                </View>
            </ScrollView>

            {
                openCamera ?
                    <Modal>
                        <Camera setOpenCamera={setOpenCamera} setImgTempURI={setImgTempURI} />
                    </Modal>
                    : ''
            }
        </View>
    )
}

export default ProfileScreen