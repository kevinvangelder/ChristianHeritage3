import * as React from "react"
import { ScrollView, ViewStyle, TextStyle } from "react-native"
import { Screen, Text, Button } from "../../components"
import { spacing, color } from "../../theme"
import { useStores } from "../../models"
import { useNavigation, useRoute } from "@react-navigation/native"
import { CartParamList } from "../../navigators/cart-navigator"
import { observer } from "mobx-react-lite"

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.sm,
}
const HEADING: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  paddingBottom: spacing.xs,
}
const PARAGRAPH: TextStyle = {
  paddingBottom: spacing.xs,
  color: 'black',
}
const BOLD: TextStyle = {
  fontWeight: "bold",
  paddingBottom: spacing.xs,
}
const SESSION_TITLE: TextStyle = {
  fontSize: 12,
  paddingBottom: spacing.xs,
  marginLeft: spacing.xs,
  lineHeight: 14,
}

export const SetDetailScreen = observer(() => {
  const navigation = useNavigation()
  const route = useRoute()
  const {
    cartStore: {
      addToCart,
      removeFromCart,
      currentCart: {
        itemIds,
      }
    },
    recordingStore: {
      findRecording,
    },
    userStore: {
      currentUser: {
        purchaseHistoryIds,
      }
    }
  } = useStores()

  const renderCartButton = recording => {
    if (itemIds.includes(recording.RID)) {
      return (
        <Button
          text="Remove from Cart"
          preset="delete"
          onPress={() => removeFromCart(recording.RID)}
        />
      )
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

  const { set } = route.params as CartParamList["setDetail"]
  const recording = findRecording(set.RID)
  const cleanedDescription = set.DESCRIPTION.replace(
    "###Please Ensure you provide complete Postal mailing address in your account to prevent complications during fulfillment.###",
    "",
  )
  const isDVD = set.TITLE.includes("DVD")
  return (
    <Screen preset="scroll" contentContainerStyle={{ width: "100%", padding: spacing.sm }} statusBarStyle="light">
        <Text style={HEADING}>{set.TITLE}</Text>
        <Text style={PARAGRAPH}>{cleanedDescription}</Text>
        {isDVD && (
          <Text style={BOLD}>
            Please Ensure you provide complete Postal mailing address in your account to prevent
            complications during fulfillment.
          </Text>
        )}
        {renderCartButton(recording)}
        <Text style={{ marginVertical: spacing.xs}}>Included Sessions:</Text>
        {set.SESSIONS.map(session => (
          <Text key={session.RID} style={SESSION_TITLE}>
            - {session.TITLE}
          </Text>
        ))}
        {renderCartButton(recording)}
    </Screen>
  )
})
