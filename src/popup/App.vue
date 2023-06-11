<template>
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
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
