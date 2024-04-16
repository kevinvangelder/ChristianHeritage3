import { Alert } from "react-native"
import { types, Instance, SnapshotOut } from "mobx-state-tree"
import { UserModel } from "../user"
import { withRootStore } from "../extensions"
import { validationRules, validateEmail } from "./validate"
import { validate } from "../../utils/validate"
import { api } from "app/services/api"

/**
 * An UserStore model.
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    currentUser: types.optional(UserModel, {}),
    isTokenRefreshing: types.optional(types.boolean, false),
  })
  .extend(withRootStore)
  .actions(self => ({
    setIsTokenRefreshing: (value: boolean) => {
      self.isTokenRefreshing = value
    },
    validateEmail: () => {
      const { setEmailError } = self.currentUser
      const { email } = validate(validateEmail, self.currentUser)
      email ? setEmailError(email[0]) : setEmailError(undefined)
      return !email
    },
    validateSignUp: () => {
      const {
        setPasswordError,
        setConfirmError,
        setPhoneError,
        setFirstNameError,
        setLastNameError,
        setAddress1Error,
        setCityError,
        setStateError,
        setZipError,
      } = self.currentUser
      const {
        password,
        confirm,
        phone,
        firstName,
        lastName,
        address1,
        city,
        state,
        zip,
      } = validate(validationRules, self.currentUser)
      password ? setPasswordError(password[0]) : setPasswordError(undefined)
      confirm ? setConfirmError(confirm[0]) : setConfirmError(undefined)
      phone ? setPhoneError(phone[0]) : setPhoneError(undefined)
      firstName ? setFirstNameError(firstName[0]) : setFirstNameError(undefined)
      lastName ? setLastNameError(lastName[0]) : setLastNameError(undefined)
      address1 ? setAddress1Error(address1[0]) : setAddress1Error(undefined)
      city ? setCityError(city[0]) : setCityError(undefined)
      state ? setStateError(state[0]) : setStateError(undefined)
      zip ? setZipError(zip[0]) : setZipError(undefined)
      return (
        !password &&
        !confirm &&
        !phone &&
        !firstName &&
        !lastName &&
        !address1 &&
        !city &&
        !state &&
        !zip
      )
    },
    validateUpdateUser: () => {
      const {
        setPhoneError,
        setFirstNameError,
        setLastNameError,
        setAddress1Error,
        setCityError,
        setStateError,
        setZipError,
      } = self.currentUser
      const { phone, firstName, lastName, address1, city, state, zip } = validate(
        validationRules,
        self.currentUser,
      )
      phone ? setPhoneError(phone[0]) : setPhoneError(undefined)
      firstName ? setFirstNameError(firstName[0]) : setFirstNameError(undefined)
      lastName ? setLastNameError(lastName[0]) : setLastNameError(undefined)
      address1 ? setAddress1Error(address1[0]) : setAddress1Error(undefined)
      city ? setCityError(city[0]) : setCityError(undefined)
      state ? setStateError(state[0]) : setStateError(undefined)
      zip ? setZipError(zip[0]) : setZipError(undefined)
      return !phone && !firstName && !lastName && !address1 && !city && !state && !zip
    },
  }))
  .actions(self => ({
    checkEmail: async () => {
      const result = await api.checkEmail(self.currentUser.email)
      if (result.kind === "ok") {
        self.currentUser.setEmailExists(result.emailExists)
      }
    },
    signIn: async () => {
      const {
        email,
        password,
        setPassword,
        setToken,
        setFirstName,
        setLastName,
        setPhone,
        setPurchaseHistory,
        setAddress1,
        setAddress2,
        setCity,
        setZip,
        setState,
      } = self.currentUser
      const {
        currentCart: { items, coupons },
        updateCartFromAPI,
        updateCouponsFromAPI,
      } = self.rootStore.cartStore
      const result = await api.signIn(email, password, items, coupons)

      if (result.kind === "ok") {
        setPassword("")
        if (result.token) setToken(result.token)
        if (result.firstName) setFirstName(result.firstName)
        if (result.lastName) setLastName(result.lastName)
        if (result.phone) setPhone(`${result.phone}`)
        if (result.address1) setAddress1(result.address1)
        if (result.address2) setAddress2(result.address2)
        if (result.city) setCity(result.city)
        if (result.state) setState(result.state)
        if (result.zip) setZip(`${result.zip}`)
        if (result.purchaseHistory) {
          const ids = Object.keys(result.purchaseHistory).map(i => parseInt(i))
          setPurchaseHistory(ids)
        }
        if (result.cart) updateCartFromAPI(result.cart)
        if (result.cart) updateCouponsFromAPI(result.cart)
        // if (result.coupons) updateInvalidCouponsFromAPI(result.cart)
        if (result.error) {
          Alert.alert("Error", result.error)
          return false
        } else {
          return true
        }
      }
      return false
    },
    reauthenticate: async () => {
      if (!self.isTokenRefreshing) {
        self.setIsTokenRefreshing(true)
        const {
          email,
          token,
          setToken,
          setFirstName,
          setLastName,
          setPhone,
          setPurchaseHistory,
          setAddress1,
          setAddress2,
          setCity,
          setZip,
          setState,
        } = self.currentUser
        const {
          currentCart: { items, coupons },
          updateCartFromAPI,
          updateCouponsFromAPI,
        } = self.rootStore.cartStore
        const result = await api.reauthenticate(email, token, items, coupons)
        if (result.kind === "ok" && !result.error) {
          if (result.token) setToken(result.token)
          if (result.firstName) setFirstName(result.firstName)
          if (result.lastName) setLastName(result.lastName)
          if (result.phone) setPhone(`${result.phone}`)
          if (result.address1) setAddress1(result.address1)
          if (result.address2) setAddress2(result.address2)
          if (result.city) setCity(result.city)
          if (result.state) setState(result.state)
          if (result.zip) setZip(`${result.zip}`)
          if (result.purchaseHistory) {
            const ids = Object.keys(result.purchaseHistory).map(i => parseInt(i))
            setPurchaseHistory(ids)
          }
          if (result.cart) updateCartFromAPI(result.cart)
          if (result.cart) updateCouponsFromAPI(result.cart)
          // if (result.coupons) updateInvalidCouponsFromAPI(result.cart)
        } else {
          console.tron.log(result.error)
          if (result.error === "User not found or password incorrect.") {
            self.currentUser.setToken(undefined)
            Alert.alert("Session Expired", "Your Alliance Recordings session has expired.")
          }
        }
        self.setIsTokenRefreshing(false)
      }
    },
    signUp: async () => {
      const {
        email,
        password,
        phone,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zip,
      } = self.currentUser
      const {
        setPassword,
        setConfirm,
        setToken,
        setFirstName,
        setLastName,
        setPhone,
        setPurchaseHistory,
        setAddress1,
        setAddress2,
        setCity,
        setZip,
        setState,
      } = self.currentUser
      const {
        currentCart: { items, coupons },
        updateCartFromAPI,
        updateCouponsFromAPI,
      } = self.rootStore.cartStore
      const result = await api.signUp(
        email,
        password,
        phone,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zip,
        items,
        coupons,
      )
      if (result.kind === "ok") {
        setPassword("")
        setConfirm("")
        if (result.token) setToken(result.token)
        if (result.firstName) setFirstName(result.firstName)
        if (result.lastName) setLastName(result.lastName)
        if (result.phone) setPhone(`${result.phone}`)
        if (result.address1) setAddress1(result.address1)
        if (result.address2) setAddress2(result.address2)
        if (result.city) setCity(result.city)
        if (result.state) setState(result.state)
        if (result.zip) setZip(`${result.zip}`)
        if (result.purchaseHistory) {
          const ids = Object.keys(result.purchaseHistory).map(i => parseInt(i))
          setPurchaseHistory(ids)
        }
        if (result.cart) updateCartFromAPI(result.cart)
        if (result.cart) updateCouponsFromAPI(result.cart)
        // if (result.coupons) self.rootStore.cartStore.updateInvalidCouponsFromAPI(result.cart)
        if (result.token) return true
      }
      return false
    },
    updateUser: async () => {
      const { currentCart: { items, coupons } } = self.rootStore.cartStore
      const {
        email,
        password,
        phone,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zip,
        setPassword,
        setPasswordError,
      } = self.currentUser
      const result = await api.updateUser(
        email,
        password,
        phone,
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zip,
        items,
        coupons,
      )
      if (result.kind === "ok" && result.success) {
        setPassword("")
        return true
      } else {
        result.error && setPasswordError(result.error)
        return false
      }
    },
    resetEmailExists: () => {
      const {
        setEmailExists,
        setPassword,
        setConfirm,
        setFirstName,
        setLastName,
        setPhone,
        setAddress1,
        setAddress2,
        setCity,
        setState,
        setZip,
        setPurchaseHistory,
      } = self.currentUser
      const {
        setPasswordError,
        setConfirmError,
        setFirstNameError,
        setLastNameError,
        setPhoneError,
        setAddress1Error,
        setAddress2Error,
        setCityError,
        setStateError,
        setZipError,
      } = self.currentUser
      setEmailExists(undefined)
      setPassword(undefined)
      setConfirm(undefined)
      setFirstName(undefined)
      setLastName(undefined)
      setPhone(undefined)
      setAddress1(undefined)
      setAddress2("")
      setCity(undefined)
      setState(undefined)
      setZip(undefined)
      setPasswordError(undefined)
      setConfirmError(undefined)
      setFirstNameError(undefined)
      setLastNameError(undefined)
      setPhoneError(undefined)
      setAddress1Error(undefined)
      setAddress2Error(undefined)
      setCityError(undefined)
      setStateError(undefined)
      setZipError(undefined)
      setPurchaseHistory([])
    },
  }))
  .actions(self => ({
    signOut: () => {
      self.currentUser.setToken(undefined)
      self.rootStore.cartStore.currentCart.setToken(undefined)
      self.resetEmailExists()
    },
  }))

type UserStoreType = Instance<typeof UserStoreModel>
export interface UserStore extends UserStoreType {}
type UserStoreSnapshotType = SnapshotOut<typeof UserStoreModel>
export interface UserStoreSnapshot extends UserStoreSnapshotType {}
