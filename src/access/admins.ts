import { User } from '@/payload-types'
import { checkRole } from '../collections/Users/checkRole'
import { FieldAccess } from 'payload/types'

export const admins: FieldAccess<User> = ({ req: { user } }) => checkRole(['admin'], user)
