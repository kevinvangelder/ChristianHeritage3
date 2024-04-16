import * as React from "react"
import { Platform, ViewStyle, Dimensions, Animated, Button, View, TouchableOpacity } from "react-native"
import { PanGestureHandler, PinchGestureHandler, State } from "react-native-gesture-handler"
import { Screen} from "../../components"
import { useNavigation } from "@react-navigation/native"
import { colors, spacing } from "../../theme"
import { Text } from "../../components"
// import MapView, { Marker, Overlay, Region } from "react-native-maps"

const ROOT: ViewStyle = {
  flex: 1,
}

const NAV_ITEM: ViewStyle = {
  flex: 1,
  width: "50%",
  padding: spacing.sm,
}

// const initialRegion: Region = {
//   latitude: 47.181578,
//   longitude: -122.294156,
//   latitudeDelta: .003,
//   longitudeDelta: .003,
// }

export const VenueScreen = function() {
  const translateX = React.useRef(new Animated.Value(1)).current
  const translateY = React.useRef(new Animated.Value(1)).current
  const scale = React.useRef(new Animated.Value(1)).current
  const [selectedFloor, setSelectedFloor] = React.useState("Main")
  let lastScale = 1

  const navigation = useNavigation()

  const reset = () => {
    translateX.setValue(1)
    translateX.setOffset(0)
    translateY.setValue(1)
    translateY.setOffset(0)
    scale.setValue(1)
    lastScale = 1
  }

  const selectFloor = (floor) => {
    setSelectedFloor(floor)
    reset()
  }

  navigation.setOptions({
    headerRight: () => (
      <Button onPress={reset} title="Reset" color={Platform.OS === 'ios' ? '#fff' : colors.palette.endeavour} />
    )
  })

  const aspectRatio = 1.468339307
  const width = Dimensions.get('screen').width
  const height = width * aspectRatio

  const onPanGesture = (event) => {
    translateX.setValue(event.nativeEvent.translationX * (Platform.OS === 'ios' ? lastScale : 1))
    translateY.setValue(event.nativeEvent.translationY * (Platform.OS === 'ios' ? lastScale : 1))
  }
  // Animated.event(
  //   [{ nativeEvent: {
  //     translationX: translateX,
  //     translationY: translateY,
  //   }}], { useNativeDriver: false}
  // )
  const onPinchGesture = (event) => {
    scale.setValue(event.nativeEvent.scale * lastScale)
  }
  // Animated.event(
  //   [{ nativeEvent: {
  //     scale: scale,
  //   }}], { useNativeDriver: false}
  // )

  const onPanStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      translateX.extractOffset()
      translateY.extractOffset()
    }
  }

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (event.nativeEvent.scale * lastScale > 5) {
        Animated.spring(scale, {
          toValue: 5,
          useNativeDriver: false,
        }).start()
        lastScale = 5
      } else if (event.nativeEvent.scale * lastScale < 1) {
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: false,
          }),
          Animated.spring(translateX, {
            toValue: 1,
            useNativeDriver: false,
          }),
          Animated.spring(translateY, {
            toValue: 1,
            useNativeDriver: false,
          }),
        ]).start()
        translateX.setOffset(0)
        translateY.setOffset(0)
        lastScale = 1
      } else {
        lastScale *= event.nativeEvent.scale
      }
    }
  }

  return (
    <Screen preset="fixed" style={ROOT} statusBarStyle="light">
      <View
        style={{ height: 50, flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.palette.lightGrey, zIndex: 50 }}
      >
        <TouchableOpacity
          onPress={() => selectFloor("Lower")}
          style={[NAV_ITEM, selectedFloor === "Lower" ? { backgroundColor: colors.palette.shipCove } : { backgroundColor: colors.background}]}
        >
          <Text
            text="Lower"
            style={{
              textAlign: "center",
              color: selectedFloor === "Lower" ? colors.palette.white : colors.palette.darkGrey,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => selectFloor("Main")}
          style={[
            NAV_ITEM,
            { borderLeftWidth: 1, borderLeftColor: colors.palette.lightGrey },
            selectedFloor === "Main" ? { backgroundColor: colors.palette.shipCove } : { backgroundColor: colors.background},
          ]}
        >
          <Text
            text="Main"
            style={{
              textAlign: "center",
              color: selectedFloor === "Main" ? colors.palette.white : colors.palette.darkGrey,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => selectFloor("Upper")}
          style={[
            NAV_ITEM,
            { borderLeftWidth: 1, borderLeftColor: colors.palette.lightGrey },
            selectedFloor === "Upper" ? { backgroundColor: colors.palette.shipCove } : { backgroundColor: colors.background},
          ]}
        >
          <Text
            text="Upper"
            style={{
              textAlign: "center",
              color: selectedFloor === "Upper" ? colors.palette.white : colors.palette.darkGrey,
            }}
          />
        </TouchableOpacity>
      </View>
      <PanGestureHandler onGestureEvent={onPanGesture} maxPointers={1} onHandlerStateChange={onPanStateChange}>
        <PinchGestureHandler onGestureEvent={onPinchGesture} onHandlerStateChange={onPinchStateChange}>
          <Animated.Image
            // eslint-disable-next-line react-native/no-inline-styles
            style={{width: '100%', height: height, resizeMode: 'contain', zIndex: 40, transform: [{translateX: translateX}, {translateY: translateY}, {scale: scale}]}}
            source={
              selectedFloor == "Main" ? require("./MainFloor.jpg") :
              selectedFloor == "Upper" ? require("./UpperFloor.jpg") :
              require("./LowerFloor.jpg")}
          />
        </PinchGestureHandler>
      </PanGestureHandler>
    </Screen>
  )
}
