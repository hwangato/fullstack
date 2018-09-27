// index.js
import Bee from './bee';
let demo = new Bee({
    el: '#app',
    data: {
        'title': 'Hello Vue',
        'info': ` 重复造轮子：从0开始实现Vue数据绑定`,
        'author': {
            name: 'Shellming'
        },
        'date': new Date()
    }
});
setInterval(() => {
    demo.date = new Date()
}, 1000)