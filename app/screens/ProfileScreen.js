import React, { useState } from 'react'
import { Text, View, Image, TextInput, Button } from 'react-native'
import { defaultColors } from '../../src/styles/styles'

const ProfileScreen = (props) => {
    const [ editable, setEditable ] = useState(false)

    const [name, setName] = useState('Johanna Doe')
    const [email, setEmail] = useState('johanna@company.com')
    const [heightFeet, setHeightFeet] = useState('5')
    const [heightInches, setHeightInches] = useState('5')
    const [weight, setWeight] = useState('130')
    const [race, setRace] = useState('White')
    const [age, setAge] = useState('27')
    const [sex, setSex] = useState('F')

    const [apiKey, setApiKey] = useState('d763f815d9ec4955b9166954bc1bc073')

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <View style={{ margin: 20 }}>
                <View style={{ flexDirection: 'row'}}>
                    <Image
                        source={require('../../assets/johanna.png')}
                    ></Image>
                    <View style={{ marginLeft: 25}}>
                        <TextInput editable={editable} style={{ fontWeight: 800, fontSize: 18 }} defaultValue={name} onChangeText={setName}></TextInput>
                        <TextInput editable={editable} style={{ fontWeight: 900 }} defaultValue={email} onChangeText={setEmail}></TextInput>
                    </View>
                </View>
                <View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Height</Text>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput editable={editable} defaultValue={heightFeet} onChangeText={setHeightFeet}></TextInput>
                                <Text>'</Text>
                                <TextInput editable={editable} defaultValue={heightInches} onChangeText={setHeightInches}></TextInput>
                                <Text>"</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Weight</Text>
                            <TextInput editable={editable} defaultValue={weight} onChangeText={setWeight}></TextInput>
                        </View>
                    </View>
                
                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>BMI</Text>
                            <Text>{Math.round(10*703*(Number(weight) / (Number(heightFeet)*12 + Number(heightInches))**2))/10}</Text> 
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Race</Text>
                            <TextInput editable={editable} defaultValue={race} onChangeText={setRace}></TextInput>
                        </View>
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Age</Text>
                            <TextInput editable={editable} defaultValue={age} onChangeText={setAge}></TextInput>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 20, justifyContent: 'space-between', width: 100, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                            <Text style={{ color: defaultColors.red.color, fontWeight: 800 }}>Sex</Text>
                            <TextInput editable={editable} defaultValue={sex} onChangeText={setSex}></TextInput>
                        </View>
                    </View>
                </View>
                <View style={{marginVertical: 20, borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, paddingBottom: 8}}>
                    <Text style={{ color: defaultColors.red.color, fontWeight: 800, paddingBottom: 10 }}>DexCom API Key</Text>
                    <TextInput editable={editable} defaultValue={apiKey} onChangeText={setApiKey}></TextInput>
                </View>

                {
                    (editable) ?
                        <Button
                            title="Save?"
                            color={defaultColors.blue.color}
                            onPress={() => setEditable(false)}
                        ></Button>
                        : <Button
                        title="Edit?"
                        color={defaultColors.blue.color}
                        onPress={() => setEditable(true)}
                    ></Button>
                }
                
                {/* <Button
                    title="Edit Profile"
                    color={defaultColors.blue.color}
                ></Button> */}
                <Button
                    title="Delete Profile"
                    color={defaultColors.red.color}
                ></Button>
            </View>
        </View>
    )
}

export default ProfileScreen