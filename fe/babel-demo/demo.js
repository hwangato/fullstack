const babylon = require('babylon')
const t = require('babel-types')
const generate = require('babel-generator').default
const traverse = require('babel-traverse').default

const code = `
export default {
  data() {
    return {
      message: 'hello vue',
      count: 0
    }
  },
  methods: {
    add() {
      ++this.count
    },
    minus() {
      --this.count
    }
  }
}
`
 
const ast = babylon.parse(code, {
  sourceType: 'module',
  plugins: ['flow']
})

traverse(ast, {
    ObjectMethod(path) {
      if (path.node.key.name === 'data') {
        // 获取第一级的 BlockStatement，也就是data函数体
        let blockStatement = null
        path.traverse({  //将traverse合并的写法
          BlockStatement(p) {
            blockStatement = p.node
          }
        })
   
        // 用blockStatement生成ArrowFunctionExpression
        const arrowFunctionExpression = t.arrowFunctionExpression([], blockStatement)
        // 生成CallExpression
        const callExpression = t.callExpression(arrowFunctionExpression, [])
        // 生成data property
        const dataProperty = t.objectProperty(t.identifier('data'), callExpression)
        // 插入到原data函数下方
        path.insertAfter(dataProperty)
   
        // 删除原data函数
        path.remove()
        // console.log(arrowFunctionExpression)
      }
    }
  })

  traverse(ast, {
    ObjectProperty(path) {
      if (path.node.key.name === 'methods') {
        // 遍历属性并插入到原methods之后
        path.node.value.properties.forEach(property => {
          path.insertAfter(property)
        })
        // 删除原methods
        path.remove()
      }
    }
  })

const datas = []
traverse(ast, {
  ObjectProperty(path) {
    if (path.node.key.name === 'data') {
      path.traverse({
        ReturnStatement(path) {
          path.traverse({
            ObjectProperty(path) {
              datas.push(path.node.key.name)
              path.skip()
            }
          })
          path.skip()
        }
      })
    }
    path.skip()
  }
})

traverse(ast, {
    MemberExpression(path) {
      if (path.node.object.type === 'ThisExpression' && datas.includes(path.node.property.name)) {
        path.get('object').replaceWithSourceString('this.data')
      }
    }
  })

//console.log(datas)

traverse(ast, {
    MemberExpression(path) {
      if (path.node.object.type === 'ThisExpression' && datas.includes(path.node.property.name)) {
        path.get('object').replaceWithSourceString('this.data')
        //一定要判断一下是不是赋值操作
        if(
          (t.isAssignmentExpression(path.parentPath) && path.parentPath.get('left') === path) ||
          t.isUpdateExpression(path.parentPath)
        ) {
            // findParent
            const expressionStatement = path.findParent((parent) =>   
              parent.isExpressionStatement()
            )
            // create
            if(expressionStatement) {
              const finalExpStatement =
                t.expressionStatement(
                  t.callExpression(
                    t.memberExpression(t.thisExpression(), t.identifier('setData')),
                    [t.objectExpression([t.objectProperty(
                      t.identifier(propertyName), t.identifier(`this.data.${propertyName}`)
                    )])]
                  )
                )
              expressionStatement.insertAfter(finalExpStatement)
            }
        }
      }
    }
  })
   
console.log(generate(ast, {}, code).code)
