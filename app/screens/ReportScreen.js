// 3rd party
import React, { useContext, useEffect, useState } from "react";
import { Text, View, Dimensions, ScrollView, StyleSheet } from "react-native";
import PieChart from 'react-native-pie-chart'
import { Table, Row, Rows } from 'react-native-reanimated-table'
import { LineChart, BarChart } from "react-native-gifted-charts";
import { Image } from 'expo-image'
import { differenceInDays, parse, eachDayOfInterval, format, isSameDay } from 'date-fns'

// local files
import { defaultColors } from "../../src/styles/styles";
import { MealContext } from "../../src/context"

const ReportScreen = () => {
    const mealHelpers = useContext(MealContext)

    // Helpers
    const convertDate = (meal) => {
        return { ...meal, date: parse(meal['title'], 'MM/dd/yyyy p', new Date()) }
    }

    const sortMealsByDate = (mealObj1, mealObj2) => {
        const delta = mealObj2['date'] - mealObj1['date']
        return delta
    }

    // Component State
    const [processedData, setProcessedData] = useState(Object.entries(mealHelpers.data).map(x => { return {...x[1], uuid: x[0]}}).map(convertDate))
    const [pastThirtyDayData, setPastThirtyDayData] = useState(Object.entries(mealHelpers.data).map(x => { return {...x[1], uuid: x[0]}}).map(convertDate))
    const [monthlyMacros, setMonthlyMacros] = useState({ proteins: 1, fats: 1, carbs: 1 })
    const [chartData, setChartData] = useState([])
    const [tableData, setTableData] = useState([])

    // Data Updaters
    useEffect(() => {
        setProcessedData(Object.entries(mealHelpers.data).map(x => { return {...x[1], uuid: x[0]}}).map(convertDate).sort(sortMealsByDate))
    }, [mealHelpers.data])

    useEffect(() => {
        setPastThirtyDayData(processedData.filter(x => differenceInDays(new Date(), x['date']) < 30).sort(sortMealsByDate))
    }, [processedData])

    useEffect(() => {
        setMonthlyMacros({
            proteins: pastThirtyDayData.map(meal => meal.CMNP.proteins).reduce((a, b) => a + b, 0),
            fats: pastThirtyDayData.map(meal => meal.CMNP.fats).reduce((a, b) => a + b, 0),
            carbs: pastThirtyDayData.map(meal => meal.CMNP.carbs).reduce((a, b) => a + b, 0)
        })
    }, [pastThirtyDayData])

    useEffect(() => {
        if (processedData.length == 0) {
            setChartData([])
        }
        
        else {
            const sorted = processedData.sort(sortMealsByDate)

            interval = {
                end: sorted[0].date,
                start: sorted.slice(-1)[0].date // last in `sorted` is first chronologically b/c storing in reverse sorted order
            }

            // Assumption: processedData is sorted
            keys = eachDayOfInterval(interval)
            vals = keys.map(day => sorted.map(meal => isSameDay(meal.date, day) ? meal.CMNP.calories : 0).reduce((a, b) => a + b, 0))

            setChartData(keys.map((key, idx) => { return { label: format(key, 'MM/dd'), value: vals[idx]}}))
        }
    }, [processedData])

    useEffect(() => {
        td = processedData.map(meal => [meal.title,
        <Image
            source={meal.img.URI}
            style={{
                width: 50,
                height: meal.img.height / (meal.img.width / 50),
                alignSelf: 'center'
            }}
        ></Image>, meal.CMNP.calories, meal.CMNP.proteins, meal.CMNP.fats, meal.CMNP.carbs])
        setTableData(td)
    }, [processedData])

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
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginBottom: 20 }}>
                        <View>
                            <Text style={{ alignSelf: 'center', marginTop: 15 }}>30d Avg. Protein</Text>
                            <View style={styles.pieChartContainer}>
                                <PieChart
                                    widthAndHeight={100}
                                    series={[monthlyMacros.proteins, monthlyMacros.proteins + monthlyMacros.fats + monthlyMacros.carbs + 1]}
                                    sliceColor={['#7fe1ad', defaultColors.lightGray.color]}
                                    coverRadius={0.85}
                                />
                                <View style={styles.pieFill}>
                                    <Text style={styles.pieFillTextAmount}>{Math.round(100 * monthlyMacros.proteins / (monthlyMacros.proteins + monthlyMacros.fats + monthlyMacros.carbs))}%</Text>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={{ alignSelf: 'center', marginTop: 15 }}>30d Avg. Carbs</Text>
                            <View style={styles.pieChartContainer}>
                                <PieChart
                                    widthAndHeight={100}
                                    series={[monthlyMacros.carbs, monthlyMacros.proteins + monthlyMacros.fats + monthlyMacros.carbs + 1]}
                                    sliceColor={['red', defaultColors.lightGray.color]}
                                    coverRadius={0.85}
                                />
                                <View style={styles.pieFill}>
                                    <Text style={styles.pieFillTextAmount}>{Math.round(100 * monthlyMacros.carbs / (monthlyMacros.proteins + monthlyMacros.fats + monthlyMacros.carbs))}%</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={{ alignSelf: 'center', marginTop: 15 }}>30d Avg. Fat</Text>
                            <View style={styles.pieChartContainer}>
                                <PieChart
                                    widthAndHeight={100}
                                    series={[monthlyMacros.fats, monthlyMacros.proteins + monthlyMacros.fats + monthlyMacros.carbs + 1]}
                                    sliceColor={[defaultColors.blue.color, defaultColors.lightGray.color]}
                                    coverRadius={0.85}
                                />
                                <View style={styles.pieFill}>
                                    <Text style={styles.pieFillTextAmount}>{Math.round(100 * monthlyMacros.fats / (monthlyMacros.proteins + monthlyMacros.fats + monthlyMacros.carbs))}%</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {
                        (pastThirtyDayData.length === 0) ?
                            <Text style={{ color: defaultColors.red.color }}>No meals recorded in last 30 days. Please add some.</Text> : ''
                    }
                </View>

                <View style={{ marginBottom: 20}}>
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
                        yAxisLabelWidth={38}
                        yAxisLabelContainerStyle={{
                            marginRight: 5
                        }}
                        endSpacing={0}
                        data={chartData}
                        width={Dimensions.get('screen').width*0.78}
                    />
                    <Text style={{ color: defaultColors.darkGray.color, textAlign: 'center', marginTop: -35 }}>Please swipe left on chart to see more days of data.</Text>
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