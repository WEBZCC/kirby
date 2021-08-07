
export default (name) => {
  if (window.panel.$vue["_context"].components[name] !== undefined) {
    return true;
  }

  return false;
};
