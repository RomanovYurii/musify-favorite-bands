const htmlHelpers = {
  parseContent: (content) => _.isArray(content) ? content.join('') : content,
  makeTBody: (content, props = '') => `<tbody ${props}>${htmlHelpers.parseContent(content)}</tbody>`,
  makeRow: (content, props = '') => `<tr ${props}>${htmlHelpers.parseContent(content)}</tr>`,
  makeHeaderCell: (content, props = '') => `<th ${props}>${htmlHelpers.parseContent(content)}</th>`,
  makeCell: (content, props = '') => `<td ${props}><div>${htmlHelpers.parseContent(content)}</div></td>`
};