import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import PieChart from 'react-native-pie-chart'
import { defaultColors } from "../styles/styles";
import { MealPayload } from '../context'
import { Table, Col, Cols, Row, Rows } from 'react-native-reanimated-table'
import { ScrollView } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const ReportScreen = () => {
    const screenWidth = Dimensions.get("window").width;
    // const data=[ {value:50}, {value:80}, {value:90}, {value:70} ]
    const [ data, setData ] = useState([])
    const [ tableData, setTableData ] = useState([])

    const payload = useContext(MealPayload)

    useEffect(() => {
        keys = Array.from(new Set(payload.map(meal => meal.title.slice(0,10)))) // TODO: terribly brittle...
        vals = keys.map(k => payload.map(meal => meal.title.includes(k) ? meal.CMNP.Calories : 0).reduce((a, b) => a + b, 0))
        
        setData(keys.map((k, i) => { return {label: k, value: vals[i]} }))
    }, [payload])

    useEffect(() => {
        td = payload.map(meal => ['', meal.title, meal.CMNP.Calories, meal.CMNP.Protein, meal.CMNP.Fat, meal.CMNP.Carbs])
        setTableData(td)
        console.log(tableData)
    }, [payload])

    let proteins = payload.map(meal => meal.CMNP.Protein).reduce((a, b) => a + b, 0)
    let carbs = payload.map(meal => meal.CMNP.Carbs).reduce((a, b) => a + b, 0)
    let fats = (payload.map(meal => meal.CMNP.Fat).reduce((a, b) => a + b, 0))

    // https://github.com/genexu/react-native-pie-chart/issues/21 - Customize
    const styles = {
        pieChartContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15,
        },
        
        pieFill: {
            position: 'absolute',
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
        },
        
        pieFillTextAmount: {
            fontSize: 18,
            lineHeight: 23,
        },
    }

    return (
        <ScrollView>
            <View style={{ margin: 20 }}>
                <Text style={{ ...defaultColors.black, fontSize: 28, fontWeight: 800 }}>Reports</Text>
                <View style={{ marginVertical: 15 }}>
                    <View style={{ borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, marginBottom: 8, alignItems: 'flex-end' }}>
                        <Text
                            style={{
                                color: defaultColors.black.color,
                                fontWeight: 800,
                                paddingVertical: 15,
                                borderBottomColor: defaultColors.black.color,
                                borderBottomWidth: 1
                            }}
                        >Macro Breakdown</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                        <View>
                            <Text style={{ alignSelf: 'center', marginTop: 15}}>7d Avg. Protein</Text>
                            <View style={styles.pieChartContainer}>
                                <PieChart
                                    widthAndHeight={100}
                                    series={[proteins, proteins + fats + carbs]}
                                    sliceColor={['#7fe1ad', defaultColors.lightGray.color]}
                                    coverRadius={0.85}
                                />
                                <View style={styles.pieFill}>
                                    <Text style={styles.pieFillTextAmount}>{Math.round(100*proteins/(proteins+fats+carbs))}%</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={{ alignSelf: 'center', marginTop: 15}}>7d Avg. Carbs</Text>
                            {/* TODO: add text % in center */}
                            <View style={styles.pieChartContainer}>
                                <PieChart
                                    widthAndHeight={100}
                                    series={[carbs, proteins + fats + carbs]}
                                    sliceColor={['red', defaultColors.lightGray.color]}
                                    coverRadius={0.85}
                                />
                                <View style={styles.pieFill}>
                                    <Text style={styles.pieFillTextAmount}>{Math.round(100*carbs/(proteins + fats + carbs))}%</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={{ alignSelf: 'center', marginTop: 15}}>7d Avg. Fat</Text>
                            {/* TODO: add text % in center */}

                            <View style={styles.pieChartContainer}>
                                <PieChart
                                    widthAndHeight={100}
                                    series={[fats, proteins + fats + carbs]}
                                    sliceColor={[defaultColors.blue.color, defaultColors.lightGray.color]}
                                    coverRadius={0.85}
                                />
                                <View style={styles.pieFill}>
                                    <Text style={styles.pieFillTextAmount}>{Math.round(100*fats / (proteins + fats + carbs))}%</Text>
                                </View>
                            </View>
                            <Text></Text>
                        </View>
                    </View>
                </View>

                <View style={{ marginVertical: 15 }}>
                    <View style={{ borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, marginBottom: 8, alignItems: 'flex-end' }}>
                        <Text
                            style={{
                                color: defaultColors.black.color,
                                fontWeight: 800,
                                paddingVertical: 15,
                                borderBottomColor: defaultColors.black.color,
                                borderBottomWidth: 1
                            }}
                        >Calories</Text>
                    </View>
                <BarChart
                    data={data}
                    width={screenWidth}
                />
                </View>

                <View style={{ marginVertical: 15 }}>
                    <View style={{ borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, marginBottom: 8, alignItems: 'flex-end' }}>
                        <Text
                            style={{
                                color: defaultColors.black.color,
                                fontWeight: 800,
                                paddingVertical: 15,
                                borderBottomColor: defaultColors.black.color,
                                borderBottomWidth: 1
                            }}
                        >Meals</Text>
                    </View>

                    <Table>
                        <Row data={['', 'Time', 'Cal', 'Protein', 'Fat', 'Carbs']} textStyle={null}></Row>
                        <Rows data={tableData}></Rows>
                    </Table>
                </View>
            </View>
        </ScrollView>
    )
}

export default ReportScreen