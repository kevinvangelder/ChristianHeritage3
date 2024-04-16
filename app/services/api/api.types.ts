import { GeneralApiProblem } from "./api-problem"
import { RecordingSnapshot } from "../../models/recording"
import { ScheduleBlockSnapshot } from "../../models/schedule-block"
import { CartSnapshot } from "../../models/cart"
import { SpeakerSnapshot } from "../../models/speaker"

export type GetRecordingsResult =
  | { kind: "ok"; recordings: RecordingSnapshot[] }
  | GeneralApiProblem
export type GetScheduleResult =
  | { kind: "ok"; schedule: ScheduleBlockSnapshot[] }
  | GeneralApiProblem
export type GetSpeakersResult = 
  | { kind: "ok"; Speakers: SpeakerSnapshot[] }
  | GeneralApiProblem
export type CheckEmailResult = { kind: "ok"; emailExists: boolean } | GeneralApiProblem
export type SignUpResult =
  | {
      kind: "ok"
      token: string
      firstName: string
      lastName: string
      phone: string
      address1: string
      address2: string
      city: string
      state: string
      zip: string
      cart: CartSnapshot
      coupons: any
      purchaseHistory: any
      error: string,
    }
  | GeneralApiProblem
export type SignInResult =
  | {
      kind: "ok"
      token: string
      firstName: string
      lastName: string
      phone: string
      address1: string
      address2: string
      city: string
      state: string
      zip: string
      cart: CartSnapshot
      coupons: any
      purchaseHistory: any
      error: string,
    }
  | GeneralApiProblem
export type ReauthenticateResult =
  | {
      kind: "ok"
      token: string
      firstName: string
      lastName: string
      phone: string
      address1: string
      address2: string
      city: string
      state: string
      zip: string
      cart: CartSnapshot
      coupons: any
      purchaseHistory: any
      error: string | null,
    }
  | GeneralApiProblem
export type UpdateUserResult = { kind: "ok"; success: string; error: string } | GeneralApiProblem
export type CheckCartResult =
  | { kind: "ok"; cart: CartSnapshot; coupons: any; error: string }
  | GeneralApiProblem
export type RemoveFromCartResult =
  | { kind: "ok"; cart: CartSnapshot; error: string }
  | GeneralApiProblem
export type CheckoutResult = { kind: "ok"; result: any } | GeneralApiProblem


/**
 * The options used to configure apisauce.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string

  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number
}
