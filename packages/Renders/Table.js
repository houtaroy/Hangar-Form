import { pick } from 'lodash';

function renderTable(h, element) {
  const attr = {
    class: pick(element.options, ['bright', 'small', 'bordered']),
    style: element.options.customStyle
  };
  return (
    <table class="kk-table-9136076486841527" {...attr}>
      {this._renderElements(element.trs)}
    </table>
  );
}

function renderTd(h, element) {
  if (element.colspan && element.rowspan) {
    return (
      <td class="table-td" colSpan={element.colspan} rowSpan={element.rowspan}>
        {this._renderChildren(element)}
      </td>
    );
  }
}

export { renderTable, renderTd };
