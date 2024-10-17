import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const config = [...compat.extends('react-app'), {
    files: ['**/*.{js,jsx}'],
    rules: {
        semi: ['warn', 'always'],
        'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0, }],
        quotes: ['warn', 'single'],
    },
}];

export default config;