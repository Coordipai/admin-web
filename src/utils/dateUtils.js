export const extractDate = (isoString) => {
  if (!isoString) return ''
  return isoString.split('T')[0]
}
