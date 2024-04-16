

export interface ITimeSlot {
  id: number
  name: string
  startTime: string
  endTime: string
  duration: number
}

export interface IActivity {
  name: string
  location?: string
  speaker?: string
  description?: string
  RID?: string
  RECID?: string
  DVD_RID?: string
}

export interface ISpeaker {
  name: string
  bio: string
  image: number
  social: {
    website?: string
    website2?: string
  }
}