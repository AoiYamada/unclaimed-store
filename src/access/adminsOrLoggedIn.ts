import type { Access } from 'payload/config'
import { checkRole } from '../collections/Users/checkRole'
import { User } from '@/payload-types'

export const adminsOrLoggedIn: Access<User> = ({ req }) => {
  if (checkRole(['admin'], req.user)) {
    return true
  }

  return !!req.user
}
