export default function objectMap (obj, fn) {
  Object.assign({}, ...Object.keys(obj).map(k => ({[k]: fn(obj[k])})))
};
