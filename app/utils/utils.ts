export const getSpeakerNames = item => {
  const speakers = item.SPEAKERS
  const names = speakers.map(s => `${s.FIRSTNAME} ${s.LASTNAME}`)
  return names.join(", ")
}
