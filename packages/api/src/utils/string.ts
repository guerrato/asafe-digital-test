type IsEmpty<T> = T extends null | undefined ? T : never

export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isCompleteName = (name: string): boolean => {
  const words = name.split(' ')
  return words.length >= 2
}

export const formatPersonName = (name: string): string => {
  const words = name.split(' ')
  const formattedName = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  return formattedName
}

export const formatEmail = (email: string): string => {
  return email.toLowerCase()
}

export const isEmpty = <T>(str: T): str is IsEmpty<T> => {
  if (typeof str === 'object') {
    return Object.keys(str as object).length === 0
  }
  
  if (str === null || str === undefined || typeof str === 'undefined' || (str as string).trim() === '') {
    return true
  }

  return false
}
