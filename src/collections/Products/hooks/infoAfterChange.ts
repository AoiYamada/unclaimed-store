import type { FieldHook, PayloadRequest } from 'payload'

export const getCategoriesTemplate = async (categoryId: string, req: PayloadRequest) => {
  try {
    const category = await req.payload.findByID({
      id: categoryId,
      collection: 'categories',
      depth: 0,
    })

    return category.template
  } catch (error) {
    throw error
  }
}

export const infoAfterChange: FieldHook = async ({ data, operation, req }) => {
  if (
    data &&
    data?.categories.length > 0 &&
    (['create', 'update'] as (string | undefined)[]).includes(operation)
  ) {
    // always get the first category's template
    let info = await getCategoriesTemplate(data.categories[0], req)
  }

  return
}
