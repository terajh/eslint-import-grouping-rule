# test (`import-grouping-rule`)

이 규칙의 기원에 대해 설명합니다. 이 규칙은 코드의 import 구문을 그룹화하여 가독성을 높이고, 관련된 import 구문을 함께 묶어 관리하기 쉽게 합니다.

## Rule Details

이 규칙은 import 구문이 그룹화되어 있으며, 각 그룹은 주석으로 구분되어야 함을 목표로 합니다. 이를 통해 코드의 구조를 명확히 하고, 유지보수를 용이하게 합니다.

Examples of **incorrect** code for this rule:

```js
import { watch } from 'vue';
import { useState } from 'react';
```

Examples of **correct** code for this rule:

```js
// vue
import { watch } from 'vue';

// react
import { useState } from 'react';
```

### Options

옵션이 있는 경우 여기에 설명합니다. 그렇지 않으면 이 섹션을 삭제합니다.

## When Not To Use It

이 규칙을 끄는 것이 적절한 경우에 대한 간단한 설명을 제공합니다. 예를 들어, 작은 스크립트 파일에서는 import 구문 그룹화가 필요하지 않을 수 있습니다.

## Further Reading

이 규칙이 다루는 문제를 설명하는 다른 링크가 있는 경우 여기에 포함합니다. 
- [ESLint Documentation](https://eslint.org/docs/user-guide/configuring)
- [JavaScript Import Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)