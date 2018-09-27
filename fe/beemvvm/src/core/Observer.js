
	function observe (obj, vm) {
      Object.keys(obj).forEach(function (key) {
        defineReactive(vm, key, obj[key]);
      })
    }
    function defineReactive (obj, key, val) {
      var dep = new Dep();
      Object.defineProperty(obj, key, {
        get: function () {
          // 添加订阅者 watcher 到主题对象 Dep
          if (Dep.target) dep.addSub(Dep.target);
          return val
        },
        set: function (newVal) {
          if (newVal === val) return
          val = newVal;
          // 作为发布者发出通知
          dep.notify();
        }
      });
    }

    function Watcher (vm, node, name, nodeType) {
      Dep.target = this;
      this.name = name;
      this.node = node;
      this.vm = vm;
      this.nodeType = nodeType;
      this.update();
      Dep.target = null;
    }
    Watcher.prototype = {
      update: function () {
        this.get();
        if (this.nodeType == 'text') {
          this.node.nodeValue = this.value;
        }
        if (this.nodeType == 'input') {
          this.node.value = this.value;
        }
      },
      // 获取 data 中的属性值
      get: function () {
        this.value = this.vm[this.name]; // 触发相应属性的 get
      }
    }
    function Dep () {
      this.subs = []
    }
    Dep.prototype = {
      addSub: function(sub) {
        this.subs.push(sub);
      },
      notify: function() {
        this.subs.forEach(function(sub) {
          sub.update();
        });
      }
    }


export {
  Watcher,
  Dep,
  observe
}

