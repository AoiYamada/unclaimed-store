import type { User } from '../../payload-types'

export const checkRole = (
  allRoles: NonNullable<User['roles']> = [],
  user?: User | null,
): boolean => {
  if (!user) {
    return false
  }

  if (
    allRoles.some((role) => {
      return user?.roles?.some((userRole) => userRole === role)
    })
  ) {
    return true
  }

  return false
}
