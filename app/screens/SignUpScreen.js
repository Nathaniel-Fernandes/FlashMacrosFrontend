import React, { useState } from "react";
import { Text, TextInput, View, Button, Image, ScrollView } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { defaultColors } from '../../src/styles/styles';
import { Link } from "expo-router";
import PasswordValidate, {
    VALIDATION_RULES_KEYS,
  } from 'react-native-password-validate-checklist';

const SignUpScreen = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isValid, setIsValid] = useState(true) // TODO: make validate 
    const [agreed, setAgreed] = useState(false)

    const rules = [
        {key: VALIDATION_RULES_KEYS.MIN_LENGTH, ruleValue: 10, label: 'Should contain more than 6 letter characters'},
        {key: VALIDATION_RULES_KEYS.MAX_LENGTH, ruleValue: 15, label: 'Should contain less than 12 letter characters'},
        {key: VALIDATION_RULES_KEYS.LOWERCASE_LETTER},
        {key: VALIDATION_RULES_KEYS.UPPERCASE_LETTER},
        {key: VALIDATION_RULES_KEYS.NUMERIC},
        {key: VALIDATION_RULES_KEYS.SPECIAL_CHARS},
      ];

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

            <View>
                <Text style={{...defaultColors.red, fontWeight: 800}}>Password</Text>
                <TextInput
                value={password}
                onChangeText={e => {setPassword(e), setIsValid(false)}}
                placeholder="******"
                style={{
                    color: defaultColors.lightGray,
                    marginVertical: 15,
                    borderBottomColor: defaultColors.lightGray,
                    paddingBottom: 5,
                    borderBottomWidth: 1
                }}></TextInput>
            </View>

            {password.length > 0 && !isValid ? <PasswordValidate
                newPassword={password}
                validationRules={rules}
                onPasswordValidateChange={setIsValid}
            /> : ''}

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