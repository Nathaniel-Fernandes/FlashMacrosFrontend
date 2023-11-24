// 3rd party
import React, { useContext, useEffect, useState } from "react";
import { Text, View, Dimensions, ScrollView, StyleSheet } from "react-native";
import PieChart from 'react-native-pie-chart'
import { Table, Row, Rows } from 'react-native-reanimated-table'
import { BarChart } from "react-native-gifted-charts";
import { Image } from 'expo-image'

// local files
import { defaultColors } from "../../src/styles/styles";
import { MealContext } from "../../src/context"

const ReportScreen = () => {
    const mealHelpers = useContext(MealContext)

    let proteins = mealHelpers.data.map(meal => meal.CMNP.Protein).reduce((a, b) => a + b, 0)
    let carbs = mealHelpers.data.map(meal => meal.CMNP.Carbs).reduce((a, b) => a + b, 0)
    let fats = (mealHelpers.data.map(meal => meal.CMNP.Fat).reduce((a, b) => a + b, 0))

    const [barChartData, setBarChartData] = useState([])
    const [tableData, setTableData] = useState([])


    useEffect(() => {
        keys = Array.from(new Set(mealHelpers.data.map(meal => meal.title.slice(0, 10))))
        vals = keys.map(k => mealHelpers.data.map(meal => meal.title.includes(k) ? meal.CMNP.Calories : 0).reduce((a, b) => a + b, 0))

        setBarChartData(keys.map((k, i) => { return { label: k, value: vals[i] } }))
    }, [mealHelpers.data])

    useEffect(() => {
        td = mealHelpers.data.map(meal => [meal.title,
        <Image
            source={meal.img.URI}
            style={{
                width: 50,
                height: meal.img.height / (meal.img.width / 50),
                alignSelf: 'center'
            }}
        ></Image>, meal.CMNP.Calories, meal.CMNP.Protein, meal.CMNP.Fat, meal.CMNP.Carbs])
        setTableData(td)
    }, [mealHelpers.data])



    return (
        <ScrollView style={{ backgroundColor: '#fff' }}>
            <View style={{ margin: 20 }}>
                <Text style={{ ...defaultColors.black, fontSize: 28, fontWeight: 800 }}>Reports</Text>
                <View style={{ marginBottom: 15 }}>
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
                            <Text style={{ alignSelf: 'center', marginTop: 15 }}>7d Avg. Protein</Text>
                            <View style={styles.pieChartContainer}>
                                <PieChart
                                    widthAndHeight={100}
                                    series={[proteins, proteins + fats + carbs]}
                                    sliceColor={['#7fe1ad', defaultColors.lightGray.color]}
                                    coverRadius={0.85}
                                />
                                <View style={styles.pieFill}>
                                    <Text style={styles.pieFillTextAmount}>{Math.round(100 * proteins / (proteins + fats + carbs))}%</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={{ alignSelf: 'center', marginTop: 15 }}>7d Avg. Carbs</Text>
                            <View style={styles.pieChartContainer}>
                                <PieChart
                                    widthAndHeight={100}
                                    series={[carbs, proteins + fats + carbs]}
                                    sliceColor={['red', defaultColors.lightGray.color]}
                                    coverRadius={0.85}
                                />
                                <View style={styles.pieFill}>
                                    <Text style={styles.pieFillTextAmount}>{Math.round(100 * carbs / (proteins + fats + carbs))}%</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={{ alignSelf: 'center', marginTop: 15 }}>7d Avg. Fat</Text>
                            <View style={styles.pieChartContainer}>
                                <PieChart
                                    widthAndHeight={100}
                                    series={[fats, proteins + fats + carbs]}
                                    sliceColor={[defaultColors.blue.color, defaultColors.lightGray.color]}
                                    coverRadius={0.85}
                                />
                                <View style={styles.pieFill}>
                                    <Text style={styles.pieFillTextAmount}>{Math.round(100 * fats / (proteins + fats + carbs))}%</Text>
                                </View>
                            </View>
                            <Text></Text>
                        </View>
                    </View>
                </View>

                <View>
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
                        data={barChartData}
                        width={Dimensions.get('screen').width}
                    />
                </View>

                <View style={{ marginBottom: 15 }}>
                    <View style={{ borderBottomColor: defaultColors.darkGray.color, borderBottomWidth: 1, marginBottom: 8, alignItems: 'flex-end' }}>
                        <Text
                            style={{
                                color: defaultColors.black.color,
                                fontWeight: 800,
                                paddingBottom: 15,
                                borderBottomColor: defaultColors.black.color,
                                borderBottomWidth: 1
                            }}
                        >Meals</Text>
                    </View>

                    <Table>
                        <Row data={['Time', 'Picture', 'Cal', 'Protein', 'Fat', 'Carbs']} flexArr={[1.5, 1.5, 1, 1, 1, 1]} textStyle={{ textAlign: 'center', fontWeight: 700 }} style={{ marginBottom: 10 }}></Row>
                        <Rows data={tableData} textStyle={{ textAlign: 'center' }} flexArr={[1.5, 1.5, 1, 1, 1, 1]} style={{ marginBottom: 10 }}></Rows>
                    </Table>
                </View>
            </View>
        </ScrollView>
    )
}

// Pie Chart styling adapted from: https://github.com/genexu/react-native-pie-chart/issues/21
const styles = StyleSheet.create(
    {
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
    })

export default ReportScreen