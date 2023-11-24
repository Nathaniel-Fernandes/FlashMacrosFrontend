import React, { useContext, useEffect, useState } from "react";
import { FlatList, View, Text, Image, ImageBackground } from "react-native";

import { defaultColors } from "../../src/styles/styles";
import { MealContext } from "../../src/context";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { TextInput } from "react-native-gesture-handler";

// TODO: add + button to header
// TODO: create modal for adding a new meal that has the following fields: title, description, Calories, Protein, Fat, Carbs, img
// TODO: use camera for modal
// TODO: save picture to local storage
const Meal = (props) => {
    console.log(props.item.img, props.item.img == undefined)
    let CMNP = props.item.CMNP

    return (
        <View style={{ borderBottomColor: defaultColors.black.color, borderBottomWidth: 1, marginBottom: 10, paddingBottom: 10 }}>
            <Text style={{...defaultColors.black, fontSize: 16, fontWeight: 800}}>{props.item.title}</Text>
            
            {props.item?.description?.length > 0 ?
                <Text style={{marginVertical: 10}}>{props.item.description}</Text>
                : ''
            }
            
            {Object.keys(CMNP).length !== 0 ?
                <Text
                    style={{...defaultColors.blue, marginTop: 10}}
                >{`Calories: ${CMNP.Calories}; Protein: ${CMNP.Protein}; Fat: ${CMNP.Fat}; Carbs: ${CMNP.Carbs}`}</Text>                
                : ''
            }
        
            {props.item.tags.length > 0 ?
                <FlatList
                    style={{flexDirection: "row", justifyContent: 'space-between', marginVertical: 15}}
                    data={props.item.tags}
                    renderItem={({item}) => <Text style={{backgroundColor: defaultColors.lightGray.color, padding: 15, borderRadius: 20, overflow:'hidden'}}>{item}</Text>}
                /> : ''
            }

            {
            (props.item.img == '' || props.item.img == undefined) ? '' :
                typeof(props.item.img) === typeof('') ?
                    <ImageBackground
                        src={props.item.img}
                        style={{
                            width: 200,
                            height: 150,
                            marginTop: 10,
                            backgroundColor: 'blue'
                        }}
                    ></ImageBackground> : 
                    <Image
                        source={props.item.img}
                        style={{
                            width: 200,
                            height: 150,
                            marginTop: 10
                        }} 
                    />
            }
        </View>
    )
}

const MealScreen = () => {
    const mealHelpers = useContext(MealContext)

    console.log(mealHelpers.data)
    const [ mealsToRender, setMealsToRender ] = useState(mealHelpers.data)
    const [ search, setSearch ] = useState('')

    useEffect(() => {
        let searchLower = search.toLowerCase()

        if (searchLower === '') {
            setMealsToRender(mealHelpers.data)
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

            setMealsToRender(filtered)
        }
    }, [search])

    return (
        // TODO: add calendar icon to header
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
                    {/* TODO: add list rendering view to not hard-coded */}
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