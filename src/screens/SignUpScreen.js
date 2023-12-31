import React, { useState } from "react";
import { Text, TextInput, View, Button, Image } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { defaultColors } from '../styles/styles';
import { useNavigation } from '@react-navigation/native'

const SignUpScreen = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isValid, setIsValid] = useState(true) // TODO: make validate 
    const [agreed, setAgreed] = useState(false)

    const navigation = useNavigation();

    return (
        <View style={{marginHorizontal: 20, marginVertical: 25, marginTop: 60}}>
            <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 20}}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 13
                    }}
                />
                <Text style={{...defaultColors.black, fontWeight: 800 }}>Flash Macros</Text>
            </View>
            <Text style={{...defaultColors.black, fontSize: 28, fontWeight: 800}}>Sign Up</Text>

            <View style={{marginVertical: 20}}>
                <Text style={{...defaultColors.red, fontWeight: 800}}>Email</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Your email address"
                    style={{
                        color: defaultColors.lightGray,
                        marginVertical: 15,
                        borderBottomColor: defaultColors.lightGray,
                        paddingBottom: 5,
                        borderBottomWidth: 1
                    }}
                ></TextInput>
            </View>

            {/* TODO: add input validation for password on frontend */}
            {/* TODO: add input validation for password on server */}
            <View>
                <Text style={{...defaultColors.red, fontWeight: 800}}>Password</Text>
                <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="******"
                style={{
                    color: defaultColors.lightGray,
                    marginVertical: 15,
                    borderBottomColor: defaultColors.lightGray,
                    paddingBottom: 5,
                    borderBottomWidth: 1
                }}></TextInput>
            </View>

            <View style={{marginVertical: 20}}>
                {/* TODO: BUGFIX make on same line */}
                {/* TODO: add link to Terms of Service */}
                {/* TODO: add link to Privacy policy */}
                <BouncyCheckbox
                    isChecked={agreed}
                    fillColor={defaultColors.red.color}
                    onPress={setAgreed}></BouncyCheckbox>
                <Text>I agree to the Terms of Service and Privacy Policy.</Text>
            </View>

            {/* TODO: see if it's possible to change background color */}
            <Button
                title="Continue"
                color={defaultColors.red.color}
                disabled={!agreed || !isValid}
                onPress={() => navigation.navigate('Home')}
            ></Button>

            {/* TODO: add link from Sign In to signin page */}
            <Text style={{...defaultColors.darkGray, marginVertical: 15}}>Have an Account? <Text style={defaultColors.red} onPress={() => navigation.navigate('Sign In')}>Sign In</Text></Text>
        </View>
    )
}

export default SignUpScreen