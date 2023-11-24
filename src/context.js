import { createContext } from 'react'

// Populate a couple dummy meals
const DummyMeals = [
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
      'imgURI': require('../assets/salmon.jpg')
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
      'imgURI': require('../assets/cheftai.jpg')
  }
]

// Creating a Context enables deeply-nested child components to access the global, in-memory source of truth data store
// Reference: https://react.dev/reference/react/createContext
const MealContext = createContext({
  data: DummyMeals,
  addMeal: () => {},
  deleteMeal: () => {},
  deletingMeals: false
})

export { DummyMeals, MealContext }