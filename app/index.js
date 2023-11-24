import React, { useState } from "react";
import { Text, View, Image, TextInput, Button, ScrollView, Pressable } from "react-native";
import { defaultColors } from '../src/styles/styles';
import { Link } from "expo-router"
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

import { LoginButton, AccessToken } from 'react-native-fbsdk-next';

const SignInScreen = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <ScrollView style={{ marginTop: 60 }} keyboardShouldPersistTaps='handled'>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 20 }}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 13
                        }}
                    />
                    <Text style={{ ...defaultColors.black, fontWeight: 800 }}>Flash Macros</Text>
                </View>

                <View style={{ marginHorizontal: 20, marginVertical: 25 }}>
                    <Text style={{ ...defaultColors.black, fontSize: 28, fontWeight: 800 }}>Sign In</Text>
                    <Text style={{ ...defaultColors.black }}>Hi there! Nice to see you again.</Text>

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

                    {/* TODO: see if it's possible to change background color */}
                    {/* 
                    <Button 
                        title="Sign In"
                        color={defaultColors.red.color}
                        disabled={username.length === 0 || password.length === 0}
                        onPress={() => navigation.navigate('Home')}
                    ></Button> */}
                    <Link
                        href={'/screens/HomeScreen'}
                        asChild
                    >
                        <Button
                            title="Sign In"
                            color={defaultColors.red.color}
                            disabled={username.length === 0 || password.length === 0}
                        ></Button>
                    </Link>

                    <Text style={{ textAlign: 'center', ...defaultColors.darkGray }}>or use one of your social profiles</Text>

                    {/* <View style={{ display: "flex", flexDirection: 'row' }}> */}
                    <View style={{ 
                        // margin: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <GoogleSigninButton
                            style={{ width: 198, marginLeft: -3 }}
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Dark}
                        onPress={GoogleSignin}
                        // disabled={state.isSigninInProgress}
                        />

                        <Pressable
                            style={{
                                backgroundColor: 'rgba(22,118,241,255)',
                                height: 40,
                                borderRadius: 3,
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                            onPress={() => console.log('hi')} // TODO: do styling, make button press the same, etc.
                        >
                            <LoginButton
                                onPress={() => { }}
                            // onLoginFinished={
                            //     (error, result) => {
                            //         if (error) {
                            //             console.log("login has error: " + result.error);
                            //         } else if (result.isCancelled) {
                            //             console.log("login is cancelled.");
                            //         } else {
                            //             AccessToken.getCurrentAccessToken().then(
                            //                 (data) => {
                            //                     console.log(data.accessToken.toString())
                            //                 }
                            //             )
                            //         }
                            //     }
                            // }
                            // onLogoutFinished={() => console.log("logout.")}
                            />
                        </Pressable>
                    </View>



                    {/* TODO: add sign in w/ Google */}
                    {/* TODO: add sign in with Facebook */}
                    {/* TODO: add sign in with Twitter */}
                    {/* TODO: add link from Sign In to signin page */}

                    <View style={{ marginVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Link
                            href={'/screens/ForgotPassword'}
                            asChild
                        >
                            <Text style={{ ...defaultColors.darkGray, fontWeight: 800 }}>Forgot Password?</Text>
                        </Link>
                        <Link
                            href={'/screens/SignUpScreen'}
                        >
                            <Text style={{ ...defaultColors.red, fontWeight: 800 }}>Sign Up</Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default SignInScreen