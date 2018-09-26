const babylon = require('babylon')
/*
const t = require('@babel/types')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
*/
const t = require('babel-types')
const generate = require('babel-generator').default
const traverse = require('babel-traverse').default

/*
const code = ''
const ast = babylon.parse(code)
 
// 生成 VariableDeclarator
const id = t.identifier('a')
const literal = t.numericLiteral(1)
const declarator = t.variableDeclarator(id, literal)
 
// 生成 VariableDeclaration
const declaration = t.variableDeclaration('const', [declarator])
 
// 将表达式放入body中
ast.program.body.push(declaration)
 
const output = generate(ast, {}, code)
console.log('Input \n', code)
console.log('Output \n', output.code)
*/

const code = ''
const ast = babylon.parse(code)
 
// BinaryExpression a + b
const binaryExp = t.binaryExpression('+', t.identifier('a'), t.identifier('b'))
const returnStatement = t.returnStatement(binaryExp)
 
// function body
const fnBody = t.blockStatement([returnStatement])
const params = [t.identifier('a'), t.identifier('b')]
 
const fnDeclaraton = t.functionDeclaration(t.identifier('add'), params, fnBody)
ast.program.body.push(fnDeclaraton)
 
const output = generate(ast, {}, code)
console.log('Input \n', code)
console.log('Output \n', output.code)
