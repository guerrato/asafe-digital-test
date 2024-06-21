import request from 'supertest'
import { start } from '../src/server'
import { FastifyInstance } from 'fastify'
import { bootstrap } from '../src/startup'

describe('GET /health', () => {
  let fastify: FastifyInstance

  beforeAll(async () => {
    bootstrap()
    fastify = await start()
  })

  afterAll(() => {
    fastify.close()
  })

  test('should return "OK" on /health route', async () => {
    const response = await request(fastify.server).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'OK' })
  })
})
