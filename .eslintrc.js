module.exports = {
    'parserOptions': {
        'ecmaVersion': 6,
        'sourceType': 'script'
    },
    'env': {
        'es6': true,
        'node': true,
        'mocha': true
    },
    'extends': [
        'eslint:recommended',
        'airbnb-base',
    ],
    'rules': {
        'max-len': [
            'error',
            120,
            {'ignoreStrings': true}
        ],
        'indent': [
            'error',
            4
        ],
        'comma-dangle': [
            'error',
            'never'
        ],
        'linebreak-style': [0],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'import/no-extraneous-dependencies': [
            'error', {
                devDependencies: true
            }
        ],
        'no-plusplus': [
            'error', {
                'allowForLoopAfterthoughts': true
            }
        ],
        'no-underscore-dangle': [
            'error', {
                'allowAfterThis': true,
                'allowAfterSuper': true
            }
        ],
        'no-unused-vars': [
            'warn', {
                'vars': 'all',
                'args': 'after-used'
            }
        ],
        'prefer-arrow-callback': [
            'warn', {
                'allowNamedFunctions': true
            }
        ],
        'no-param-reassign': [
            'error', {
                'props': false
            }
        ]
    }
};
