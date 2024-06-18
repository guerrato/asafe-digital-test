import { FastifyReply, FastifyRequest } from 'fastify'
import { JwtPayload } from 'jsonwebtoken'
import { UserInput, UserUpdate } from '~/models/user.model'
import httpResponse from '~/utils/httpResponse'
import { verifyToken } from '~/utils/jwt'
import { isEmpty } from '~/utils/string'

export const authMiddleware = async (
  request: FastifyRequest<{ Body: UserUpdate; Headers: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    if (isEmpty(process.env.JWT_SECRET)) {
      throw new Error('MDW_VAR_MISSING: Internal Error: Variables missing')
    }
    const { authorization } = request.headers

    const token = authorization?.replace('Bearer ', '')

    if (isEmpty(token)) {
      throw new Error('Invalid Token')
    }
    const payload: JwtPayload = verifyToken(token, process.env.JWT_SECRET)

    if (!payload) {
      throw new Error('Invalid token')
    }

    if(isEmpty(payload.sub)) {
      throw new Error('Invalid token')
    }

    request.body.id = payload.sub
  } catch (error) {
    reply.code(401).send(httpResponse({ error: (error as Error).message }))
  }
}
