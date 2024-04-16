import { types, Instance, SnapshotOut } from "mobx-state-tree"
import { api } from "app/services/api"
import { SpeakerModel, SpeakerSnapshot } from "../speaker"

/**
 * An SpeakerStore model.
 */
export const SpeakerStoreModel = types
  .model("SpeakerStore")
  .props({
    speakers: types.array(SpeakerModel),
    speakersUpdated: types.maybe(types.Date),
    fetchingSpeakers: types.optional(types.boolean, false),
  })
  .actions(self => ({
    setSpeakers: (value: SpeakerSnapshot[]) => {
      self.speakers.replace(value as any)
    },
    setSpeakersUpdated: (value: Date) => {
      self.speakersUpdated = value
    },
    setFetchingSpeakers: (value: boolean) => {
      self.fetchingSpeakers = value
    },
  }))
  .actions(self => ({
    fetchSpeakers: async () => {
      self.setFetchingSpeakers(true)
      try {
        const result = await api.getSpeakers()
        
        if (result.kind === "ok") {
          self.setSpeakers([...result.speakers, {
            SID: 99999999,
            FIRSTNAME: "Kevin",
            LASTNAME: "VanGelder",
            BIO: "Kevin is a highly skilled software engineer with over 15 years of experience in developing cutting-edge mobile apps and web applications for renowned clients such as Microsoft, GasBuddy, Facebook, Realtor, and many more. His expertise in building innovative and user-friendly software solutions has earned him a reputation as a top-notch professional in the industry. As the owner of VanGelder Technologies, Kevin's business is dedicated to delivering exceptional software development services that exceed clients' expectations. With a keen eye for detail and a deep understanding of the latest technologies, Kevin is known for his ability to create robust and scalable software solutions that drive businesses to new heights of success. Visit his website, linked above, to learn more or to get in touch about your next project.\n\nWhen Kevin isn't busy crafting groundbreaking software, he enjoys hitting the open road on his motorcycle, practicing hospitality, and exploring God's beautiful creation. He's looking forward to starting a large homeschooling family of his own in God's timing.",
            PHOTO: "kevin-vangelder.jpg",
          }])
          self.setSpeakersUpdated(new Date())
          self.setFetchingSpeakers(false)
        }
      } catch (e) {
        self.setFetchingSpeakers(false)
        __DEV__ && console.tron.log(e.message)
      }
    },
  }))