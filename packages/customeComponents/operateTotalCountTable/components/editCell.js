import { parseOptionsConfig } from '../../../HForm/modules/OptionsParser';
import AsyncValidator from 'async-validator';
import './style/error-style.css';

function noop() {}

export default {
  name: 'EditCell',
  // mixins: [validationMixin],
  components: {},
  data() {
    return {
      stateValue: this.value,
      renderValueMap: {
        input: 'a-input',
        select: 'a-select'
      },
      filedProps: {},
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {}
    };
  },
  watch: {
    value(val) {
      this.stateValue = val;
      if (this.edit) {
        this.validate('blur')
      }
    }
  },
  computed: {
    isRequired() {
      const rules = this.getRules();
      let isRequired = false;
      if (rules && rules.length) {
        rules.every(rule => {
          if (rule.required) {
            isRequired = true;
            return false;
          }
          return true;
        });
      }
      return isRequired;
    }
  },
  props: {
    value: {
      type: [String, Number, Date, Function],
      default: '',
      required: true
    },
    type: {
      type: String,
      default: '',
      required: true
    },
    edit: {
      type: Boolean,
      default: true
    },
    optionsConfig: {
      type: Object,
      default: () => {
        return {};
      }
    },
    rules: {
      type: Array,
      default: () => {
        return [];
      }
    },
    dataIndex: {
      type: String,
      default: '',
      required: true
    }
  },
  methods: {
    /**
     * @description 解析字段
     * @param {String} name
     * @return {Boolean} true
     * @Modify
     */
    parseFiled() {
      if (JSON.stringify(this.optionsConfig) !== '{}') {
        this._parseOptions({ optionsConfig: this.optionsConfig });
      }
    },
    /**
     * @description: 解析选项配置
     * @param {Object} element 表单元素Json
     */
    _parseOptions(element) {
      const elementClone = JSON.parse(JSON.stringify(element));
      const decodeResult = parseOptionsConfig(elementClone, this);
      if (decodeResult instanceof Promise) {
        decodeResult.then(res => {
          this.$set(this.filedProps, 'options', res);
        });
      } else {
        this.$set(this.filedProps, 'options', decodeResult);
      }
    },
    validate(trigger, callback = noop) {
      this.validateDisabled = false;
      const rules = this.getFilteredRule(trigger);
      if (!rules || rules.length === 0) {
        callback();
        return true;
      }
      this.validateState = 'validating';
      const descriptor = {};
      if (rules && rules.length > 0) {
        rules.forEach(rule => {
          delete rule.trigger;
        });
      }
      descriptor[this.dataIndex] = rules;
      const validator = new AsyncValidator(descriptor);
      const model = {};
      model[this.dataIndex] = this.stateValue;
      validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
        this.validateState = errors ? 'error' : 'success';
        this.validateMessage = errors ? errors[0].message : '';
        callback(this.validateMessage, invalidFields);
        this.$emit('validate', this.validateState, this.validateMessage);
        /*this.FormContext &&
          this.FormContext.$emit &&
          this.FormContext.$emit('validate', this.dataIndex, !errors, this.validateMessage || null);*/
      });
    },
    getRules() {
      let formRules = this.rules;
      const requiredRule =
        this.required !== undefined ? { required: !!this.required, trigger: 'blur' } : [];
      formRules = formRules || [];
      return [].concat(formRules || []).concat(requiredRule);
    },
    getFilteredRule(trigger) {
      const rules = this.getRules();
      return rules
        .filter(rule => {
          if (!rule.trigger || trigger === '') return true;
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.indexOf(trigger) > -1;
          } else {
            return rule.trigger === trigger;
          }
        })
        .map(rule => ({ ...rule }));
    },
    onFieldBlur() {
      this.validate('blur');
    },
    onFieldChange() {
      if (this.validateDisabled) {
        this.validateDisabled = false;
        return;
      }
      this.validate('change');
    },
    clearValidate() {
      this.validateState = '';
      this.validateMessage = '';
      this.validateDisabled = false;
    }
  },
  mounted() {
    this.parseFiled();
    if (this.edit) {
      this.validate('blur')
    }
  },
  render() {
    const { validateState, validateMessage } = this;
    const filedTag = this.renderValueMap[this.type];
    const errorClass = {
      'has-feedback': validateState,
      'has-success': validateState === 'success',
      'has-warning': validateState === 'warning',
      'has-error': validateState === 'error',
      'is-validating': validateState === 'validating'
    };
    const filed = (
      <div>
        <filedTag
          v-model={this.stateValue}
          style={{ width: '100%' }}
          {...{ props: { ...this.filedProps } }}
          class={errorClass}
          on-change={() => {
            this.$emit('input', this.stateValue);
            this.onFieldChange();
          }}
          on-blur={() => this.onFieldBlur()}
        />
        {validateState === 'error' ? <div class={'form-explain'}>{validateMessage}</div> : ''}
      </div>
    );
    return <div>{this.edit ? filed : this.stateValue}</div>;
  }
};
