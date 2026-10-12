import { createContext } from 'react'

// Lets any DrinkCard open the "Share to a group" sheet without threading props through every screen.
// Value: (drinkId) => void, or null when sharing isn't available.
export const ShareContext = createContext(null)
