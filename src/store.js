const fs = require("node:fs/promises");

/**
 * Сховище відгуків: масив у пам’яті з необов’язковим збереженням у файл JSON.
 * @param {string|null} file шлях до файлу або null (лише пам’ять, для тестів)
 */
function createStore(file = null) {
  const items = [];
  return {
    all() {
      return [...items];
    },
    async add(item) {
      items.push(item);
      if (file) await fs.writeFile(file, JSON.stringify(items, null, 2));
      return item;
    },
  };
}

module.exports = { createStore };
