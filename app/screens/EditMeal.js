import React, { useContext, useState, useEffect } from 'react'
import { Text, View, Modal, TextInput, Button, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import Modal2 from "react-native-modal";
import { defaultColors } from '../../src/styles/styles';
import { Image } from 'expo-image'
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { MealContext } from '../../src/context';
import Camera from '../../src/components/camera';
import * as MediaLibrary from 'expo-media-library';

const EditMealModal = () => {
    const navigation = useNavigation()
    const mealHelpers = useContext(MealContext)

    const params = useLocalSearchParams()

    // component logistics state
    const [uuid, setUuid] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [openCamera, setOpenCamera] = useState(false)
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    // data state
    const [imgTempURI, setImgTempURI] = useState('')
    const [mealDescription, setMealDescription] = useState('')
    const [mealTags, setMealTags] = useState('')

    useEffect(() => {
        setUuid(params.uuid)
    }, [params])

    useEffect(() => {
        if (uuid != '') {
            setIsLoading(false)
            setImgTempURI(mealHelpers.data[uuid].img.URI)
            setMealDescription(mealHelpers.data[uuid].description)
            setMealTags(mealHelpers.data[uuid].tags.join(','))
        }
    }, [uuid])

    // helpers
    const closeModal = async (timeout = 1000) => {
        setIsLoading(true)

        // Use Timeout to allow sorting logic to complete in MealScreen before navigating to the Meals Screen    
        await setTimeout(() => {
            setMealDescription('')
            setMealTags('')
            setImgTempURI('')
            setIsLoading(false)
            setUuid('')
            navigation.navigate('screens/MealScreen')
        }, timeout)
    }

    const saveMeal = async () => {
        if (imgTempURI === mealHelpers.data[uuid].img.URI) {
            // console.log('saving meal method 1')

            const mealObj = {
                'title': mealHelpers.data[uuid].title,
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
                    'URI': mealHelpers.data[uuid].img.URI,
                    'width': mealHelpers.data[uuid].img.width,
                    'height': mealHelpers.data[uuid].img.height
                }
            }
            mealHelpers.addMeal(mealObj, uuid)
        }

        else {
            // console.log('saving meal method 2')

            // get media library permission
            let mediaLibraryPermission = await requestPermission()

            if (mediaLibraryPermission['status'] === 'granted') {
                await MediaLibrary.createAssetAsync(imgTempURI).then((asset) => {
                    const mealObj = {
                        'title': mealHelpers.data[uuid].title,
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
                    mealHelpers.addMeal(mealObj, uuid)
                })
            }
        }
    }

    return (
        // TODO: add screen transition animations by making this a modal in the MealScreen
        <View style={{ height: '100%', padding: 5, backgroundColor: '#fff' }}>
            <ScrollView style={{ marginVertical: 50, marginHorizontal: 20 }} contentContainerStyle={{ display: 'flex', flexDirection: 'column' }}>
                <Text style={{ ...defaultColors.black, fontSize: 28, fontWeight: 800 }}>Edit meal</Text>

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
                        <Image
                            source={imgTempURI}
                            style={{
                                width: 415,
                                height: mealHelpers.data[uuid].img.height / (mealHelpers.data[uuid].img.width / 415),
                                marginTop: 10,
                                alignSelf: 'center',
                            }}
                            alt="Image Preview on Meal Screen"
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

export default EditMealModal