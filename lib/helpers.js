/**
 * Helpers
 */

/**
 * [pascalCaseToCamelCase description]
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */

export function pascalCaseToCamelCase(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
}


/**
 * [camelCaseToDashCase description]
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export function camelCaseToDashCase(str) {
    return str.replace(/[A-Z]/g, ($1) => {
        return '-' + $1.toLowerCase();
    });
}
