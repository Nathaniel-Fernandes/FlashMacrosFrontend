import 'react-native-gesture-handler'; // must be at top - don't put anything above this

import React, { useState } from 'react';
import { StyleSheet, Text, Modal, View, TextInput, Button, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { defaultColors } from './src/styles/styles';
import { Camera, CameraType } from "expo-camera"
import { MealPayload } from './src/context';
import { format } from 'date-fns'

import DataScreen from './src/screens/DataScreen'
import HomeScreen from './src/screens/HomeScreen'
import MealScreen from './src/screens/MealScreen'
import ReportScreen from './src/screens/ReportScreen'
import SignInScreen from './src/screens/SignInScreen'
import SignUpScreen from './src/screens/SignUpScreen'

const Drawer = createDrawerNavigator()

// TODO: can't assume payload comes in sorted order

// const CameraPreview = ({ photo }) => {
//   return (
//     <View
//       style={{
//         backgroundColor: 'transparent',
//         flex: 1,
//         width: '100%',
//         height: '100%'
//       }}
//     >

//       <ImageBackground
//         source={{uri: photo && photo.uri}}
//         style={{ flex: 1}} />
//     </View>
//   )
// }

export default function App() {
  const [payload, setPayload] = useState([
    {
        'title': '10/13/2023 6:53 PM',
        'description': 'Atlantic salmon with buttered corn and mashed potatoes',
        'CMNP': {
          'Calories': 768,
          'Protein': 42,
          'Fat': 31,
          'Carbs': 56
        },
        'tags': ['Salmon', 'Corn', 'Mashed Potatoes'],
        'img': require('./assets/salmon.jpg')
    },
    {
        'title': '10/13/2023 12:01 PM',
        'description': '',
        'CMNP': {
          'Calories': 431,
          'Protein': 22,
          'Fat': 16,
          'Carbs': 37
        },
        'tags': [],
        'img': require('./assets/cheftai.jpg')
    }
  ])

  const [ showMealModal, setShowMealModal ] = useState(false)
  const [ mealDesc, setMealDesc ] = useState('')
  const [ mealTags, setMealTags ] = useState('')

  const [ type, setType ] = useState(CameraType.back)
  const [ startCamera, setStartCamera ] = useState(false)
  const [ previewVisible, setPreviewVisible ] = useState(false)
  const [ capturedImage, setCapturedImage ] = useState(null)


  const closeModal = () => {
    setMealDesc('')
    setMealTags('')
    setShowMealModal(false)
    setCapturedImage(null)
  }

  // const toggleCameraType = () => {
  //   setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
  // }

  let camera

  const __startCamera = async () => {
    console.log('hello from start camera')
    const { status } = await Camera.requestCameraPermissionsAsync()
    if (status === 'granted') {
      console.log('status is true: ', status)
      setStartCamera(true)
    }
    else {
      Alert.alert("Access to camera denied... :(")
    }
  }

  // const __retakePhoto = () => {
  //   setCapturedImage(null)
  //   setPreviewVisible(false)
  //   __startCamera()
  // }

  const __takePhoto = async () => {
    if (!camera) return
    const photo = await camera.takePictureAsync()

    setPreviewVisible(true)
    setCapturedImage(photo)
    setStartCamera(false)
  }

  const saveMeal = () => {
    console.log(payload)
    setPayload([...payload, 
      {
      'title': format(new Date(), 'MM/dd/yyyy HH:MM PM'), // TODO: don't hard code PM in here LOL
      'description': mealDesc,
      // 'CMNP': 'Calories: 768; Protein: 42; Fat: 31; Carbs: 56',
      'CMNP': {
        'Calories': 1000,
        'Protein': 100,
        'Fat': 2,
        'Carbs': 1000
      },
      'tags': mealTags.split(','),
      'img': capturedImage.uri
    }])
    console.log(payload)
    // navigation.refresh()
  }

  console.log('status: 2', startCamera)

  return (
    <MealPayload.Provider value={payload}>
      <NavigationContainer>
        {/* TODO: change text header to black */}
        <Drawer.Navigator
          screenOptions={{
            headerTintColor: defaultColors.red.color,
            drawerActiveTintColor: defaultColors.red.color,
          }}
        >
          {/* TODO: remove "sign in's header " */}
          <Drawer.Screen name="Sign In" component={SignInScreen} />
          {/* TODO: remove sign up's header */}
          <Drawer.Screen name="Sign Up" component={SignUpScreen} />
          <Drawer.Screen name="Data" component={DataScreen} />
          <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen 
              options={{
                headerRight: () => (
                <Text
                  style={{color: defaultColors.red.color, fontSize: 30, marginRight: 10}}
                  onPress={() => setShowMealModal(true)}
                  >+</Text>)
              }}
            name="Meals" component={MealScreen} />

          <Drawer.Screen name="Report" component={ReportScreen} />
        </Drawer.Navigator>
        
        <Modal
          animationType='slide'
          // transparent={true}
          visible={showMealModal}
          onRequestClose={() => setShowMealModal(!showMealModal)}
        >
          <View style={{marginVertical: 50, marginHorizontal: 20}}>
            <Text style={{...defaultColors.black, fontSize: 28, fontWeight: 800}}>Add new meal</Text>
            
            <View style={{marginVertical: 15}}>
              <Text>Description</Text>
              <TextInput
                  value={mealDesc}
                  onChangeText={setMealDesc}
                  placeholder="Enter a description (opt)"
                  style={{
                      color: defaultColors.lightGray,
                      marginVertical: 15,
                      borderBottomColor: defaultColors.lightGray,
                      paddingBottom: 5,
                      borderBottomWidth: 1
                  }}
              ></TextInput>
            </View>
            
            <View style={{marginVertical: 15}}>
              <Text>Tag what food is here! (Comma Separate)</Text>
              <TextInput
                  value={mealTags}
                  onChangeText={setMealTags}
                  placeholder="COMMA SEPARATE your tags"
                  style={{
                      color: defaultColors.lightGray,
                      marginVertical: 15,
                      borderBottomColor: defaultColors.lightGray,
                      paddingBottom: 5,
                      borderBottomWidth: 1
                  }}
              ></TextInput>
            </View>

            <Button 
                title="Take photo???"
                color={defaultColors.red.color}
                onPress={__startCamera}
              ></Button>

            {/* https://www.freecodecamp.org/news/how-to-create-a-camera-app-with-expo-and-react-native/ */}
            <View>
              {
                startCamera ? (
                  <Camera
                    style={{height: '100%'}}
                    type={type}
                    ref = {(r) => {camera = r}}
                  >
                    <View style={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}>
                      <TouchableOpacity onPress={__takePhoto} 
                        style={{ width: 70, height: 70, bottom: 0, borderRadius: 50, backgroundColor: '#fff'}}
                      />
                    </View>
                  </Camera>
                ) : ''
              }
            </View>
            
            {
              (capturedImage && capturedImage.uri) ?
              <ImageBackground
              style={{ height: 300}}
              src={capturedImage && capturedImage.uri}
              /> : ''
            }
          

            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button 
                title="Save"
                color={defaultColors.blue.color}
                onPress={() => { saveMeal(), closeModal() }} // TODO: save modal data
              ></Button>
              <Button 
                title="Cancel"
                color={defaultColors.red.color}
                onPress={closeModal}
              ></Button>
            </View>
          </View>
        </Modal>
      </NavigationContainer>
    </MealPayload.Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
