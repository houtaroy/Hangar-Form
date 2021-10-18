<template>
  <div>
    <k-form-design hideResetHint title="表单设计器" :fields="fields" />
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
      ]
    };
  }
};
</script>
