// 注意，这里引入的vue是运行时的模块，因为content是插入到目标页面，对组件的渲染需要运行时的vue， 而不是编译环境的vue （我也不知道我在说啥，反正大概意思就是这样）
import Vue from 'vue/dist/vue.esm.js'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

// 注意，必须设置了run_at=document_start此段代码才会生效
document.addEventListener('DOMContentLoaded', function () {
  console.log('vue-chrome扩展已载入')

  insertFloat()
})

// 在target页面中新建一个带有id的dom元素，将vue对象挂载到这个dom上。
function insertFloat () {
  const element = document.createElement('div')
  const attr = document.createAttribute('id')
  attr.value = 'appPlugin'
  element.setAttributeNode(attr)
  document.getElementsByTagName('body')[0].appendChild(element)

  const link = document.createElement('link')
  const linkAttr = document.createAttribute('rel')
  linkAttr.value = 'stylesheet'
  const linkHref = document.createAttribute('href')
  linkHref.value = 'https://unpkg.com/element-ui/lib/theme-chalk/index.css'
  link.setAttributeNode(linkAttr)
  link.setAttributeNode(linkHref)
  document.getElementsByTagName('head')[0].appendChild(link)

  let left = 0
  let top = 0
  let mx = 0
  let my = 0
  let onDrag = false

  var drag = {
    inserted: function (el) {
      ;(el.onmousedown = function (e) {
        left = el.offsetLeft
        top = el.offsetTop
        mx = e.clientX
        my = e.clientY
        if (my - top > 40) return

        onDrag = true
      }),
      (window.onmousemove = function (e) {
        if (onDrag) {
          let nx = e.clientX - mx + left
          let ny = e.clientY - my + top
          const width = el.clientWidth
          const height = el.clientHeight
          const bodyWidth = window.document.body.clientWidth
          const bodyHeight = window.document.body.clientHeight

          if (nx < 0) nx = 0
          if (ny < 0) ny = 0

          if (ny > bodyHeight - height && bodyHeight - height > 0) {
            ny = bodyHeight - height
          }

          if (nx > bodyWidth - width) {
            nx = bodyWidth - width
          }

          el.style.left = nx + 'px'
          el.style.top = ny + 'px'
        }
      }),
      (el.onmouseup = function (e) {
        if (onDrag) {
          onDrag = false
        }
      })
    }
  }
  const getAvatarUrl = (role = 'user') => {
    return role === 'user' ? '/static/image/default-avatar.png' : '/static/image/avatar.png'
  }
  window.kz_vm = new Vue({
    el: '#appPlugin',
    directives: {
      drag: drag
    },
    template: `
    <div class="float-page" ref="float" v-drag>
    <el-popover placement="left" width="400" trigger="click">
      <el-container style="height: 500px">
        <el-header>聊天框</el-header>
        <el-main>
          <el-scrollbar wrap-class="chat-scrollbar">
            <div id="msglistdiv" class="chat-body">
              <!-- 聊天记录 -->
              <div v-for="item in messageList" :key="item.id">
                <template v-if="item.role === 'user'">
                  <!-- 自己发的消息 -->
                  <div class="item self">
                    <!-- 文字内容 -->
                    <div class="content right">
                      {{ item.content }}
                    </div>
                    <!-- 头像 -->
                    <div class="avatar">
                      <image class="img" :src="item.avatarUrl" mode="aspectFill"></image>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="item Ai">
                    <!-- 头像 -->
                    <div class="avatar">
                      <image class="img" :src="item.avatarUrl" mode="aspectFill"></image>
                    </div>
                    <!-- 文字内容 -->
                    <div class="content left">
                      <animate-text :content="item.content" :needLoading="item.needLoading"></animate-text>
                    </div>
                  </div>
                </template>
                <!-- 机器人发的消息 -->
              </div>
            </div>
          </el-scrollbar>
        </el-main>
        <el-footer>
          <div class="send-msg">
            <div class="uni-textarea">
              <textarea
                v-model="chatMsg"
                maxlength="300"
                confirm-type="send"
                @confirm="handleSend"
                :show-confirm-bar="false"
                :adjust-position="false"
                @linechange="sendHeight"
                @focus="focus"
                @blur="blur"
                auto-height
              ></textarea>
            </div>
          </div>
          <button @click="handleSend" class="send-btn">发送</button>
        </el-footer>
      </el-container>
      <div slot="reference" class="cricle">
        <i class="el-icon-question"></i>
        <span>点我</span>
      </div>
    </el-popover>
  </div>
      `,
    data: function () {
      return {
        messageList: [
          {
            id: 1,
            content: 123321,
            role: 'user',
            avatarUrl: getAvatarUrl()
          }
        ],
        show: true,
        list: [],
        user: {
          username: '',
          follow: 0,
          title: '',
          div: 0
        },
        dialogShow: false
      }
    },
    mounted () {},
    methods: {
      sendMessage () {
        if (this.newMessage) {
          const newId = this.messages.length + 1
          const newTimestamp = new Date().toLocaleString()
          this.messages.push({ id: newId, text: this.newMessage, timestamp: newTimestamp })
          this.newMessage = ''
        }
      },
      toggle () {
        this.show = !this.show
      },
      openDialog () {
        this.dialogShow = true
      },
      handleClose () {
        this.dialogShow = false
      }
    }
  })
}
