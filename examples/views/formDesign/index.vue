<template>
  <div>
    <k-form-design hideResetHint title="表单设计器" :fields="fields" :formDefinitionId="id" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      fields: [
        'input',
        'textarea',
        'number',
        'select',
        'checkbox',
        'radio',
        'date',
        'time',
        'treeSelect',
        'cascader',
        'text',
        'html',
        'hUpload',
        'hCommentOptions',
        'hDatePicker',
        'tabs',
        'grid',
        'table',
        'hWebOffice'
      ],
      id: '6151CE34-EE7C-907D-F3AA-D548E9C28504'
    };
  }
};
</script>
