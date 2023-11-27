// 3rd party
import React, { useState } from "react";
import { Text, View, Image, TextInput, Button, ScrollView, Pressable } from "react-native";
import { Link, useNavigation } from "expo-router"
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { LoginButton, Settings } from 'react-native-fbsdk-next';

// local
import { defaultColors } from '../src/styles/styles';

GoogleSignin.configure();
Settings.initializeSDK();

const SignInScreen = () => {
    const navigation = useNavigation()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const signInWithGoogle = async () => {
        try {
            // [ECEN 404 TODO]: ensure the user actually is in our DATABASE before allowing access to the app.
            // For now, we can just assume the user has already registered and navigate to the home screen
            const userInfo = await GoogleSignin.signIn()
            navigation.navigate('screens/HomeScreen')
        }
        catch (e) {
            console.log(e)
        }
    }

    const signInWithFacebookCallback = (error, result) => {
        if (error) {
            console.log(error);
        } else if (result.isCancelled) {
            console.log("login is cancelled.");
        } else {
            // [ECEN 404 TODO]: ensure the user actually is in our DATABASE before allowing access to the app.
            // For now, we can just assume the user has already registered and navigate to the home screen
            navigation.navigate('screens/HomeScreen')
        }
    }

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

                    <Text style={{ textAlign: 'center', ...defaultColors.darkGray, marginTop: 30 }}>Or use one of your social profiles</Text>

                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <GoogleSigninButton
                            style={{ width: 198, marginLeft: -3 }}
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={signInWithGoogle}
                        />

                        <Pressable
                            style={{
                                backgroundColor: 'rgba(22,118,241,255)',
                                height: 40,
                                borderRadius: 3,
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <LoginButton
                                onLoginFinished={signInWithFacebookCallback}
                            />
                        </Pressable>
                    </View>

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