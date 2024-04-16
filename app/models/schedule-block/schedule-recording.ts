import { types, Instance, SnapshotOut } from "mobx-state-tree"
import { RecordingModel } from "../recording"


export const ScheduleRecordingModel = types
.model("ScheduleRecording")
.props({
  LOCATION: types.maybe(types.string),
  TITLE: types.maybe(types.string),
  RID: types.maybe(types.reference(RecordingModel)),
  PRICE: types.maybe(types.number),
  RECID: types.maybe(types.string),
})

type ScheduleRecordingType = Instance<typeof ScheduleRecordingModel>
export interface ScheduleRecording extends ScheduleRecordingType {}
type ScheduleRecordingSnapshotType = SnapshotOut<typeof ScheduleRecordingModel>
export interface ScheduleRecordingSnapshot extends ScheduleRecordingSnapshotType {}