'use client'

import { FC, useEffect, useMemo, useState } from 'react'
import {
  Button,
  ReactSelect,
  useAllFormFields,
  useFormFields,
  useConfig,
  useDocumentInfo,
  useForm,
  useTranslation,
  withCondition,
} from '@payloadcms/ui'
import { Option } from '@payloadcms/ui/elements/ReactSelect'
import * as qs from 'qs-esm'
import { Category, Product } from '@/payload-types'
import { FormField } from 'payload'
import { reduceFieldsToValues } from 'payload/shared'

type Info = Product['info']
type SelectOption = Option<Info>
type InfoFormField = [FormField, (template: Info) => void]

// http://localhost:3001/api/products/66a4d2d55fb31419658e280a?draft=true

export const ApplyTemplateComponent: FC = withCondition(() => {
  const [isClient, setIsClient] = useState(false)

  const { id, collectionSlug } = useDocumentInfo()
  const { submit } = useForm()
  const [info, dispatchInfo] = useFormFields<InfoFormField>(([fields, dispatch]) => {
    const dispatchField = (template: Info) => {
      dispatch({
        type: 'UPDATE',
        path: 'info',
        value: [...(template ?? []), ...((fields.info.value as Info) ?? [])],
      })
    }

    return [fields.info, dispatchField]
  })
  const [fields] = useAllFormFields()
  const formData = reduceFieldsToValues(fields, true)
  const categoriesField = useFormFields(([fields]) => fields.categories)
  const categories = useMemo(() => categoriesField.value as Category[], [categoriesField.value])
  const config = useConfig()
  const { i18n } = useTranslation()

  const [options, setOptions] = useState<SelectOption[]>([])
  const [value, setValue] = useState<SelectOption>()

  const {
    serverURL,
    routes: { api },
  } = config

  useEffect(() => {
    // https://nextjs.org/docs/messages/react-hydration-error
    setIsClient(true)
  }, [])

  useEffect(() => {
    fetch(`${serverURL}${api}/categories`, {
      body: qs.stringify({
        depth: 0,
        draft: true,
        // FIXME: Don't hardcode. a hard-coded limit, align with the maxRows in the relationship field
        limit: 5,
        where: {
          id: {
            in: categories,
          },
        },
      }),
      credentials: 'include',
      headers: {
        'Accept-Language': i18n.language,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-HTTP-Method-Override': 'GET',
      },
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        setOptions(categoriesToOptions(data.docs))
      })
  }, [api, categories, i18n.language, serverURL])

  const handleChange = (option: Option | Option[]) => {
    setValue(option as SelectOption)
  }

  const handleApply = () => {
    const template = value?.value

    if (!template || template.length === 0) {
      return
    }

    // this don't trigger UI update
    dispatchInfo(template)

    // hack to trigger slate UI update, necessary to save the data once the template is applied
    // modified from payload source code `packages/ui/src/elements/SaveDraftButton/index.tsx`
    setTimeout(() => {
      // next tick after dispatchInfo
      submit({
        action: `${serverURL}${api}/${collectionSlug}/${id}?draft=true`,
        method: 'PATCH',
        overrides: {
          _status: 'draft',
        },
        skipValidation: true,
      })
    }, 0)
  }

  if (!info.passesCondition) {
    return null
  }

  return isClient ? (
    <div
      style={{
        // FIXME: use tailwind
        marginBottom: '25px',
      }}
    >
      <label className="field-label">Apply a selected template</label>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        <div
          style={{
            flexGrow: 1,
          }}
        >
          <ReactSelect onChange={handleChange} options={options} value={value} />
        </div>
        {/* FIXME: remove the top & bottom margin */}
        <Button className="apply-btn" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  ) : null
})

// helpers
const categoriesToOptions = (categories: Category[]): SelectOption[] =>
  categories.map((category) => ({
    value: category.template,
    label: category.title,
  }))
