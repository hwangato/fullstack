import {Dep, Watcher, observe} from './Observer'

    function nodeToFragment (node, vm) {
      var flag = document.createDocumentFragment();
      var child;
      // 许多同学反应看不懂这一段，这里有必要解释一下
      // 首先，所有表达式必然会返回一个值，赋值表达式亦不例外
      // 理解了上面这一点，就能理解 while (child = node.firstChild) 这种用法
      // 其次，appendChild 方法有个隐蔽的地方，就是调用以后 child 会从原来 DOM 中移除
      // 所以，第二次循环时，node.firstChild 已经不再是之前的第一个子元素了
      while (child = node.firstChild) {
		//console.log(child);
        compile(child, vm);
        flag.appendChild(child); // 将子节点劫持到文档片段中
      }
      return flag
    }
    function compile (node, vm) {
	  //console.log(node);
      var reg = /\{\{(.*)\}\}/;
      // 节点类型为元素
      if (node.nodeType === 1) {
        var attr = node.attributes;
        // 解析属性
        for (var i = 0; i < attr.length; i++) {
          if (attr[i].nodeName == 'v-model') {
            var name = attr[i].nodeValue; // 获取 v-model 绑定的属性名
            node.addEventListener('input', function (e) {
              // 给相应的 data 属性赋值，进而触发该属性的 set 方法
              vm[name] = e.target.value;
            });
            node.value = vm[name]; // 将 data 的值赋给该 node
            node.removeAttribute('v-model');
          }
        };
        new Watcher(vm, node, name, 'input');
      }
      // 节点类型为 text
      if (node.nodeType === 3) {
        if (reg.test(node.nodeValue)) {
			//console.log('debug');
          var name = RegExp.$1; // 获取匹配到的字符串
          name = name.trim();
          new Watcher(vm, node, name, 'text');
        }
      }
    }

export default nodeToFragment
