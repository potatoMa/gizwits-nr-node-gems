var request = require('request');
module.exports = function aepRequest({ url, data, method }) {
  return new Promise(function (res, rej) {
    request({
      url: `http://gems-api/${url}`,
      method,
      headers: {
        'Content-Type': "application/json;charset=UTF-8",
        Authorization: 'giz-node-red-runtime-token',
      },
      body: data,
    }, function(error, response) {
      if (!error && response.statusCode == 200) {
        const body = JSON.parse(response.body);
        console.log(body, '======aepResponseBody======');
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