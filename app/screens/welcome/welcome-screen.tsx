import { useNavigation } from "@react-navigation/native"
import * as React from "react"
import {
  View,
  ViewStyle,
  Image,
  Linking,
  TextStyle,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native"
import { Screen, Text, Button } from "../../components"
import { spacing, colors } from "../../theme"
import Icon from 'react-native-vector-icons/FontAwesome'
import FeatherIcon from 'react-native-vector-icons/Feather'
import { useStores } from "../../models"
import { observer } from "mobx-react-lite"

const SCROLL: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  paddingBottom: 10,
  backgroundColor: colors.palette.white,
}
const CENTER: ViewStyle = {
  alignItems: "center",
  paddingVertical: spacing.sm,
}
const LINK: TextStyle = {
  color: colors.palette.bahamaBlue,
  textDecorationLine: "underline",
  fontWeight: "bold",
  paddingHorizontal: spacing.xs,
}
const PARAGRAPH: TextStyle = {
  marginBottom: spacing.sm,
}
const ITALICS: TextStyle = {
  fontStyle: "italic",
}

const ICON: TextStyle = {
  marginHorizontal: spacing.xs,
  color: colors.palette.bahamaBlue,
}

const FACEBOOK_URL = "https://www.facebook.com/christianheritagehomeeducators"
const YOUTUBE_URL = "https://www.youtube.com/channel/UCqcNvI5xuWIujmR5FuJiQXA"
const INSTAGRAM_URL = "https://www.instagram.com/christianheritagewa/"
const WEBSITE_URL = "https://www.christianheritagewa.org/"

export const WelcomeScreen = observer(() => {
  const navigation = useNavigation()
  const { userStore: { currentUser: { isSignedIn } }, speakerStore: { speakers } } = useStores()

  const next = () => {
    if (isSignedIn) {
      navigation.navigate("Tabs")
    } else {
      navigation.navigate("Login", { next: "Tabs" })
    }
  }

  const author = () => {
    navigation.navigate("Author", {
      speaker: speakers.find((s) => s.SID === 99999999)
    })
  }
  return (
    <Screen preset="scroll" style={SCROLL} safeAreaEdges={["top", "bottom"]} backgroundColor={"white"}>
      <Image
        source={require("./CH-logo-wide.jpg")}
        style={{ alignSelf: "center", resizeMode: "contain", maxWidth: "100%", height: Dimensions.get('screen').width * 0.1287037037, marginVertical: spacing.md }}
        />
      <View style={[CENTER, { flexDirection: "row", justifyContent: "center", paddingTop: 0 }]}>
        <FeatherIcon name="globe" onPress={() => Linking.openURL(WEBSITE_URL)} size={30} style={ICON} />
        <Icon name="facebook-official" onPress={() => Linking.openURL(FACEBOOK_URL)} size={30} style={ICON} />
        <Icon name="youtube" onPress={() => Linking.openURL(YOUTUBE_URL)} size={30} style={ICON} />
        <Icon name="instagram" onPress={() => Linking.openURL(INSTAGRAM_URL)} size={30} style={ICON} />
      </View>
      <View style={CENTER}>
        <Text preset="heading">2024 Spring Conference</Text>
      </View>
      <Image
        source={require("./Spring-2024.png")}
        style={{ alignSelf: "center", resizeMode: "contain", maxWidth: "100%", height: Dimensions.get('screen').width * 0.9, marginVertical: spacing.md }}
        />
      <Text preset="heading">Rooted in Christ</Text>
      <Text preset="bold" style={[PARAGRAPH, ITALICS]}>"...having been firmly rooted and now being built up in Him and established in your faith, just as you were instructed, and overflowing with gratitude." Colossians 2:7</Text>
      <Text>Welcome to the 18th annual Christian Heritage Discipleship and Homeschooling Conference! We are so excited you are here! As we praise God for another year of his provision of fantastic speakers, we are praying that this is a blessed time of encouragement that equips your family to get “rooted in Christ!”</Text>
      <View
        style={{
          paddingVertical: spacing.xl,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
        >
        <TouchableOpacity onPress={author}>
          <Text text="Application Development" style={{ color: colors.palette.mediumGrey }} />
          <Text text="by Kevin VanGelder" style={{ color: colors.palette.mediumGrey }} />
        </TouchableOpacity>
      </View>
      <Button
        onPress={next}
        text="Continue"
        preset="primary"
        textStyle={{fontSize: 18}}
        style={{marginBottom: spacing.lg}}
        />
    </Screen>
  )
})
