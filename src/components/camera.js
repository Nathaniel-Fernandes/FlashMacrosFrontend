import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, useWindowDimensions } from 'react-native'
import { Camera, CameraType } from "expo-camera"


const CameraComponent = () => {
    const [cameraPermission, setCameraPermission] = useState(null)
    const [startCamera, setStartCamera] = useState(false)

    const [type, setType] = useState(CameraType.back)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)

    // get the permissions
    useEffect(() => {
        const getPermissions = async () => {
            setCameraPermission(await Camera.getCameraPermissionStatus())
        }

        getPermissions()
    }, [])

    useEffect(() => {
        const handlePermissionChange = async () => {
            if (cameraPermission === 'granted') {

            }
            else if (cameraPermission === 'not-determined') {
                setCameraPermission(await Camera.requestCameraPermission())
            }
            else if (cameraPermission === 'denied') {
    
            }
            else if (cameraPermission === 'restricted') {
    
            }
            else {
    
            }
        }

        handlePermissionChange()
    }, [cameraPermission])

    useEffect(() => {
        async () => {
            const cameraPermission = await Camera.getCameraPermissionStatus()

        
            const { status } = await Camera.requestCameraPermissionsAsync()

            console.log('status is true: ', status)

            if (status === 'granted') {
                console.log('status is true: ', status)
                setStartCamera(true)
            }
            else {
                Alert.alert("Access to camera denied... :(")
            }
        }
    }, [])

    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
    }

    const takePhoto = async () => {
        const photo = await camera.takePictureAsync()

        setPreviewVisible(true)
        setCapturedImage(photo)
        setStartCamera(false)
    }

    const retakePhoto = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        startCamera()
    }

    const savePhoto = async () => {
        // TODO: use file system to permanently save
    }

    {/* https://www.freecodecamp.org/news/how-to-create-a-camera-app-with-expo-and-react-native/ */ }
    return (
        <View>
            {
                startCamera ? <View
                style = { { backgroundColor: 'blue', height: '100%' }}
                >
                    <Camera
                        // ratio='16:9'
                        style={{ 
                            height: '100%'
                            // width: '100%'
                        }}
                        zoom={0}
                        type={type}
                        ref={(r) => { camera = r }}
                    >
                        {/* <View style={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}>
                            <TouchableOpacity onPress={takePhoto}
                                style={{ width: 70, height: 70, bottom: 0, borderRadius: 50, backgroundColor: '#fff' }}
                            />
                        </View> */}
                    </Camera>
                </View> : ''
            }
            {/* {
                (previewVisible && capturedImage && capturedImage.uri) ?
                    <View>
                        <ImageBackground
                            style={{ height: 300 }}
                            src={capturedImage && capturedImage.uri}
                        />
                    </View>
                    : ''
            } */}
        </View>
    )
}

export default CameraComponent