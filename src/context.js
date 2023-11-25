import { createContext } from 'react'
import uuid from 'react-native-uuid'

// Populate a couple dummy meals
const DummyMeals = {
  [uuid.v4()]: {
      'title': '10/13/2023 6:53 PM',
      'description': 'Atlantic salmon with buttered corn and mashed potatoes',
      'CMNP': {
          'calories': 768,
          'proteins': 42,
          'fats': 31,
          'carbs': 56
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
          'calories': 431,
          'proteins': 22,
          'fats': 16,
          'carbs': 37
        },
      'tags': [],
      'img': {
        'URI': require('../assets/cheftai.jpg'),
        'width': 3024,
        'height': 2830
      }
  }
}

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

export { DummyMeals, MealContext, DexcomAuthContext }