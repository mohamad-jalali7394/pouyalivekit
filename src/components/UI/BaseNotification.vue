
<template>
  <teleport to="body">
    <div class="notifications-container">
      <transition-group name="notification" tag="div">
        <div
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-content"
            :class="notification.styleClass"
        >
          <section v-if="$i18n.locale !== 'en'" class="notification-section-rtl" :style="{backgroundColor:notification.backgroundColor}">
            <div style="width: 0.4rem;height: 80%;position: absolute;left:-2rem;top: 10%;border-radius: 0.8rem" :style="{backgroundColor:notification.color}"></div>
            <div class="notification__icon">
              <svg v-show="notification.type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15ZM12.9933 7.88338C12.9355 7.38604 12.5128 7 12 7C11.4477 7 11 7.44772 11 8V12L11.0067 12.1166C11.0645 12.614 11.4872 13 12 13C12.5523 13 13 12.5523 13 12V8L12.9933 7.88338Z" fill="#2AB459"/>
              </svg>

              <svg  v-show="notification.type === 'warning'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15ZM12.9933 7.88338C12.9355 7.38604 12.5128 7 12 7C11.4477 7 11 7.44772 11 8V12L11.0067 12.1166C11.0645 12.614 11.4872 13 12 13C12.5523 13 13 12.5523 13 12V8L12.9933 7.88338Z" fill="#FFA024"/>
              </svg>

              <svg v-show="notification.type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15ZM12.9933 7.88338C12.9355 7.38604 12.5128 7 12 7C11.4477 7 11 7.44772 11 8V12L11.0067 12.1166C11.0645 12.614 11.4872 13 12 13C12.5523 13 13 12.5523 13 12V8L12.9933 7.88338Z" fill="#EC3737"/>
              </svg>
              <svg v-show="notification.type !== 'error' && notification.type !== 'warning' && notification.type !== 'success'"  width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15ZM12.9933 7.88338C12.9355 7.38604 12.5128 7 12 7C11.4477 7 11 7.44772 11 8V12L11.0067 12.1166C11.0645 12.614 11.4872 13 12 13C12.5523 13 13 12.5523 13 12V8L12.9933 7.88338Z" fill="#246fe5"/>
              </svg>
              <!--            <img draggable="false" src="/img/Success.svg" alt="not loaded"   v-show="notificationInfo.type === 'success'" class="notification__icons"  >-->
              <!--            <img draggable="false" src="/img/Alert.svg" alt="not loaded"   v-show="notificationInfo.type === 'warning'" class="notification__icons"  >-->
              <!--            <img draggable="false" src="/img/Error.svg" alt="not loaded"   v-show="notificationInfo.type === 'error'"  class="notification__icons"  >-->
            </div>
            <div class="notification-section--body__inner" >
              <p>{{notification.bodyText}}</p>
            </div>

          </section>
          <section v-if="$i18n.locale === 'en'" class="notification-section-ltr ">
            <div style="width: 0.4rem;height: 80%;position: absolute;left: -2rem;top: 10%;border-radius: 0.8rem" :style="{backgroundColor:notification.color}"></div>
            <div class="notification__icon">
              <svg v-show="notification.type === 'success'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15ZM12.9933 7.88338C12.9355 7.38604 12.5128 7 12 7C11.4477 7 11 7.44772 11 8V12L11.0067 12.1166C11.0645 12.614 11.4872 13 12 13C12.5523 13 13 12.5523 13 12V8L12.9933 7.88338Z" fill="#2AB459"/>
              </svg>

              <svg  v-show="notification.type === 'warning'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15ZM12.9933 7.88338C12.9355 7.38604 12.5128 7 12 7C11.4477 7 11 7.44772 11 8V12L11.0067 12.1166C11.0645 12.614 11.4872 13 12 13C12.5523 13 13 12.5523 13 12V8L12.9933 7.88338Z" fill="#FFA024"/>
              </svg>

              <svg v-show="notification.type === 'error'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15ZM12.9933 7.88338C12.9355 7.38604 12.5128 7 12 7C11.4477 7 11 7.44772 11 8V12L11.0067 12.1166C11.0645 12.614 11.4872 13 12 13C12.5523 13 13 12.5523 13 12V8L12.9933 7.88338Z" fill="#EC3737"/>
              </svg>
              <svg v-show="notification.type !== 'error' && notification.type !== 'warning' && notification.type !== 'success'"  width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 15C12.5523 15 13 15.4477 13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15ZM12.9933 7.88338C12.9355 7.38604 12.5128 7 12 7C11.4477 7 11 7.44772 11 8V12L11.0067 12.1166C11.0645 12.614 11.4872 13 12 13C12.5523 13 13 12.5523 13 12V8L12.9933 7.88338Z" fill="#246fe5"/>
              </svg>
              <!--            <img draggable="false" src="/img/Success.svg" alt="not loaded"   v-show="notificationInfo.type === 'success'" class="notification__icons"  >-->
              <!--            <img draggable="false" src="/img/Alert.svg" alt="not loaded"   v-show="notificationInfo.type === 'warning'" class="notification__icons"  >-->
              <!--            <img draggable="false" src="/img/Error.svg" alt="not loaded"   v-show="notificationInfo.type === 'error'"  class="notification__icons"  >-->
            </div>
            <div class="notification-section--body__inner" >
              <p>{{notification.bodyText}}</p>
            </div>

          </section>
        </div>
      </transition-group>
    </div>

  </teleport>

</template>
<script>
export default {
  data() {
    return {
      notifications: []
    };
  },
  methods: {
    addNotification(data) {
      const id = Date.now();
      this.notifications.push({...data ,id});
      setTimeout(() => {
        this.notifications = this.notifications.filter(n => n.id !== id);
      }, 5000);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.notifications-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  z-index: 10000;
}

.notification-content {
  margin: 5px 0;
  opacity: 0.9;
  transition: all 0.3s ease;
  height: 5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  width: 100%;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16);
  border-radius: 6px;
  padding: 0 14px 0 18px;
}

.notification-section-rtl,
.notification-section-ltr {
  direction: rtl;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  gap: 0.8rem;
}

.notification__icon {
  height: 100%;
  display: flex;
  align-items: center;
  box-shadow: 0 4rem 8rem 0 rgba(0, 0, 0, 0.16);
}

.notification-section--body__inner {
  direction: rtl;
  font-size: 1.2rem;
  height: 100%;
  display: flex;
  align-items: center;
}
.notification__icons{
  box-shadow: 0 4rem 8rem 0 rgba(0, 0, 0, 0.16);
}
.notification__icons-ltr {
  box-shadow: 0 4rem 8rem 0 rgba(0, 0, 0, 0.16);
}

.notification-body--warn{
  width: auto;
  min-width: 23rem;
  height : 5rem;
  display: flex;
  align-items: center;
  border: 0.1rem solid transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.36);
  background-color: #fff;
}

.notification-body--error{
  width: auto;
  min-width: 23rem;
  display: flex;
  align-items: center;
  border: 0.1rem solid transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16);
  background-color: #fff;
}
.notification-body--success{
  width: auto;
  min-width: 23rem;
  display: flex;
  align-items: center;
  border: 0.1rem solid transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16);
  background-color: #fff;
}

.notification-enter-active{
  animation: notification 1s ease;
}
.notification-leave-active{
  animation: notification 1s ease reverse;
}
@keyframes notification {
  from{
    transform: translate(-0,-120%);
  }
  to{
    transform: translate(0,0)
  }
}
</style>