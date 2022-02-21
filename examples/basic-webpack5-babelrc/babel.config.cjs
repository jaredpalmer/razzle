console.log("read")
function cb(caller) {
    console.log(caller);
}

module.exports = function (api) {
    api.caller(cb)
    return {};
}
