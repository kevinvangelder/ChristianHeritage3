import { types, Instance, SnapshotOut } from "mobx-state-tree"
import moment from "moment"
import { ScheduleRecordingModel } from "./schedule-recording"

/**
 * An ScheduleBlock model.
 */
export const ScheduleBlockModel = types
  .model("ScheduleBlock")
  .props({
    BLOCK: types.maybe(types.string),
    START: types.maybe(types.string),
    END: types.maybe(types.string),
    RECORDINGS: types.array(ScheduleRecordingModel),
  }).views(self => ({
    get duration() {
      return moment(self.END, 'MMMM, DD YYYY HH:mm:ss').diff(moment(self.START, 'MMMM, DD YYYY HH:mm:ss'), 'minutes')
    },
    get startTime() {
      return moment(self.START, 'MMMM, DD YYYY HH:mm:ss').format("h:mm a")
    },
    get endTime() {
      return moment(self.END, 'MMMM, DD YYYY HH:mm:ss').format("h:mm a")
    }
  }))

type ScheduleBlockType = Instance<typeof ScheduleBlockModel>
export interface ScheduleBlock extends ScheduleBlockType {}
type ScheduleBlockSnapshotType = SnapshotOut<typeof ScheduleBlockModel>
export interface ScheduleBlockSnapshot extends ScheduleBlockSnapshotType {}
