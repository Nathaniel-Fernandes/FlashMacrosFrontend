// 3rd party
import React, { useState } from "react";
import { Text, TextInput, View, Button, Image, ScrollView, KeyboardAvoidingView } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Link } from "expo-router";
import PasswordValidate, { VALIDATION_RULES_KEYS } from 'react-native-password-validate-checklist';

// local files
import { defaultColors } from '../../src/styles/styles';

const SignUpScreen = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [isValid, setIsValid] = useState(false)
    const [agreed, setAgreed] = useState(false)

    const rules = [
        { key: VALIDATION_RULES_KEYS.MIN_LENGTH, ruleValue: 10, label: 'Should contain more than 6 letter characters' },
        { key: VALIDATION_RULES_KEYS.MAX_LENGTH, ruleValue: 15, label: 'Should contain less than 12 letter characters' },
        { key: VALIDATION_RULES_KEYS.LOWERCASE_LETTER },
        { key: VALIDATION_RULES_KEYS.UPPERCASE_LETTER },
        { key: VALIDATION_RULES_KEYS.NUMERIC },
        { key: VALIDATION_RULES_KEYS.SPECIAL_CHARS },
    ];

    return (
        <KeyboardAvoidingView style={{ backgroundColor: '#FFF', minHeight: '100%' }} behavior="padding">
            {/* Use "keyboardShouldPersistTaps='handled' with a <ScrollView> so clicks off the text-input will close the keyboard" */}
            <ScrollView
                style={{ marginHorizontal: 20, marginTop: 25, marginTop: 60 }}
                keyboardShouldPersistTaps='handled'
            >
                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 13
                        }}
                    />
                    <Text style={{ ...defaultColors.black, fontWeight: 800 }}>Flash Macros</Text>
                </View>

                <Text style={{ ...defaultColors.black, fontSize: 28, fontWeight: 800 }}>Sign Up</Text>

                <View style={{ marginVertical: 20 }}>
                    <Text style={{ ...defaultColors.red, fontWeight: 800 }}>Email</Text>
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
                    <Text style={{ ...defaultColors.red, fontWeight: 800 }}>Password</Text>
                    <TextInput
                        value={password}
                        onChangeText={e => { setPassword(e), setIsValid(false) }}
                        placeholder="******"
                        style={{
                            color: defaultColors.lightGray,
                            marginVertical: 15,
                            borderBottomColor: defaultColors.lightGray,
                            paddingBottom: 5,
                            borderBottomWidth: 1
                        }}></TextInput>
                </View>

                {/* Only display the PasswordValidate component if the user has entered a password and it is INvalid */}
                {password.length > 0 && !isValid ? <PasswordValidate
                    newPassword={password}
                    confirmPassword=""
                    validationRules={rules}
                    onPasswordValidateChange={setIsValid}
                /> : ''}

                <View style={{ marginVertical: 20 }}>
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

                {/* Navigate to Home Screen only if the user has agreed to the TOS+PP AND the user's password is valid */}
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

                {/* Allow the user to navigate to the Sign In screen in case they already have an account */}
                <Text style={{ ...defaultColors.darkGray, marginVertical: 15 }}>
                    Have an Account?
                    <Link
                        href={'/'}
                        asChild
                    >
                        <Text style={defaultColors.red}> Sign In</Text>
                    </Link>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen