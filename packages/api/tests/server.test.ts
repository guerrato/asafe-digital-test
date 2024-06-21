import request from 'supertest'
import { init } from '../src/startup'
import { FastifyInstance } from 'fastify'

describe('GET /health', () => {
  let fastify: FastifyInstance

  beforeAll(async () => {
    fastify = (await init()) as FastifyInstance
  })

  afterAll(() => {
    fastify.close()
  })

  test('should return "OK" on /health route', async () => {
    const response = await request((fastify as FastifyInstance).server).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'OK' })
  })
})
