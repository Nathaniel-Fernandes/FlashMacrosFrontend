import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { Text, View, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { differenceInDays, format, parse, subDays } from "date-fns";
import { LineChart, BarChart } from "react-native-gifted-charts";
import * as DocumentPicker from 'expo-document-picker';
// import { Table, Row, Rows } from 'react-native-reanimated-table'

// import csv from 'csvtojson'

import { DexcomAuthContext } from "../../src/context";
import { defaultColors } from "../../src/styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router/src/useFocusEffect";
import { readAsStringAsync } from "expo-file-system";
import { FlatList } from "react-native-gesture-handler";

// Custom hook to fix issues w/ setInterval not remembering state: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const Row = (props) => {
    return (
        <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', flexGrow: 1, textAlign: 'center', marginBottom: props.index === 0 ? 10 : 30 }}>
            <Text style={{ width: '33%', textAlign: 'center', fontWeight: props.index == 0 ? 800 : 400 }}>{props.data[0]}</Text>
            <Text style={{ width: '33%', textAlign: 'center', fontWeight: props.index == 0 ? 800 : 400 }}>{props.data[1]}</Text>
            <Text style={{ width: '33%', textAlign: 'center', fontWeight: props.index == 0 ? 800 : 400 }}>{props.data[2]}</Text>
        </View>
    )
}

const DataScreen = () => {
    const dexcomAuthHelpers = useContext(DexcomAuthContext)

    const [isLoading, setIsLoading] = useState(false)
    const [egv, setEGV] = useState({})
    const [plottingData, setPlottingData] = useState([])
    const [showLineChart, setShowLineChart] = useState(false)
    const [showTable, setShowTable] = useState(false)

    useFocusEffect(useCallback(() => {
        setShowLineChart(true)
        setShowTable(true)

        return () => {
            setShowLineChart(false)
            setShowTable(false)
        }
    }, [plottingData]))

    const [document, setDocument] = useState({})
    const [viomeData, setViomeData] = useState([])
    const [viomeFileError, setViomeFileError] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            AsyncStorage.getItem('ViomeData')
                .then(data => setViomeData(JSON.parse(data)))
                .catch(err => console.log(err))

            AsyncStorage.getItem('ViomeFileData')
                .then(doc => setDocument(JSON.parse(doc)))
                .catch(err => console.log(err))
        }

        fetchData()
            .catch(err => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        AsyncStorage.setItem('ViomeData', JSON.stringify(viomeData))
    }, [viomeData])

    useEffect(() => {
        AsyncStorage.setItem('ViomeFileData', JSON.stringify(document))
    }, [document])

    const getDocument = async () => {
        DocumentPicker.getDocumentAsync()
            .then(async doc => {
                if (doc.canceled === false) {
                    setDocument(doc)
                    // console.log(doc)
                    if (doc.assets.length >= 1 && doc.assets[0].mimeType.includes('csv')) {
                        let data = await readAsStringAsync(doc.assets[0].uri)

                        let parsed = data.split('\n').map(row => row.split(','))
                        setViomeData(parsed)
                        setViomeFileError(false)
                    }
                    else {
                        setViomeFileError('not-a-csv')
                    }
                }
            })
            .catch(err => {
                console.log('doc error:', err)
                setViomeFileError('file-not-loaded')
            })
    }

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => setIsLoading(false), 1000 * 4)
        }
    }, [isLoading])

    useEffect(() => {
        queryData()
    }, [])

    // Query the Dexcom API every 60 seconds for new data
    useInterval(async () => {
        await queryData()
    }, 1000 * 60)

    useEffect(() => {
        // console.log('this query')
        queryData()
    }, [dexcomAuthHelpers.accessToken])

    useEffect(() => {
        // console.log('updating plotting data')

        if (!!egv?.records) {
            const data = egv.records.map((x, i) => {
                // console.log('hi', i, x)
                // console.log('time: ', x.displayTime, 'wat', parse(x.displayTime, "yyyy-MM-dd'T'HH:mm:ss", new Date()))

                if ((i % 5) == 0) {
                    return {
                        value: x.value,
                        label: format(parse(x.displayTime, "yyyy-MM-dd'T'HH:mm:ss", new Date()), 'MM/dd HH:mm'),
                        labelTextStyle: {
                            position: 'absolute',
                            display: 'flex',
                            flex: 1
                        }
                    }
                }
                return {
                    value: x.value,
                    labelTextStyle: {
                        display: 'none'
                    }
                }
            })

            setPlottingData([...data].reverse())
        }
    }, [egv])

    const queryData = async () => {
        // console.log('hiiii there')
        if (!!dexcomAuthHelpers.accessToken) {
            console.log('the access token we are using', new Date(), dexcomAuthHelpers.accessToken)

            const query = new URLSearchParams({
                startDate: format(subDays(new Date(), 6), "yyyy-MM-dd'T'hh:mm:ss"),
                endDate: format(subDays(new Date(), 4), "yyyy-MM-dd'T'hh:mm:ss")
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
                        // console.log('plot data len: ', plottingData.length)
                        if (plottingData.length < 10) {
                            // console.log('i am running')
                            setIsLoading(true)
                        }
                        // console.log('data: ', data)
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
    }

    return (
        <View style={{ backgroundColor: '#FFF', height: '100%' }}>
            <View style={{
                marginVertical: 15,
                marginHorizontal: 10
            }}>
                <Text style={{ color: defaultColors.black.color, fontWeight: 800, paddingBottom: 10, textAlign: 'center' }}>Continuous Glucose Monitoring Data</Text>

                {
                    (!showLineChart || plottingData.length < 5) ? '' :
                        <>
                            <Text>Blood Glucose (mg/dL)</Text>
                            <LineChart
                                yAxisLabelWidth={38}
                                yAxisLabelContainerStyle={{
                                    marginRight: 5
                                }}
                                endSpacing={15}
                                data={plottingData}
                                width={Dimensions.get('screen').width * 0.78}
                                spacing={40}
                                xAxisTextNumberOfLines={100}
                                textShiftX={-10}
                            />
                            <Text style={{ color: defaultColors.darkGray.color, textAlign: 'center', marginTop: -25 }}>Please swipe left/right on chart to see more data.</Text>
                        </>
                }

                {
                    (!!!dexcomAuthHelpers.accessToken || !!!dexcomAuthHelpers.authCode) ?
                        <Text style={{ color: defaultColors.red.color, marginTop: 10, fontSize: 18 }}>Please sign in to your Dexcom Account on the Profile page.</Text> : ''
                }
            </View>

            <View style={{ marginVertical: 20, marginHorizontal: 10, borderBottomColor: defaultColors.darkGray.color, paddingBottom: 8 }}>
                <Text style={{ color: defaultColors.black.color, fontWeight: 800, paddingBottom: 10, textAlign: 'center' }}>Viome Gut Microbiome Data</Text>

                {
                    (viomeData.length === 0) ?
                        <TouchableOpacity
                            style={{
                                backgroundColor: 'rgba(22,118,241,255)',
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: 'rgba(22,118,241,255)'
                            }}
                            onPress={getDocument}
                        >
                            <Text style={{ color: defaultColors.white.color, fontWeight: '800' }}>
                                Load Viome Data
                            </Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#dc3545',
                                padding: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10,
                                borderWidth: 2,
                                borderColor: '#dc3545'
                            }}
                            onPress={() => { setDocument({}), setViomeData([]) }}
                        >
                            <Text style={{ color: defaultColors.white.color, fontWeight: '800' }}>
                                Delete Viome Data
                            </Text>
                        </TouchableOpacity>
                }
                {
                    (viomeFileError === 'not-a-csv') ?
                        <Text style={{ color: defaultColors.red.color, marginTop: 10, fontSize: 18 }}>The file does not seem to be a csv file. Please try again :)</Text> : ''
                }
                {
                    (viomeFileError === 'file-not-loaded' && viomeData.length !== 0) ?
                        <Text style={{ color: defaultColors.red.color, marginTop: 10, fontSize: 18 }}>Could not load file. Please try again. Sorry :)</Text> : ''
                }
                {
                    !(viomeFileError === false && viomeData.length > 0) ? '' :
                        <View style={{ marginVertical: 30 }}>
                            {
                                (!showTable || viomeData.length === 0) ? '' :
                                    <FlatList
                                        data={viomeData}
                                        renderItem={({ item, index }) => <Row data={item} index={index} />}
                                        removeClippedSubviews={true}

                                    >
                                    </FlatList>
                            }

                        </View>
                }
            </View>

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
                            animating={isLoading}
                        />
                    </Modal> : ''
            }
        </View>
    )
}

export default DataScreen