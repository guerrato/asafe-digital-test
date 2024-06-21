import { isEmail, isCompleteName, formatPersonName, formatEmail, isEmpty } from '../src/string'

describe('string utilities', () => {
  describe('isEmail', () => {
    it('should return true for valid email', () => {
      expect(isEmail('test@example.com')).toBe(true)
    })

    it('should return false for invalid email', () => {
      expect(isEmail('test@example')).toBe(false)
    })
  })

  describe('isCompleteName', () => {
    it('should return true for a complete name', () => {
      expect(isCompleteName('John Doe')).toBe(true)
    })

    it('should return false for a single word name', () => {
      expect(isCompleteName('John')).toBe(false)
    })
  })

  describe('formatPersonName', () => {
    it('should capitalize the first letter of each word', () => {
      expect(formatPersonName('john doe')).toEqual('John Doe')
    })
  })

  describe('formatEmail', () => {
    it('should return the email in lowercase', () => {
      expect(formatEmail('TEST@EXAMPLE.COM')).toEqual('test@example.com')
    })
  })

  describe('isEmpty', () => {
    it('should return true for null', () => {
      expect(isEmpty(null)).toBe(true)
    })

    it('should return true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true)
    })

    it('should return true for an empty string', () => {
      expect(isEmpty('')).toBe(true)
    })

    it('should return true for an object with no keys', () => {
      expect(isEmpty({})).toBe(true)
    })

    it('should return false for a non-empty string', () => {
      expect(isEmpty('not empty')).toBe(false)
    })

    it('should return false for an object with keys', () => {
      expect(isEmpty({ key: 'value' })).toBe(false)
    })
  })
})
