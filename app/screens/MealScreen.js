// 3rd party
import React, { useContext, useEffect, useState, memo } from "react";
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { parse } from "date-fns";

// local files
import { defaultColors } from "../../src/styles/styles";
import { MealContext } from "../../src/context";
import { TextInput } from "react-native-gesture-handler";
import Meal from "../../src/components/meal";

const MealScreen = () => {
    const mealHelpers = useContext(MealContext)

    const [mealsToRender, setMealsToRender] = useState([])
    const [search, setSearch] = useState('')

    const sortMealsByDate = (mealObj1, mealObj2) => {
        const delta = parse(mealObj2['title'], 'MM/dd/yyyy p', new Date()) - parse(mealObj1['title'], 'MM/dd/yyyy p', new Date())
        return delta
    }

    console.log(mealsToRender)

    useEffect(() => {
        if (Object.keys(mealHelpers.data).length == 0) {
            mealHelpers.setDeletingMeals(false)
        }
    }, [mealHelpers.data])

    useEffect(() => {
        let searchLower = search.toLowerCase()

        if (searchLower === '') {
            const sorted = Object.entries(mealHelpers.data).map(x => { return {...x[1], uuid: x[0]}}).sort(sortMealsByDate)
            setMealsToRender(sorted)
        }
        else {
            let filtered = Object.entries(mealHelpers.data).map(x => { return {...x[1], uuid: x[0]}}).filter((mealObj) => {
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
                    display: 'flex'
                }}>
                    <FlatList
                        data={mealsToRender}
                        renderItem={(props) => Meal({ 
                            ...props,
                            deletingMeals: mealHelpers.deletingMeals,
                            deleteMeal: mealHelpers.deleteMeal,
                            editingMeals: mealHelpers.editingMeals,
                            editMeal: mealHelpers.editMeals
                        })}
                        keyExtractor={item => item.uuid}
                    />
                </View>
            </View>

            {
                (!mealHelpers.deletingMeals) ? '' :
                <View style={styles.buttonContainer}>
                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: defaultColors.darkGray.color,
                        }}
                        onPress={() => mealHelpers.setDeletingMeals(false)}
                    >
                        <Text style={{ color: defaultColors.darkGray.color, fontWeight: '500' }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            padding: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: defaultColors.red.color,
                        }}
                        // onPress={savePhoto}
                    >

                        <Text style={{ color: defaultColors.red.color, fontWeight: '500' }}>
                            Use Photo
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'gray',
    },
    backButton: {
        backgroundColor: 'rgba(0,0,0,0.0)',
        position: 'absolute',
        justifyContent: 'center',
        width: '100%',
        top: 0,
        padding: 20,
    },
    buttonContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        bottom: 0,
        padding: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    camButton: {
        height: 80,
        width: 80,
        borderRadius: 40,
        backgroundColor: '#B2BEB5',

        alignSelf: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },

});

export default MealScreen