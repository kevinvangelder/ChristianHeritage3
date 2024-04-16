/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { MainNavigator } from "./main-navigator"
import { Speaker } from "../models/speaker"
import { useStores } from "app/models"

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
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined,
  Login: {
    Next: string
  },
  Author: {
    Speaker: Speaker,
  },
  Tabs: undefined
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
    >
      <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} options={{headerShown: false}} />
      <Stack.Screen name="Login" component={Screens.LoginScreen} options={{headerShown: true, headerTitle: 'Log In', headerStyle: {backgroundColor: colors.palette.endeavour }, headerTintColor: colors.palette.white}} />
      <Stack.Screen name="Author" component={Screens.SpeakerDetailScreen} options={{ headerShown: true, headerTitle: 'About the Author', headerStyle: {backgroundColor: colors.palette.endeavour }, headerTintColor: colors.palette.white }} />
      <Stack.Screen
        name="Tabs"
        component={MainNavigator}
        options={{
          headerShown: false,
        }}
        />
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  // const {
  //   cartStore: { syncCartAddition },
  //   speakerStore: { fetchSpeakers },
  //   recordingStore: { fetchRecordings },
  //   scheduleStore: { fetchSchedule, schedule },
  // } = useStores()

  // const fetchContent = async () => {
  //   await fetchSpeakers()
  //   await fetchRecordings()
  //   await fetchSchedule()
  //   syncCartAddition()
  // }

  // React.useEffect(() => {
  //   if (!schedule || schedule.length === 0) {
  //     fetchContent()
  //   }
  // }, [schedule])

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
