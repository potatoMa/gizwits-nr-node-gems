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
      body: JSON.stringify({
        appKey: 'string',
        data,
        version: '1.0'
      }),
    }, function(error, response) {
      if (!error && response.statusCode == 200 && JSON.parse(response.body).code === '200') {
        res(JSON.parse(response.body));
      } else {
        rej(response);
      }
    });
  });
}