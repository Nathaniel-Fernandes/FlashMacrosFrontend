import React, { useContext } from "react";
import { FlatList, View, Text, Image, ImageBackground } from "react-native";

import { defaultColors } from "../styles/styles";
import { MealPayload } from "../context";

// TODO: add + button to header
// TODO: create modal for adding a new meal that has the following fields: title, description, Calories, Protein, Fat, Carbs, img
// TODO: use camera for modal
// TODO: save picture to local storage
const Meal = (props) => {
    console.log(typeof(props.item.img))
    let CMNP = props.item.CMNP
    console.log(CMNP)

    return (
        <View style={{ borderBottomColor: defaultColors.black.color, borderBottomWidth: 1, marginBottom: 20, paddingBottom: 10}}>
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
            (typeof(props.item.img) === typeof('')) ?
                <ImageBackground
                    src={props.item.img}
                    // source={props.item.img}
                    style={{
                        width: 200,
                        height: 150,
                        marginTop: 10
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
    const payload = useContext(MealPayload)

    return (
        // TODO: add calendar icon to header
        // TODO: add "add meal +" to top
        // TODO: make meal save locally to device

        <View style={{padding: 20}}>
            {/* TODO: add search bar that searches for food */}
            {/* TODO: add list rendering view to not hard-coded */}
            <FlatList
                data={payload}
                renderItem={(item) => Meal(item)}
            />

            <View></View>
            <View></View>
            <View></View>
        </View>
    )
}

export default MealScreen