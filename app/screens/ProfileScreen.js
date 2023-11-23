import React, { useEffect, useState } from 'react'
import { Text, View, Image, TextInput, Button } from 'react-native'
import RNPickerSelect from 'react-native-picker-select';
import { defaultColors } from '../../src/styles/styles'
import { useNavigation } from 'expo-router/';
import AsyncStorage from '@react-native-async-storage/async-storage'


const ProfileScreen = (props) => {
    const navigation = useNavigation()

    const [editable, setEditable] = useState(false)
    const [validInput, setValidInput ] = useState(true)

    const [apiKey, setApiKey] = useState('d763f815d9ec4955b9166954bc1bc073')
    const [data, setData] = useState({
        name: 'Johanna Doe',
        email: 'johanna@company.com',
        heightFeet: '5',
        heightInches: '5',
        weight: '130',
        race: 'White',
        age: '27',
        sex: 'F'
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const savedData = await AsyncStorage.getItem('FlashMacrosProfileStorage')
                console.log(savedData)
                if (savedData == null) {
                    throw new Error('No dummy data found. Throwing exception.')
                } else {
                    setData(JSON.parse(savedData))
                }
            }
            catch (e) {
                console.log(e)
            }
        }

        fetchData()
            .catch(e => console.log(e))
    }, [])

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

        setData({...data, [conversion[type]]: e})
    }

    const saveData = async () => {
        await AsyncStorage.setItem('FlashMacrosProfileStorage', JSON.stringify(data))
    }

    useEffect(() => {
        if ([data.name, data.email, data.heightFeet, data.heightInches, data.weight, data.race, data.age, data.sex].includes('')) {
            setValidInput(false)
        }
        else {
            setValidInput(true)
        }
    }, [data])
    
    // TODO: make it easier to enter text 
    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <View style={{ margin: 20 }}>
                <View style={{ flexDirection: 'row'}}>
                    <Image
                        source={require('../../assets/johanna.png')}
                    ></Image>
                    <View style={{ marginLeft: 25}}>
                        <TextInput editable={editable} style={{ fontWeight: 800, fontSize: 18 }} defaultValue={data.name} onChangeText={e => handleChange(e, 'name')}></TextInput>
                        <TextInput editable={editable} style={{ fontWeight: 900 }} defaultValue={data.email} onChangeText={e => handleChange(e, 'email')}></TextInput>
                    </View>
                </View>
                <View> 
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Height</Text>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput inputMode='numeric' editable={editable} defaultValue={data.heightFeet} onChangeText={e => handleChange(e, 'feet')}></TextInput>
                                <Text>'</Text>
                                <TextInput inputMode='numeric' editable={editable} defaultValue={data.heightInches} onChangeText={e => handleChange(e, 'inches')}></TextInput>
                                <Text>"</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Weight</Text>
                            <TextInput inputMode='decimal' editable={editable} defaultValue={data.weight} onChangeText={e => handleChange(e, 'weight')}></TextInput>
                        </View>
                    </View>
                
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                            <Text style={{ color: editable ? defaultColors.darkGray.color : defaultColors.red.color, fontWeight: 800 }}>BMI</Text>
                            <Text style={{ color: editable ? defaultColors.darkGray.color : defaultColors.black.color }}>{Math.round(10*703*(Number(data.weight) / (Number(data.heightFeet)*12 + Number(data.heightInches))**2))/10}</Text> 
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
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

                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Age</Text>
                            <TextInput inputMode='decimal' editable={editable} defaultValue={data.age} onChangeText={e => handleChange(e, 'age')}></TextInput>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
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

                    { (!validInput) ?
                        <Text style={{ textAlign: 'center' }}>Please ensure no fields are left blank.</Text>
                        :
                        ''
                    }
                </View>
                <View style={{marginVertical: 20, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                    <Text style={{ color: defaultColors.red.color, fontWeight: 800, paddingBottom: 10 }}>DexCom API Key</Text>
                    <TextInput editable={editable} defaultValue={apiKey} onChangeText={setApiKey}></TextInput>
                </View>

                {
                    (editable) ?
                        <Button
                            title="Save?"
                            color={validInput ? defaultColors.blue.color : defaultColors.lightGray.color }
                            disabled={!validInput}
                            onPress={() => { setEditable(false); saveData()}}
                        ></Button>
                        : <Button
                        title="Edit?"
                        color={defaultColors.blue.color}
                        onPress={() => setEditable(true) }
                    ></Button>
                }
                
                {/* <Button
                    title="Edit Profile"
                    color={defaultColors.blue.color}
                ></Button> */}
                <Button
                    title="Delete Profile"
                    color={defaultColors.red.color}
                    onPress={() => navigation.navigate('screens/SignUpScreen')}
                ></Button>
            </View>
        </View>
    )
}

export default ProfileScreen