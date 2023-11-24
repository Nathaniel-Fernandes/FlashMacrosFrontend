// 3rd party
import React, { useContext, useEffect, useState } from "react";
import { FlatList, View, Text } from "react-native";
import { Image } from 'expo-image'
import { parse } from "date-fns";

// local files
import { defaultColors } from "../../src/styles/styles";
import { MealContext } from "../../src/context";
import { TextInput } from "react-native-gesture-handler";

const Meal = (props) => {
    let CMNP = props.item.CMNP
    return (
        <View style={{ borderBottomColor: defaultColors.black.color, borderBottomWidth: 1, marginBottom: 18, paddingBottom: 18 }}>
            <Text style={{ ...defaultColors.black, fontSize: 16, fontWeight: 800 }}>{props.item.title}</Text>

            {props.item?.description?.length > 0 ?
                <Text style={{ marginTop: 10 }}>{props.item.description}</Text>
                : ''
            }

            {Object.keys(CMNP).length !== 0 ?
                <Text
                    style={{ ...defaultColors.blue, marginTop: 10 }}
                >{`Calories: ${CMNP.Calories}; Protein: ${CMNP.Protein}; Fat: ${CMNP.Fat}; Carbs: ${CMNP.Carbs}`}</Text>
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
                        height: props.item.img.height/(props.item.img.width/300),
                        marginTop: 10,
                    }}
                ></Image>
            }
        </View>
    )
}

const MealScreen = () => {
    const mealHelpers = useContext(MealContext)

    const [mealsToRender, setMealsToRender] = useState(mealHelpers.data)
    const [search, setSearch] = useState('')

    const sortMealsByDate = (mealObj1, mealObj2) => {
        const delta = parse(mealObj2['title'], 'MM/dd/yyyy p', new Date()) - parse(mealObj1['title'], 'MM/dd/yyyy p', new Date())
        return delta
    }

    useEffect(() => {
        let searchLower = search.toLowerCase()

        if (searchLower === '') {
            const sorted = [...mealHelpers.data].sort(sortMealsByDate)
            setMealsToRender(sorted)
        }
        else {
            let filtered = mealHelpers.data.filter((mealObj) => {
                if (mealObj['description'].toLowerCase().includes(searchLower)) {
                    return true
                }
                if (mealObj['title'].toLowerCase().includes(searchLower)) {
                    return true
                }
                if (mealObj['tags'].some((tag) => tag.toLowerCase().includes(searchLower))) {
                    return true
                }

                return false
            })

            // sort the meals by time
            filtered.sort(sortMealsByDate)

            setMealsToRender(filtered)
        }
    }, [search, mealHelpers.data])

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <View style={{ backgroundColor: '#FFF', height: '90%' }}>
                <TextInput
                    placeholder="Search"
                    style={{
                        backgroundColor: defaultColors.superLightGray.color,
                        padding: 10,
                        borderRadius: 10,
                        margin: 10,
                    }}
                    value={search}
                    onChangeText={setSearch}
                ></TextInput>
                <View style={{
                    padding: 10,
                    paddingTop: 0,
                }}>
                    <FlatList
                        data={mealsToRender}
                        renderItem={(item) => Meal(item)}
                    />
                </View>
            </View>
        </View>
    )
}

export default MealScreen