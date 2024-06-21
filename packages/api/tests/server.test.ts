import { test } from 'tap'
import { start } from '../src/server'

test('Should return "OK" on /health route', async (t) => {
  const fastify = await start()

  t.teardown(() => fastify.close())

  const response = await fastify.inject({
    method: 'GET',
    url: '/health',
  })
  console.log(response)

  t.equal(response.statusCode, 200)
  t.equal(response.json(), {status: 'OK'})
})
