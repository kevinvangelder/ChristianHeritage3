import { types, Instance, SnapshotOut } from "mobx-state-tree"
import { RecordingModel, Recording, RecordingSnapshot } from "../recording"
import { api } from "app/services/api"

/**
 * An RecordingStore model.
 */
export const RecordingStoreModel = types
  .model("RecordingStore")
  .props({
    recordings: types.optional(types.array(RecordingModel), []),
    recordingsUpdated: types.maybe(types.Date),
  })
  .actions(self => ({
    setRecordings: (value: RecordingSnapshot[]) => {
      self.recordings.replace(value as any)
    },
    setRecordingsUpdated: (value: Date) => {
      self.recordingsUpdated = value
    },
  }))
  .actions(self => ({
    fetchRecordings: async () => {
      try {
        const result = await api.getRecordings()
        
        if (result.kind === "ok") {
          self.setRecordings(result.recordings)
          self.setRecordingsUpdated(new Date())
        }
      } catch (e) {
        __DEV__ && console.tron.log(e.message)
      }
    },
  }))
  .actions(self => ({
    findRecording: (RID: number): Recording | undefined => {
      // if (self.recordings) {
      const recording = self.recordings.find(r => `${r.RID}` === `${RID}`)
      if (recording) return recording
      return undefined
      // } else {
      //   await self.fetchRecordings()
      //   const rec = self.recordings.find(r => r.RID === RID)
      //   if (rec) return rec
      //   return false
      // }
    },
  }))
  .views(self => ({
    get getSets() {
      return self.recordings.filter(r => r.SET === true)
    },
  }))

type RecordingStoreType = Instance<typeof RecordingModel>
export interface RecordingStore extends RecordingStoreType {}
type RecordingStoreSnapshotType = SnapshotOut<typeof RecordingStoreModel>
export interface RecordingStoreSnapshot extends RecordingStoreSnapshotType {}
