import React, { useState } from "react";
import { Text, TextInput, View, Button, Image, ScrollView } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { defaultColors } from '../../src/styles/styles';
import { useNavigation } from '@react-navigation/native'
import { Link } from "expo-router";

const SignUpScreen = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isValid, setIsValid] = useState(true) // TODO: make validate 
    const [agreed, setAgreed] = useState(false)

    const navigation = useNavigation();

    return (
        <ScrollView
            style={{marginHorizontal: 20, marginVertical: 25, marginTop: 60}}
            keyboardShouldPersistTaps='handled'
        >
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
                {/* TODO: add link to Terms of Service */}
                {/* TODO: add link to Privacy policy */}
                <BouncyCheckbox
                    isChecked={agreed}
                    fillColor={defaultColors.red.color}
                    onPress={setAgreed}
                    text="I agree to the Terms of Service and Privacy Policy."
                    textStyle={{
                        textDecorationLine: "none",
                      }}   
                >
                </BouncyCheckbox>
            </View>

            <Link
                href={'/screens/HomeScreen'}
                asChild
            >
                <Button
                    title="Continue"
                    color={defaultColors.red.color}
                    disabled={!agreed || !isValid}
                ></Button>
            </Link>

            <Text style={{...defaultColors.darkGray, marginVertical: 15}}>
                Have an Account?
                <Link
                    href={'/'}
                    asChild
                >
                    <Text style={defaultColors.red}> Sign In</Text>
                </Link>
            </Text>
        </ScrollView>
    )
}

export default SignUpScreen