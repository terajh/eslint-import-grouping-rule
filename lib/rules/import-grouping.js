/**
 * @fileoverview test
 * @author terajh
 */
'use strict';

// ------------------------------------------------------------------------------
// Utility Functions
// ------------------------------------------------------------------------------

function getGroups(options) {
  return options || [
    { regex: /^vue$/, label: '// vue' },
    { regex: /(?:\btypes\b|\bcommon\b)$/, label: '// types' }, // Match exact words using \b
    { regex: /\bconstants\b/, label: '// constants' }, // Removed unnecessary .*
    { regex: /^@\/[^/]+\/(?:mock|selector)$/, label: '// etc' }, // Use [^/]+ to prevent backtracking
    { regex: /^@\/components(?:\/[^/]+)*\.vue$/, label: '// components' }, // Use .+ instead of .*
    { regex: /^@\/views|.+\.vue$/, label: '// views' }, // Applied the same rule
    { regex: /^@\/sections|.+\.vue$/, label: '// sections' },
    { regex: /^@\/use/, label: '// use' },
    { regex: /^@\/services/, label: '// services' },
    { regex: /^@\/utils/, label: '// utils' },
  ];
}

function getPriorityImportKeys(groups) {
  return groups.map(group => group.label); // Return the order as provided by the user
}

function createImportBlockNode(importNodes) {
  return {
    type: 'ImportBlock',
    range: [importNodes[0].range[0], importNodes[importNodes.length - 1].range[1]],
    loc: {
      start: importNodes[0].loc.start,
      end: importNodes[importNodes.length - 1].loc.end,
    },
  };
}

function groupImports(importNodes, groups) {
  const groupedImports = groups.reduce((acc, group) => {
    acc[group.label] = [];
    return acc;
  }, {});

  importNodes.forEach(importNode => {
    const importSource = importNode.source.value;
    const group = groups.find(g => g.regex.test(importSource));
    if (group) {
      groupedImports[group.label].push(importNode);
    } else {
      if (!groupedImports['// etc']) {
        groupedImports['// etc'] = [];
      }
      groupedImports['// etc'].push(importNode);
    }
  });

  return groupedImports;
}

function validateImportGrouping(_groupedImports, sourceCode) {
  let isValid = true;
  Object.keys(_groupedImports).forEach(label => {
    const labelType = label.replace('//', '');
    const _groupImports = _groupedImports[label];
    if (_groupImports.length === 0) return;

    const beforeImportComments = sourceCode.getCommentsBefore(_groupImports[0]);
    const hasNoComment = beforeImportComments.length === 0;
    const hasDifferentComment = !hasNoComment && beforeImportComments.at(-1).value !== labelType;

    if (hasNoComment || hasDifferentComment) {
      isValid = false;
    }
  });

  return isValid;
}

function generateGroupedImportText(groupedImports, priorityImportKeys, sourceCode, addedLabels) {
  let groupedText = '';
  priorityImportKeys.forEach(label => {
    const _groupImports = groupedImports[label];
    if (_groupImports.length > 0) {
      const groupText = _groupImports.map(importNode => sourceCode.getText(importNode)).join('\n');
      if (!addedLabels.has(label)) {
        addedLabels.add(label);
        if (groupedText.length > 0) groupedText += '\n'; // Do not add a newline before the first group
        groupedText += `${label}\n`; // Add comment
      }
      groupedText += `${groupText}\n`; // Add grouped imports
    }
  });

  return groupedText;
}

function applyFixes(fixer, importNodes, comments, sourceCode, groupedText) {
  const [firstImportStart] = importNodes[0].range;
  const beforeFirstImport = sourceCode.text[firstImportStart - 1]; // Get the character before the first import
  const fixes = [...comments.map(comment => fixer.remove(comment))];

  if (/\s/.test(beforeFirstImport)) {
    fixes.push(fixer.removeRange([firstImportStart - 1, firstImportStart]));
  }

  fixes.push(
    fixer.replaceTextRange(
      [firstImportStart, importNodes[importNodes.length - 1].range[1]],
      groupedText
    )
  );
  return fixes;
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure imports are grouped and preceded by a comment',
      category: 'Stylistic Issues',
      recommended: false,
    },
    messages: {
      importGroupingError: 'Group imports from the same unit together and separate groups by a blank line',
    },
    fixable: 'code',
    /**
     * Customizable grouping configuration
     *
     * @example
     * {
     *  "rules": {
     *    "import-grouping": ["error", [
     *      { "regex": "^vue$", "label": "// vue" },
     *      { "regex": "(.*types|common$)", "label": "// types" },
     *      { "regex": ".*constants", "label": "// constants" },
     *      { "regex": "^@/components|.*.vue", "label": "// components" },
     *      { "regex": "^@/utils", "label": "// utils" }
     *    ]]
     *  }
     * }
     */
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            regex: { type: 'string' },
            label: { type: 'string' },
          },
          required: ['regex', 'label'],
          additionalProperties: false,
        },
      },
    ],
  },

  create(context) {
    const addedLabels = new Set(); // Track already added comments
    const groups = getGroups(context.options[0]); // Get user-defined groups or use default

    const priorityImportKeys = getPriorityImportKeys(groups);

    return {
      Program(node) {
        const sourceCode = context.getSourceCode();
        const importNodes = node.body.filter(n => n.type === 'ImportDeclaration');
        if (importNodes.length === 0) return;

        const importBlockNode = createImportBlockNode(importNodes);
        const comments = sourceCode.getCommentsBefore(importNodes[0]);

        const groupedImports = groupImports(importNodes, groups);

        if (validateImportGrouping(groupedImports, sourceCode)) return;

        const groupedText = generateGroupedImportText(groupedImports, priorityImportKeys, sourceCode, addedLabels);

        context.report({
          node: importBlockNode,
          messageId: 'importGroupingError',
          fix: fixer => applyFixes(fixer, importNodes, comments, sourceCode, groupedText),
        });
      },
    };
  },
};