import js from "@eslint/js";
import sty from "@stylistic/eslint-plugin";
import { defineConfig } from "eslint/config";
import importSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		ignores: ["build.js", "dist/**"],
		plugins: {js, sty, importSort},
		extends: [
			"js/recommended",
			...tseslint.configs.recommended
		],
		languageOptions: {
			globals: {...globals.browser, ...globals.node},
			parserOptions: {
				ecmaVersion: 2018,
				sourceType: "module"
			}
		},
		rules: {
			"no-empty": ["warn", {allowEmptyCatch: true}],
			"importSort/imports": "error",

			"@typescript-eslint/no-unused-vars": ["warn", {caughtErrors: "none"}],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-expressions": "off",

			"sty/max-len": ["error", {code: 120}],
			"sty/linebreak-style": ["error", "unix"],
			"sty/eol-last": ["error", "never"],
			"sty/no-trailing-spaces": "error",
			"sty/no-multiple-empty-lines": ["error", {max: 1, maxBOF: 0, maxEOF: 0}],
			"sty/lines-between-class-members": ["error", "always", {
				exceptAfterSingleLine: true,
				exceptAfterOverload: true
			}],
			"sty/semi": ["error", "always", {omitLastInOneLineBlock: true}],
			"sty/semi-spacing": "error",
			"sty/indent": ["error", "tab"],
			"sty/dot-location": ["error", "property"],
			"sty/keyword-spacing": ["error", {
				overrides: {
					if: {after: false},
					for: {after: false},
					while: {after: false},
					switch: {after: false}
				}
			}],
			"sty/space-infix-ops": "error",
			"sty/space-unary-ops": "error",
			"sty/space-in-parens": "error",
			"sty/function-call-spacing": "error",
			"sty/space-before-function-paren": ["error", {
				anonymous: "never",
				named: "never",
				asyncArrow: "always",
				catch: "never"
			}],
			"sty/no-extra-parens": "error",
			"sty/arrow-spacing": "error",
			"sty/comma-spacing": "error",
			"sty/no-whitespace-before-property": "error",
			"sty/no-multi-spaces": "error",
			"sty/multiline-comment-style": ["error", "bare-block"],
			"sty/space-before-blocks": "error",
			"sty/padded-blocks": ["error", "never"],
			"sty/comma-dangle": "error",
			"sty/type-annotation-spacing": "error",
			"sty/type-generic-spacing": "error",
			"sty/type-named-tuple-spacing": "error",
			"sty/key-spacing": "error",
			"sty/array-bracket-spacing": ["error", "never"],
			"sty/array-bracket-newline": ["error", "consistent"],
			"sty/array-element-newline": ["error", "consistent"],
			"sty/computed-property-spacing": "error",
			"sty/object-curly-spacing": ["error", "never", {overrides: {ImportDeclaration: "always"}}],
			"sty/object-curly-newline": ["error", {consistent: true}],
			"sty/object-property-newline": ["error", {allowAllPropertiesOnSameLine: true}],
			"sty/quote-props": ["error", "as-needed"],
			"sty/curly-newline": ["error", {consistent: true}],
			"sty/brace-style": ["error", "1tbs", {allowSingleLine: true}]
		}
	}
]);