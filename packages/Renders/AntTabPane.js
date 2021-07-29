function renderAntTabPane(h, element) {
  return (
    <a-tab-pane key={element.value} tab={element.label}>
      {this._renderChildren(element)}
    </a-tab-pane>
  );
}

export { renderAntTabPane };
