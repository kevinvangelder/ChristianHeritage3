import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { RecordingStoreModel } from "./recording-store"
import { ScheduleStoreModel } from "./schedule-store/schedule-store"
import { CartStoreModel } from "./cart-store"
import { UserStoreModel } from "./user-store"
import { SpeakerStoreModel } from "./speaker-store"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  recordingStore: types.optional(RecordingStoreModel, {}),
  scheduleStore: types.optional(ScheduleStoreModel, {}),
  cartStore: types.optional(CartStoreModel, {}),
  speakerStore: types.optional(SpeakerStoreModel, {}),
  userStore: types.optional(UserStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
