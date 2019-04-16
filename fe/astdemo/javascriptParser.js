const babylon = require('babylon') //AST解析器
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default

class JavascriptParser  {
  constructor(){

 }
 /**
   * 解析前替换掉无用字符
   * @param code
   * @returns
   */
  beforeParse(code){
 return code.replace(/this\.\$apply\(\);?/gm,'').replace(/import\s+wepy\s+from\s+['"]wepy['"]/gm,'')
 }
 /**
   * 文本内容解析成AST
   * @param scriptText
   * @returns {Promise}
   */
  parse(scriptText){
	  //console.log(scriptText)

 return new Promise((resolve,reject)=>{
 try {
 const scriptParsed = babylon.parse(scriptText,{
          sourceType:'module',
          plugins: [
 // "estree", //这个插件会导致解析的结果发生变化，因此去除，这本来是acron的插件
 "jsx",
 "flow",
 "doExpressions",
 "objectRestSpread",
 "exportExtensions",
 "classProperties",
 "decorators",
 "objectRestSpread",
 "asyncGenerators",
 "functionBind",
 "functionSent",
 "throwExpressions",
 "templateInvalidEscapes"
 ]
 })
        resolve(scriptParsed)
 }catch (e){
        reject(e)
 }
 })

 }

 /**
   * AST树遍历方法
   * @param astObject
   * @returns {*}
   */
  traverse(astObject){
 return traverse(astObject)
 }

 /**
   * 模板或AST对象转文本方法
   * @param astObject
   * @param code
   * @returns {*}
   */
  generate(astObject,code){
 const newScript = generate(astObject, {}, code)
 return newScript
 }
}
module.exports = JavascriptParser