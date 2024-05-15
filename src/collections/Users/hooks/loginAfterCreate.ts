import { User } from '@/payload-types'
import { CollectionAfterChangeHook } from 'payload/types'

export const loginAfterCreate: CollectionAfterChangeHook<User> = async ({
  doc,
  req,
  req: {
    payload,
    data,
    // Payload 3 removed this field
    // res,
  },
  operation,
}) => {
  if (operation === 'create' && data && !req.user) {
    // Payload 3's types are a bit off here, so we need to cast `data` as `User`
    const { email, password } = data as unknown as User

    if (email && password) {
      // TODO: need to verify that `payload.login` works as expected in Payload 3
      const { user, token } = await payload.login({
        collection: 'users',
        data: { email, password },
        req,
        // Payload 3 removed this field
        // res
      })

      return {
        ...doc,
        token,
        user,
      }
    }
  }

  return doc
}
