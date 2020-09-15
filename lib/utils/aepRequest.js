var request = require('request');
module.exports = function aepRequest({ config, url, data, method }) {
  return new Promise(function (res, rej) {
    request({
      url: `${config.settings.aepUrl}${url}`,
      method,
      headers: {
        'Content-Type': "application/json;charset=UTF-8",
        Authorization: config.settings.aepToken,
      },
      body: data,
    }, function(error, response) {
      if (!error && response.statusCode == 200) {
        const body = JSON.parse(response.body);
        if (body.code === 0) {
          res(body);
        } else {
          rej(body);
        }
      } else {
        rej(response);
      }
    });
  });
}