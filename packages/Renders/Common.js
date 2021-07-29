import { has, get } from 'lodash';

import { excludeFormElementTypes, elementChildrenKeys } from '../Configs';
import ComponentPropParser from '../Parsers/ComponentPropParser';

function renderElements(elements) {
  const result = [];
  elements.forEach(element => {
    if (!get(element, 'options.hidden', false)) {
      result.push(
        excludeFormElementTypes.includes(element.type)
          ? renderElement(element)
          : renderFormElement(element)
      );
    }
  });
  return result;
}

function renderElement(element) {
  const Tag = getTag(element.type);
  if (has(this.constantRender, Tag)) {
    return this.constantRender[Tag](element);
  }
  const attrs = renderTagAttrs(Tag, element);
  if (element.model) {
    return (
      <Tag v-model={this.data[element.model]} {...attrs}>
        {renderElements(getElementChildren(element))}
      </Tag>
    );
  }
  return <Tag {...attrs}>{renderElements(getElementChildren(element))}</Tag>;
}

function renderFormElement(element) {
  const FormTag = this._getTag('formItem');
  return (
    <FormTag
      v-show={element.options && !element.options.hidden}
      {...{
        props: ComponentPropParser.parse(
          FormTag,
          element,
          this.antFormModalItemAttrs,
          {
            prop: element.model
          },
          { rules: get(element, 'options.disabled') ? undefined : element.rules }
        )
      }}
      style={this.antFormModalItemAttrs.style}>
      {renderElement(element)}
    </FormTag>
  );
}

function renderTagAttrs(h, Tag, element) {
  return {
    ref: element.key,
    class: element.class ? element.class.split(',') : '',
    style: this._renderStyle(element),
    props: this._renderTagProps(Tag, element),
    on: element.listeners
  };
}

function getElementChildren(element) {
  for (const key of elementChildrenKeys) {
    if (has(element, key)) {
      return element[key];
    }
  }
}

export { renderTagAttrs };
