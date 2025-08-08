<template>
  <base-modal is-blur="false" page="conference" :open="isOpen">
    <template #modal-header>
      <div :style="{direction: $i18n.locale === 'fa' ? 'rtl':'ltr'}" class="header-container--polling">
        <h1>{{$store.getters.t("polling-result")}}</h1>
        <div>
          <img draggable="false"
              src="/img/close.svg"
              alt="not loaded"
              @click="closePollingModal"
              style="cursor: pointer"
          />
        </div>
      </div>
    </template>

    <template #modal-body>
      <div class="main-body__polling" :style="{height:currentLayoutContainerHeight - 170 + 'px'}">
          <polling-information-card v-for="poll in allPollings" :key="poll.pollingId"
                               :polling-id="poll.surveyId"
                               :polling-data="poll.surveyQuestionRespDtoList"
                               :polling-result-dto="poll.pollingResultDto"></polling-information-card>

      </div>
    </template>

  </base-modal>
</template>
<script>
import RestClient from "@/api/restClient";
import entityTypes from "../statics/entityTypes";

import BaseModal from "@/components/UI/BaseModal.vue";

import PollingInformationCard from "@/components/PollingInformationCard.vue";
export default {
  name: "ThePoll",
  props: ["isOpen","meetingTitle","whichPollingItem","currentLayoutContainerHeight","whichTab"],
  components: {
    PollingInformationCard,BaseModal
  },
  data() {
    return {
      isPassCoupleOfSeconds:false,
      isPassedThreeSeconds:false,
      isGetResult:false,
      pollingResult: [],
      pollStatistics: [],
      pollingId: "",
      arrayOfPercentage: [],
      resultQuestion: [],
      allPollings: [],
      conicGrad: "",
      options: [],
      pollButton: "active",
      pollResultButton: "inactive",
      pollOrResult: "poll",
      restClient: new RestClient(entityTypes.polling),

    };
  },
  watch: {
    isPassCoupleOfSeconds(val){
      if(val === true){
        setTimeout(()=>{
          this.isPassCoupleOfSeconds = false
        },3000)
      }
    },
    isPassedThreeSeconds(val){
      if(val === true){
        setTimeout(()=>{
          this.isPassedThreeSeconds = false
        },3000)
      }
    },
  },
  methods: {

    getAllResult() {
      this.allPollings = [];
      this.restClient
          .getAllSurvey(this.$store.getters.roomId)
          .then((response) => {
            console.error('aaaaaaaaaaaaaaaaaaaaaallllllllllllllllllllllllllllllllllllllllllllllll')
            console.error(response)
            this.isPassedThreeSeconds = false
            this.isGetResult = true
            // document.getElementById("chart").style.display = "none";
            // this.allPollings = response;
            for (let i=0; i < response.length ; i++){
              this.allPollings.unshift(response[i])
            }
            this.selectedQuestion = { label: response[0].body,pollingId:response[0].pollingId,isOptional:response[0].isOptional};
            for (const el of response) {
              this.resultQuestion.push({ label: el.body,pollingId: el.pollingId,isOptional: el.isOptional });
            }
          })
          .catch((error) => {
            this.isPassedThreeSeconds = true
            this.isGetResult = false
            console.error(error);
          })
          .finally(() => {});
    },
    // getResultPolling(id) {
    //   this.arrayOfPercentage = [];
    //   for (let i = 0; i < this.allPollings.length; i++) {
    //     if (this.allPollings[i].pollingId === id) {
    //       this.pollingId = this.allPollings[i].pollingId;
    //     }
    //   }
    //   this.restClient
    //       .getResult(this.pollingId)
    //       .then((response) => {
    //         const createdAt =momentjs(response.createdAt).format('YYYY-MM-DD')
    //         this.createdAt = momentJalali(createdAt).format('jYYYY/jMM/jDD')
    //         nextTick(()=>{
    //           if (response.isOption){
    //             document.getElementById("chart").style.display = "none";
    //           }
    //         })
    //
    //         if (response.isAnonymous) {
    //           for (let i = 0; i < response.pollingResultDto.length; i++) {
    //             response.pollingResultDto[i].username = "ناشناس";
    //           }
    //         }
    //         this.body = response.body;
    //         this.pollingResult = response.pollingResultDto;
    //         this.pollStatistics = response.pollStatistics;
    //         let question = "";
    //         let percentage = 0;
    //         if (response.pollingResultDto.length === 0){
    //           this.isPassCoupleOfSeconds = true
    //         }else{
    //
    //           this.isPassCoupleOfSeconds = false
    //         }
    //         if (response.isOptional && response.pollingResultDto.length !== 0) {
    //           document.getElementById("chart").style.display = "block";
    //           if (this.pollStatistics) {
    //             for (let i = 0; i < this.pollStatistics.length; i++) {
    //               question = this.pollStatistics[i].question;
    //               this.arrayOfPercentage.push(question);
    //               percentage = this.pollStatistics[i].percentageOfVotes;
    //               this.arrayOfPercentage.push(percentage);
    //             }
    //             let splittedArray = [];
    //             while (this.arrayOfPercentage.length > 0) {
    //               splittedArray.push(this.arrayOfPercentage.splice(0, 2));
    //             }
    //             this.innerData = splittedArray;
    //             const options = {
    //               data: {
    //                 columns: this.innerData,
    //                 type: "pie",
    //               },
    //             };
    //             this.chartOptions = options
    //             // this.eventBus.emit("initChart", options);
    //           }
    //          }
    //           // else {
    //         //   document.getElementById("chart").style.display = "none";
    //         // }
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       })
    //       .finally(() => {});
    // },
    // getResultPolling(id) {
    //   this.arrayOfPercentage = [];
    //   for (let i = 0; i < this.allPollings.length; i++) {
    //     if (this.allPollings[i].pollingId == id) {
    //       this.pollingId = this.allPollings[i].pollingId;
    //     }
    //   }
    //   this.restClient
    //       .getResult(this.pollingId)
    //       .then((response) => {
    //         if (response.isAnonymous) {
    //           for (let i = 0; i < response.pollingResultDto.length; i++) {
    //             response.pollingResultDto[i].username = "ناشناس";
    //           }
    //         }
    //         this.body = response.body;
    //         this.pollingResult = response.pollingResultDto;
    //         this.pollStatistics = response.pollStatistics;
    //         let question = "";
    //         let percentage = 0;
    //         if (response.isOptional) {
    //           document.getElementById("chart").style.display = "block";
    //           if (this.pollStatistics) {
    //             for (let i = 0; i < this.pollStatistics.length; i++) {
    //               question = this.pollStatistics[i].question;
    //               this.arrayOfPercentage.push(question);
    //               percentage = this.pollStatistics[i].percentageOfVotes;
    //               this.arrayOfPercentage.push(percentage);
    //             }
    //             let splittedArray = [];
    //             while (this.arrayOfPercentage.length > 0) {
    //               splittedArray.push(this.arrayOfPercentage.splice(0, 2));
    //             }
    //             this.innerData = splittedArray;
    //             const options = {
    //               data: {
    //                 columns: this.innerData,
    //                 type: "pie",
    //               },
    //             };
    //             this.eventBus.emit("initChart", options);
    //           }
    //         } else {
    //           document.getElementById("chart").style.display = "none";
    //         }
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //       })
    //       .finally(() => {});
    // },
    downloadResult() {
      this.restClient
          .getResultInExcel(this.pollingId)
          .then((response) => {
            var raw = window.atob(response);
            // Create an array to store the decoded data
            var uInt8Array = new Uint8Array(raw.length);
            // blob can only receive binary encoding, need to talk about base64 converted to binary and then stuffed
            for (var i = 0; i < raw.length; ++i) {
              uInt8Array[i] = raw.charCodeAt(i);
            }
            // A return value is given here. In other methods, you can get the converted blob by using the base64 encoding.
            const link = document.createElement("a");
            const blob = new Blob([uInt8Array], {
              type: "application/vnd.ms-excel",
            });
            link.target = "_blank"
            link.style.display = "none";
            link.target = "_blank"
            link.href = URL.createObjectURL(blob);
            // Set the downloaded Excel table name
            link.setAttribute("download", `${this.meetingTitle}` + ' ' + `${this.createdAt}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {});
    },


    closePollingModal(){
      this.$emit('close-polling-modal')
    },
  },
  mounted() {
    this.getAllResult();
    setTimeout(() => {
      this.isMount = true
    }, 10)
    addEventListener('resize', () => {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.isResizing = !this.isResizing
        if (this.isFullScreen) {
          this.$refs.tab.style.width = '98vw'
        }
      }, 50)
    })
    this.eventBus.on('open-polling',(data)=>{
      this.restClient.getResultSurvey(data)
          .then((response) => {
            this.eventBus.emit('Polling',response)

          })
          .catch((error) => {
            console.error(error);
          })
    })
    this.eventBus.on("close-option", (data) => {
      const optionIndex = this.options.findIndex((el, index) => {
        return data === index;
      });
      if (optionIndex != -1) {
        this.options.splice(optionIndex, 1);
      }
    });
    this.eventBus.on("anonymous", (data) => {
      if (data === true) {
        this.isAnonymous = true;
      } else {
        this.isAnonymous = false;
      }
    });
  },
};
</script>
<style scoped>
.label {
  margin-right: 1rem;
  cursor: pointer;
}

.header-container--polling{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  color: #292933;
}
.header-container--polling >h1{
font-size: 2.5rem;
}
.main-body__polling {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80rem;
  gap: 1.2rem;
  min-height: 50vh;
  max-height: 70vh;
  overflow-y: auto;
  /*align-items: center;*/
}

.button-container--polling {
  width: 85rem;
  height: 7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}

.descriptive__poll__body {
  display: flex;
  width: 100%;
  height: 40rem;
  flex-direction: column;
  direction: rtl;
  align-items: center;
}





::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #7A7A7A;
  border-radius: 12px;
}

::-webkit-scrollbar-track-piece {
  height: 20px;
}

@media (max-width: 980px) {
  .header-container--polling{

    width: 85vw;

  }
  .main-body__polling {
    width: 85vw;
  }
  .main-body__polling {
    width: 85vw;
  }
}
@media (max-width: 480px) {
  .header-container--polling{

    width: 75vw;

  }
  .main-body__polling {
    width: 75vw;
  }
  .main-body__polling {
    width: 75vw;
  }


}
</style>
