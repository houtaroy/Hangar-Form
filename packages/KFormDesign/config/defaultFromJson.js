import { jsonMinimumVersion } from '../../HForm/config'

export const DefaultFormJson = {
  frame: 'ant',
  version: jsonMinimumVersion,
  list: [],
  config: {
    layout: 'horizontal',
    labelCol: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 },
    labelWidth: 100,
    labelLayout: 'flex',
    wrapperCol: { xs: 18, sm: 18, md: 18, lg: 18, xl: 18, xxl: 18 },
    hideRequiredMark: false,
    customStyle: '',
    lifecycle: [
      {
        name: 'created',
        body: ''
      },
      {
        name: 'mounted',
        body: ''
      }
    ],
    computed: [],
    watch: [],
    filter: [],
    methods: []
  }
}