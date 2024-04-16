import * as React from "react"
import {
  View,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native"
import { Text, Screen, Button } from "../../components"
import { spacing, colors } from "../../theme"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ScheduleParamList } from '../../navigators/schedule-navigator'
import { useStores } from "../../models"
import { observer } from "mobx-react-lite"
import { ScheduleRecording, ScheduleRecordingSnapshot } from "../../models/schedule-block/schedule-recording"
import { Speaker } from "../../models/speaker/speaker"
// const BIOS = require('./speaker-bios.json')
const BIOS = {}

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  width: "100%",
}
const TITLE: TextStyle = {
  marginBottom: spacing.xs,
}
const KEYNOTE_WRAPPER: TextStyle = {
  flexDirection: "row",
}
const KEYNOTE_CONTENT: TextStyle = {
  flexDirection: "column",
  flex: 2,
  paddingRight: spacing.xxs,
}
const KEYNOTE_TITLE: TextStyle = {
  marginBottom: spacing.sm,
  textAlign: 'center',
}
const SPEAKER_ROW: ViewStyle = {
  flexDirection: 'row',
}
const SPEAKER_DETAILS: ViewStyle = {
  justifyContent: 'center'
}
const SPEAKER: TextStyle = {
  marginBottom: spacing.xxs,
}
const TIME: TextStyle = {
  marginBottom: spacing.xs,
}
const DESCRIPTION: TextStyle = {
  marginBottom: spacing.xs,
}
const LINK: TextStyle = {
  color: colors.palette.bahamaBlue,
  textDecorationLine: "underline",
}
const IMAGE_WRAPPER: ViewStyle = {
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  maxHeight: 140,
  marginRight: spacing.xs
}
const IMAGE: ImageStyle = {
  width: 120,
  resizeMode: "contain",
  height: 120,
  marginBottom: spacing.xxs
}
const KEYNOTE_SPEAKER: TextStyle = {
  marginBottom: spacing.xxs,
  alignSelf: 'center',
}
const KEYNOTE_TIME: TextStyle = {
  marginBottom: spacing.xs,
  alignSelf: 'center',
}
const KEYNOTE_IMAGE_WRAPPER: ViewStyle = {
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  maxHeight: 200,
  marginBottom: spacing.xs,
}
const KEYNOTE_IMAGE: ImageStyle = {
  width: 200,
  resizeMode: "contain",
  height: 200,
}

const ACTIVITY: ViewStyle = {
  borderBottomColor: colors.palette.lightGrey,
  borderBottomWidth: 1,
  paddingVertical: spacing.sm,
}

const LAST_ACTIVITY: ViewStyle = {
  borderBottomWidth: 0,
}

const INVISIBLE: ViewStyle = {
  height: 0,
  width: 0,
}

const DVD_BUTTON: ViewStyle = {
  marginTop: spacing.sm,
}

export const ScheduleDetailScreen = observer(() => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    cartStore: { addToCart, removeFromCart, currentCart: { itemIds, setSessionIds } },
    recordingStore: { findRecording },
    userStore: { currentUser: { purchaseHistoryIds } },
  } = useStores()

  const doesBioExist = (speaker: Speaker) => {
    return !!speaker.BIO
  }

  const openBio = (speaker: Speaker) => {
    navigation.navigate("speakerDetail", { speaker: speaker })
  }

  const breakActivities = [{TITLE: "Concessions"}, {TITLE: "Vendor Hall", LOCATION: "Vendor Hall"}, {TITLE: "Silent Auction", LOCATION: "Lobby near Auditorium"}]
  
  const { title, timeSlotActivities, item } = route?.params as ScheduleParamList["scheduleDetail"];

  const renderKeynote = () => {
    const activity = timeSlotActivities[0]
    const recording = activity.RID
    const speaker = recording?.primarySpeaker
    const dvdRecording =
      activity.DVD_RID && findRecording(activity.DVD_RID)
    
    return (
      <>
        <Text preset="heading" text={activity.TITLE} style={KEYNOTE_TITLE} />
        <View style={KEYNOTE_WRAPPER}>
          <View style={KEYNOTE_CONTENT}>
            <TouchableOpacity
              onPress={() =>
                speaker && doesBioExist(speaker) && openBio(speaker)
              }
              style={KEYNOTE_IMAGE_WRAPPER}
            >
              <Image source={{ uri: speaker?.image }} style={KEYNOTE_IMAGE} />
            </TouchableOpacity>
            <Text
              preset="subheading"
              text={speaker?.fullName}
              style={KEYNOTE_SPEAKER}
              onPress={() =>
                speaker && doesBioExist(speaker) && openBio(speaker)
              }
            />
            <Text preset="secondary" text={`${item.startTime} - ${item.endTime}`} style={KEYNOTE_TIME} />
            {recording && recording.DESCRIPTION && <Text preset="default" text={recording.DESCRIPTION} style={DESCRIPTION} />}
            {/* <Text preset="default" text={BIOS[activity.speaker]} style={DESCRIPTION} /> */}
          </View>
        </View>
        {!!recording && renderCartButton(recording)}
        {!!dvdRecording && renderDvdButton(dvdRecording)}
      </>
    )
  }

  const renderOther = () => {
    if (title.includes("Break")) {
      return (
        <>
          {breakActivities.map((activity, i) => renderActivity(activity, i))}
        </>
      )
    }
    if (title.includes("Lunch") || title.includes("Dinner")) {
      return (
        <>
          {[...timeSlotActivities.filter((activity) => activity.TITLE !== "Vendor Hall" && activity.TITLE !== "Silent Auction"), ...breakActivities].map((activity, i) => renderActivity(activity, i))}
        </>
      )
    }
    return (
      <>
        {timeSlotActivities.map((activity, i) => renderActivity(activity, i))}
      </>
    )
  }

  const renderActivity = (activity: ScheduleRecording | { TITLE: string, LOCATION?: string }, i: number) => {
    const last = false
    const recording = activity.RID
    const speaker = recording?.primarySpeaker
    const dvdRecording =
      activity.DVD_RID && findRecording(activity.DVD_RID)
    return (
      <View style={[ACTIVITY, last && LAST_ACTIVITY]} key={activity.TITLE}>
        <View style={KEYNOTE_WRAPPER}>
          <View style={KEYNOTE_CONTENT}>
            {speaker ? (
              <View style={SPEAKER_ROW}>
                {!!speaker.image && (
                  <TouchableOpacity
                    onPress={() =>
                      doesBioExist(speaker) && openBio(speaker)
                    }
                    style={IMAGE_WRAPPER}
                  >
                    <Image source={{ uri: speaker.image }} style={IMAGE} />
                  </TouchableOpacity>
                )}
                <View style={SPEAKER_DETAILS}>
                  <Text
                    preset="default"
                    text={speaker.fullName}
                    style={SPEAKER}
                    onPress={() =>
                      doesBioExist(speaker) && openBio(speaker)
                    }
                  />
                  {activity.LOCATION ? (
                    <Text preset="secondary" text={activity.LOCATION} style={TIME} />
                  ) : (
                    <View style={INVISIBLE} />
                  )}
                  {!!activity.startTime && !!activity.endTime && (
                    <Text preset="secondary" style={TIME} text={`${activity.startTime}-${activity.endTime}`} />
                  )}
                </View>
              </View>
            ) : (
              <View style={INVISIBLE} />
            )}
            <Text preset="subheading" text={activity.TITLE} style={TITLE} />
            {!speaker && !!activity.LOCATION && (
              <Text preset="secondary" text={activity.LOCATION} style={TIME} />
            )}
            {recording?.DESCRIPTION ? (
              <Text preset="secondary" text={recording.DESCRIPTION} style={DESCRIPTION} />
            ) : (
              <View style={INVISIBLE} />
            )}
            {activity.TITLE === "Concessions" && (
              <Text onPress={() => navigation.navigate("concessionsDetail")} style={LINK}>
                See Menus
              </Text>
            )}
          </View>
        </View>
        {!!recording && renderCartButton(recording)}
        {!!dvdRecording && renderDvdButton(dvdRecording)}
      </View>
    )
  }

  const renderCartButton = recording => {
    if (!recording || recording.NOT_RECORDED) return null
    if (itemIds.includes(recording.RID)) {
      return (
        <Button
          text="Remove from Cart"
          preset="delete"
          onPress={() => removeFromCart(recording.RID)}
        />
      )
    } else if (setSessionIds.includes(recording.RID)) {
      return <Button text="Included in Set" preset="disabled" disabled />
    } else {
      if (purchaseHistoryIds.includes(recording.RID)) {
        return <Button text="Already Purchased" preset="disabled" disabled />
      } else {
        return (
          <Button
            text={`Add to Cart - $${recording.displayPrice}`}
            onPress={() => addToCart(recording.RID)}
            preset="primary"
          />
        )
      }
    }
  }

  const renderDvdButton = dvdRecording => {
    if (itemIds.includes(dvdRecording.RID)) {
      return (
        <Button
          text="Remove DVD from Cart"
          preset="delete"
          onPress={() => removeFromCart(dvdRecording.RID)}
          style={DVD_BUTTON}
        />
      )
    } else if (setSessionIds.includes(dvdRecording.RID)) {
      return <Button text="DVD Included in Set" preset="disabled" disabled style={DVD_BUTTON} />
    } else {
      if (purchaseHistoryIds.includes(dvdRecording.RID)) {
        return <Button text="Already Purchased" preset="disabled" disabled style={DVD_BUTTON} />
      } else {
        return (
          <Button
            text={`Add DVD to Cart - $${dvdRecording.displayPrice}`}
            onPress={() => addToCart(dvdRecording.RID)}
            style={DVD_BUTTON}
          />
        )
      }
    }
  }

  return (
    <Screen preset="scroll" statusBarStyle="light" style={ROOT} contentContainerStyle={{paddingBottom: spacing.sm}}>
      {title.includes('General Session') ? renderKeynote() : renderOther()}
    </Screen>
  )
})
