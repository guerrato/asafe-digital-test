import { FastifyReply } from 'fastify'
import { JwtPayload } from 'jsonwebtoken'
import { AuthenticatedRequest } from '../models/auth.model'
import { httpResponse, isEmpty, verifyToken } from '@asafe-digital-test/utils'

export const adminOnlyMiddleware = async <T extends AuthenticatedRequest>(request: T, reply: FastifyReply) => {
  try {
    if (isEmpty(process.env.JWT_SECRET)) {
      throw new Error('MDW_VAR_MISSING: Internal Error: Variables missing')
    }
    const { authorization } = request.headers

    const token = authorization?.replace('Bearer ', '')

    if (isEmpty(token)) {
      throw new Error('MDW_INVALID_TOKEN: Invalid Token')
    }
    const payload: JwtPayload = verifyToken(token, process.env.JWT_SECRET)

    if (!payload) {
      throw new Error('MDW_INVALID_TOKEN: Invalid token')
    }

    if (isEmpty(payload.sub)) {
      throw new Error('MDW_INVALID_TOKEN: Invalid token')
    }

    if ((payload.role as string).toUpperCase() !== 'ADMIN') {
      throw new Error('MDW_UNAUTHORIZED: Unauthorized')
    }
  } catch (error) {
    reply.code(401).send(httpResponse({ error: (error as Error).message }))
  }
}
