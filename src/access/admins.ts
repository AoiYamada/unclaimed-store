import type { User } from '@/payload-types'
import type { FieldAccess } from 'payload'
import { checkRole } from '../collections/Users/checkRole'

export const admins: FieldAccess<User> = ({ req: { user } }) => checkRole(['admin'], user)
