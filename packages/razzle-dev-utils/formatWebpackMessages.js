'use strict';

const webpackMajor = require('./webpackMajor');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

function razzleFormatWebpackMessages(messages) {
  return webpackMajor === 5
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
