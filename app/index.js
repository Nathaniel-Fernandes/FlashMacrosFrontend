import React, { useState } from "react";
import { Text, View, Image, TextInput, Button, ScrollView } from "react-native";
import { defaultColors } from '../src/styles/styles';
import { useNavigation } from '@react-navigation/native'
import { Link } from "expo-router"

const SignInScreen = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation();

    return (
        <ScrollView style={{marginTop: 60}} keyboardShouldPersistTaps='handled'>
            <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 20}}>
                <Image
                    source={require('../assets/logo.png')}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 13
                    }}
                />
                <Text style={{...defaultColors.black, fontWeight: 800 }}>Flash Macros</Text>
            </View>

            <View style={{marginHorizontal: 20, marginVertical: 25}}>
                <Text style={{...defaultColors.black, fontSize: 28, fontWeight: 800}}>Sign In</Text>
                <Text style={{...defaultColors.black }}>Hi there! Nice to see you again.</Text>

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

                <Text style={{textAlign: 'center', ...defaultColors.darkGray}}>or use one of your social profiles</Text>
                
                {/* TODO: add sign in w/ Google */}
                {/* TODO: add sign in with Facebook */}
                {/* TODO: add sign in with Twitter */}
                {/* TODO: add link from Sign In to signin page */}

                <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Link
                        href={'/screens/ForgotPassword'}
                        asChild
                    >
                        <Text style={{...defaultColors.darkGray, fontWeight: 800}}>Forgot Password?</Text>
                    </Link>
                    <Link
                        href={'/screens/SignUpScreen'}
                    >
                        <Text style={{...defaultColors.red, fontWeight: 800}}>Sign Up</Text>                    
                    </Link>
                </View>
            </View>
        </ScrollView>
    )
}

export default SignInScreen