export default {
  uuid: function getUuid() {
    let i;
    let random;
    let uuid = '';
    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 :
        (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  },
  pluralize: function pluralize(count, word) {
    return count === 1 ? word : word + 's';
  },
  store: function store(namespace, data = false) {
    let rtnVal;
    let todos;
    if (data) {
      rtnVal = localStorage.setItem(namespace, JSON.stringify(data));
    } else {
      todos = localStorage.getItem(namespace);
      rtnVal = (todos && JSON.parse(todos)) || [];
    }
    return rtnVal;
  }
};
