import * as React from "react"
import {
  View,
  ViewStyle,
  TextStyle,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import { Screen, Text, Button } from "../../components"
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing } from "../../theme"
import { useStores } from "../../models"
import { NavigatorParamList } from "../../navigators/app-navigator"
import { observer } from "mobx-react-lite";

const ROOT: ViewStyle = {
  flexGrow: 1,
  padding: spacing.xs,
}
const CONTENT: ViewStyle = {
  padding: spacing.xs,
}
const NOTICE: TextStyle = {
  marginTop: spacing.xs,
  fontStyle: "italic",
}
const LINK: TextStyle = {
  color: colors.palette.bahamaBlue,
  textDecorationLine: "underline",
  fontWeight: "bold",
}
const HEADER: TextStyle = {
  fontWeight: "bold",
  textAlign: "center",
  marginTop: spacing.lg,
  marginBottom: spacing.xs,
}
const BOLD: TextStyle = {
  fontWeight: "bold",
}
const ROW: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
const INPUT: ViewStyle = {
  marginVertical: spacing.xs,
  paddingBottom: spacing.xxs,
  borderBottomColor: colors.line,
  borderBottomWidth: 1,
}
const INPUT_ANDROID: TextStyle = { color: colors.text }
const ERROR: TextStyle = {
  color: colors.error,
  marginLeft: spacing.xxs,
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
const BUTTON_MARGIN: ViewStyle = {
  marginVertical: spacing.sm,
}

export const LoginScreen = observer(() => {
  const scrollViewRef = React.useRef<ScrollView>()
  const confirmPasswordRef = React.useRef<TextInput>()
  const firstNameRef = React.useRef<TextInput>()
  const lastNameRef = React.useRef<TextInput>()
  const phoneRef = React.useRef<TextInput>()
  const address1Ref = React.useRef<TextInput>()
  const address2Ref = React.useRef<TextInput>()
  const cityRef = React.useRef<TextInput>()
  const stateRef = React.useRef<TextInput>()
  const zipRef = React.useRef<TextInput>()
  const [loginError, setLoginError] = React.useState<string>();

  const navigation = useNavigation()
  const route = useRoute()

  const nextScreen = (route.params as NavigatorParamList["login"]).next
  const { userStore } = useStores()
  const {
    currentUser: {
      email,
      setEmail,
      emailError,
      password,
      setPassword,
      initials,
      firstName,
      lastName,
      passwordError,
      confirm,
      setConfirm,
      confirmError,
      setFirstName,
      firstNameError,
      setLastName,
      lastNameError,
      phone,
      setPhone,
      phoneError,
      address1,
      setAddress1,
      address1Error,
      address2,
      setAddress2,
      address2Error,
      city,
      setCity,
      cityError,
      state,
      setState,
      stateError,
      zip,
      setZip,
      zipError,
    },
    validateSignUp,
    signOut,
  } = userStore

  const isIos = Platform.OS === "ios"

  const checkEmail = async () => {
    if (userStore.validateEmail()) {
      await userStore.checkEmail()
    }
  }
  const signIn = async () => {
    const result = await userStore.signIn()
    console.debug(result)
    if (result) {
      if (nextScreen === "cart") {
        navigation.goBack()
      } else {
        navigation.navigate(nextScreen || "Tabs")
      }
    }
  }
  const signUp = async () => {
    if (validateSignUp()) {
      const result = await userStore.signUp()
      if (result) {
        if (nextScreen === "cart") {
          navigation.goBack()
        } else {
          navigation.navigate(nextScreen || "Tabs")
        }
      }
    } else {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
    }
  }

  const changeEmail = () => {
    userStore.resetEmailExists()
  }

  const next = () => {
    if (nextScreen === "cart") {
      navigation.goBack()
    } else {
      navigation.navigate(nextScreen || "Tabs")
    }
  }

  const renderEmailInput = () => {
    return (
      <KeyboardAvoidingView behavior="height">
        <Text style={HEADER}>Enter Email</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.palette.mediumGrey}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          onSubmitEditing={checkEmail}
          returnKeyLabel="Next"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {emailError !== undefined && emailError.length > 0 && <Text style={ERROR}>{emailError}</Text>}
        <Button onPress={checkEmail} text="Next" preset="primary" />
      </KeyboardAvoidingView>
    )
  }

  const renderPasswordInput = () => {
    return (
      <View>
        <Text style={HEADER}>Sign In</Text>
        <View style={{ ...ROW, justifyContent: "space-between" }}>
          <Text>
            <Text style={BOLD}>Email: </Text>
            {email}
          </Text>
          <Button onPress={changeEmail} text="Edit" preset="primarySmall" />
        </View>
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.palette.mediumGrey}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={signIn}
          returnKeyLabel="Next"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {loginError !== undefined && loginError.length > 0 && <Text style={ERROR}>{loginError}</Text>}
        <Button onPress={signIn} text="Next" preset="primary" />
      </View>
    )
  }

  const renderSignUp = () => {
    return (
      <View>
        <Text style={HEADER}>Sign Up</Text>
        <View style={{ ...ROW, justifyContent: "space-between" }}>
          <Text>
            <Text style={BOLD}>Email: </Text>
            {email}
          </Text>
          <Button onPress={changeEmail} text="Edit" preset="primarySmall" />
        </View>
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.palette.mediumGrey}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={() => {
            confirmPasswordRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {passwordError?.length > 0 && <Text style={ERROR}>{passwordError}</Text>}
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor={colors.palette.mediumGrey}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          ref={input => confirmPasswordRef.current = input}
          onSubmitEditing={() => {
            firstNameRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {confirmError?.length > 0 && <Text style={ERROR}>{confirmError}</Text>}
        <TextInput
          placeholder="First Name"
          placeholderTextColor={colors.palette.mediumGrey}
          value={firstName}
          onChangeText={setFirstName}
          ref={input => firstNameRef.current = input}
          onSubmitEditing={() => {
            lastNameRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {firstNameError?.length > 0 && <Text style={ERROR}>{firstNameError}</Text>}
        <TextInput
          placeholder="Last Name"
          placeholderTextColor={colors.palette.mediumGrey}
          value={lastName}
          onChangeText={setLastName}
          ref={input => lastNameRef.current = input}
          onSubmitEditing={() => {
            phoneRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {lastNameError?.length > 0 && <Text style={ERROR}>{lastNameError}</Text>}
        <TextInput
          placeholder="Phone (for account recovery purposes only)"
          placeholderTextColor={colors.palette.mediumGrey}
          value={phone}
          onChangeText={setPhone}
          ref={input => phoneRef.current = input}
          onSubmitEditing={() => {
            address1Ref.current.focus()
          }}
          returnKeyLabel="Next"
          keyboardType="phone-pad"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {phoneError?.length > 0 && <Text style={ERROR}>{phoneError}</Text>}
        <TextInput
          placeholder="Address Line 1"
          placeholderTextColor={colors.palette.mediumGrey}
          value={address1}
          onChangeText={setAddress1}
          ref={input => address1Ref.current = input}
          onSubmitEditing={() => {
            address2Ref.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {address1Error?.length > 0 && <Text style={ERROR}>{address1Error}</Text>}
        <TextInput
          placeholder="Address Line 2"
          placeholderTextColor={colors.palette.mediumGrey}
          value={address2}
          onChangeText={setAddress2}
          ref={input => address2Ref.current = input}
          onSubmitEditing={() => {
            cityRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {address2Error?.length > 0 && <Text style={ERROR}>{address2Error}</Text>}
        <TextInput
          placeholder="City"
          placeholderTextColor={colors.palette.mediumGrey}
          value={city}
          onChangeText={setCity}
          ref={input => cityRef.current = input}
          onSubmitEditing={() => {
            stateRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {cityError?.length > 0 && <Text style={ERROR}>{cityError}</Text>}
        <TextInput
          placeholder="State"
          placeholderTextColor={colors.palette.mediumGrey}
          value={state}
          onChangeText={setState}
          ref={input => stateRef.current = input}
          onSubmitEditing={() => {
            zipRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {stateError?.length > 0 && <Text style={ERROR}>{stateError}</Text>}
        <TextInput
          placeholder="Zip"
          placeholderTextColor={colors.palette.mediumGrey}
          value={zip}
          onChangeText={setZip}
          ref={input => zipRef.current = input}
          onSubmitEditing={signUp}
          returnKeyLabel="Next"
          keyboardType="numeric"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {zipError?.length > 0 && <Text style={ERROR}>{zipError}</Text>}
        <Button onPress={signUp} text="Next" preset="primary" />
      </View>
    )
  }

  const renderSignedIn = () => {
    return (
      <View>
        <Text style={HEADER}>Account</Text>
        <View style={ROW}>
          <View style={CIRCLE}>
            <Text style={INITIALS}>{initials}</Text>
          </View>
          <View style={{ flexDirection: "column", justifyContent: "center" }}>
            <Text>
              {firstName} {lastName}
            </Text>
            <Text>{email}</Text>
          </View>
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
        <Button onPress={next} text="Continue" style={BUTTON_MARGIN} />
      </View>
    )
  }

  const { currentUser: { emailExists, isSignedIn } } = userStore
  const checkingOut = nextScreen === "checkout" || nextScreen === "cart"

  return (
    <Screen preset="scroll" style={ROOT} safeAreaEdges={["bottom"]} statusBarStyle="light">
      <KeyboardAvoidingView contentContainerStyle={CONTENT} behavior='padding'>
        <Text preset="subheading">Log In to Alliance Recordings</Text>
        <Text>
          For the best experience, we recommend you log in or sign up so
          that your cart will sync to your other devices, but you can always come back to do
          this later.
        </Text>
        <Text style={NOTICE}>
          Please note, your Alliance Recording account is separate from your Christian Heritage
          account.
        </Text>
        {emailExists === undefined && !isSignedIn && renderEmailInput()}
        {emailExists && !isSignedIn && renderPasswordInput()}
        {emailExists === false && !isSignedIn && renderSignUp()}
        {!checkingOut &&
          !isSignedIn && (
            <Text
              onPress={next}
              style={{
                ...LINK,
                alignSelf: "center",
                paddingHorizontal: spacing.xs,
                marginTop: spacing.xs,
                marginBottom: spacing.sm,
              }}
            >
              Skip for now
            </Text>
          )}
        {isSignedIn && renderSignedIn()}
      </KeyboardAvoidingView>
    </Screen>
  )
})
