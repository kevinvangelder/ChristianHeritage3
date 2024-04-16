import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { LoginScreen, CartScreen, SetDetailScreen, CheckoutScreen, FinalizeOrderScreen, UpdateUserScreen } from "../screens"
import { colors } from "../theme"
import { Recording } from "../models/recording"

// {
//   scheduleOverview: { screen: ScheduleScreen },
//   scheduleDetail: { screen: ScheduleDetailScreen },
//   speakerDetail: { screen: SpeakerDetailScreen },
//   concessionsDetail: { screen: ConcessionsDetailScreen },
// },
// {
//   headerMode: "none",
//   navigationOptions: { gesturesEnabled: true },
// },

export type CartParamList = {
  'cart-detail': undefined,
  setDetail: { set: Recording },
  'cart-login': undefined,
  checkout: undefined,
  finalizeOrder: undefined,
  updateUser: undefined,
}


const Stack = createStackNavigator<CartParamList>()

export function CartNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.palette.endeavour },
        headerTintColor: colors.palette.white,
      }}
    >
      <Stack.Screen name="cart-detail" component={CartScreen} options={{headerTitle: "Cart"}} />
      <Stack.Screen name="cart-login" component={LoginScreen} options={{headerTitle: "Log In"}} />
      <Stack.Screen name="setDetail" component={SetDetailScreen} options={{headerTitle: "Schedule Details"}} />
      <Stack.Screen name="checkout" component={CheckoutScreen} options={{ headerTitle: "Check Out" }} />
      <Stack.Screen name="finalizeOrder" component={FinalizeOrderScreen} options={{ headerTitle: "Finalize Order" }} />
      <Stack.Screen name="updateUser" component={UpdateUserScreen} options={{ headerTitle: "Update User" }} />
    </Stack.Navigator>
  )
}