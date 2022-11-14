module.exports = {
    parser: '@typescript-eslint/this.parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    parseOptions: {
        ecmaVersion: 2018,
        sourceType: 'modules',
    },
    rules: {},
};
