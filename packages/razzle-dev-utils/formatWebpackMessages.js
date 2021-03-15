'use strict';

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

function razzleFormatWebpackMessages(messages) {
  return process.env.WEBPACK_VERSION === 5
    ? formatWebpackMessages(
        ['errors', 'warnings'].reduce(
          function(result, item) {
            result[item] = result[item].concat(
              messages[item].map(function(stat) {
                return stat.message;
              })
            );
            return result;
          },
          { errors: [], warnings: [] }
        )
      )
    : formatWebpackMessages(messages);
}
module.exports = razzleFormatWebpackMessages;
