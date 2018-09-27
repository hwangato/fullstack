
import {observe} from './Observer' // 监听数据变化的方法
import nodeToFragment from './Compile'

window.Bee = function (options) {
  //console.log(options);
  this.data = options.data
  var data = this.data
  var vm =this
  observe(data, this)
  var id = options.el
  var appDom=document.getElementById(id);
  var dom = nodeToFragment(appDom, this)
  document.getElementById(id).appendChild(dom)
/*
  var node=document.createElement("li"); //创建一个li节点
  var asd=document.createTextNode("debug")//定义创建文本节点
  node.appendChild(asd); //把文本节点追加到li节点
  document.getElementById(id).appendChild(node)
*/
}
