import { CollectionAfterDeleteHook } from 'payload/types'
import type { CartItems, Product } from '../../../payload-types'

export const deleteProductFromCarts: CollectionAfterDeleteHook<Product> = async ({ req, id }) => {
  const usersWithProductInCart = await req.payload.find({
    collection: 'users',
    overrideAccess: true,
    where: {
      'cart.items.product': {
        equals: id,
      },
    },
  })

  if (usersWithProductInCart.totalDocs > 0) {
    await Promise.all(
      usersWithProductInCart.docs.map(async (user) => {
        const { cart } = user
        const itemsWithoutProduct: CartItems =
          cart?.items?.filter((item) => item.product !== id) ?? []

        return req.payload.update({
          collection: 'users',
          id: user.id,
          data: {
            cart: {
              ...cart,
              // FIXME: the type is right, but the payload type is wrong
              // @ts-expect-error
              items: itemsWithoutProduct,
            },
          },
        })
      }),
    )
  }
}
