import * as React from "react"
import { View, ViewStyle, Image, ImageStyle, TextStyle, Linking } from "react-native"
import { Button, Screen, Text } from "../../components"
import { colors, spacing } from "../../theme"
import { useRoute } from "@react-navigation/native"
import { ScheduleParamList } from "../../navigators/schedule-navigator"
import Icon from 'react-native-vector-icons/Feather'

const ROOT: ViewStyle = {
  width: "100%",
  flex: 1,
  // paddingHorizontal: spacing[4],
  // paddingVertical: spacing[3],
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
}
const HEADING: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  paddingBottom: spacing.xs,
  textAlign: 'center'
}
const IMAGE: ImageStyle = {
  width: 200,
  resizeMode: "contain",
  height: 200,
  alignSelf: 'center',
  marginBottom: spacing.sm,
}

export const SpeakerDetailScreen = function SpeakerDetailScreen() {
  const route = useRoute()
  const { speaker } = route.params as ScheduleParamList["speakerDetail"]
  return (
    <Screen preset="scroll" statusBarStyle="light" style={ROOT} contentContainerStyle={{paddingBottom: spacing.xl}} safeAreaEdges={["bottom"]}>
      <View style={{ flex: 1, flexDirection: "column"}}>
        {speaker.SID === 99999999 ? (
          <Image source={require("./speaker-images/KevinVanGelder.jpg")} style={IMAGE} />
        ) : (
          <Image source={{ uri: speaker.image }} style={IMAGE} />
        )}
        <Text style={HEADING}>{speaker.fullName}</Text>
        {!!speaker.social && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.sm}}>
            {!!speaker.social.website && (
              <Button preset="link" onPress={() => Linking.openURL(speaker.social.website)} style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="globe" size={25} color={colors.palette.bahamaBlue} style={{marginRight: spacing.xs}} />
                <Text preset="link">Website</Text>
              </Button>
            )}
            {!!speaker.social.website2 && (
              <Button preset="link" onPress={() => Linking.openURL(speaker.social.website2)} style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="globe" size={25} color={colors.palette.bahamaBlue} style={{marginRight: spacing.xs}} />
                <Text preset="link">Website</Text>
              </Button>
            )}
          </View>
        )}
        <Text preset="default" style={{marginBottom: spacing.md}}>{speaker.BIO}</Text>
      </View>
    </Screen>
  )
}
