import * as React from "react"
import { TouchableOpacity, View } from "react-native"
import { Text } from "../../components"
import { colors, spacing } from "../../theme"
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScheduleBlock } from "../../models/schedule-block"
import { ScheduleRecording } from "../../models/schedule-block/schedule-recording"

export interface TimeSlotProps {
  timeSlot: ScheduleBlock
  timeSlotActivities: ScheduleRecording[]
  onPress: any
  last: boolean
}


export const TimeSlot = function TimeSlot({
  timeSlot,
  timeSlotActivities,
  onPress,
  last,
}: TimeSlotProps) {
  const title = timeSlot.BLOCK
  const summary =
    timeSlotActivities.length <= 3
      ? timeSlotActivities.map(activity => activity.TITLE).join(", ")
      : `${timeSlotActivities.length} Workshops`
  const height = timeSlot.duration / 15 * 30 // 30 pixels tall per 15 minutes
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.palette.lightGrey,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 5,
          paddingLeft: 10,
          paddingRight: 10,
          height,
          // minHeight: 0,
        }}
      >
        <Text preset="secondary" text={timeSlot.startTime} style={{ paddingTop: 5 }} />
        {last && (
          <Text
            preset="secondary"
            text={timeSlot.endTime}
            style={{ position: "absolute", bottom: 10, left: 10 }}
          />
        )}
      </View>
      <View style={{ flexDirection: "column", padding: 5, flex: 1, height, minHeight: 60 }}>
        <Text preset="heading" text={title} />
        <Text preset="default" text={summary} />
      </View>
      <Icon name="chevron-right" size={16} style={{alignSelf: 'center', marginRight: spacing.xs}} />
    </TouchableOpacity>
  )
}
