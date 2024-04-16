import { types, Instance, SnapshotOut } from "mobx-state-tree"

/**
 * An Speaker model.
 */
export const SpeakerModel = types
  .model("Speaker")
  .props({
    SID: types.identifierNumber,
    FIRSTNAME: types.maybe(types.string),
    LASTNAME: types.maybe(types.string),
    BIO: types.maybe(types.string),
    PHOTO: types.maybe(types.string),
  }).views(self => ({
    get fullName() {
      return `${self.FIRSTNAME} ${self.LASTNAME}`
    },
    get image() {
      return `https://www.alliancerecordings.com/images/speakers/${self.PHOTO}`
    }
  }))

  type SpeakerType = Instance<typeof SpeakerModel>
  export interface Speaker extends SpeakerType {}
  type SpeakerSnapshotType = SnapshotOut<typeof SpeakerModel>
  export interface SpeakerSnapshot extends SpeakerSnapshotType {}