import { RichTextCustomElement } from '@payloadcms/richtext-slate'
import Button from './Button'
import Element from './Element'
import WithLabel from './plugin'

const richTextLabel: RichTextCustomElement = {
  name: 'label',
  Button,
  Element,
  plugins: [WithLabel],
}

export default richTextLabel
