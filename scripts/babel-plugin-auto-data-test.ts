/*
 * Babel plugin generated with AI that automatically injects data-test attributes
 * into JSX elements when className contains tokens from CSS Modules.
 *
 * Features:
 * - Builds test IDs from owner component name + CSS Module class tokens
 * - Skips elements that already define data-test/dataTest
 * - Skips React Fragments
 */

import type { Binding, NodePath } from '@babel/traverse'
import * as t from '@babel/types'

const CSS_MODULE_IMPORT_RE = /\.module\.(css)$/i

function getOwnerComponentName(path: NodePath): string {
  const componentNameFromFunction = (fnPath: NodePath | null): string => {
    if (!fnPath?.node) {
      return ''
    }

    if (fnPath.isFunctionDeclaration() && fnPath.node.id && /^[A-Z]/.test(fnPath.node.id.name)) {
      return fnPath.node.id.name
    }

    const parent = fnPath.parentPath
    if (!parent) {
      return ''
    }

    if (parent.isVariableDeclarator() && t.isIdentifier(parent.node.id) && /^[A-Z]/.test(parent.node.id.name)) {
      return parent.node.id.name
    }

    return ''
  }

  let current: NodePath | null = path

  while (current) {
    if (current.isFunctionDeclaration() || current.isFunctionExpression() || current.isArrowFunctionExpression()) {
      const functionName = componentNameFromFunction(current)
      if (functionName) {
        return functionName
      }
    }

    if (current.isClassDeclaration() && current.node.id && /^[A-Z]/.test(current.node.id.name)) {
      return current.node.id.name
    }

    current = current.parentPath
  }

  return ''
}

function isCssModuleBinding(binding: Binding | null | undefined): boolean {
  if (!binding?.path) {
    return false
  }

  if (
    !binding.path.isImportDefaultSpecifier() &&
    !binding.path.isImportNamespaceSpecifier() &&
    !binding.path.isImportSpecifier()
  ) {
    return false
  }

  const importDecl = binding.path.parentPath

  if (!importDecl?.isImportDeclaration()) {
    return false
  }

  return CSS_MODULE_IMPORT_RE.test(importDecl.node.source.value || '')
}

function addToken(tokens: Set<string>, value: string | number | boolean | null | undefined): void {
  if (typeof value === 'string') {
    value
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => {
        tokens.add(item)
      })
  }
}

function addCssModuleKeyFromMemberExpression(expr: t.Node | null, jsxPath: NodePath, tokens: Set<string>): boolean {
  if (!t.isMemberExpression(expr)) {
    return false
  }

  if (!t.isIdentifier(expr.object)) {
    return false
  }

  const binding = jsxPath.scope.getBinding(expr.object.name)
  if (!isCssModuleBinding(binding)) {
    return false
  }

  if (!expr.computed && t.isIdentifier(expr.property)) {
    addToken(tokens, expr.property.name)
    return true
  }

  if (expr.computed && t.isStringLiteral(expr.property)) {
    addToken(tokens, expr.property.value)
    return true
  }

  return false
}

function collectClassTokens(expr: t.Node | null | undefined, jsxPath: NodePath, tokens: Set<string>): void {
  if (!expr) {
    return
  }

  if (t.isIdentifier(expr)) {
    const binding = jsxPath.scope.getBinding(expr.name)

    if (!binding?.path) {
      return
    }

    if (binding.path.isVariableDeclarator()) {
      const initNode = binding.path.node.init
      collectClassTokens(initNode, binding.path, tokens)

      binding.constantViolations.forEach((violationPath) => {
        if (!violationPath.isAssignmentExpression()) {
          return
        }

        if (!t.isIdentifier(violationPath.node.left) || violationPath.node.left.name !== expr.name) {
          return
        }

        collectClassTokens(violationPath.node.right, violationPath, tokens)
      })
    }

    return
  }

  if (t.isMemberExpression(expr)) {
    addCssModuleKeyFromMemberExpression(expr, jsxPath, tokens)
    return
  }

  if (t.isArrayExpression(expr)) {
    expr.elements.forEach((element) => {
      collectClassTokens(element, jsxPath, tokens)
    })
    return
  }

  if (t.isCallExpression(expr)) {
    const isClassnamesCall =
      (t.isIdentifier(expr.callee) && ['cn', 'classnames', 'classNames'].includes(expr.callee.name)) ||
      (t.isMemberExpression(expr.callee) &&
        !expr.callee.computed &&
        t.isIdentifier(expr.callee.property) &&
        ['cn', 'classnames', 'classNames'].includes(expr.callee.property.name))

    if (isClassnamesCall) {
      const [firstArg] = expr.arguments

      if (!firstArg) {
        return
      }

      if (t.isObjectExpression(firstArg)) {
        return
      }

      if (t.isSpreadElement(firstArg)) {
        collectClassTokens(firstArg.argument, jsxPath, tokens)
        return
      }

      collectClassTokens(firstArg, jsxPath, tokens)
      return
    }

    expr.arguments.forEach((arg) => {
      if (t.isSpreadElement(arg)) {
        collectClassTokens(arg.argument, jsxPath, tokens)
        return
      }

      collectClassTokens(arg, jsxPath, tokens)
    })
    return
  }

  if (t.isObjectExpression(expr)) {
    expr.properties.forEach((prop) => {
      if (t.isSpreadElement(prop)) {
        collectClassTokens(prop.argument, jsxPath, tokens)
        return
      }

      if (t.isObjectProperty(prop) && prop.computed) {
        collectClassTokens(prop.key, jsxPath, tokens)
      }
    })
    return
  }

  if (t.isConditionalExpression(expr)) {
    collectClassTokens(expr.consequent, jsxPath, tokens)
    collectClassTokens(expr.alternate, jsxPath, tokens)
    return
  }

  if (t.isLogicalExpression(expr)) {
    collectClassTokens(expr.left, jsxPath, tokens)
    collectClassTokens(expr.right, jsxPath, tokens)
  }
}

function extractClassTokensFromClassName(node: t.JSXOpeningElement, jsxPath: NodePath): string[] {
  const classAttr = node.attributes.find(
    (attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === 'className',
  )

  if (!t.isJSXAttribute(classAttr) || !classAttr.value) {
    return []
  }

  const tokens = new Set<string>()

  if (t.isJSXExpressionContainer(classAttr.value)) {
    collectClassTokens(classAttr.value.expression, jsxPath, tokens)
  }

  return [...tokens]
}

export default function babelPluginAutoDataTest() {
  return {
    visitor: {
      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>) {
        const { node } = path

        // Skip if already has data-test or dataTest attribute
        const hasDataTest = node.attributes.some((attr) => {
          if (t.isJSXAttribute(attr)) {
            const attrName = attr.name.name
            return attrName === 'data-test' || attrName === 'dataTest'
          }
          return false
        })

        if (hasDataTest) {
          return
        }

        // Skip fragments
        if (t.isJSXFragment(node.name) || (t.isJSXIdentifier(node.name) && node.name.name === 'Fragment')) {
          return
        }

        const componentName = getOwnerComponentName(path)
        const classTokens = extractClassTokensFromClassName(node, path)
        const classNameWithoutHash = classTokens.join('.')

        if (!classNameWithoutHash) {
          return
        }

        const testId = componentName ? `${componentName}-${classNameWithoutHash}` : ''

        if (testId) {
          const dataTestAttr = t.jsxAttribute(t.jsxIdentifier('data-test'), t.stringLiteral(testId))

          node.attributes.push(dataTestAttr)
        }
      },
    },
  }
}
