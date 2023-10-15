import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import PieChart from 'react-native-pie-chart'
import { defaultColors } from "../styles/styles";
import { MealPayload } from '../context'
import { Table, Col, Cols, Row } from 'react-native-table-component'

const ReportScreen = () => {
    const payload = useContext(MealPayload)
    let proteins = payload.map(meal => meal.CMNP.Protein).reduce((a, b) => a + b, 0)
    let carbs = payload.map(meal => meal.CMNP.Carbs).reduce((a, b) => a + b, 0)
    let fats = (payload.map(meal => meal.CMNP.Fat).reduce((a, b) => a + b, 0))
    
    console.log(proteins, carbs, fats)
    // const [ proteins, setProteins ] = useState(1)
    // const [ carbs, setCarbs ] = useState(1)
    // const [ fats, setFats ] = useState(1)

    // useEffect(() => {
    //     setProteins(payload.map(meal => meal.CMNP.Protein).reduce((a, b) => a + b, 0))
    //     setCarbs(payload.map(meal => meal.CMNP.Carbs).reduce((a, b) => a + b, 0))
    //     setFats(payload.map(meal => meal.CMNP.Fat).reduce((a, b) => a + b, 0))

    //     console.log(proteins, carbs, fats)
    // }, [payload])

    // console.log(payload)

    // https://github.com/genexu/react-native-pie-chart/issues/21 - Customize
    const styles = {
        pieChartContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 25,
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
                        <Text>7d Avg. Protein</Text>
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
                        <Text>7d Avg. Carbs</Text>
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
                        <Text>7d Avg. Fat</Text>
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
                {/* Bar chart */}
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
                </Table>
            </View>
        </View>
    )
}

export default ReportScreen