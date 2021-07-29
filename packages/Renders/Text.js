import { pick } from 'lodash';

function renderText(h, element) {
  const divAttrs = {
    style: `text-align: ${element.options.textAlign}`
  };
  const labelAttrs = {
    class: { 'ant-form-item-required': element.options.showRequiredMark },
    style: pick(element.options, ['fontFamily', 'fontSize', 'color'])
  };
  return (
    <div {...divAttrs}>
      <label {...labelAttrs} class={element.class} style={element.style}>
        {element.label}
      </label>
    </div>
  );
}

export { renderText };
