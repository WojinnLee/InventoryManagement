const AppError = require("./app-error");

/**
 * Parse a value to a positive integer (> 0).
 * Accepts numbers and numeric strings (e.g. from form data).
 * @param {*} value
 * @param {string} fieldName - used in error message
 * @returns {number}
 */
function parsePositiveInt(value, fieldName) {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) {
    throw new AppError(400, `${fieldName} must be a positive integer`);
  }
  return n;
}

/**
 * Parse a value to a non-negative integer (>= 0).
 * Accepts numbers and numeric strings.
 * @param {*} value
 * @param {string} fieldName - used in error message
 * @returns {number}
 */
function parseNonNegativeInt(value, fieldName) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    throw new AppError(400, `${fieldName} must be a non-negative integer`);
  }
  return n;
}

/**
 * Parse optional non-negative integer.
 * Returns undefined if value is undefined, otherwise validates and returns integer.
 * @param {*} value
 * @param {string} fieldName
 * @returns {number|undefined}
 */
function parseOptionalNonNegativeInt(value, fieldName) {
  if (value === undefined) return undefined;
  return parseNonNegativeInt(value, fieldName);
}

module.exports = {
  parsePositiveInt,
  parseNonNegativeInt,
  parseOptionalNonNegativeInt,
};
