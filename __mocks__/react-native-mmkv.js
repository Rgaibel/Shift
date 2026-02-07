class MMKV {
  constructor() {
    this.storage = new Map();
  }

  set(key, value) {
    this.storage.set(key, value);
  }

  getString(key) {
    return this.storage.get(key) || undefined;
  }

  getNumber(key) {
    return this.storage.get(key);
  }

  getBoolean(key) {
    return this.storage.get(key);
  }

  delete(key) {
    this.storage.delete(key);
  }

  clearAll() {
    this.storage.clear();
  }

  getAllKeys() {
    return Array.from(this.storage.keys());
  }
}

module.exports = {MMKV};
module.exports.default = {MMKV};
