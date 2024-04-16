import * as React from "react"
import { ScrollView, View, ViewStyle, TextInput, TextStyle, Platform } from "react-native"
import { Screen, TitleBar, Text, Button } from "../../components"
import { spacing, colors } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { observer } from "mobx-react-lite"

const ROOT: ViewStyle = {
  width: "100%",
  flex: 1,
  paddingHorizontal: spacing[4],
  paddingBottom: spacing[3],
}
const ROW: ViewStyle = {
  flexDirection: "row",
  marginTop: spacing[3],
  justifyContent: "space-between",
}
const INPUT: ViewStyle = {
  marginVertical: spacing[2],
  paddingBottom: spacing[1],
  borderBottomColor: colors.line,
  borderBottomWidth: 1,
}
const BOLD: TextStyle = {
  fontWeight: "bold",
}
const ERROR: TextStyle = {
  color: colors.error,
  marginLeft: spacing[1],
}

export const UpdateUserScreen = observer(() => {
  const scrollView = React.useRef<ScrollView>()
  const firstNameRef = React.useRef<TextInput>()
  const lastNameRef = React.useRef<TextInput>()
  const phoneRef = React.useRef<TextInput>()
  const address1Ref = React.useRef<TextInput>()
  const address2Ref = React.useRef<TextInput>()
  const cityRef = React.useRef<TextInput>()
  const stateRef = React.useRef<TextInput>()
  const zipRef = React.useRef<TextInput>()
  const navigation = useNavigation()
  const {
    userStore: {
      validateUpdateUser,
      updateUser,
      currentUser: {
        email,
        password,
        firstName,
        lastName,
        phone,
        address1,
        address2,
        city,
        state,
        zip,
        passwordError,
        firstNameError,
        lastNameError,
        phoneError,
        address1Error,
        cityError,
        stateError,
        zipError,
        setPasswordError,
        setPassword,
        setFirstName,
        setLastName,
        setPhone,
        setAddress1,
        setAddress2,
        setCity,
        setState,
        setZip,
      }
    }
  } = useStores()

  const submit = async () => {
    if (validateUpdateUser()) {
      setPasswordError(undefined)
      const result = await updateUser()
      if (result) {
        navigation.goBack()
      } else {
        setPasswordError("The email and password do not match.")
        scrollView.current.scrollTo({ x: 0, y: 0, animated: true })
      }
    } else {
      scrollView.current.scrollTo({ x: 0, y: 0, animated: true })
    }
  }

  const isIos = Platform.OS === "ios"
  return (
    <Screen preset="fixed" unsafe>
      <ScrollView
        style={ROOT}
        keyboardShouldPersistTaps="handled"
        ref={scrollview => (scrollView.current = scrollview)}
      >
        <View style={{ ...ROW, justifyContent: "space-between" }}>
          <Text>
            <Text style={BOLD}>Email: </Text>
            {email}
          </Text>
        </View>
        <TextInput
          placeholder="Current Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={() => {
            firstNameRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : {}}
        />
        {passwordError !== undefined &&
          passwordError.length > 0 && <Text style={ERROR}>{passwordError}</Text>}
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          ref={input => (firstNameRef.current = input)}
          onSubmitEditing={() => {
            lastNameRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : {}}
        />
        {firstNameError !== undefined &&
          firstNameError.length > 0 && <Text style={ERROR}>{firstNameError}</Text>}
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          ref={input => (lastNameRef.current = input)}
          onSubmitEditing={() => {
            phoneRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : {}}
        />
        {lastNameError !== undefined &&
          lastNameError.length > 0 && <Text style={ERROR}>{lastNameError}</Text>}
        <TextInput
          placeholder="Phone (for account recovery purposes only)"
          value={phone}
          onChangeText={setPhone}
          ref={input => (phoneRef.current = input)}
          onSubmitEditing={() => {
            address1Ref.current.focus()
          }}
          returnKeyLabel="Next"
          keyboardType="phone-pad"
          style={isIos ? INPUT : {}}
        />
        {phoneError !== undefined && phoneError.length > 0 && <Text style={ERROR}>{phoneError}</Text>}
        <TextInput
          placeholder="Address Line 1"
          value={address1}
          onChangeText={setAddress1}
          ref={input => (address1Ref.current = input)}
          onSubmitEditing={() => {
            address2Ref.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : {}}
        />
        {address1Error !== undefined &&
          address1Error.length > 0 && <Text style={ERROR}>{address1Error}</Text>}
        <TextInput
          placeholder="Address Line 2"
          value={address2}
          onChangeText={setAddress2}
          ref={input => (address2Ref.current = input)}
          onSubmitEditing={() => {
            cityRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : {}}
        />
        <TextInput
          placeholder="City"
          value={city}
          onChangeText={setCity}
          ref={input => (cityRef.current = input)}
          onSubmitEditing={() => {
            stateRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : {}}
        />
        {cityError !== undefined && cityError.length > 0 && <Text style={ERROR}>{cityError}</Text>}
        <TextInput
          placeholder="State"
          value={state}
          onChangeText={setState}
          ref={input => (stateRef.current = input)}
          onSubmitEditing={() => {
            zipRef.current.focus()
          }}
          returnKeyLabel="Next"
          style={isIos ? INPUT : {}}
        />
        {stateError !== undefined && stateError.length > 0 && <Text style={ERROR}>{stateError}</Text>}
        <TextInput
          placeholder="Zip"
          value={zip}
          onChangeText={setZip}
          ref={input => (zipRef.current = input)}
          onSubmitEditing={submit}
          returnKeyLabel="Next"
          keyboardType="numeric"
          style={isIos ? INPUT : {}}
        />
        {zipError !== undefined && zipError.length > 0 && <Text style={ERROR}>{zipError}</Text>}
        <Button onPress={submit} text="Finish" />
      </ScrollView>
    </Screen>
  )
})
