module.exports = {
  get: function (key) {
    if (global.shadowDeviceDataCache) {
      return global.shadowDeviceDataCache[key] || {};
    } else {
      return {}
    }
  },
  set: function (key, val) {
    if (global.shadowDeviceDataCache) {
      global.shadowDeviceDataCache[key] = val;
    } else {
      global.shadowDeviceDataCache = {
        [key]: val
      };
    }
  }
}