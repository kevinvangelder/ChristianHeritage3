/**
 * This is the navigator you will modify to display the logged-in screens of your app.
 * You can use RootNavigator to also display an auth flow or other user flows.
 *
 * You'll likely spend most of your time in this file.
 */
import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { ScheduleNavigator } from './schedule-navigator';
import { colors } from "../theme";
import Icon from 'react-native-vector-icons/FontAwesome';
import { CartNavigator } from "./cart-navigator";
import { VenueScreen } from "../screens";
import { useStores } from "../models";
import { observer } from "mobx-react-lite";
 
/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type PrimaryParamList = {
  Schedule: undefined
  Venue: undefined
  Cart: undefined
}

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Tab = createBottomTabNavigator<PrimaryParamList>()
 
export const MainNavigator = observer(() => {
  const { cartStore: { currentCart: { itemCount } } } = useStores()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Schedule":
              return <Icon name="calendar" color={color} size={size} />
            case "Venue":
              return <Icon name="map" color={color} size={size} />
            case "Cart":
              return <Icon name="shopping-cart" color={color} size={size} />
            default:
              break;
          }
        },
        activeTintColor: colors.palette.white,
        inactiveTintColor: colors.palette.lighterGrey,
        style: {
          backgroundColor: colors.palette.bahamaBlue,
        },
        headerStyle: {backgroundColor: colors.palette.endeavour },
        headerTintColor: colors.palette.white,
        tabBarActiveTintColor: colors.palette.endeavour,
      })}
    >
      <Tab.Screen name="Schedule" component={ScheduleNavigator} options={{headerShown: false}} />
      <Tab.Screen name="Venue" component={VenueScreen} />
      <Tab.Screen name="Cart" component={CartNavigator} options={{ tabBarBadge: itemCount > 0 ? itemCount : undefined, headerShown: false }} />
    </Tab.Navigator>
  )
})

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 *
 * `canExit` is used in ./app/app.tsx in the `useBackButtonHandler` hook.
 */
const exitRoutes = ["Schedule"]
export const canExit = (routeName: string) => exitRoutes.includes(routeName)
 