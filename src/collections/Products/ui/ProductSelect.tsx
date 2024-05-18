'use client'

import * as React from 'react'
import { useFormFields } from '@payloadcms/ui/forms/Form'
import { CopyToClipboard } from '@payloadcms/ui/elements'
import { Select } from '@payloadcms/ui/fields/Select'
import { OptionObject, TextField } from 'payload/types'

export const ProductSelect: React.FC<TextField> = (props) => {
  const { name, label } = props
  const [options, setOptions] = React.useState<OptionObject[]>([])

  const { value: stripeProductID } = useFormFields(([fields]) => fields[name])

  React.useEffect(() => {
    const getStripeProducts = async () => {
      const productsFetch = await fetch('/api/stripe/products', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const res = await productsFetch.json()

      if (res?.data) {
        const fetchedProducts = (res.data as { id: string; name: string }[]).reduce(
          (acc, item) => {
            acc.push({
              label: item.name || item.id,
              value: item.id,
            })
            return acc
          },
          [
            {
              label: 'Select a product',
              value: '',
            },
          ] as OptionObject[],
        )

        setOptions(fetchedProducts)
      }
    }

    getStripeProducts()
  }, [])

  const href = `https://dashboard.stripe.com/${
    process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
  }products/${stripeProductID}`

  return (
    <div>
      <p style={{ marginBottom: '0' }}>{typeof label === 'string' ? label : 'Product'}</p>
      <p
        style={{
          marginBottom: '0.75rem',
          color: 'var(--theme-elevation-400)',
        }}
      >
        {`Select the related Stripe product or `}
        <a
          href={`https://dashboard.stripe.com/${
            process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
          }products/create`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--theme-text' }}
        >
          create a new one
        </a>
        {'.'}
      </p>
      <Select {...props} label="" options={options} />
      {Boolean(stripeProductID) && (
        <div
          style={{
            marginTop: '-1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <span
              className="label"
              style={{
                color: '#9A9A9A',
              }}
            >
              {`Manage "${
                options.find((option) => option.value === stripeProductID)?.label || 'Unknown'
              }" in Stripe`}
            </span>
            <CopyToClipboard value={href} />
          </div>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: '600',
            }}
          >
            <a
              href={`https://dashboard.stripe.com/${
                process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
              }products/${stripeProductID}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {href}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
