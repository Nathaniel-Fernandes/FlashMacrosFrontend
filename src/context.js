import React, { createContext } from 'react'

const MealPayload = createContext([
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
        // 'img': require('../assets/salmon.jpg')
        'img': require('../assets/salmon.jpg')
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
        // 'img': require('../assets/cheftai.jpg')
        'img': require('../assets/cheftai.jpg')
    }
  ])

export { MealPayload }