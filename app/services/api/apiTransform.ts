import { RecordingSnapshot } from "../../models/recording"
import { ScheduleRecordingSnapshot } from "../../models/schedule-block/schedule-recording"

export const transformRecordingSnapshots = (rawRecordings: any) => {
  const recordings: RecordingSnapshot[] = rawRecordings.map(bid => {
    const { SET, AVAILABLE, NOT_RECORDED, SPEAKERS, ...rest } = bid
    return {
      SET: SET === 1,
      AVAILABLE: AVAILABLE === 1,
      NOT_RECORDED: NOT_RECORDED === 1,
      SPEAKERS: SPEAKERS.map((s) => s.SID),
      ...rest,
    }
  })
  return recordings
}

export const transformScheduleRecordings = (rawRecordings: any) => {
  if (!rawRecordings || rawRecordings.length === 0) {
    return undefined
  }
  const recordings: ScheduleRecordingSnapshot[] = rawRecordings.map(recording => {
    const { PRICE, LOCATION, TITLE, RID, RECID, SPEAKERS, ...rest } = recording
    return {
      PRICE: parseFloat(PRICE) || undefined,
      LOCATION: LOCATION,
      TITLE: TITLE,
      RID: RID,
      RECID: RECID,
      SPEAKERS: (SPEAKERS || []).map((s) => s.SID),
      ...rest,
    }
  })
  return recordings.sort((a, b) => a.RID > b.RID ? 1 : -1)
}

export const transformSchedule = (rawSchedule: any) => {
  if (!rawSchedule || rawSchedule.length === 0) {
    return []
  }
  const schedule = rawSchedule.map((b: any) => {
    const { RECORDINGS, START, END, BLOCK, ...rest } = b
    const result = {
      RECORDINGS: transformScheduleRecordings(RECORDINGS),
      START: START,
      END: END,
      BLOCK: BLOCK,
      ...rest,
    }
    return result
  })
  return schedule
}

export const transformSpeakers = (speakers: any) => {
  return speakers
}
