const isEnvUndefined = process.env.NODE_ENV === undefined;
const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvTest = process.env.NODE_ENV === 'test';
module.exports = isEnvUndefined || isEnvDevelopment || isEnvTest;
