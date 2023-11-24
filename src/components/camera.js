import React, { useEffect, useState, useRef } from 'react'
import { View, TouchableOpacity, useWindowDimensions, StyleSheet, Text, Image } from 'react-native'
import { Camera, NoCameraDeviceError, useCameraDevice } from 'react-native-vision-camera'
import { defaultColors } from '../styles/styles'

const CameraComponent = (props) => {
    console.log(props)
    const [cameraPermission, setCameraPermission] = useState(null)
    const [showCamera, setShowCamera] = useState(false)
    const [error, setError] = useState(false)

    // const [type, setType] = useState(CameraType.back)
    const [imageSource, setImageSource] = useState('');

    // get the permissions - runs one time on start up
    useEffect(() => {
        const getPermissions = async () => {
            setCameraPermission(await Camera.getCameraPermissionStatus())
        }

        getPermissions()
    }, [])

    useEffect(() => {
        const handlePermissionChange = async () => {
            if (cameraPermission === 'granted') {
                setShowCamera(true)
            }
            else if (cameraPermission === 'not-determined') {
                setCameraPermission(await Camera.requestCameraPermission())
            }
            else if (cameraPermission === 'denied') {
                setError(true) // TODO: handle these higher up
                Alert.alert("Access to camera denied... :(")
            }
            else if (cameraPermission === 'restricted') {
                setError(true)
                Alert.alert("Access to camera denied... :(")
            }
            else {
                console.log('error: API might have changed')
            }
        }

        handlePermissionChange()
    }, [cameraPermission])

    const device = useCameraDevice('back')
    const camera = useRef(null);

    const capturePhoto = async () => {
        if (camera.current !== null) {
            const photo = await camera.current.takePhoto({});
            console.log(photo)
            setImageSource(photo.path);
            setShowCamera(false);
            console.log(photo.path);
        }
    };

    const savePhoto = () => {
        props.setImgFilePath(imageSource)
        props.setOpenCamera(false)
    }

    // Html/CSS Styling adapted from: https://stackoverflow.com/a/77386507
    return (
        (device == null) ?
            <NoCameraDeviceError /> :
            <View style={styles.container}>
                {showCamera ? (
                    <>
                        <Camera
                            ref={camera}
                            style={StyleSheet.absoluteFill}
                            device={device}
                            isActive={showCamera}
                            photo={true}
                        />

                        <View style={styles.backButton}>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    padding: 10,
                                    marginTop: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: '#fff',
                                    width: 120,
                                    zIndex: 100
                                }}
                                onPress={() => props.setOpenCamera(false)}>
                                <Text style={{ color: 'white', fontWeight: '500' }}>Cancel Photo</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.camButton}
                                onPress={() => capturePhoto()}
                            />
                        </View>
                    </>
                ) : (
                    <>
                        {imageSource !== '' ? (
                            <Image
                                style={styles.image}
                                source={{
                                    uri: `file://'${imageSource}`,
                                }}
                            />
                        ) : null}

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
                                        borderColor: defaultColors.red.color,
                                    }}
                                    onPress={() => setShowCamera(true)}>
                                    <Text style={{ color: defaultColors.red.color, fontWeight: '500' }}>
                                        Retake
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
                                    onPress={savePhoto}>
                                    {/* onPress={() => savePhoto().then(props.setOpenCamera(false))}> */}

                                    <Text style={{ color: defaultColors.red.color, fontWeight: '500' }}>
                                        Use Photo
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )}
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
        //ADD backgroundColor COLOR GREY
        backgroundColor: '#B2BEB5',

        alignSelf: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 9 / 16,
    },
});

// const toggleCameraType = () => {
//     setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
// }

// const takePhoto = async () => {
//     const photo = await camera.takePictureAsync()

//     setPreviewVisible(true)
//     setCapturedImage(photo)
//     setStartCamera(false)
// }

// const retakePhoto = () => {
//     setCapturedImage(null)
//     setPreviewVisible(false)
//     startCamera()
// }

// const savePhoto = async () => {
//     // TODO: use file system to permanently save
// }

// {/* https://www.freecodecamp.org/news/how-to-create-a-camera-app-with-expo-and-react-native/ */ }
// return (
//     <View>
//         {
//             startCamera ? <View
//                 style={{ backgroundColor: 'blue', height: '100%' }}
//             >
//                 <Camera
//                     // ratio='16:9'
//                     style={{
//                         height: '100%'
//                         // width: '100%'
//                     }}
//                     zoom={0}
//                     type={type}
//                     ref={(r) => { camera = r }}
//                 >
//                     {/* <View style={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}>
//                             <TouchableOpacity onPress={takePhoto}
//                                 style={{ width: 70, height: 70, bottom: 0, borderRadius: 50, backgroundColor: '#fff' }}
//                             />
//                         </View> */}
//                 </Camera>
//             </View> : ''
//         }
//         {/* {
//                 (previewVisible && capturedImage && capturedImage.uri) ?
//                     <View>
//                         <ImageBackground
//                             style={{ height: 300 }}
//                             src={capturedImage && capturedImage.uri}
//                         />
//                     </View>
//                     : ''
//             } */}
//     </View>
// )
// }

export default CameraComponent