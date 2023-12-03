import React, { useContext, useState, useEffect } from 'react'
import { Text, View, Modal, TextInput, Button, ScrollView, ActivityIndicator } from 'react-native';
import Modal2 from "react-native-modal";
import { defaultColors } from '../../src/styles/styles';
import { useNavigation } from 'expo-router';
import { Image } from 'expo-image'
import { MealContext } from '../../src/context';
import { format } from 'date-fns'
import CameraComponent from '../../src/components/camera';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'react-native-vision-camera'

const AddMealModal = () => {
    const navigation = useNavigation()
    const mealHelpers = useContext(MealContext)

    const [isLoading, setIsLoading] = useState(false)

    const [mealDescription, setMealDescription] = useState('')
    const [mealTags, setMealTags] = useState('')

    const [openCamera, setOpenCamera] = useState(false)
    const [imgTempURI, setImgTempURI] = useState('')

    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    // 2. Get user's permission to use the Camera + Media Library
    const [cameraPermission, setCameraPermission] = useState('')

    // Ask for permissions 1x on component start up
    useEffect(() => {
        (async () => {
            setCameraPermission(await Camera.getCameraPermissionStatus())
        })()
    }, [])

    console.log('camera perm:', cameraPermission)

    const closeModal = async (timeout = 1000) => {
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

        if (mediaLibraryPermission['status'] === 'granted') {
            await MediaLibrary.createAssetAsync(imgTempURI).then((asset) => {
                const mealObj = {
                    'title': format(new Date(), 'MM/dd/yyyy p'),
                    'description': mealDescription,
                    'CMNP': {
                        'calories': {
                            'mean': Math.round(500 * (1 + Math.random())),
                            'CI': Math.round(25 * (1 + Math.random())),
                        },
                        'proteins': {
                            'mean': Math.round(100 * (0.5 + Math.random())),
                            'CI': Math.round(10 * (0.5 + Math.random())),
                        },
                        'fats': {
                            'mean': Math.round(20 * (1 + Math.random())),
                            'CI': Math.round(5 * (1 + Math.random()))
                        },
                        'carbs': {
                            'mean': Math.round(50 * (1 + Math.random())),
                            'CI': Math.round(10 * (1 + Math.random())),
                        }
                    },
                    'tags': mealTags.split(','),
                    'img': {
                        'URI': asset.uri,
                        'width': asset.width,
                        'height': asset.height
                    }
                }
                mealHelpers.addMeal(mealObj)
                closeModal()
            })
        }
    }

    console.log(permissionResponse)

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
                            <CameraComponent setOpenCamera={setOpenCamera} setImgTempURI={setImgTempURI} />
                        </Modal>
                        : <Button
                            title={(imgTempURI === '') ? "Add Photo" : "Retake photo"}
                            color={defaultColors.blue.color}
                            onPress={() => setOpenCamera(true)}
                            disabled={cameraPermission != 'granted'}
                        ></Button>
                }
                {
                    (cameraPermission == 'granted') ? '' : 
                        <Text style={{ color: defaultColors.red.color, margin: 15, fontSize: 14, }}>Camera permissions denied. Please open settings & enable "Camera Permissions" for FlashMacros.</Text>
                }

                {
                    (permissionResponse?.granted) ? '' : 
                        <Text style={{ color: defaultColors.red.color, margin: 15, fontSize: 14, }}>Media Library permissions denied. Please open settings & enable "Photo Permissions" for FlashMacros to save your photos.</Text>
                }

                {
                    // TODO:
                    imgTempURI === '' ? '' :
                        <Image
                            source={imgTempURI}
                            style={{
                                width: 415*9/16,
                                height: 415,
                                marginTop: 10,
                                alignSelf: 'center'
                            }}
                            alt="Image Preview"
                        />
                }

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                        title="Save"
                        color={defaultColors.blue.color}
                        onPress={saveMeal} // TODO: save modal data
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