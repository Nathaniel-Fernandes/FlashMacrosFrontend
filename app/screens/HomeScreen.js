import React, { useContext, useState, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { Image } from 'expo-image'

import { MealContext, ProfileContext } from '../../src/context'
import { defaultColors } from "../../src/styles/styles";
import { Link, useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { convertDate, sortMealsByDate, convertMealObjArr, getMostRecentMeals } from "../../src/components/meal";

import { Meal } from '../../src/components/meal'

const HomeScreen = () => {
    const navigation = useNavigation()
    const [name, setName] = useState()

    const mealHelpers = useContext(MealContext)
    const profileContext = useContext(ProfileContext)

    //

    const [processedData, setProcessedData] = useState(Object.entries(mealHelpers.data).map(x => { return { ...x[1], uuid: x[0] } }).map(convertDate))
    const [pastWeekData, setPastWeekData] = useState(Object.entries(mealHelpers.data).map(x => { return { ...x[1], uuid: x[0] } }).map(convertDate))

    // Data Updaters
    useEffect(() => {
        setProcessedData(convertMealObjArr(mealHelpers.data))
    }, [mealHelpers.data])

    useEffect(() => {
        setPastWeekData(getMostRecentMeals(processedData, 7))
    }, [processedData])

    console.log(pastWeekData)

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: '#FFF', minHeight: '100%' }}>
            <View
                style={{
                    marginVertical: 15,
                    marginHorizontal: 15
                }}>
                <Text style={{ fontWeight: 800, fontSize: 30, textAlign: 'center' }}>Hi {profileContext.profileData.name}!</Text>
                {
                    pastWeekData.length > 0 ?
                        <Text style={{ fontSize: 16, marginTop: 10 }}>You are making great progress towards your health goals. Take a look below!</Text>
                        :
                        <Text style={{ fontSize: 16, marginTop: 10 }}>Log some more meals! None found this past week.</Text>
                }
            </View>

            <View style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                <TouchableOpacity style={{
                    backgroundColor: defaultColors.lightRed2.color,
                    borderRadius: 10,
                    marginHorizontal: 12,
                    marginVertical: 10,
                    padding: 20,
                    display: 'flex',
                    width: 155,
                }}
                    onPress={() => navigation.navigate('screens/ReportScreen')}
                >
                    <Text style={{ fontWeight: 800 }}>Weekly Calories</Text>
                    <Text style={{ fontSize: 32 }}>{pastWeekData.map(meal => meal.CMNP.calories).reduce((a, b) => a + b, 0)}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor: defaultColors.lightBlue.color,
                    borderRadius: 10,
                    marginHorizontal: 12,
                    marginVertical: 10,
                    padding: 20,
                    display: 'flex',
                    width: 155
                }}
                    onPress={() => navigation.navigate('screens/ReportScreen')}
                >
                    <Text style={{ fontWeight: 800 }}>Weekly Protein</Text>
                    <Text style={{ fontSize: 32 }}>{pastWeekData.map(meal => meal.CMNP.proteins).reduce((a, b) => a + b, 0)}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor: defaultColors.purple.color,
                    borderRadius: 10,
                    marginHorizontal: 12,
                    marginVertical: 10,
                    padding: 20,
                    display: 'flex',
                    width: 155
                }}
                    onPress={() => navigation.navigate('screens/ReportScreen')}
                >
                    <Text style={{ fontWeight: 800 }}>Weekly Fats</Text>
                    <Text style={{ fontSize: 32 }}>{pastWeekData.map(meal => meal.CMNP.fats).reduce((a, b) => a + b, 0)}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{
                    backgroundColor: defaultColors.lightGreen.color,
                    borderRadius: 10,
                    marginHorizontal: 12,
                    marginVertical: 10,
                    padding: 20,
                    display: 'flex',
                    width: 155
                }}
                    onPress={() => navigation.navigate('screens/ReportScreen')}
                >
                    <Text style={{ fontWeight: 800 }}>Weekly Carbs</Text>
                    <Text style={{ fontSize: 32 }}>{pastWeekData.map(meal => meal.CMNP.carbs).reduce((a, b) => a + b, 0)}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 15, marginHorizontal: 15 }}>
                <Text style={{ fontSize: 20, fontWeight: 800 }}>Last Meal Eaten</Text>

                {(pastWeekData.length === 0) ? <Text>No meals found! Please log some more :)</Text> :
                    <View>
                        <Image
                            source={pastWeekData[0].img.URI}
                            style={{
                                width: 350,
                                height: pastWeekData[0].img.height / (pastWeekData[0].img.width / 300),
                                marginTop: 10,
                                borderRadius: 10
                            }}
                            alt="The last Meal You Ate Image"
                        ></Image>
                    </View>
                }
            </View>
        </ScrollView>
    )
}

export default HomeScreen