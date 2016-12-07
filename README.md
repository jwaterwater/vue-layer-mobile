#vue-layer
vue弹出层插件,包含toast loading dialog等浮层控件

参考:开源插件layer-mobile http://layer.layui.com/mobile/

#使用方法
```javascript
import vue-layer from 'vue-layer/index'
Vue.use(vue-layer)
```

toast:
文字和图标:
```javascript
this.$layer.toast({
  icon: 'icon-check', // 图标clssName
  content: '提示文字',
  time: 2000 // 自动消失时间
})
```

loading: 
```javascript
this.$layer.loading('加载中...')
```
dialog:
```javascript
this.$layer.dialog({
  title: '这是标题',
  content: '这是内容',
  btn: ['确定']
  time: 2000
})
```
