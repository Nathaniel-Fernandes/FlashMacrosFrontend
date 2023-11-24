import React, { useContext, useState, useEffect } from 'react'
import { Text, View, Modal, TextInput, Button, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import Modal2 from "react-native-modal";
import { defaultColors } from '../../src/styles/styles';
import { useNavigation } from 'expo-router';
import { MealContext } from '../../src/context';
import { format } from 'date-fns'
import Camera from '../../src/components/camera';
import * as MediaLibrary from 'expo-media-library';

const AddMealModal = () => {
    const navigation = useNavigation()
    const mealHelpers = useContext(MealContext)

    const [isLoading, setIsLoading] = useState(false)

    const [mealDescription, setMealDescription] = useState('')
    const [mealTags, setMealTags] = useState('')

    const [openCamera, setOpenCamera] = useState(false)
    const [imgTempURI, setImgTempURI] = useState('')

    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    const closeModal = async (timeout=1000) => {
        setIsLoading(true)

        // Use Timeout to allow sorting logic to complete in MealScreen before navigating to the Meals Screen    
        await setTimeout(() => {
            setMealDescription('')
            setMealTags('')
            setImgTempURI('')
            navigation.navigate('screens/MealScreen')
            setIsLoading(false)
        }, timeout)
    }

    const saveMeal = async () => {
        // get media library permission
        let mediaLibraryPermission = await requestPermission()
        console.log('current permissions: ', mediaLibraryPermission)

        if (mediaLibraryPermission['status'] === 'granted') {
            await MediaLibrary.createAssetAsync(imgTempURI).then((asset) => {
                console.log('asset: ', asset)

                const mealObj = {
                    'title': format(new Date(), 'MM/dd/yyyy p'),
                    'description': mealDescription,
                    'CMNP': {
                        'calories': Math.round(500 * (1 + Math.random())),
                        'proteins': Math.round(100 * (0.5 + Math.random())),
                        'fats': Math.round(20 * (1 + Math.random())),
                        'carbs': Math.round(50 * (1 + Math.random()))
                    },
                    'tags': mealTags.split(','),
                    'img': {
                        'URI': asset.uri,
                        'width': asset.width,
                        'height': asset.height
                    }
                }
                mealHelpers.addMeal(mealObj)
            })
        }
    }

    return (
        // TODO: add screen transition animations by making this a modal in the MealScreen
        <View style={{ height: '100%', padding: 5, backgroundColor: '#fff' }}>
            <ScrollView style={{ marginVertical: 50, marginHorizontal: 20 }} contentContainerStyle={{ display: 'flex', flexDirection: 'column' }}>
                <Text style={{ ...defaultColors.black, fontSize: 28, fontWeight: 800 }}>Add new meal</Text>

                <View style={{ marginVertical: 15 }}>
                    <Text>Description</Text>
                    <TextInput
                        value={mealDescription}
                        onChangeText={setMealDescription}
                        placeholder="Enter a description (optional)"
                        style={{
                            color: mealDescription === '' ? defaultColors.lightGray.color : defaultColors.black.color,
                            marginVertical: 15,
                            borderBottomColor: defaultColors.lightGray.color,
                            paddingBottom: 5,
                            borderBottomWidth: 1
                        }}
                    ></TextInput>
                </View>

                <View style={{ marginVertical: 15 }}>
                    <Text>Tag what food is here! (Comma Separate)</Text>
                    <TextInput
                        value={mealTags}
                        onChangeText={setMealTags}
                        placeholder="COMMA SEPARATE your tags"
                        style={{
                            color: mealTags === '' ? defaultColors.lightGray.color : defaultColors.black.color,
                            marginVertical: 15,
                            borderBottomColor: defaultColors.lightGray.color,
                            paddingBottom: 5,
                            borderBottomWidth: 1
                        }}
                    ></TextInput>
                </View>

                {
                    openCamera ?
                        <Modal>
                            <Camera setOpenCamera={setOpenCamera} setImgTempURI={setImgTempURI} />
                        </Modal>
                        : <Button
                            title={(imgTempURI === '') ? "Add Photo" : "Retake photo"}
                            color={defaultColors.blue.color}
                            onPress={() => setOpenCamera(true)}
                        ></Button>
                }

                {
                    // TODO:
                    imgTempURI === '' ? '' :
                        typeof (imgTempURI) === typeof ('') ?
                            <ImageBackground
                                src={imgTempURI}
                                style={{
                                    width: 415 * 9 / 16, // 9:16 aspect ratio
                                    height: 415,
                                    marginTop: 10,
                                    alignSelf: 'center',
                                    marginBottom: 5
                                }}
                            ></ImageBackground> :
                            <Image
                                source={imgTempURI}
                                style={{
                                    width: 415 * 9 / 16,
                                    height: 415,
                                    marginTop: 10
                                }}
                            />
                }

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                        title="Save"
                        color={defaultColors.blue.color}
                        onPress={() => { saveMeal(), closeModal() }} // TODO: save modal data
                        disabled={imgTempURI === ''}
                    ></Button>
                    <Button
                        title="Cancel"
                        color={defaultColors.red.color}
                        onPress={() => closeModal(0)}
                    ></Button>
                </View>

                <Modal2
                    isVisible={isLoading}
                    animationInTiming={0.1}
                    animationOutTiming={0.1}
                    backdropOpacity={0.5}
                >
                    <ActivityIndicator
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        size="large"
                        color={defaultColors.red.color}
                    />
                </Modal2>
            </ScrollView>
        </View>
    )
}

export default AddMealModal