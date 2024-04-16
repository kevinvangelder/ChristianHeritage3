import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { ScheduleOverview, ScheduleDetailScreen, SpeakerDetailScreen, ConcessionsDetailScreen } from "../screens"
import { Speaker } from "../models/speaker"
import { colors } from "../theme"
import { ScheduleBlock } from "../models/schedule-block"
import { ScheduleRecording } from "../models/schedule-block/schedule-recording"

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

export type ScheduleParamList = {
  overview: undefined
  scheduleDetail: {
    item: ScheduleBlock
    timeSlotActivities: ScheduleRecording[]
    title: string
  }
  speakerDetail: {
    speaker: Speaker,
  }
  concessionsDetail: undefined
}


const Stack = createStackNavigator<ScheduleParamList>()

export function ScheduleNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.palette.endeavour },
        headerTintColor: colors.palette.white,
      }}
    >
      <Stack.Screen name="overview" component={ScheduleOverview} options={{headerTitle: "Schedule" }}/>
      <Stack.Screen name="scheduleDetail" component={ScheduleDetailScreen} options={{headerTitle: "Schedule Details"}} />
      <Stack.Screen name="speakerDetail" component={SpeakerDetailScreen} options={{headerTitle: "Speaker Bio"}} />
      <Stack.Screen name="concessionsDetail" component={ConcessionsDetailScreen} options={{ headerTitle: "Concessions" }} />
    </Stack.Navigator>
  )
}