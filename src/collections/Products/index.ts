import type { CollectionConfig } from 'payload'

import { admins } from '../../access/admins'
import { Archive } from '../../blocks/ArchiveBlock'
import { CallToAction } from '../../blocks/CallToAction'
import { Content } from '../../blocks/Content'
import { MediaBlock } from '../../blocks/MediaBlock'
import { slugField } from '../../fields/slug'
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock'
// import { beforeProductChange } from './hooks/beforeChange'
import { deleteProductFromCarts } from './hooks/deleteProductFromCarts'
import { revalidateProduct } from './hooks/revalidateProduct'
import { checkRole } from '../Users/checkRole'
import { infoAfterChange } from './hooks/infoAfterChange'

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status'],
    preview: (doc) => {
      return `/next/preview?url=${encodeURIComponent(`/products/${doc.slug}`)}&secret=${
        process.env.PAYLOAD_PUBLIC_DRAFT_SECRET
      }`
    },
  },
  hooks: {
    // FIXME: we don't use stripe
    // beforeChange: [beforeProductChange],
    afterChange: [revalidateProduct],
    // afterRead: [populateArchiveBlock],
    afterDelete: [deleteProductFromCarts],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: (args) => {
      if (checkRole(['admin'], args.req.user)) {
        return true
      }

      return { _status: { not_equals: 'draft' } }
    },
    create: admins,
    update: admins,
    delete: admins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'info',
              type: 'richText',
              admin: {
                condition: (data) => data.categories.length > 0,
              },
              hooks: {
                afterChange: [infoAfterChange],
              },
            },
          ],
        },
        {
          label: 'Product Details',
          // Fields are synced with Stripe Price object for the possibility of integration in the future
          fields: [
            {
              name: 'price',
              type: 'group',
              fields: [
                {
                  name: 'active',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'currency',
                  type: 'select',
                  hasMany: false,
                  options: [
                    {
                      label: 'NTD',
                      value: 'ntd',
                    },
                  ],
                  defaultValue: 'ntd',
                },
                {
                  name: 'unit_amount',
                  label: 'Price in cents',
                  type: 'number',
                  min: 0,
                  required: true,
                  admin: {
                    step: 1,
                  },
                  validate: async (val: number) => {
                    if (parseInt(String(val)) === val) {
                      return true
                    }

                    return 'Price must be an integer'
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
    },
    slugField(),
    {
      name: 'skipSync',
      label: 'Skip Sync',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
  ],
}

export default Products

// Not use, but keep for reference
// https://docs.stripe.com/api/prices/object
type StripePrice = {
  id: string
  object: 'price'
  active: boolean
  created: number // timestamp number
  currency: 'ntd' // iso currency code
  custom_unit_amount: {
    maximum: number | null
    minimum: number | null
    preset: number | null
  } | null
  livemode: boolean
  lookup_key: string | null
  metadata: Record<string, string> // https://docs.stripe.com/metadata
  nickname: string | null
  product: string // product id
  billing_scheme: 'per_unit' | 'tiered'
  recurring: {
    aggregate_usage: 'last_during_period' | 'last_ever' | 'max' | 'sum' | null
    interval: 'day' | 'week' | 'month' | 'year'
    interval_count: number
    meter: string | null
    usage_type: 'licensed' | 'metered'
  } | null
  tax_behavior: 'exclusive' | 'inclusive' | 'unspecified' | null
  tiers_mode: 'graduated' | 'volume' | null
  tiers:
    | {
        flat_amount: number | null
        flat_amount_decimal: string | null
        unit_amount: number | null
        unit_amount_decimal: string | null
        up_to: number | null
      }[]
    | null
  transform_quantity: {
    divide_by: number
    round: 'up' | 'down'
  } | null
  type: 'one_time' | 'recurring'
  unit_amount: number // unit amount in cents to be charged
  unit_amount_decimal: string // string representation of unit_amount, up to 12 decimal places
}
