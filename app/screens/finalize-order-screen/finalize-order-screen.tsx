import * as React from "react"
import { View, ViewStyle, TextStyle, Alert } from "react-native"
import { Screen, Text, Button } from "../../components"
import { spacing, colors } from "../../theme"
import { getSpeakerNames } from "../../utils/utils"
import { useStores } from "../../models"
import { useNavigation } from "@react-navigation/native"
import { observer } from "mobx-react-lite"

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.sm,
  width: "100%",
}

const CART: ViewStyle = {
  flex: 1,
}
const HEADING: TextStyle = {
  marginTop: spacing.xs,
  fontSize: 18,
  fontWeight: "bold",
}
const CART_ITEM: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-around",
  borderBottomWidth: 1,
  borderBottomColor: colors.line,
  paddingVertical: spacing.xs,
}
const ITEM_DETAILS: ViewStyle = {
  flexDirection: "column",
  flex: 1,
}
const ITEM_TITLE: TextStyle = {
  fontWeight: "bold",
}
const ITEM_SPEAKER: TextStyle = {
  fontStyle: "italic",
  fontWeight: "normal",
}
const ITEM_PRICE: TextStyle = {
  marginLeft: spacing.xs,
}
const TOTAL: ViewStyle = {
  alignSelf: "flex-end",
}
const SUBTOTAL: TextStyle = {
  marginVertical: spacing.xs,
}
const DISCLAIMER: TextStyle = {
  marginTop: spacing.sm,
  fontSize: 12,
}
const SECTION: ViewStyle = {
  marginVertical: spacing.sm,
}

export const FinalizeOrderScreen = observer(() => {
  const { 
    cartStore: {
      checkout,
      currentCart: {
        orderResult,
        token,
        localSubtotal,
        resetOrderResult,
        isEmpty,
        items,
        containsDVD,
      },
    },
    userStore: {
      currentUser: {
        isSignedIn,
        address1,
        address2,
        city,
        state,
        zip,
      },
    }
  } = useStores()
  const navigation = useNavigation()
  const [complete, setComplete] = React.useState<boolean>(orderResult && !!orderResult.ORDERID)

  const processCheckout = async () => {
    if (token && isSignedIn) {
      const result = await checkout()
      if (result) {
        navigation.setOptions({ title: "Order Complete" })
        setComplete(true)
      } else {
        Alert.alert(
          "Error",
          "We couldn't complete your transaction. Please try reentering your card. If you continue to see this error, restart the app or try a different card.",
        )
      }
    } else {
      if (!token) {
        Alert.alert(
          "Error",
          "Looks like your card is missing or invalid. Please go back and enter a valid credit or debit card.",
          [
            {
              text: "Ok",
              onPress: () => {
                navigation.goBack()
              },
            },
          ],
        )
      } else if (!isSignedIn) {
        Alert.alert(
          "Error",
          "Looks like you aren't signed in. Please go back and sign in before trying to place an order.",
          [
            {
              text: "Ok",
              onPress: () => {
                navigation.navigate("checkout")
              },
            },
          ],
        )
      }
    }
  }

  const finish = () => {
    navigation.popToTop()
    resetOrderResult()
  }

  const renderResult = () => {
    __DEV__ && console.tron.log(orderResult)
    return (
      <View>
        <Text style={HEADING}>Thank you for your order!</Text>
        <View style={SECTION}>
          <Text>Order ID: #{orderResult && orderResult.ORDERID}</Text>
          <Text>Amount Paid: ${orderResult && orderResult.PAID}.00</Text>
          <Text>Items: {orderResult && orderResult.ITEMS?.length}</Text>
        </View>
        <Button onPress={finish} text="Finish" preset="primary" />
        <Text style={DISCLAIMER}>
          You will receive an emailed receipt shortly with links to download your purchased
          sessions.
        </Text>
      </View>
    )
  }

  const renderCart = () => {
    return (
      <View style={CART}>
        {containsDVD && renderDVDWarning()}
        <Text style={HEADING}>Review Cart</Text>
        {!isEmpty && items.map(i => renderCartItem(i))}
        {!isEmpty && renderSubtotal()}
        <Text style={DISCLAIMER}>
          You will receive an emailed receipt with links to download the sessions you have
          purchased. If any sessions have not yet been uploaded, you will receive additional emails
          when each one is uploaded.
        </Text>
      </View>
    )
  }

  const renderDVDWarning = () => {
    return (
      <View>
        <Text style={HEADING}>Verify Shipping Address</Text>
        <Text>{`DVDs will be shipped to the following address:\n${address1}${
          address2 && address2.length > 0 ? `\n${address2}` : ""
        }\n${city}, ${state} ${zip}`}</Text>
        <Button
          preset="primary"
          onPress={() => navigation.navigate("updateUser")}
          text="Update Address"
        />
      </View>
    )
  }

  const renderCartItem = item => {
    return (
      <View key={item.RECID} style={CART_ITEM}>
        <View style={ITEM_DETAILS}>
          <Text style={ITEM_TITLE} numberOfLines={0}>
            {item.TITLE}
          </Text>
          <Text style={ITEM_SPEAKER}>{getSpeakerNames(item)}</Text>
        </View>
        <Text style={ITEM_PRICE}>${item.displayPrice}</Text>
      </View>
    )
  }

  const renderSubtotal = () => {
    return (
      <View style={TOTAL}>
        <Text style={SUBTOTAL}>Subtotal: ${localSubtotal}</Text>
        <Button onPress={processCheckout} text="Place Order" preset="primary" />
      </View>
    )
  }

  return (
    <Screen preset="scroll" statusBarStyle="light" style={ROOT}>
      {!!complete && renderResult()}
      {!complete && renderCart()}
    </Screen>
  )
})
