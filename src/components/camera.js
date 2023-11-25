import React, { useEffect, useState, useRef } from 'react'
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native'
import { Camera, NoCameraDeviceError, useCameraDevice } from 'react-native-vision-camera'
import { defaultColors } from '../styles/styles'

const CameraComponent = (props) => {
    // 1. Set up variables needed to use the camera
    const device = useCameraDevice('back')
    const camera = useRef(null);

    const [error, setError] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [imgTempURI, setImgTempURI] = useState('');

    // 2. Get user's permission to use the Camera + Media Library
    const [cameraPermission, setCameraPermission] = useState(null)
    
    // Ask for permissions 1x on component start up
    useEffect(() => {
        (async () => {
            setCameraPermission(await Camera.getCameraPermissionStatus())
        })()
    }, [])

    // Every time the `cameraPermission` changes, retest to see if we have access to use the camera
    useEffect(() => {
        const handlePermissionChange = async () => {
            if (cameraPermission != null) {
                if (cameraPermission === 'granted') {
                    setShowCamera(true)
                }
                else if (cameraPermission === 'not-determined') {
                    setCameraPermission(await Camera.requestCameraPermission())
                }
                else if (cameraPermission === 'denied') {
                    // TODO: handle errors higher up, potentially with permissions context
                    setError(true)
                    Alert.alert("Access to camera denied... :(", cameraPermission)
                }
                else if (cameraPermission === 'restricted') {
                    setError(true)
                    Alert.alert("Access to camera denied... :(", cameraPermission)
                }
                else {
                    console.log('error: API might have changed', cameraPermission)
                }
            }
        }

        handlePermissionChange()
    }, [cameraPermission])

    // 3. helper functions to take the photo & send results to parent component (i.e., AddMeals component)
    const capturePhoto = async () => {
        if (camera.current !== null) {
            const photo = await camera.current.takePhoto({
                enableShutterSound: false
            });
            setImgTempURI(photo.path);
            setShowCamera(false);
        }
    };

    // The parent AddMeals component sends 2 f(x) via props, that allow this component (the child) to mutate state in the parent's scope
    const savePhoto = () => {
        props.setImgTempURI(imgTempURI)
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
                            enableZoomGesture={true}
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
                        {imgTempURI !== '' ? (
                            <Image
                                style={styles.image}
                                source={{
                                    uri: `file://'${imgTempURI}`,
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

export default CameraComponent