import { jsonMinimumVersion } from '../Configs';

function checkJsonVersion(version) {
  return compare(version, jsonMinimumVersion) > -1;
}

function compare(version1, version2) {
  if (version1 === version2) {
    return 0;
  }
  let p1 = 0,
    p2 = 0;
  const n1 = version1.length,
    n2 = version2.length;
  while (p1 < n1 || p2 < n2) {
    const temp1 = get_next_chunk(version1, n1, p1);
    const temp2 = get_next_chunk(version2, n2, p2);
    if (temp1.num != temp2.num) {
      return temp1.num > temp2.num ? 1 : -1;
    }
    p1 = temp1.p;
    p2 = temp2.p;
  }
  return 0;
}

function get_next_chunk(version, n, p) {
  if (p > n - 1) return { num: 0, p: p };
  let p_end = p;
  while (p_end < n && version[p_end] != '.') {
    p_end += 1;
  }
  const result = parseInt(p_end != n - 1 ? version.slice(p, p_end) : version.slice(p, n));
  p = p_end + 1;
  return {
    num: result,
    p: p
  };
}

export { checkJsonVersion, compare };

export default {
  checkJsonVersion,
  compare
};
