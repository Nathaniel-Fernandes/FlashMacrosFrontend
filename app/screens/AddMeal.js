import React, { useContext, useState } from 'react'
import { StyleSheet, Text, Modal, View, TextInput, Button, Alert, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { defaultColors } from '../../src/styles/styles';
import { useNavigation } from 'expo-router';
import { MealContext } from '../../src/context';
import { format } from 'date-fns'
import Camera from '../../src/components/camera';

const AddMealModal = () => {
    const navigation = useNavigation()

    const mealHelpers = useContext(MealContext)

    const [mealDescription, setMealDescription] = useState('')
    const [mealTags, setMealTags] = useState('')

    const [openCamera, setOpenCamera] = useState(false)

    const closeModal = () => {
        setMealDescription('')
        setMealTags('')
        // setCapturedImage(null)
        navigation.navigate('screens/MealScreen')
    }

    const saveMeal = () => {
        const meal = {
            'title': format(new Date(), 'MM/dd/yyyy HH:MM'), // TODO: don't hard code PM in here LOL
            'description': mealDescription,
            'CMNP': {
                'Calories': 1000,
                'Protein': 100,
                'Fat': 2,
                'Carbs': 50
            },
            'tags': mealTags.split(','),
            // 'img': capturedImage.uri // TODO: save images to file storage system
        }

        mealHelpers.addMeal(meal)
    }

    return (
        // TODO: add screen transition animations by making this a modal in the MealScreen
        <View style={{ height: '100%', padding: 5 }}>
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

                <View style={{ backgroundColor: 'red', height: '160%' }}>
                {
                    openCamera ?
                        <Camera />
                        : <Button
                            title="Add a photo?"
                            color={defaultColors.red.color}
                            onPress={() => setOpenCamera(true)}
                        ></Button>
                }
                </View>

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