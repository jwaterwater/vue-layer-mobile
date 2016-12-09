(function(window){
  window.component = {
    template: `<div v-if="visible" class="layui-m-layer" v-bind:class="layerClass">
                <div v-on:click="close()"  v-if="isShade" class="layui-m-layershade"></div>
                <div class="layui-m-layermain">
                  <div class="layui-m-layersection">
                    <div v-if="type==2 && !skin" class="layui-m-layerchild  layui-m-anim-scale">
                      <div class="layui-m-layercont"><i></i>
                        <i class="layui-m-layerload"></i>
                        <i></i><p>{{ content?content:"" }}</p>
                      </div>
                    </div>
                    <div v-if="ismsg" v-bind:style="msgStyle" class="layui-m-layerchild layui-m-anim-up" v-bind:class="skinClass">
                      <div class="layui-m-layercont">
                      <i v-if="icon" style="display:block;font-size:40px;margin:22px" class="icon iconfont" :class="iconClass"></i>
                      {{ content }}
                      </div>
                    </div>
                    <div v-if="defaultChild" class="layui-m-layerchild layui-m-anim-up">
                        <h3 :style="titleStyle" v-if="title">{{ titleText }}</h3>
                        <div style="word-wrap:break-word" class="layui-m-layercont">{{ content }}</div>
                        <div v-if="btn" class="layui-m-layerbtn">
                          <template v-for="(item, index) in btn">
                            <span v-on:click="callback(index)" type="1">{{ item }}</span>
                          </template>
                        </div>
                    </div>
                    <div v-if="isfooter" class="layui-m-layerchild layui-m-anim-up" v-bind:class="skinClass">
                      <div v-if="content" class="layui-m-layercont">{{ content }}</div>
                      <div class="layui-m-layerbtn">
                          <template v-for="(item, index) in btn">
                            <span :style="footerRadius(index)" v-if="index!=0" no="" v-on:click="callback(index)" type="1">{{ item }}</span>
                          </template>
                          <span v-if="btn.length>0" yes="" v-on:click="callback(0)" type="1">{{ btn[0] }}</span>
                      </div>
                  </div>
                  </div>
                </div>
              </div>`,
    props:{
      'content': String,
      'type': {
        type: [Number, String],
        default: 0
      },
      'time': {
        type: Number,
        default: 0
      },
      'skin': {
        type: String
      },
      'btn': {
        type: [String, Array]
      },
      'title': {
        type: [Array, String]
      },
      'icon': {
        type: String
      },
      'callback': {
        type: Function
      }
    },
    created: function () {
      this.visible = true
      setTimeout(() => { this.status = false }, 3000 )
      this.time > 0 ? setTimeout(() => { this.visible = false }, this.time) : ''
    },
    computed: {
      defaultChild: function () {
        return (this.type==2 || this.skin=='msg' || this.skin=='footer') ? false : true
      },
      layerClass: function () {
        return 'layui-m-layer' + this.type
      },
      skinClass: function () {
        return 'layui-m-layer-' + this.skin
      },
      msgStyle: function () {
        return {
          bottom: this.icon ? 'auto' : ''
        }
      },
      iconClass: function () {
        return this.icon
      },
      isShade: function () {
        return (this.type==2 || this.skin=='footer' || this.defaultChild) ? true : false
      },
      titleText: function () {
        return (typeof this.title) == 'string' ? this.title : this.title[0]
      },
      titleStyle: function () {
        return (typeof this.title) == 'string' ? '' : this.title[1]
      },
      ismsg: function () {
        return this.skin=='msg'
      },
      isfooter: function () {
        return this.skin == 'footer'
      }
    },
    data: function () {
      return {
        visible: false,
        status: true
      }
    },
    methods: {
      close: function () {
        if(this.type === 2) {
          return false
        }
        this.visible = false
      },
      footerRadius: function (index) {
        return this.btn[index+1] ? 'border-radius:0;' : 'border-radius: 0 0 5px 5px;'
      }
    }
  }
  function getIndexLayer (Vue, props) {
    let layerIndex = Vue.extend(component)
    return new layerIndex({
      el: document.createElement('div'),
      propsData: props
    })
  }
  const layer = {
    v: '1.0',
    instanceList: [],
    open: function (props) {
      this.close()
      let instance = getIndexLayer(this.vue, props)
      this.instanceList.push(instance)
      document.body.appendChild(instance.$el)
      return instance
    },
    close: function () {
      if(this.instanceList.length>0) {
        let item = this.instanceList.pop()
        item.visible = false
        this.close()
      }
      return false
    },
    loading: function (content) {
      let props = {
        content: content?content:'',
        type: 2
      }
      this.open(props)
    },
    toast: function (icon) {
      let props = {
        content: typeof icon == 'string' ? icon : (icon.content?icon.content:''),
        icon: icon.className?icon.className:'',
        skin: 'msg',
        time: icon.time?icon.time:2000
      }
      this.open(props)
    },
    dialog: function (dialog) {
      let self = this
      let props = {
        content: dialog.content?dialog.content:'',
        time: dialog.time?dialog.time:0,
        title: dialog.title?dialog.title:'',
        btn: dialog.btn?dialog.btn:''
      }
      // this.open(props)
      return new Promise(function (resolve, reject){
        props.callback = function (action) {
          resolve(action)
          self.close()
        }
        let instance = self.open(props)
      })
    },
    footer: function (data) {
        let self = this
        let props = {
          skin: 'footer',
          content: data.content ? data.content : '',
          btn: data.btn ? data.btn : []
        }
        return new Promise(function (resolve, reject){
          props.callback = function (action) {
            resolve(action)
            self.close()
          }
          let instance = self.open(props)
        })
      }
  }
  layer.install = function (Vue, options) {
    layer.vue = Vue
    Vue.prototype.$layer = layer
  }
  module.exports = layer
})(window)