import * as React from "react"
import { FlatList, View, TouchableOpacity, ViewStyle, Platform, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Screen, Text } from "../../components"
import { TimeSlot } from "./timeslot"
// import { TitleBar } from "../../shared/title-bar"
import { spacing, colors } from "../../theme"
import { IActivity, ITimeSlot } from "../../models/types"
// const data = require("../../models/spring-2022.json")
import moment from "moment"
import { useStores } from "../../models"
import { observer } from "mobx-react-lite"
import { ScheduleBlock } from "../../models/schedule-block"
import { ScheduleRecording } from "../../models/schedule-block/schedule-recording"

const NAV_ITEM: ViewStyle = {
  flex: 1,
  width: "50%",
  padding: spacing.sm,
}

const TIME: ViewStyle = {
  width: 14,
  height: 14,
  backgroundColor: 'red',
  position: "absolute",
  left: -7,
  transform: [{ rotate: '45deg' }],
}

export const ScheduleOverview = observer(() => {
  let initialSelectedDay: "thursday" | "friday" | "saturday" | undefined = undefined
  switch (moment().day()) {
    case 6:
      initialSelectedDay = "saturday"
      break
    case 5:
      initialSelectedDay = "friday"
      break
    default:
      initialSelectedDay = "friday" // "thursday"
      break
  }
  const [selectedDay, setSelectedDay] = React.useState<"thursday" | "friday" | "saturday">(initialSelectedDay)
  const [time, setTime] = React.useState(moment())

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment())
    }, 60 * 1000) // every minute

    return () => {
      clearInterval(interval)
    }
  }, [])

  const { scheduleStore: { fetchingSchedule, fullSchedule, fetchSchedule, friday, saturday } } = useStores()

  const navigation = useNavigation();

  const onPress = (item: ScheduleBlock, timeSlotActivities: ScheduleRecording[]) => {
    navigation.navigate("scheduleDetail", { item, timeSlotActivities, title: item.BLOCK })
  }

  const renderTimeSlot = ({ item, index }: any) => {
    let timeSlotActivities = item.RECORDINGS
    const breakActivities = [{
      "TITLE": "Vendor Hall",
      "LOCATION": "Vendor Hall"
    }, {
      "TITLE": "Silent Auction",
      "LOCATION": "Hallway to Vendor Hall"
    }]
    if (timeSlotActivities.length === 0 && item.BLOCK === 'Break') {
      timeSlotActivities = breakActivities
    } else if (item.BLOCK.includes("Lunch")) {
      timeSlotActivities = [
        ...breakActivities,
        ...timeSlotActivities
      ]
    }
    return (
      <TimeSlot
        timeSlot={item}
        timeSlotActivities={timeSlotActivities}
        last={index === fullSchedule[selectedDay].length - 1}
        onPress={() => {
          onPress(item, timeSlotActivities)
        }}
      />
    )
  }

  const renderCurrentTimeIndicator = () => {
    const debuggingTime = false
    const shouldRender = time.isBetween(moment().hour(7).minute(50), moment().hour(20).minute(35))
    if (!shouldRender && !debuggingTime) return null
    if (selectedDay === "friday" && time.day() !== 5 && !debuggingTime) return null
    if (selectedDay === "saturday" && time.day() !== 6 && !debuggingTime) return null
    // optional offset if Saturday starts early for Father/Son breakfast
    const dayStart = selectedDay === "friday" ? 8 * 60 : 6 * 60 + 45;
    const timeOffset = (time.hour() * 60) + time.minute()
    // const timeOffset = (9 * 60) + 0
    
    const offset = (timeOffset - dayStart) * 2.014 // 1.677 // 1.344
    return (
      <View style={[TIME, {top: offset -7}]}>
        <Text>&nbsp;</Text>
      </View>
    )
  }

  const dayTimeSlots = fullSchedule[selectedDay]
  return (
    <Screen preset="fixed" statusBarStyle="light">
      <FlatList
        data={dayTimeSlots}
        extraData={{selectedDay}}
        renderItem={renderTimeSlot}
        keyExtractor={(item, index) => `${selectedDay}-${index}`}
        ListHeaderComponent={renderCurrentTimeIndicator}
        style={{ width: "100%", flexGrow: 1}}
        removeClippedSubviews={false}
        refreshing={fetchingSchedule}
        onRefresh={fetchSchedule}
        ListEmptyComponent={() => {
          return (
            <View>
              <Text>Schedule has not loaded yet. Pull to refresh.</Text>
            </View>
          )
        }}
      />
      <View
        style={{ flex: 1, minHeight: 50, flexDirection: "row", borderTopWidth: 1, borderTopColor: colors.palette.lightGrey }}
      >
        {Object.keys(fullSchedule).includes("thursday") && (
          <TouchableOpacity
            onPress={() => setSelectedDay("thursday")}
            style={[NAV_ITEM, selectedDay === "thursday" && { backgroundColor: colors.palette.shipCove }]}
          >
            <Text
              text="Thursday"
              style={{
                textAlign: "center",
                color: selectedDay === "thursday" ? colors.palette.white : colors.palette.darkGrey,
              }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setSelectedDay("friday")}
          style={[
            NAV_ITEM,
            { borderLeftWidth: 1, borderLeftColor: colors.palette.lightGrey },
            selectedDay === "friday" && { backgroundColor: colors.palette.shipCove },
          ]}
        >
          <Text
            text="Friday"
            style={{
              textAlign: "center",
              color: selectedDay === "friday" ? colors.palette.white : colors.palette.darkGrey,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedDay("saturday")}
          style={[
            NAV_ITEM,
            { borderLeftWidth: 1, borderLeftColor: colors.palette.lightGrey },
            selectedDay === "saturday" && { backgroundColor: colors.palette.shipCove },
          ]}
        >
          <Text
            text="Saturday"
            style={{
              textAlign: "center",
              color: selectedDay === "saturday" ? colors.palette.white : colors.palette.darkGrey,
            }}
          />
        </TouchableOpacity>
      </View>
    </Screen>
  )
})
