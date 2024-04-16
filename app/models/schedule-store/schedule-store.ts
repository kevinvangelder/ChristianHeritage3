import { types, Instance, SnapshotOut } from "mobx-state-tree"
import { ScheduleBlockModel, ScheduleBlockSnapshot } from "../schedule-block"
import moment from "moment"
import { api } from "app/services/api"

/**
 * An ScheduleStore model.
 */
export const ScheduleStoreModel = types
  .model("ScheduleStore")
  .props({
    schedule: types.array(ScheduleBlockModel),
    scheduleUpdated: types.maybe(types.Date),
    fetchingSchedule: types.optional(types.boolean, false),
  })
  .views(self => ({
    get friday() {
      return self.schedule.filter(s => s.START && s.START.includes("April, 26 2024"))
    },
    get saturday() {
      return self.schedule.filter(s => s.START && s.START.includes("April, 27 2024"))
    },
  }))
  .views(self => ({
    get fullSchedule() {
      return {
        friday: self.friday,
        saturday: self.saturday,
      }
    },
  }))
  .actions(self => ({
    setSchedule: (value: ScheduleBlockSnapshot[]) => {
      // console.debug(value)
      const sorted = [
        {
          BLOCK: "Registration",
          START: "April, 26 2024 08:00:00",
          END: "April, 26 2024 9:00:00",
          RECORDINGS: [{
            TITLE: "Registration",
            LOCATION: "Registration Table"
          }, {
            TITLE: "Silent Auction",
            LOCATION: "Lobby near Auditorium",
          }],
        },
        ...value.filter((s) => s.BLOCK !== "Registration"),
        {
          BLOCK: "Registration",
          START: "April, 27 2024 08:00:00",
          END: "April, 27 2024 9:00:00",
          RECORDINGS: [{
            TITLE: "Registration",
            LOCATION: "Registration Table"
          }, {
            TITLE: "Silent Auction",
            LOCATION: "Lobby near Auditorium",
          }],
        },
        {
          BLOCK: 'End of Conference',
          START: "April, 27 2024 18:00:00",
          END: "April, 27 2024 18:30:00",
          RECORDINGS: [{
            TITLE: "End of Conference",
            LOCATION: "Thank you for attending the 2024 Conference! Please exit the building promptly and have a safe trip home."
          }],
        },
      ].sort((a, b) => moment(a.START, 'MMMM, DD YYYY HH:mm:ss').unix() - moment(b.START, 'MMMM, DD YYYY HH:mm:ss').unix())
      // console.debug(sorted)
      self.schedule.replace(sorted as any)
    },
    setScheduleUpdated: (value: Date) => {
      self.scheduleUpdated = value
    },
    setFetchingSchedule: (value: boolean) => {
      self.fetchingSchedule = value
    },
  }))
  .actions(self => ({
    fetchSchedule: async () => {
      self.setFetchingSchedule(true)
      try {
        const result = await api.getSchedule()
        
        if (result.kind === "ok") {
          self.setSchedule(result.schedule)
          self.setScheduleUpdated(new Date())
          self.setFetchingSchedule(false)
        }
      } catch (e) {
        self.setFetchingSchedule(false)
        __DEV__ && console.tron.log(e.message)
      }
    },
  }))