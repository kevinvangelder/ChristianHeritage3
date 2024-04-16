import * as React from "react"
import {
  View,
  ViewStyle,
  TextInput,
  ScrollView,
  TextStyle,
  Alert,
  Platform,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native"
import { Screen, Text, Button } from "../../components"
import { spacing, colors } from "../../theme"
import { validate } from "../../utils/validate"
import { cardRules } from "../../models/cart-store/validate"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { observer } from "mobx-react-lite"
import { NativeModules } from 'react-native';
const { RNAuthorizeNet } = NativeModules;


// Sandbox - must also enable test in API checkout method
// const LOGIN_ID = "76m2skPQr"
// const CLIENT_KEY = "7f4FUD6SRR8Dw634qYpJaSh65WVUNaJvmhjh8wcCxDF69EhUcg5pyffPJ2jV6293"
// const isProduction = false

// Live
const LOGIN_ID = "98g2AB6aE7"
const CLIENT_KEY = "2seKtumJAGK8fuH6qpBgS2k9DkK45aqa5TtnJ94Wg6H9AkXHeHJ28g7sHH9w5B8F"
const isProduction = true

const CONTAINER: ViewStyle = {
  padding: spacing.xs,
}
const ROW: ViewStyle = {
  flexDirection: "row",
}
const COLUMN: ViewStyle = {
  flex: 1,
  flexDirection: "column",
}
const INPUT: ViewStyle = {
  marginVertical: spacing.xs,
  paddingBottom: spacing.xxs,
  borderBottomColor: colors.line,
  borderBottomWidth: 1,
}
const INPUT_ANDROID: TextStyle = {
  color: colors.text,
}
const ERROR: TextStyle = {
  color: colors.error,
  marginLeft: spacing.xxs,
  fontSize: 14,
  marginBottom: spacing.sm
}
const DISCLAIMER: TextStyle = {
  marginTop: spacing.sm,
  fontSize: 12,
  textAlign: "center",
}
const CARD: ViewStyle = {
  padding: spacing.xs,
  borderColor: colors.dim,
  backgroundColor: colors.line,
  flexDirection: "row",
  borderRadius: 4,
  borderWidth: 1,
  marginVertical: spacing.sm,
  alignItems: "center",
}
const PICKER_OPTION: ViewStyle = {
  marginHorizontal: spacing.md,
  padding: spacing.sm,
  borderBottomColor: colors.line,
  borderBottomWidth: 1,
}

export const CheckoutScreen = observer(() => {
  const [ACCOUNT_HOLDER_NAME, setCardName] = React.useState<string>()
  const [ACCOUNT_HOLDER_NAME_ERROR, setCardNameError] = React.useState<string>()
  const [CARD_NO, setCardNo] = React.useState<string>()
  const [CARD_NO_ERROR, setCardNumberError] = React.useState<string>()
  const [cardNumberDisplay, setCardNumberDisplay] = React.useState<string>()
  const [EXPIRATION_MONTH, setExpMonth] = React.useState<string>()
  const [EXPIRATION_MONTH_ERROR, setExpirationMonthError] = React.useState<string>()
  const [EXPIRATION_YEAR, setExpYear] = React.useState<string>()
  const [EXPIRATION_YEAR_ERROR, setExpirationYearError] = React.useState<string>()
  const [CVV_NO, setCvv] = React.useState<string>()
  const [CVV_NO_ERROR, setCvvError] = React.useState<string>()
  const [ZIP_CODE, setZipCode] = React.useState<string>()
  const [ZIP_CODE_ERROR, setZipCodeError] = React.useState<string>()
  const [modalVisible, setModalVisible] = React.useState<boolean>(false)
  const [modalType, setModalType] = React.useState<string>()

  const navigation = useNavigation()
  const {
    cartStore: {
      currentCart: {
        setLastFour,
        setToken,
        setExpiration,
        token,
        lastFour,
        expiration,
        resetCard,
      }
    }
  } = useStores()

  const setCardNumber = value => {
    setCardNo(value)
    setCardNumberDisplay(value)
  }
  const cardNumberFocus = () => {
    setCardNumberDisplay(CARD_NO)
  }
  const cardNumberBlur = () => {
    if (CARD_NO && CARD_NO.length === 16) {
      const hidden = CARD_NO.slice(0, -4).replace(/\d/g, "●")
      const display = `${hidden}${CARD_NO.slice(-4)}`
      setCardNumberDisplay(display)
    }
  }
  const closeModal = () => {
    setModalVisible(false)
    setModalType(null)
  }
  const openModal = (type) => {
    setModalType(type)
    setModalVisible(true)
  }
  const setExpirationMonth = value => {
    setExpMonth(value)
    closeModal()
  }
  const setExpirationYear = value => {
    setExpYear(value)
    closeModal()
  }
  const submit = async () => {
    const card = {
      ACCOUNT_HOLDER_NAME,
      CARD_NO,
      EXPIRATION_MONTH,
      EXPIRATION_YEAR,
      CVV_NO,
      ZIP_CODE,
      LOGIN_ID,
      CLIENT_KEY,
    }
    const result = validate(cardRules, card)
    if (!result || Object.keys(result).length === 0) {
      try {
        RNAuthorizeNet.getTokenWithRequestForCard({
          LOGIN_ID: LOGIN_ID,
          CLIENT_KEY: CLIENT_KEY,
          CARD_NO: CARD_NO,
          EXPIRATION_MONTH: EXPIRATION_MONTH,
          EXPIRATION_YEAR: EXPIRATION_YEAR,
          CVV_NO: CVV_NO,
          ZIP_CODE: ZIP_CODE,
        }, isProduction).then((response) => {

          if (response.DATA_VALUE) {
            setLastFour(CARD_NO.slice(-4))
            setExpiration(`${EXPIRATION_MONTH}/20${EXPIRATION_YEAR}`)
            setToken(response.DATA_VALUE)
            navigation.navigate("finalizeOrder")
          }

        })
      } catch (e) {
        console.tron.log(e)
        if (e.text) {
          Alert.alert("Error", e.text)
        } else {
          Alert.alert("Error", "Error validating card. Please check your entries and try again.")
        }
      }
    } else {
      const {
        ACCOUNT_HOLDER_NAME: nameError,
        CARD_NO: cardError,
        EXPIRATION_MONTH: monthError,
        EXPIRATION_YEAR: yearError,
        CVV_NO: cvvError,
        ZIP_CODE: zipError,
      } = result
      nameError && setCardNameError(nameError[0])
      cardError && setCardNumberError(cardError[0])
      monthError && setExpirationMonthError(monthError[0])
      yearError && setExpirationYearError(yearError[0])
      cvvError && setCvvError(cvvError[0])
      zipError && setZipCodeError(zipError[0])
    }
  }

  const next = () => {
    if (token && lastFour && expiration) {
      navigation.navigate("finalizeOrder")
    } else {
      resetCard()
    }
  }


  const renderExistingCard = () => {
    return (
      <View>
        <View style={CARD}>
          <View style={COLUMN}>
            <Text>Card ending in {lastFour}</Text>
            <Text>Exp: {expiration}</Text>
          </View>
          <Button onPress={resetCard} preset="deleteSmall" text="Remove" />
        </View>
        <Button onPress={next} text="Continue" preset="primary" />
      </View>
    )
  }

  const renderForm = () => {
    const isIos = Platform.OS === "ios"
    return (
      <View>
        <Modal
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          {renderModalContent()}
        </Modal>
        <Text style={{marginVertical: spacing.xs}}>Pay by Card:</Text>
        <TextInput
          placeholder="Name on Card"
          placeholderTextColor={colors.palette.mediumGrey}
          value={ACCOUNT_HOLDER_NAME}
          onChangeText={setCardName}
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {ACCOUNT_HOLDER_NAME_ERROR && <Text style={ERROR}>{ACCOUNT_HOLDER_NAME_ERROR}</Text>}
        <TextInput
          placeholder="Card Number"
          placeholderTextColor={colors.palette.mediumGrey}
          value={cardNumberDisplay}
          onChangeText={setCardNumber}
          onBlur={cardNumberBlur}
          onFocus={cardNumberFocus}
          maxLength={16}
          keyboardType="numeric"
          style={isIos ? INPUT : INPUT_ANDROID}
        />
        {CARD_NO_ERROR && <Text style={ERROR}>{CARD_NO_ERROR}</Text>}
        <View style={ROW}>
          <View style={COLUMN}>
            <View style={ROW}>
              <Text style={{ alignSelf: "center" }}>Exp. Month:</Text>
              {renderPicker("month")}
            </View>
            {EXPIRATION_MONTH_ERROR && <Text style={ERROR}>{EXPIRATION_MONTH_ERROR}</Text>}
          </View>
          <View style={COLUMN}>
            <View style={ROW}>
              <Text style={{ alignSelf: "center" }}>Exp Year:</Text>
              {renderPicker("year")}
            </View>
            {EXPIRATION_YEAR_ERROR && <Text style={ERROR}>{EXPIRATION_YEAR_ERROR}</Text>}
          </View>
        </View>
        <View style={ROW}>
          <View style={COLUMN}>
            <TextInput
              placeholder="CVV"
              placeholderTextColor={colors.palette.mediumGrey}
              value={CVV_NO}
              onChangeText={setCvv}
              maxLength={4}
              keyboardType="numeric"
              style={isIos ? [INPUT, { marginRight: spacing.sm }] : INPUT_ANDROID}
            />
            {CVV_NO_ERROR && <Text style={ERROR}>{CVV_NO_ERROR}</Text>}
          </View>
          <View style={COLUMN}>
            <TextInput
              placeholder="Zip"
              placeholderTextColor={colors.palette.mediumGrey}
              value={ZIP_CODE}
              onChangeText={setZipCode}
              maxLength={5}
              keyboardType="numeric"
              style={isIos ? INPUT : INPUT_ANDROID}
            />
            {ZIP_CODE_ERROR && <Text style={ERROR}>{ZIP_CODE_ERROR}</Text>}
          </View>
        </View>
        <Button onPress={submit} text="Continue" style={{marginTop: spacing.xs}} preset="primary" />
      </View>
    )
  }

  const renderPicker = type => {
    const currentValue = type === "month" ? EXPIRATION_MONTH : EXPIRATION_YEAR
    return (
      <TouchableOpacity
        style={{ marginLeft: spacing.xs }}
        onPress={() => openModal(type)}
      >
        <Text style={{color: colors.palette.bahamaBlue}}>
          {currentValue ? (type === "year" ? `20${currentValue}` : currentValue) : "Select"}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderModalContent = () => {
    return (
      <SafeAreaView>
        <View>
          <Text preset="subheading" style={{ textAlign: "center" }}>
            Select Expiration {modalType === "month" ? "Month" : "Year"}
          </Text>
          <ScrollView style={{flexGrow: 1}}>
            {modalType === "month" && renderMonthOptions()}
            {modalType === "year" && renderYearOptions()}
          </ScrollView>
          <Button
            preset="delete"
            text="Cancel"
            onPress={closeModal}
            style={{ margin: spacing.sm }}
          />
        </View>
      </SafeAreaView>
    )
  }

  const renderMonthOptions = () => {
    return (
      <View>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("01")}>
          <Text>01</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("02")}>
          <Text>02</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("03")}>
          <Text>03</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("04")}>
          <Text>04</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("05")}>
          <Text>05</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("06")}>
          <Text>06</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("07")}>
          <Text>07</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("08")}>
          <Text>08</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("09")}>
          <Text>09</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("10")}>
          <Text>10</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("11")}>
          <Text>11</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationMonth("12")}>
          <Text>12</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderYearOptions = () => {
    return (
      <View>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationYear("24")}>
          <Text>2024</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationYear("25")}>
          <Text>2025</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationYear("26")}>
          <Text>2026</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationYear("27")}>
          <Text>2027</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationYear("28")}>
          <Text>2028</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationYear("29")}>
          <Text>2029</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationYear("30")}>
          <Text>2030</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationYear("31")}>
          <Text>2031</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationYear("32")}>
          <Text>2032</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationYear("33")}>
          <Text>2033</Text>
        </TouchableOpacity>
        <TouchableOpacity style={PICKER_OPTION} onPress={() => setExpirationYear("34")}>
          <Text>2034</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Screen preset="scroll" statusBarStyle="light" style={CONTAINER}>
      {token && lastFour && expiration && renderExistingCard()}
      {(!token || !lastFour || !expiration) && renderForm()}
      <Text style={DISCLAIMER}>
        You will have a chance to review your order before submitting.
      </Text>
    </Screen>
  )
})
