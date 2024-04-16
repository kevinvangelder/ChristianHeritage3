import { Alert } from "react-native"
import { types, clone, Instance, SnapshotOut } from "mobx-state-tree"
import { CartSnapshot, Cart, CartModel } from "../cart"
import { withRootStore } from "../extensions"
import {
  RecordingSnapshot,
  FakeRecordingSnapshot,
} from "../recording"
import { api } from "app/services/api"

/**
 * An CartStore model.
 */
export const CartStoreModel = types
  .model("CartStore")
  .props({
    currentCart: types.optional(CartModel, {}),
    coupons: types.optional(types.array(types.string), []),
    error: types.maybe(types.string),
  })
  .extend(withRootStore)
  .actions(self => ({
    setCurrentCart: (value: CartSnapshot | Cart) => {
      self.currentCart = value as Cart
    },
    findCartItem: (RID: number): RecordingSnapshot | null => {
      const recording = self.currentCart.items.find(r => r.RID === RID)
      if (recording) return recording
      return null
    },
    findOtherItem: (RID: number): FakeRecordingSnapshot | null => {
      const recording = self.currentCart.otherItems.find(r => r.rid === RID)
      if (recording) return recording
      return null
    },
    setError: (value: string) => {
      self.error = value
    },
  }))
  .actions(self => ({
    updateCartFromAPI: async (cart: any) => {
      // const oldCartItems = self.currentCart.items
      // console.tron.log(oldCartItems)
      self.currentCart.setItems(undefined)
      self.currentCart.setOtherItems(undefined)
      console.debug(cart)
      if (cart) {
        await Object.keys(cart).map(async k => {
          const recording = await self.rootStore.recordingStore.findRecording(parseInt(k))
          if (recording) {
            const newCartItem = clone(recording)
            newCartItem.setPrice(cart[k].price)
            newCartItem.setCoupon(cart[k].coupon)
            self.currentCart.addItem(newCartItem)
          } else {
            const { set, ...rest } = cart[k]
            const otherItem = { rid: parseInt(k), set: set === 1, ...rest }
            self.currentCart.addOtherItem(otherItem)
          }
        })
      }
    },
    updateCouponsFromAPI: (cart: any) => {
      self.currentCart.setCoupons(undefined)
      if (cart) {
        const coupons = Object.keys(cart)
          .map(k => cart[k].coupon)
          .filter(i => i.length > 0)
        __DEV__ && console.tron.log(coupons)
        self.currentCart.setCoupons(coupons)
      }
    },
    updateInvalidCouponsFromAPI: (coupons: { invalid: string[] }) => {
      Object.keys(coupons.invalid).map(coupon => {
        if (self.currentCart.coupons.includes(coupon)) {
          self.currentCart.coupons.remove(coupon)
        }
        Alert.alert(
          "Invalid Coupon",
          `${coupon} is not a valid coupon code. Coupons are case sensitive.`,
        )
      })
    },
  }))
  .actions(self => ({
    syncCartAddition: async (newCoupons: string[] = []) => {
      const { items } = self.currentCart
      const { token } = self.rootStore.userStore.currentUser
      try {
        const { kind, cart, coupons } = await api.checkCart(
          items,
          newCoupons,
          token,
        )

        if (kind === "ok" && cart && Object.keys(cart).length > 0) {
          self.updateCartFromAPI(cart)
          self.updateCouponsFromAPI(cart)
          self.updateInvalidCouponsFromAPI(coupons)
        }
      } catch (e) {
        __DEV__ && console.tron.log(e.message)
      }
    },
    syncCartRemoval: async (ids: number[]) => {
      const { token } = self.rootStore.userStore.currentUser
      try {
        const { kind, cart } = await api.removeFromCart(ids, token)

        if (kind === "ok" && cart && Object.keys(cart).length > 0) {
          self.updateCartFromAPI(cart)
          self.updateCouponsFromAPI(cart)
        }
      } catch (e) {
        __DEV__ && console.tron.log(e.message)
      }
    },
  }))
  .actions(self => ({
    addToCart: (RID: number) => {
      const recording = self.rootStore.recordingStore.findRecording(RID)
      const { isSignedIn } = self.rootStore.userStore.currentUser
      if (recording) {
        self.currentCart.addItem(clone(recording))
        isSignedIn && self.syncCartAddition()
      }
    },
    removeFromCart: async (RID: number) => {
      const cartItem = self.findCartItem(RID)
      const { isSignedIn } = self.rootStore.userStore.currentUser
      cartItem && self.currentCart.removeItem(cartItem)
      isSignedIn && RID && (await self.syncCartRemoval([RID]))
    },
    removeOtherFromCart: async (RID: number) => {
      const cartItem = self.findOtherItem(RID)
      const { isSignedIn } = self.rootStore.userStore.currentUser
      cartItem && self.currentCart.removeOtherItem(cartItem)
      isSignedIn && RID && (await self.syncCartRemoval([RID]))
    },
    checkout: async () => {
      const { currentCart } = self
      const { token } = self.rootStore.userStore.currentUser

      try {
        const { kind, result } = await api.checkout(
          currentCart.token,
          currentCart.coupons,
          token,
        )

        if (kind === "ok" && !result.ERROR) {
          currentCart.setOrderResult(result)
          currentCart.resetCard()
          currentCart.resetItems()
          return true
        } else {
          self.setError(result.ERROR)
          return false
        }
      } catch (e) {
        __DEV__ && console.tron.log(e.message)
        return false
      }
    },
    addCoupon: async (coupon: string) => {
      // self.currentCart.setCoupons(self.currentCart.coupons.concat(coupon))
      await self.syncCartAddition(self.currentCart.coupons.concat(coupon))
    },
  }))


type CartStoreType = Instance<typeof CartStoreModel>
export interface CartStore extends CartStoreType {}
type CartStoreSnapshotType = SnapshotOut<typeof CartStoreModel>
export interface CartStoreSnapshot extends CartStoreSnapshotType {}
