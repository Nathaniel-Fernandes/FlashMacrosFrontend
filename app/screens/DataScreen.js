import React, { useContext, useEffect, useState } from "react";
import { Text, View, Dimensions, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
import { differenceInDays, format, subDays } from "date-fns";
import { LineChart, BarChart } from "react-native-gifted-charts";

import { DexcomAuthContext } from "../../src/context";
import { defaultColors } from "../../src/styles/styles";

const DataScreen = () => {
    const dexcomAuthHelpers = useContext(DexcomAuthContext)

    const [isLoading, setIsLoading] = useState(true)
    const [egv, setEGV] = useState({})
    const [plottingData, setPlottingData] = useState([])

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => setIsLoading(false), 1000 * 5)
        }
    }, [isLoading])

    useEffect(() => {
        // Query the Dexcom API every 60 seconds for new data
        setInterval((async () => {
            console.log('hiiii there')
            if (!!dexcomAuthHelpers.accessToken) {
                console.log('the access token we are using', new Date(), dexcomAuthHelpers.accessToken)

                const query = new URLSearchParams({
                    startDate: format(subDays(new Date(), 10), "yyyy-MM-dd'T'hh:mm:ss"),
                    endDate: format(new Date(), "yyyy-MM-dd'T'hh:mm:ss")
                }).toString();

                fetch(`https://sandbox-api.dexcom.com/v3/users/self/egvs?${query}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${dexcomAuthHelpers.accessToken}`
                    }
                })
                    .then(async resp => {
                        const data = JSON.parse(await resp.text());
                        if (!!(data?.faultString)) {
                            throw new Error('Invalid access token. Please retry.')
                        }
                        else {
                            setIsLoading(true)
                            setEGV(data)
                        }
                    })
                    .catch(async (err) => {
                        // The Dexcom API guarantees data queries will always return 200 OK responses
                        // Thus, if an error is returned, it's likely b/c the access token is expired so try to refresh
                        console.log(err)
                        dexcomAuthHelpers.refreshAccessToken()
                    })
            }
        })(), 1000 * 30)
    }, [])

    useEffect(() => {
        console.log('updating plotting data')

        if (!!egv?.records) {
            const data = egv.records.map(x => {
                return {
                    value: x.value,
                    // label: JSON.stringify(x.displayTime) 
                }
            })
            setIsLoading(true)
            setPlottingData(data)
        }
    }, [Object.keys(egv).length])

    console.log('pdata: ', plottingData.length, plottingData.length === 0)

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            {
                (isLoading) ?
                    <Modal
                        isVisible={isLoading}
                        animationInTiming={0.1}
                        animationOutTiming={0.1}
                        backdropOpacity={0.5}
                    >
                        <ActivityIndicator
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            size="large"
                            color={defaultColors.red.color}
                        />
                    </Modal> : ''
            }

            <View>
                {
                    (plottingData.length === 0) ? '' :
                        <>
                            <LineChart
                                yAxisLabelWidth={38}
                                yAxisLabelContainerStyle={{
                                    marginRight: 5
                                }}
                                endSpacing={0}
                                data={plottingData}
                                width={Dimensions.get('screen').width * 0.78}
                                spacing={0.5}
                            />
                            <Text style={{ color: defaultColors.darkGray.color, textAlign: 'center', marginTop: -35 }}>Please swipe left/right on chart to see more data.</Text>
                        </>
                }
            </View>


            <Text>
                Upload your viome data
            </Text>
        </View>
    )
}

export default DataScreen