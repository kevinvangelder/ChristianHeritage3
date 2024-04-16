import { types, Instance, SnapshotOut } from "mobx-state-tree"
import { SpeakerModel } from "../speaker";

type Speaker = {
  FIRSTNAME: string;
  LASTNAME: string;
  SID: number;
}

type Topic = {
  TOPIC: string;
  TID: number;
}

type Set = {
  PRICE: number;
  REGULARPRICE: number;
  RECID: string;
  RECORDINGID: string;
  FIRSTNAME: string;
  RID: number;
  SETID: number;
  SID: number;
  VARSETID: number;
  DESCRIPTION: string;
  LASTNAME: string;
  TITLE: string;
  SETTITLE: string;
}

/**
 * An Recording model.
 */
export const RecordingModel = types
  .model("Recording")
  .props({
    LOCATION: types.string,
    SET: types.boolean,
    PRICE: types.number,
    ORG: types.string,
    RECID: types.string,
    RID: types.identifierNumber,
    AVAILABLE: types.boolean,
    TOPICS: types.array(types.frozen<Topic>()),
    DESCRIPTION: types.string,
    TITLE: types.string,
    SPEAKERS: types.array(types.reference(SpeakerModel)),
    CID: types.number,
    SESSIONS: types.maybe(types.frozen<Set>()),
    COUPON: types.maybe(types.string),
    NOT_RECORDED: types.boolean,
  })
  .views(self => ({
    get speakerNames() {
      const speakers = self.SPEAKERS
      const names = speakers.map(s => `${s.FIRSTNAME} ${s.LASTNAME}`)
      return names.join(", ")
    },
    get primarySpeaker() {
      if (self.SPEAKERS.length > 0) {
        return self.SPEAKERS[0]
      } else {
        return null 
      }
    },
    get displayPrice() {
      return self.PRICE.toFixed(2)
    },
  }))
  .actions(self => ({
    setPrice: (value: number) => {
      self.PRICE = value
    },
    setCoupon: (value: string) => {
      self.COUPON = value
    },
  }))
type RecordingType = Instance<typeof RecordingModel>
export interface Recording extends RecordingType {}
type RecordingSnapshotType = SnapshotOut<typeof RecordingModel>
export interface RecordingSnapshot extends RecordingSnapshotType {}

export const FakeRecordingModel = types
  .model("FakeRecording")
  .props({
    rid: types.number,
    coupon: types.string,
    set: types.boolean,
    price: types.number,
    recID: types.string,
    title: types.string,
  })
  .views(self => ({
    get displayPrice() {
      return self.price.toFixed(2)
    },
  }))

type FakeRecordingType = Instance<typeof FakeRecordingModel>
export interface FakeRecording extends FakeRecordingType {}
type FakeRecordingSnapshotType = SnapshotOut<typeof FakeRecordingModel>
export interface FakeRecordingSnapshot extends FakeRecordingSnapshotType {}
