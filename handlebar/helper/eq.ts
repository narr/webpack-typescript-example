export default (currentfilter, filter, options) => {
  // options.inverse(this); ==> for {{else}}
  return currentfilter === filter ? options.fn(this) : options.inverse(this);
};
