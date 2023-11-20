import React, { useState } from "react";
import { Text, View, Image, TextInput, Button, ScrollView } from "react-native";
import { defaultColors } from '../../src/styles/styles';
import { Link } from "expo-router"

const ForgotPassword = () => {
    const [username, setUsername] = useState('')

    return (
        <View style={{  backgroundColor: '#FFF', height: '100%' }}>
            <ScrollView style={{marginTop: 60 }} keyboardShouldPersistTaps='handled'>
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

                <View style={{marginHorizontal: 20, marginVertical: 25}}>
                    <Text style={{...defaultColors.black, fontSize: 28, fontWeight: 800}}>Password Reset</Text>
                    <Text style={{...defaultColors.black }}>Please enter the email associated with your account.</Text>

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

                    {/* TODO: send message to user that an email has been sent */}
                    <Link
                        href={'/'}
                        asChild
                    >
                        <Button 
                            title="Submit"
                            color={defaultColors.red.color}
                            disabled={username.length === 0}
                        ></Button>
                    </Link>

                    <View style={{marginVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Link
                            href={'/'}
                            asChild
                        >
                            <Text style={{...defaultColors.darkGray, fontWeight: 800}}>Sign In</Text>
                        </Link>
                        <Link
                            href={'/screens/SignUpScreen'}
                        >
                            <Text style={{...defaultColors.red, fontWeight: 800}}>Sign Up</Text>                    
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default ForgotPassword