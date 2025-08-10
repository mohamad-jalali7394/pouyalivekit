<template>
  <div class="meeting-files__container">
<div>
  <span style="font-size: 1.2rem;font-weight: 700">قبل از جلسه</span>
  <ul v-if="isThereFilesBeforeMeeting" class="meeting-files__ul">
    <li class="file-information__container">
      <div>بررسی سایت های رقبای داخلی</div>
      <div>فرمت PDF</div>
      <div>تاریخ انتشار 6 اسفند</div>
      <img src="/img/download-excel.svg" alt="not loaded"  @click="downLoadFile"  style="cursor: pointer;width: 1.5rem;height:1.5rem" class="pin__icon">

    </li>
    <li class="file-information__container">
      <div>بررسی سایت های رقبای داخلی</div>
      <div>فرمت PDF</div>
      <div>تاریخ انتشار 6 اسفند</div>
      <img src="/img/download-excel.svg" alt="not loaded"  @click="downLoadFile"  style="cursor: pointer;width: 1.5rem;height:1.5rem" class="pin__icon">

    </li>
  </ul>
  <div style="  font-weight: 400;font-size: 14px;color: rgba(41, 41, 51, 1);" v-else>
    اطلاعاتی وجود ندارد
  </div>
</div>
<div>
  <span style="font-size: 1.2rem;font-weight: 700">بعد از جلسه</span>
  <ul v-if="isThereFilesAfterMeeting" class="meeting-files__ul">
    <li v-for="file in listOfRecordings" :key="file.fileName" class="file-information__container">
      <div>{{file.fileName}}</div>
      <div style="direction: ltr"> {{file.fileName?.split('.')?.pop() + ' ' + 'فرمت'}}</div>
      <div>{{file.timestamp}}</div>
      <img src="/img/download-excel.svg" alt="not loaded"  @click="downLoadFile(file.fileName?.split('.')?.pop(), file.fileName)"  style="cursor: pointer;width: 1.5rem;height:1.5rem" class="pin__icon">

    </li>

  </ul>
  <div style="  font-weight: 400;font-size: 14px;color: rgba(41, 41, 51, 1);" v-else>
    اطلاعاتی وجود ندارد
  </div>
</div>
  </div>
</template>
<script>
import RestClient from "@/api/restClient";
import entityTypes from "@/statics/entityTypes";
import auth from "@/store/auth";
export default {
  name: "MeetingFilesInformation",
  props:["listOfRecordings","isThereFilesBeforeMeeting","isThereFilesAfterMeeting"],
  data(){
    return {
      restClientControlMeeting: new RestClient(entityTypes.controlMeeting),
    }
  },
  methods:{
    downLoadFile(fileType,fileName){
      switch (fileType){
        case 'mp4':
          this.downloadRecordedMeetings(auth.getCustomerId(),fileName)
      }
    },
    downloadRecordedMeetings(customerId,fileName){
      this.restClientControlMeeting.downloadRecordedFiles(customerId,fileName).then((response)=>{
        if (response?.data){
          console.error("download started")

        }
      }).catch((error)=>{
        console.error(error)
      })
    }
  }
}
</script>
<style scoped>
.meeting-files__container{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  align-items: center;
  justify-content: center;
}
.meeting-files__container > div{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: flex-start;
  justify-content: center;
}
.meeting-files__ul{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  justify-content: center;
  padding:0 0.4rem ;
}
.file-information__container {
  width: 100% ;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  color: rgba(41, 41, 51, 1);

}
.file-information__container > div:nth-child {
  width: 20%;
}
.file-information__container > div:first-child {
  width: 40%;
}
</style>