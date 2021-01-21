module.exports = {
  get: function (key) { return global.shadowDeviceDataCache[key]; },
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