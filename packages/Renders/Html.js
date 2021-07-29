function renderHtml(h, element) {
  return <h-html v-model={this.data} {...this._renderTagAttrs('h-html', element)}></h-html>;
}

export { renderHtml };
