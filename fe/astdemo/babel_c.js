const babylon = require('babylon')
const t = require('@babel/types')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
 
const code = ''
const ast = babylon.parse(code)
/*
const literal = t.numericLiteral(1)
const exp = t.expressionStatement(literal)
ast.program.body.push(exp)
*/

/*
const id = t.identifier('a')
const literal = t.numericLiteral(1)
const declarator = t.variableDeclarator(id,literal)

const declaration = t.variableDeclaration('const',[declarator])

ast.program.body.push(declaration)
*/

const binaryExp = t.binaryExpression('+',t.identifier('a'),t.identifier('b'))
const returnStatement = t.returnStatement(binaryExp)

const fnBody = t.blockStatement([returnStatement])
const params = [t.identifier('a'),t.identifier('b')]

const fnDeclaraton = t.functionDeclaration(t.identifier('add'),params,fnBody)
ast.program.body.push(fnDeclaraton)


// manipulate ast
const output = generate(ast, {}, code)  
console.log('Input \n', code)
console.log('Output \n', output.code)
