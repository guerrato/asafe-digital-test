import fastify, { FastifyInstance } from 'fastify'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { IAuthService } from '../src/services/auth.service'
import { init } from '../src/startup'
import request from 'supertest'

jest.mock('../src/services/auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    login: jest.fn().mockImplementation(credentials => {
      if (credentials.email === 'test@example.com' && credentials.password === 'test') {
        return Promise.resolve('fakeToken')
      } else {
        return Promise.reject(new Error('Invalid credentials'))
      }
    }),
  })),
}))

describe('AuthController login', () => {
  let fastify: FastifyInstance

  beforeAll(async () => {
    // Register the mock service with the container
    container.register<IAuthService>('IAuthService', {
      useClass: jest.fn().mockImplementation(() => ({
        login: jest.fn().mockResolvedValue('fakeToken'),
      })),
    })
    fastify = (await init()) as FastifyInstance
  })

  afterAll(async () => {
    await fastify.close()
  })

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
  })

  it('should successfully login and return 200 with data', async () => {
    // Get a reference to the mocked class
    const MockedAuthService = container.resolve<IAuthService>('IAuthService')

    // Setup mock implementation for successful login
    ;(MockedAuthService.login as jest.Mock).mockResolvedValue('fakeToken')

    const response = await request(fastify.server)
      .post('/auth/login') // Adjust this endpoint based on your routing
      .send({ email: 'test@example.com', password: 'test' })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ data: 'fakeToken', error: '', message: '', success: true })
  })

  it('should return 401 if login fails', async () => {
    // Get a reference to the mocked class
    const MockedAuthService = container.resolve<IAuthService>('IAuthService')

    // Setup mock implementation for failed login
    ;(MockedAuthService.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'))
    const response = await request(fastify.server)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'tst' })
    expect(response.status).toBe(401)
    expect(response.body).toEqual({ data: null, error: 'Unauthorized', message: '', success: false })
  })

  it('should return 400 if email is missing', async () => {
    const response = await request(fastify.server).post('/auth/login').send({ password: 'test' })
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      success: false,
      error: 'Bad Request',
      data: null,
      message: "body must have required property 'email'",
    })
  })

  it('should return 400 if password is missing', async () => {
    const response = await request(fastify.server).post('/auth/login').send({ email: 'test@example.com' })
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      data: null,
      error: 'Bad Request',
      message: "body must have required property 'password'",
      success: false,
    })
  })
})
