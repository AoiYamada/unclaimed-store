import { RichTextCustomElement } from '@payloadcms/richtext-slate'
import Button from './Button'
import Element from './Element'
import WithLargeBody from './plugin'

const richTextLargeBody: RichTextCustomElement = {
  name: 'large-body',
  Button,
  Element,
  plugins: [WithLargeBody],
}

export default richTextLargeBody
