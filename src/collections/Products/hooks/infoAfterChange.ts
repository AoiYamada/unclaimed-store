import type { FieldHook } from 'payload/types'
import payload from 'payload'

export const getCategoriesTemplate = async (categoryId: string) => {
  try {
    const category = await payload.findByID({
      collection: 'categories',
      id: categoryId,
    });

    return category.template;
  } catch (error) {
    throw error;
  }
};

export const infoAfterChange: FieldHook = async ({ data, operation }) => {
  if (data && (operation === 'create' || operation === 'update')) {
    data.info = await getCategoriesTemplate(data.categories);
  }

  return data;
};
