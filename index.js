(function(window){
  let layerComponent = {
    template: `<div v-if="visible" class="layui-m-layer" v-bind:class="layerClass">
                <div  v-if="type==2" class="layui-m-layershade"></div>
                <div class="layui-m-layermain">
                  <div class="layui-m-layersection">
                    <div v-if="type==2 && !skin" class="layui-m-layerchild  layui-m-anim-scale">
                      <div class="layui-m-layercont"><i></i>
                        <i class="layui-m-layerload"></i>
                        <i></i><p>{{ content?content:"" }}</p>
                      </div>
                    </div>
                    <div v-if="skin=='msg'" v-bind:style="msgStyle" class="layui-m-layerchild layui-m-anim-up" v-bind:class="skinClass">
                      <div class="layui-m-layercont">
                      <i style="display:block;font-size:40px;margin:22px" class="icon iconfont" :class="iconClass"></i>
                      {{ content }}
                      </div>
                    </div>
                    <div v-if="defaultChild" class="layui-m-layerchild">
                        <h3 v-if="title">{{ title }}</h3>
                        <div style="word-wrap:break-word" class="layui-m-layercont">{{ content }}</div>
                        <div v-if="btn" class="layui-m-layerbtn">
                          <template v-for="(item, index) in btn">
                            <span type="1">{{ item }}</span>
                          </template>
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
        type: String
      },
      'title': {
        type: Object
      },
      'icon': {
        type: String
      }
    },
    created () {
      this.visible = true
      this.time > 0 ? setTimeout(()=>{this.visible = false}, this.time) : ''
    },
    computed: {
      defaultChild: function () {
        return (this.type==2 || this.skin=='msg') ? false : true
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
      }
    },
    data: function () {
      return {
        visible: false
      }
    },
    methods: {
    }
  }
  function getIndexLayer (Vue, props) {
    let layerIndex = Vue.extend(layerComponent)
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
        content: icon.content?icon.content:'',
        icon: icon.className,
        skin: 'msg',
        time: icon.time
      }
      this.open(props)
    }
  }
  layer.install = function (Vue, options) {
    layer.vue = Vue
    Vue.prototype.$layer = layer
  }
  module.exports = layer
})(window)