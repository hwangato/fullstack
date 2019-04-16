const cwdPath = process.cwd()
const fs = require('fs')
const fse = require('fs-extra')
const parse = require('xml-parser')
const fastXmlParser = require('fast-xml-parser')

/*
var xml = fs.readFileSync(`${cwdPath}/demo.wpy`, 'utf8');
var inspect = require('util').inspect;

var obj = parse(xml);
console.log(inspect(obj, { colors: true, depth: Infinity }));
*/

//最简单的写法，直接调用parse方法
fs.readFile(`${cwdPath}/demo.wpy`,'utf-8',function(err,result){
    var jsonObj = fastXmlParser.parse(result);

	var inspect = require('util').inspect;
	console.log(inspect(jsonObj, { colors: true, depth: Infinity }));
    //console.log('xml解析成json:'+JSON.stringify(jsonObj));
	//当一个标签具有属性时
	var options = {
		attrPrefix : "@_",
		textNodeName : "#text",
		ignoreNonTextNodeAttr : true,
		ignoreTextNodeAttr : true,
		ignoreNameSpace : true,
		textNodeConversion : true
	};
	  var tObj = fastXmlParser.getTraversalObj(result,options);
	  console.log(tObj.child);
});

const convert = async function(filepath){
 let fileText = await fse.readFile(filepath, 'utf-8');
	
	/*
  	var xml = fs.readFileSync(filepath, 'utf8');
	var inspect = require('util').inspect;
	 
	var obj = parse(xml);
	//console.log(xml);
	//console.log(inspect(obj, { colors: true, depth: Infinity }));
	*/

  fileHandle(fileText.toString(),filepath)
}

const fileHandle = async function(fileText,filepath){

	//var xml = fs.readFileSync(fileText, 'utf8');
	//var inspect = require('util').inspect;
	 
	//var obj = parse(fileText);
	//console.log(inspect(obj, { colors: true, depth: Infinity }));
	
	/*
	//首先需要完成Xml解析及路径定义：

	//初始化一个Xml解析器
	let xmlParser = new XmlParser(),
	//解析代码内容
	xmlParserObj = xmlParser.parse(fileText),
	//正则匹配产生文件名
	filenameMatch = filepath.match(/([^\.|\/|\\]+)\.\w+$/),
	//如果没有名字默认为blank
	filename = filenameMatch.length > 1 ? filenameMatch[1] : 'blank',
	//计算出模板文件存放目录dist的绝对地址
	filedir = utils.createDistPath(filepath),
	//最终产出文件地址
	targetFilePath = `${filedir}/${filename}.vue`

	//接下来创建目标目录
	try {
	  fse.ensureDirSync(filedir)
	}catch (e){
	 throw new Error(e)
	}

	//最后根据xml解析出来的节点类型进行不同处理
	for(let i = 0 ;i < xmlParserObj.childNodes.length;i++){
	 let v = xmlParserObj.childNodes[i]
	 if(v.nodeName === 'style'){
		typesHandler.style(v,filedir,filename,targetFilePath)
	 }
	 if(v.nodeName === 'template'){
		typesHandler.template(v,filedir,filename,targetFilePath)
	 }
	 if(v.nodeName === 'script'){
		typesHandler.script(v,filedir,filename,targetFilePath)
	 }
	}
	*/
}
convert(`${cwdPath}/demo.wpy`)
