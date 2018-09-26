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

const dataProperty = ast.program.body[0].declaration.properties[0]
console.log(dataProperty)

dataProperty.key.name = 'mydata'
 
const output = generate(ast, {}, code)
console.log(output.code)

let space = 0

traverse(ast, {
    enter(path) {
      console.log(new Array(space).fill(' ').join(''), '>', path.node.type)
      space += 2
    },
    exit(path) {
      space -= 2
      // console.log(new Array(space).fill(' ').join(''), '<', path.type)
    }
  })
