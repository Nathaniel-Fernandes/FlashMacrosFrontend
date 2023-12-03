import React, { memo, useContext } from "react"
import { Image } from 'expo-image'
import { FlatList, View, Text } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import { defaultColors } from "../styles/styles";
import { differenceInDays, parse } from 'date-fns'

// Helpers
const convertDate = (meal) => {
    return { ...meal, date: parse(meal['title'], 'MM/dd/yyyy p', new Date()) }
}

const sortMealsByDate = (mealObj1, mealObj2) => {
    const delta = mealObj2['date'] - mealObj1['date']
    return delta
}

const convertMealObjArr = (mealObjs) => Object.entries(mealObjs).map(x => { return { ...x[1], uuid: x[0] } }).map(convertDate).sort(sortMealsByDate)

const getMostRecentMeals = (mealArr, threshold) => {
    return mealArr.filter(x => differenceInDays(new Date(), x['date']) < threshold).sort(sortMealsByDate)
}

const Meal = (props) => {
    let CMNP = props.item.CMNP

    return (
        <View style={{ borderBottomColor: defaultColors.black.color, borderBottomWidth: 1, marginBottom: 18, paddingBottom: 18 }}>
            {
                (!props.deletingMeals) ? '' :
                    <Text
                        style={{
                            position: 'absolute',
                            right: 0,
                            zIndex: 1
                        }}
                        onPress={() => props.deleteMeal(props.item.uuid)}
                    >
                        <Ionicons name='close-outline' size={24} color={defaultColors.red.color}
                        />
                    </Text>
            }

            {
                (!props.editingMeals) ? '' :
                    <Text
                        style={{
                            position: 'absolute',
                            right: 0,
                            color: defaultColors.red.color,
                            zIndex: 1
                        }}
                        onPress={() => props.editMeal(props.item.uuid)}
                    >
                        Edit
                    </Text>
            }

            <Text style={{ ...defaultColors.black, fontSize: 16, fontWeight: 800 }}>{props.item.title}</Text>

            {props.item?.description?.length > 0 ?
                <Text style={{ marginTop: 10 }}>{props.item.description}</Text>
                : ''
            }

            {Object.keys(CMNP).length !== 0 ?
                <Text
                    style={{ ...defaultColors.blue, marginTop: 10 }}
                >{`Calories: ${CMNP.calories.mean} (±${CMNP.calories.CI}); Protein: ${CMNP.proteins.mean}g (±${CMNP.proteins.CI}); Fat: ${CMNP.fats.mean}g (±${CMNP.fats.CI}); Carbs: ${CMNP.carbs.mean}g (±${CMNP.carbs.CI})`}</Text>
                : ''
            }

            {props.item.tags.length > 0 ?
                <FlatList
                    style={{ flexDirection: "row", justifyContent: 'start', flexWrap: 'wrap', marginTop: 10 }}
                    data={props.item.tags.filter(tag => tag.length > 0)}
                    renderItem={({ item }) => <Text style={{ backgroundColor: defaultColors.lightGray.color, padding: 15, borderRadius: 20, overflow: 'hidden', marginRight: 7, marginBottom: 7 }}>{item}</Text>}
                /> : ''
            }

            {
                <Image
                    source={props.item.img.URI}
                    style={{
                        width: 300,
                        height: props.item.img.height / (props.item.img.width / 300),
                        marginTop: 10,
                        borderRadius: 10
                    }}
                    alt="Image for Meal"
                ></Image>
            }
        </View>
    )
}

export { Meal, convertDate, sortMealsByDate, convertMealObjArr, getMostRecentMeals }