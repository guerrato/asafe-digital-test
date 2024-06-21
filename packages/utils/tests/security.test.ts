import { generatePasswordHash, verifyPassword } from '../src/security'
import { hash, verify } from 'argon2'

jest.mock('argon2')

describe('security', () => {
  const password = 'password123'
  const secretKey = 'secretKey'
  const hashedPassword = 'hashedPassword'

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('generatePasswordHash', () => {
    test('should call argon2.hash with the correct arguments', async () => {
      ;(hash as jest.Mock).mockResolvedValue(hashedPassword)
      await generatePasswordHash(password, secretKey)
      expect(hash).toHaveBeenCalledWith(password, { secret: Buffer.from(secretKey) })
    })

    test('should return the hashed password', async () => {
      ;(hash as jest.Mock).mockResolvedValue(hashedPassword)
      const result = await generatePasswordHash(password, secretKey)
      expect(result).toEqual(hashedPassword)
    })
  })

  describe('verifyPassword', () => {
    test('should call argon2.verify with the correct arguments', async () => {
      ;(verify as jest.Mock).mockResolvedValue(true)
      await verifyPassword(hashedPassword, password, secretKey)
      expect(verify).toHaveBeenCalledWith(hashedPassword, password, { secret: Buffer.from(secretKey) })
    })

    test('should return true if the password matches the hash', async () => {
      ;(verify as jest.Mock).mockResolvedValue(true)
      const result = await verifyPassword(hashedPassword, password, secretKey)
      expect(result).toBe(true)
    })

    test('should return false if the password does not match the hash', async () => {
      ;(verify as jest.Mock).mockResolvedValue(false)
      const result = await verifyPassword(hashedPassword, password, secretKey)
      expect(result).toBe(false)
    })
  })
})
