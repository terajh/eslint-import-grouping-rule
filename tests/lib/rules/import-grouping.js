/**
 * @fileoverview test
 * @author import-grouping
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/import-grouping"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("import-grouping", rule, {
  valid: [
    // give me some code that won't trigger a warning
    `
// vue
import {watch} from 'vue';
    `
  ],

  invalid: [
    {
      code: `import {watch} from 'vue';`,
      output: `// vue\nimport {watch} from 'vue';\n`,
      errors: [{ messageId: "importGroupingError" }],
    },
  ],
});
