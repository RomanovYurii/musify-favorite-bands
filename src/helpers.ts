import _isArray from 'lodash/isArray';
import { Band } from './types';

type Content = string | string[];

export const tableHelpers = {
  parseContent: (content: Content) =>
    _isArray(content) ? content.join('') : content,
  makeTBody: (content: Content, props = '') =>
    `<tbody ${props}>${tableHelpers.parseContent(content)}</tbody>`,
  makeRow: (content: Content, props = '') =>
    `<tr ${props}>${tableHelpers.parseContent(content)}</tr>`,
  makeHeaderCell: (content: Content, props = '') =>
    `<th ${props}>${tableHelpers.parseContent(content)}</th>`,
  makeCell: (content: Content, props = '') =>
    `<td ${props}><div>${tableHelpers.parseContent(content)}</div></td>`,
};

export const getLocalStorageValue = (key: string): { [key: string]: Band } => {
  const item = localStorage.getItem(key);
  if (!item) {
    return {};
  }
  return JSON.parse(item);
};
