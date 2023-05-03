import '@fastify/jwt'
import { Role } from './roles'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: Role
    }
  }
}
