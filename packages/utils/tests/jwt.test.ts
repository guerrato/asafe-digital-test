import * as jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import { verifyToken, createToken } from '../src/jwt'

jest.mock('jsonwebtoken')

describe('jwt', () => {
  const payload: JwtPayload = { id: 1, username: 'john.doe' }

  // Use jest.MockedFunction to typecast jwt.verify and jwt.sign correctly
  const mockVerify = jwt.verify as jest.MockedFunction<typeof jwt.verify>
  const mockSign = jwt.sign as jest.MockedFunction<typeof jwt.sign>

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('verifyToken should call jwt.verify with the correct arguments', () => {
    const token = 'sampleToken'
    const secret = 'sampleSecret'

    verifyToken(token, secret)

    expect(mockVerify).toHaveBeenCalledWith(token, secret)
  })

  test('verifyToken should return the decoded payload', () => {
    const token = 'sampleToken'
    const secret = 'sampleSecret'

    mockVerify.mockReturnValue(payload as any)

    const result = verifyToken(token, secret)

    expect(result).toEqual(payload)
  })

  test('createToken should call jwt.sign with the correct arguments', () => {
    const payload = { id: 1, username: 'john.doe' }
    const secret = 'sampleSecret'
    const now = Math.floor(Date.now() / 1000)
    const exp = now + 60 * 60

    createToken(payload, secret)

    expect(mockSign).toHaveBeenCalledWith({ ...payload, iat: now, exp }, secret)
  })

  test('createToken should return the generated token', () => {
    const payload = { id: 1, username: 'john.doe' }
    const secret = 'sampleSecret'
    const token = 'sampleToken'

    mockSign.mockReturnValue(token as any)

    const result = createToken(payload, secret)

    expect(result).toEqual(token)
  })
})
