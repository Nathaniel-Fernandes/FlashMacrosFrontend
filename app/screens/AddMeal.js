import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, Text, Modal, View, TextInput, Button, ImageBackground, ScrollView } from 'react-native';
import { defaultColors } from '../../src/styles/styles';
import { useNavigation } from 'expo-router';
import { MealContext } from '../../src/context';
import { format } from 'date-fns'
import Camera from '../../src/components/camera';
import * as MediaLibrary from 'expo-media-library'; 

const AddMealModal = () => {
    const navigation = useNavigation()

    const mealHelpers = useContext(MealContext)

    const [mealDescription, setMealDescription] = useState('')
    const [mealTags, setMealTags] = useState('')

    const [openCamera, setOpenCamera] = useState(false)
    const [imgTempURI, setImgTempURI] = useState('')

    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    const closeModal = () => {
        setMealDescription('')
        setMealTags('')
        setImgTempURI('')
        navigation.navigate('screens/MealScreen')
    }

    const saveMeal = async () => {
        // get media library permission
        let mediaLibraryPermission = await requestPermission()
        console.log('current permissions: ', mediaLibraryPermission)

        if (mediaLibraryPermission['status'] === 'granted') {
            await MediaLibrary.createAssetAsync(imgTempURI).then((asset) => {
                const meal = {
                    'title': format(new Date(), 'MM/dd/yyyy p'),
                    'description': mealDescription,
                    'CMNP': {
                        'Calories': 1000,
                        'Protein': 100,
                        'Fat': 2,
                        'Carbs': 50
                    },
                    'tags': mealTags.split(','),
                    'imgURI': asset.uri,
                }    
                mealHelpers.addMeal(meal)
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
                            title = {(imgTempURI === '') ? "Add a photo?" : "Retake photo"}
                            color={defaultColors.red.color}
                            onPress={() => setOpenCamera(true)}
                        ></Button>
                }

                {
                imgTempURI === '' ? '' :
                    typeof(imgTempURI) === typeof('') ?
                    <ImageBackground
                        src={imgTempURI}
                        style={{
                            width: 415*9/16, // 9:16 aspect ratio
                            height: 415,
                            marginTop: 10,
                            alignSelf: 'center',
                            marginBottom: 5
                        }}
                    ></ImageBackground> : 
                    <Image
                        source={imgTempURI}
                        style={{
                            width: 415*9/16,
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
                    ></Button>
                    <Button
                        title="Cancel"
                        color={defaultColors.red.color}
                        onPress={closeModal}
                    ></Button>
                </View>
            </ScrollView>
        </View>
    )
}

export default AddMealModal