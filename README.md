# eslint-plugin-import-grouping-rule

Group imports from the same unit together and separate groups by a blank line

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-import-grouping-rule`:

```sh
npm install eslint-plugin-import-grouping-rule --save-dev
```

## Usage

In your [configuration file](https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file), import the plugin `eslint-plugin-import-grouping-rule` and add `plugin-grouping-rule` to the `plugins` key:

```js
import plugin-grouping-rule from "eslint-plugin-import-grouping-rule";

export default [
    {
        plugins: {
            plugin-grouping-rule
        }
    }
];
```


Then configure the rules you want to use under the `rules` key.

```js
import plugin-grouping-rule from "eslint-plugin-import-grouping-rule";

export default [
    {
        plugins: {
            plugin-grouping-rule
        },
        rules: {
            "plugin-grouping-rule/import-grouping": "warn"
        }
    }
];
```



## Configurations

<!-- begin auto-generated configs list -->
TODO: Run eslint-doc-generator to generate the configs list (or delete this section if no configs are offered).
<!-- end auto-generated configs list -->



## Rules

<!-- begin auto-generated rules list -->
TODO: Run eslint-doc-generator to generate the rules list.
<!-- end auto-generated rules list -->


