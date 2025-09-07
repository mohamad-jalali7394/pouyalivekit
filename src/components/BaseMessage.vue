<template>
  <div v-if="lastMessageReadIndex === idx && lastMessageReadIndex !== 0 " style="width: 100%;border: 0.1rem dashed #b7b6b6;margin-top: 1rem;position: relative;left: -0.4rem">
    <div style="height: 5rem;background-color: white;position: absolute;left: 50%;top:-0.8rem;transform: translateX(-50%);padding: 0 0.5rem">{{$store.getters.t('unread_messages')}}</div>
  </div>
     <transition appear :appear-active-class="messageAnimationClass">
    <div class="message message--sent" v-if="messageSender === $store.getters.t('you')">
      <div v-if="repeatedName" class="name sender--name">
        <p>{{messageSender}}</p>
      </div>

      <div class="text--sent" v-if="repeatedName">
        <div class="border--shape__sender" ></div>
        <p v-html="detectedText"></p>
        <div style="font-size: 1.2rem;font-weight: 400;color: #75758F">
          {{messageTime}}
        </div>
<!--          {{detectedText}}-->
      </div>
      <div class="text--sent" v-else>
        <p v-html="detectedText"></p>
        <div style="font-size: 1.2rem;font-weight: 400;color: #75758F">
          {{messageTime}}
        </div>
<!--        {{detectedText}}-->
      </div>
    </div>

    <div class=" message message--recieved" v-else>
      <div v-if="repeatedName" class="name reciever--name">
        <p>{{messageSender}}</p>
      </div>

      <div class="text--recieved" v-if="repeatedName">
        <div class="border--shape__reciever" ></div>
        <p v-html="detectedText"></p>
        <div style="font-size: 1.2rem;font-weight: 400;color: #75758F">
          {{messageTime}}
        </div>
<!--        {{detectedText}}-->
      </div>
      <div class="text--recieved" v-else>
        <p v-html="detectedText"></p>
        <div style="font-size: 1.2rem;font-weight: 400;color: #75758F">
          {{messageTime}}
        </div>
<!--        {{detectedText}}-->
      </div>
    </div>
  </transition>
</template>
<script>
export default {
    name : "BaseMessage",
  props:["textMessage","messageSender","repeatedName","messageTime","idx","lastMessageReadIndex"],
  computed : {
      detectedText(){
        return this.replaceURLs(this.textMessage)
      },

    messageAnimationClass(){
      let animationClass;
      if(this.chatName === this.$store.getters.t('you')){
        animationClass = 'animate-left'
      } else {
        animationClass = 'animate-right'
      }
      return animationClass;
    }
  },
  methods:{
    replaceURLs(message) {
      if(!message) return;

      let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
      return message.replace(urlRegex, function (url) {
        let hyperlink = url;
        if (!hyperlink.match('^https?://')) {
          hyperlink = 'http://' + hyperlink;
        }
        return '<a href="' + hyperlink + '" target="_blank" rel="noopener noreferrer" style="cursor: pointer">' + url + '</a>'
      });
    }
  }
}
</script>
<style scoped>
.animate-right{
  animation : message-right .15s ease-in forwards;
}
.animate-left{
  animation : message-left .15s ease-out forwards;
}
@keyframes message-right {
  from{
    transform: translateX(18rem);
    opacity : 0;

  }
  to{
    opacity: 1;
    transform: translateX(0);
  }

}
@keyframes message-left {
  from{
    transform: translateX(-18rem);
    opacity : 0;

  }
  to{
    opacity: 1;
    transform: translateX(0);
  }

}
p{
  color:#292933;
}
.message{
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;
  margin-top: 1rem;
}
.message--sent{
 direction: rtl;

}

.container__chat{
  position: relative;
  height: auto;
  font-size: 1.2rem;
  direction: rtl;
  color:#292933;
  padding: .8rem 1rem;

  /*margin-bottom: .2rem;*/
  margin-right: 0.7rem;
  margin-left:1rem;
  border-radius: 0.7rem;
  border-top-right-radius: 0;
  width: fit-content;
  max-width: 18rem;
  color:#292933;
  overflow-wrap: break-word;
}
.text{
 position: relative;
  height: auto;
  font-size: 1.2rem;
  direction: rtl;
  padding: .8rem 1rem;
  border-radius: 0.7rem;
  width: fit-content;
  max-width: 18rem;

  overflow-wrap: break-word;
  white-space: pre;
}
.text--sent{
  position: relative;
  height: auto;
  font-size: 1.2rem;
  direction: rtl;
  color:#292933;
  padding: .8rem 1rem;

  /*margin-bottom: .2rem;*/
  margin-right: 0.7rem;
  margin-left:1rem;
  background-color: #CBE0FF;
  border-radius: 0.7rem;
  border-top-right-radius: 0;
  width: fit-content;
  max-width: 18rem;
  color:#292933;
  white-space: pre-line;
  overflow-wrap: break-word;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.border--shape__sender{
  position: absolute;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 10px solid #CBE0FF;
  border-bottom-left-radius:5px;
  transform: rotate(180deg);
  overflow-wrap: break-word;
  white-space: pre;
  top: 0;
  right: -0.6rem;

}
a {
  text-decoration: underline;
  color:#292933;
  overflow-wrap: break-word;
  white-space: pre;

}

.border-shape{
  position: absolute;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 10px solid #CBE0FF;
  border-bottom-left-radius:5px;
  transform: rotate(180deg);
  white-space: pre;
  top: 0;
  right: -0.6rem;

}


.name{
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
}

.sender--name p {
  margin-right: 12px;
  font-size: 1.2rem;
  font-weight: 400;
}
.reciever--name p{
  font-size: 1.2rem;
  font-weight: 400;
}



.message--recieved{
  direction: ltr;

}


.text--recieved{
  position: relative;
  height: auto;
  font-size: 1.2rem;

  direction: rtl;
  color:#292933;
  padding: .8rem 1rem;

  /*margin-bottom: .2rem;*/
  margin-left: .6rem;
  background-color: #F2F2F2;
  border-radius: 0.7rem;
  border-top-left-radius: 0;
  width: fit-content;
  max-width: 18rem;
  white-space: pre-line;
  overflow-wrap: break-word;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

}
.border--shape__reciever{
  position: absolute;
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid #F2F2F2;
  border-bottom-left-radius:5px;
  transform: rotate(45deg);
 white-space: pre;
  top: -0.3rem;
  left: -.5rem;
}

</style>
