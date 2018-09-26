const babylon = require('babylon')
const t = require('babel-types')
const generate = require('babel-generator').default
const traverse = require('babel-traverse').default

/*
const code = `const c = a + b`
const ast = babylon.parse(code)
 
traverse(ast, {
  BinaryExpression(path) {
    // 注意这里要有判断，否则会无限进入`BinaryExpression`
    // https://stackoverflow.com/questions/37539432/babel-maximum-call-stack-size-exceeded-while-using-path-replacewith
    if (path.node.operator === '+') {
      path.replaceWith(t.binaryExpression('*', path.node.left, path.node.right))
    }
  }
})
 
console.log(generate(ast, {}, code).code) // const c = a * b;
*/

const code = `this.count`
const ast = babylon.parse(code)
 
traverse(ast, {
  MemberExpression(path) {
    if (
      t.isThisExpression(path.node.object) &&
      t.isIdentifier(path.node.property, {
        name: 'count'
      })
    ) {
      path
        .get('object')    // 获取`ThisExpresssion`
        .replaceWith(
          t.memberExpression(t.thisExpression(), t.identifier('data'))
        )
    }
  }
})
console.log(generate(ast, {}, code).code) // this.data.count;
//path.get('object').replaceWithSourceString('this.data')

