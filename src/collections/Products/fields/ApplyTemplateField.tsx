import { UIField } from 'payload'
import { ApplyTemplateComponent } from './components/ApplyTemplateComponent'

export const ApplyTemplateField: UIField = {
  name: 'Apply Template',
  type: 'ui',
  admin: {
    components: {
      Field: ApplyTemplateComponent,
    },
    // UI field cannot use condition, probably a bug, handled in the component
    // condition: (data) => data.categories.length > 0,
  },
}
