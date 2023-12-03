import { createContext } from 'react'
import uuid from 'react-native-uuid'

// Populate a couple dummy meals
const DummyMeals = {
  [uuid.v4()]: {
      'title': '10/13/2023 6:53 PM',
      'description': 'Atlantic salmon with buttered corn and mashed potatoes',
      'CMNP': {
          'calories': {
            'mean': 768,
            'CI': 6
          },
          'proteins': {
            'mean': 42,
            'CI': 7
          },
          'fats': {
            'mean': 31,
            'CI': 8
          },
          'carbs': {
            'mean': 56,
            'CI': 17
          }
      },
      'tags': ['Salmon', 'Corn', 'Mashed Potatoes'],
      'img': {
        'URI': require('../assets/salmon.jpg'),
        'width': 4032,
        'height': 3024
      }
  },
  [uuid.v4()]: {
      'title': '10/13/2023 12:01 PM',
      'description': '',
      'CMNP': {
          'calories': {
            'mean': 431,
            'CI': 20
          },
          'proteins': {
            'mean': 22,
            'CI': 4
          },
          'fats': {
            'mean': 16,
            'CI': 3
          },

          'carbs': {
            'mean': 37,
            'CI': 6
          }
        },
      'tags': [],
      'img': {
        'URI': require('../assets/cheftai.jpg'),
        'width': 3024,
        'height': 2830
      }
  }
}

const DummyProfile = {
  name: 'Johanna Doe',
  email: 'johanna@company.com',
  // heightFeet: '5',
  heightInches: '65',
  weight: '130',
  race: 1,
  age: '27',
  sex: 2,
  img: {
    URI: require('../assets/johanna.png')
  }
}

const ProfileContext = createContext({
  profileData: DummyProfile,
  setProfileData: () => {},
  resetProfile: () => {}
})

// Creating a Context enables deeply-nested child components to access the global, in-memory source of truth data store
// Reference: https://react.dev/reference/react/createContext
const MealContext = createContext({
  data: DummyMeals,
  addMeal: () => {},
  deleteMeal: () => {},
  deletingMeals: false,
  setDeletingMeals: () => {},
  editingMeals: false,
  setEditingMeals: () => {},
  editMeal: () => {}
})

const DexcomAuthContext = createContext({
  authCode: '',
  accessToken: '',
  refreshToken: '',
  setAuthCode: () => {},
  setAccessToken: () => {},
  setRefreshToken: () => {},
  getAccessToken: () => {},
  revokeAuthorization: () => {},
  refreshAccessToken: () => {}
})

export { DummyMeals, DummyProfile, MealContext, DexcomAuthContext, ProfileContext }