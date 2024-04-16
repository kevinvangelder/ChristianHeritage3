import * as React from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native"
import { Screen, Text, Button } from "../../components"
import { spacing } from "../../theme/spacing"
import { colors } from "../../theme"
import { getSpeakerNames } from "../../utils/utils"
import { validate } from "../../utils/validate"
import { couponRules } from "../../models/cart-store/validate"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { observer } from "mobx-react-lite"

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  width: "100%",
}

const SECTION: ViewStyle = {
  flex: 1,
  marginTop: spacing.lg,
}
const HEADING: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
}
const ROW: ViewStyle = {
  flexDirection: "row",
  marginTop: spacing.sm,
}
const CIRCLE: ViewStyle = {
  width: spacing.xxl,
  height: spacing.xxl,
  borderRadius: spacing.lg,
  backgroundColor: colors.palette.endeavour,
  justifyContent: "center",
  alignItems: "center",
  marginRight: spacing.sm,
}
const INITIALS: TextStyle = {
  fontSize: 24,
  color: colors.background,
}
const LINK: TextStyle = {
  color: colors.palette.bahamaBlue,
  textDecorationLine: "underline",
}
const EMPTY: TextStyle = {
  textAlign: "center",
  maxWidth: "75%",
  alignSelf: "center",
  fontStyle: "italic",
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
  alignItems: "flex-start",
}
const ITEM_PRICE: ViewStyle = {
  alignItems: "flex-end",
  flexDirection: "column",
  marginLeft: spacing.xs,
}
const ITEM_TITLE: TextStyle = {
  fontWeight: "bold",
}
const ITEM_SPEAKER: TextStyle = {
  fontStyle: "italic",
  fontWeight: "normal",
}
const COUPONS: ViewStyle = {
  flex: 2,
  marginRight: spacing.md,
}
const INPUT: ViewStyle = {
  marginVertical: spacing.xs,
  paddingBottom: spacing.xxs,
  borderBottomColor: colors.line,
  borderBottomWidth: 1,
  marginRight: spacing.sm,
}
const ERROR: TextStyle = {
  color: colors.error,
  marginLeft: spacing.xxs,
  fontSize: 14,
}
const TOTAL: ViewStyle = {
  flexDirection: "column",
  flex: 1,
  alignItems: "flex-end",
}
const SUBTOTAL: TextStyle = {
  marginVertical: spacing.xs,
}
const DISCLAIMER: TextStyle = {
  marginTop: spacing.sm,
  fontSize: 12,
}

export const CartScreen = observer(() => {
  const [coupon, setCoupon] = React.useState<string>()
  const [couponError, setCouponError] = React.useState<string>()

  const navigation = useNavigation()
  const {
    cartStore: {
      removeFromCart,
      removeOtherFromCart,
      addCoupon,
      addToCart,
      currentCart: {
        coupons,
        localSubtotal,
        setIds,
        isEmpty,
        items,
        otherItems,
      },
    },
    recordingStore: {
      findRecording,
      getSets,
    },
    userStore: {
      signOut,
      currentUser: {
        isSignedIn,
        email,
        initials,
        firstName,
        lastName,
        purchaseHistory,
      },
    },
  } = useStores()

  const checkout = () => {
    if (!isSignedIn) {
      navigation.navigate("cart-login", { next: "checkout" })
    } else {
      navigation.navigate("checkout")
    }
  }

  const removeItem = RID => {
    Alert.alert("Confirm", "Are you sure you wish to remove this item from your cart?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          removeFromCart(RID)
        },
      },
    ])
  }

  const removeOtherItem = RID => {
    Alert.alert("Confirm", "Are you sure you wish to remove this item from your cart?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          __DEV__ && console.tron.log(`removing ${RID}`)
          removeOtherFromCart(RID)
        },
      },
    ])
  }

  const checkCoupon = () => {
    const validationResult = validate(couponRules, { coupon })
    if (validationResult.coupon) {
      setCouponError(validationResult.coupon[0])
    } else {
      if (coupons.includes(coupon)) {
        setCoupon(null)
        setCouponError("Coupon has already been applied")
      } else {
        if (addCoupon(coupon)) {
          setCoupon(null)
          setCouponError(null)
        } else {
          // this.setState({couponError: this.props.cartStore.currentCart.couponErrors[0]})
        }
      }
    }
  }


  const renderSignIn = () => {
    return (
      <View>
        <Text style={HEADING}>Alliance Recording Account</Text>
        <Text style={{ marginBottom: spacing.xs }}>
          Sign in to sync your cart to your account or complete your order.
        </Text>
        <Button
          onPress={() => navigation.navigate("cart-login", { next: "cart" })}
          text="Sign In"
          preset="primary"
        />
      </View>
    )
  }

  const renderSignedIn = () => {
    return (
      <View>
        <Text style={HEADING}>Alliance Recording Account</Text>
        <View style={ROW}>
          <TouchableOpacity onPress={() => navigation.navigate("updateUser")} style={ROW}>
            <View style={CIRCLE}>
              <Text style={INITIALS}>{initials}</Text>
            </View>
            <View style={{ flexDirection: "column", justifyContent: "center" }}>
              <Text>
                {firstName} {lastName}
              </Text>
              <Text>{email}</Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Button preset="deleteSmall" onPress={signOut} text="Sign Out" />
          </View>
        </View>
      </View>
    )
  }

  const renderSets = sets => {
    if (!setIds) return null
    return (
      <View style={SECTION}>
        <Text style={HEADING}>Conference Sets</Text>
        {sets.map(set => renderSet(set))}
      </View>
    )
  }

  const renderSet = set => {
    const setInCart = setIds.includes(set.RID)
    if (setInCart) return null
    return (
      <View key={set.RECID} style={CART_ITEM}>
        <View style={ITEM_DETAILS}>
          <Text style={ITEM_TITLE}>{set.TITLE}</Text>
          <Text style={LINK} onPress={() => navigation.navigate("setDetail", { set })}>
            See Details
          </Text>
        </View>
        <View style={ITEM_PRICE}>
          <Text>${set.displayPrice}</Text>
          <Button
            onPress={() => addToCart(set.RID)}
            preset="primarySmall"
            text="Add to Cart"
          />
        </View>
      </View>
    )
  }

  const renderCart = () => {
    return (
      <View style={SECTION}>
        <Text style={HEADING}>Cart</Text>
        {isEmpty && <Text style={EMPTY}>Cart is empty.</Text>}
        {isEmpty && (
          <Text style={EMPTY}>Add individual sessions from the schedule or add a set above.</Text>
        )}
        {!isEmpty && items.map(i => renderCartItem(i))}
        {otherItems && otherItems.map(i => renderOtherItem(i))}
        <View style={ROW}>
          {!isEmpty && renderCouponSection()}
          {!isEmpty && renderSubtotal()}
        </View>
      </View>
    )
  }

  const renderCartItem = item => {
    const recording = item.SET && findRecording(item.RID)
    return (
      <View key={item.RECID} style={CART_ITEM}>
        <View style={ITEM_DETAILS}>
          <Text style={ITEM_TITLE} numberOfLines={0}>
            {item.TITLE}
          </Text>
          {!item.SET && <Text style={ITEM_SPEAKER}>{getSpeakerNames(item)}</Text>}
          {item.SET && (
            <Text
              style={LINK}
              onPress={() => navigation.navigate("setDetail", { set: recording })}
            >
              See Details
            </Text>
          )}
          {!!item.COUPON && <Text>Coupon: {item.COUPON}</Text>}
        </View>
        <View style={ITEM_PRICE}>
          <Text>${item.displayPrice}</Text>
          <Button onPress={() => removeItem(item.RID)} preset="deleteSmall" text="Remove" />
        </View>
      </View>
    )
  }

  const renderOtherItem = item => {
    return (
      <View key={item.recID} style={CART_ITEM}>
        <View style={ITEM_DETAILS}>
          <Text style={ITEM_TITLE} numberOfLines={0}>
            {item.title}
          </Text>
        </View>
        <View style={ITEM_PRICE}>
          <Text>${item.displayPrice}</Text>
          <Button
            onPress={() => removeOtherItem(item.rid)}
            preset="deleteSmall"
            text="Remove"
          />
        </View>
      </View>
    )
  }

  const renderCouponSection = () => {
    return (
      <View style={COUPONS}>
        <View style={ROW}>
          <View style={{ flex: 1 }}>
            <TextInput
              placeholder="Coupon Code"
              placeholderTextColor={colors.palette.mediumGrey}
              value={coupon}
              onChangeText={setCoupon}
              style={Platform.OS === "ios" ? INPUT : {}}
            />
          </View>
          <View>
            <Button onPress={checkCoupon} text="Add" preset="primarySmall" />
          </View>
        </View>
        {couponError && <Text style={ERROR}>{couponError}</Text>}
      </View>
    )
  }

  const renderSubtotal = () => {
    return (
      <View style={TOTAL}>
        <Text style={SUBTOTAL}>Total: ${localSubtotal}</Text>
        <Button onPress={checkout} text="Check Out" preset="primarySmall" />
      </View>
    )
  }

  const renderPurchaseHistory = () => {
    const ids = purchaseHistory
    let pastYearRecordings = 0
    return (
      <View style={SECTION}>
        <Text style={HEADING}>Purchase History</Text>
        <Text style={DISCLAIMER}>
          Purchased recordings can be downloaded through the Alliance Recordings website (check your
          emailed receipt for a direct link).
        </Text>
        {ids && ids.length > 0 && ids.map(id => {
            const item = findRecording(id)
            if (!item) {
              pastYearRecordings += 1
              return
            }
            return renderPurchasedItem(item)
          })
        }
        {pastYearRecordings > 0 && (
          <View style={CART_ITEM}>
            <Text style={ITEM_SPEAKER}>And {pastYearRecordings} items from past conferences.</Text>
          </View>
        )}
      </View>
    )
  }

  const renderPurchasedItem = item => {
    if (!item) return
    return (
      <View key={item.RECID} style={CART_ITEM}>
        <View style={ITEM_DETAILS}>
          <Text style={ITEM_TITLE} numberOfLines={0}>
            {item.TITLE}
          </Text>
          <Text style={ITEM_SPEAKER}>{getSpeakerNames(item)}</Text>
        </View>
      </View>
    )
  }

  const sets = getSets
  return (
    <Screen preset="scroll" style={ROOT} statusBarStyle="light">
      {!isSignedIn && renderSignIn()}
      {isSignedIn && renderSignedIn()}
      {renderCart()}
      <Text style={DISCLAIMER}>
        Items you have previously purchased will be automatically removed from your cart.
      </Text>
      {sets && sets.length > 0 && renderSets(sets)}
      {isSignedIn && renderPurchaseHistory()}
    </Screen>
  )
})
