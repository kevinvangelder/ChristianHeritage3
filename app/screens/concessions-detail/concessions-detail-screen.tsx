import * as React from "react"
import { ScrollView, View, ViewStyle, Image, ImageStyle, TextStyle } from "react-native"
import { Screen, TitleBar, Text } from "../../components"
import { spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"

const ROOT: ViewStyle = {
  width: "100%",
  flex: 1,
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.sm,
}
const HEADER: TextStyle = {
  marginTop: spacing.md
}
const ROW: ViewStyle = {
  flexDirection: "row",
  marginTop: spacing.sm,
  justifyContent: "space-between",
}
const COLUMN: ViewStyle = {
  flex: 1,
  flexDirection: "column",
}

export const ConcessionsDetailScreen = function() {
  return (
    <Screen preset="scroll" statusBarStyle="light" style={ROOT}>
      <Text preset="heading" style={HEADER}>J & G Mobile Catering</Text>
      <View style={ROW}>
        <View style={COLUMN}>
          <Text>- Espresso</Text>
          <Text>- Smoothies</Text>
          <Text>- Italian Sodas</Text>
          <Text>- Sandwiches</Text>
        </View>
        <View style={COLUMN}>
          <Text>- Pastries</Text>
          <Text>- Snacks</Text>
          <Text>- Salads</Text>
        </View>
      </View>
    </Screen>
  )
}
