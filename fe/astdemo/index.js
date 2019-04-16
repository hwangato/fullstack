//https://zhuanlan.zhihu.com/p/59355857
//https://summerrouxin.github.io/2018/05/29/ast-practise/ast-practise/
const cwdPath = process.cwd()
const fs = require('fs')
const fse = require('fs-extra')
const parse = require('xml-parser')
const fastXmlParser = require('fast-xml-parser')
const xml2jsParser = require('xml2js')
const templateParser = require('./templateParser')

const CSSOM = require('cssom') //css的AST解析器


/*
var xml = fs.readFileSync(`${cwdPath}/demo.wpy`, 'utf8');
var inspect = require('util').inspect;

var obj = parse(xml);
console.log(inspect(obj, { colors: true, depth: Infinity }));
*/

var template = `//wepy版
<template>
 <view class="userCard">
 <view class="basic">
 <view class="avatar">
 <image src="{{info.portrait}}"></image>
 </view>
 <view class="info">
 <view class="name">{{info.nickName}}</view>
 <view class="label" wx:if="{{info.label}}">
 <view class="label-text" wx:for="{{info.label}}">{{item}}</view>
 </view>
 <view class="onsale">在售宝贝{{sellingCount}}</view>
 <view class="follow " @tap="follow">{{isFollow ? '取消关注' : '关注'}}</view>
 </view>
 </view>
 </view>
</template>`

var style = `<style lang="less" rel="stylesheet/less" scoped>
.userCard {
  position:relative;
  background: #FFFFFF;
  box-shadow: 0 0 10rpx 0 rgba(162,167,182,0.31);
  border-radius: 3rpx;
  padding:20rpx;
  position: relative;
}
/* css太多了，省略其他内容 */
</style>`

var script = `
import wepy from 'wepy'
export default class UserCard extends wepy.component {
  props = {
    info:{
      type:Object,
 default:{}
 }
 }
  data = {
    isFollow: false,
 }
  methods = {
 async follow() {
 await someHttpRequest()
 this.isFollow = !this.isFollow
 this.$apply()
 }
 }
  computed = {
    sellingCount(){
 return this.info.sellingCount || 1
 }
 }
  onLoad(){
 this.$log('view')
 }
}
`

var testScript = `
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

//最简单的写法，直接调用parse方法 
fs.readFile(`${cwdPath}/demo.wpy`,'utf-8',function(err,result){
    var jsonObj = fastXmlParser.parse(result);

	var inspect = require('util').inspect;
	//console.log(jsonObj.length);
	//console.log(inspect(jsonObj, { colors: true, depth: Infinity }));
    //console.log('xml解析成json:'+JSON.stringify(jsonObj));
	var options = {
		attributeNamePrefix : "@_",
		attrNodeName: "attr", //default is 'false'
		textNodeName : "#text",
		ignoreAttributes : true,
		ignoreNameSpace : false,
		allowBooleanAttributes : false,
		parseNodeValue : true,
		parseAttributeValue : false,
		trimValues: true,
		cdataTagName: "__cdata", //default is 'false'
		cdataPositionChar: "\\c",
		localeRange: "", //To support non english character in tag/attribute values.
		parseTrueNumberOnly: false
	};
	var tObj = fastXmlParser.getTraversalObj(result,options);
	//console.log(tObj.child.template);
	//console.log(tObj.child.style);
	//console.log(tObj.child.script);

	//typesHandler.style(v,filedir,filename,targetFilePath)
});

			/*
//var filePath = "./test.xml"
var filePath = "./demo.wpy"

fs.readFile(filePath, function(err, data) {
    xml2jsParser.parseString(data, function (err, result) {
		console.log(result)

        var strings = result.resources.string
        for(var i=0;i< strings.length;i++ ){
            console.log(strings[i].$.name)
            console.log(strings[i]._)
        }
	
    });
});
	*/

//console.log(template);
//console.log(style);
//console.log(script);

var targetFilePath = `${cwdPath}/dist/demo.vue`
fs.writeFile(targetFilePath,'')

templateHandler(template);
styleHandler(style);
scriptHandler(script);



function templateHandler(textContent) {
	//初始化一个解析器
	templateParserObj = new templateParser()

	//生成语法树
	templateParserObj.parse(textContent).then((templateAst)=>{
	 //进行上述目标的转换
	 let convertedTemplate = templateConverter(templateAst)
	 //把语法树转成文本
	  templateConvertedString = templateParserObj.astToString(convertedTemplate)

	  //templateConvertedString = `<template>\r\n${templateConvertedString}\r\n</template>\r\n`
	  //console.log(templateConvertedString);
	  
	  /*
	  fs.writeFile(targetFilePath,templateConvertedString, ()=>{
		resolve()
	 })*/
	   //fs.writeFile(targetFilePath,templateConvertedString);
	   fs.appendFileSync(targetFilePath,templateConvertedString);
	})/*.catch((e)=>{
	  reject(e)
	})*/
}


//html标签替换规则，可以添加更多
const tagConverterConfig = {
 'view':'div',
 'image':'img'
}
//属性替换规则，也可以加入更多
const attrConverterConfig = {
 'wx:for':{
    key:'v-for',
    value:(str)=>{
 return str.replace(/{{(.*)}}/,'(item,key) in $1')
 }
 },
 'wx:if':{
    key:'v-if',
    value:(str)=>{
 return str.replace(/{{(.*)}}/,'$1')
 }
 },
 '@tap':{
    key:'@click'
 },
}
//替换入口方法
const templateConverter = function(ast){
 for(let i = 0;i<ast.length;i++){
 let node = ast[i]
 //检测到是html节点
 if(node.type === 'tag'){
 //进行标签替换
 if(tagConverterConfig[node.name]){
        node.name = tagConverterConfig[node.name]
 }
 //进行属性替换
 let attrs = {}
 for(let k in node.attribs){
 let target = attrConverterConfig[k]
 if(target){
 //分别替换属性名和属性值
          attrs[target['key']] = target['value'] ? target['value'](node.attribs[k]) : node.attribs[k]
 }else {
          attrs[k] = node.attribs[k]
 }
 }
      node.attribs = attrs
 }
 //因为是树状结构，所以需要进行递归
 if(node.children){
      templateConverter(node.children)
 }
 }
 return ast
}


function styleHandler(styleString) {

	const replaceTagClassName = function(replacedStyleText){
	 const replaceConfig = {}
	 //匹配标签选择器
	 const tagReg = /[^\.|#|\-|_](\b\w+\b)/g
	 //将css文本转换为语法树
	 const ast = CSSOM.parse(replacedStyleText),
				  styleRules = ast.cssRules

	 if(styleRules && styleRules.length){
	 //找到包含tag的className
		styleRules.forEach(function(item){
	 //可能会有 view image {...}这多级选择器
	 let tags = item.selectorText.match(tagReg)
	 if(tags && tags.length){
	 let newName = ''
			tags = tags.map((tag)=>{
			  tag = tag.trim()
	 if(tag === 'image')tag = 'img'
	 return tag
	 })
			item.selectorText = tags.join(' ')
	 }
	 })
	 //使用toString方法可以把语法树转换为字符串
		replacedStyleText = ast.toString()
	 }
	replacedStyleText = replacedStyleText.replace(/([\d\s]+)rpx/g,'$1*@px')
	//console.log(replacedStyleText)

	replacedStyleText = `<style scoped>\r\n${replacedStyleText}\r\n</style>\r\n`
			//console.log(replacedStyleText)
	/*
	fs.writeFile(`${cwdPath}/dist/demo.vue`,replacedStyleText,{
	  flag: 'a'
	})*/
	fs.appendFileSync(`${cwdPath}/dist/demo.vue`,replacedStyleText)
	 return {replacedStyleText,replaceConfig}
	}

	vueStyleString = replaceTagClassName(styleString)
	//console.log(targetFilePath)
	//console.log(vueStyleString)

}

function scriptHandler(scriptString) {
const JavascriptParser = require('./javascriptParser')

//先反转义
//let javascriptContent = utils.deEscape(v.childNodes.toString())
let javascriptContent = scriptString
//初始化一个解析器
javascriptParser = new JavascriptParser()

//去除无用代码
javascriptContent = javascriptParser.beforeParse(javascriptContent)
//解析成AST
//console.log(javascriptContent)

javascriptParser.parse(javascriptContent).then((javascriptAst)=>{
 //进行代码转换
 let {convertedJavascript,vistors} = componentConverter(javascriptAst)
 //放到预先定义好的模板中
  convertedJavascript = componentTemplateBuilder(convertedJavascript,vistors)

 //生成文本并写入到文件
 let codeText = `<script>\r\n${generate(convertedJavascript).code}\r\n</script>\r\n`

 fs.appendFileSync(`${cwdPath}/dist/demo.vue`,codeText)
})/*.catch((e)=>{
  reject(e)
})*/

}

const componentTemplate = `
export default {
  data() {
    return DATA
  },

  props:PROPS,

  methods: METHODS,

  computed: COMPUTED,

  watch:WATCH,

}
`


const componentTemplateBuilder = function(ast,vistors){
 const buildRequire = template(componentTemplate);
  ast = buildRequire({
    PROPS: arrayToObject(vistors.props.getData()),
    LIFECYCLE: arrayToObject(vistors.lifeCycle.getData()),
    DATA: arrayToObject(vistors.data.getData()),
    METHODS: arrayToObject(vistors.methods.getData()),
    COMPUTED: arrayToObject(vistors.computed.getData()),
    WATCH: arrayToObject(vistors.watch.getData()),
 });
 return ast
}

