<template>
  <confirm-optional-polling v-if="whichPolling === $store.getters.t('multiple-choice-polling')"
                            :all-optional-polling="allOptionalPolling"></confirm-optional-polling>
  <confirm-descriptive-polling v-else :all-descriptive-polling="allDescriptivePolling"></confirm-descriptive-polling>
</template>
<script>
import RestClient from "@/api/restClient";
import entityTypes from "../statics/entityTypes";
// import room_handler from "../utilities/room_handler";
import momentjs from "moment";
import momentJalali from "moment-jalaali-holiday";
import {nextTick} from "vue";
import ConfirmOptionalPolling from "@/components/ConfirmOptionalPolling.vue";
import ConfirmDescriptivePolling from "@/components/ConfirmDescriptivePolling.vue";

export default {
  name: "ThePoll",
  props: [ "whichPollingItem", "currentLayoutContainerHeight", "allOptionalPolling", "allDescriptivePolling", "whichPolling", "notAnsweredDescriptivePolling", "notAnsweredOptionalPolling"],
  components: {
    ConfirmDescriptivePolling,
    ConfirmOptionalPolling,
  },
  data() {
    return {
      isGetResult: false,
      restClient: new RestClient(entityTypes.polling),
      whichTab: this.whichPolling,
    };
  },
  methods: {
    addToQuestionList() {
      for (const el of this.options) {
        this.questionList.push(el.value);
      }
    },
    getAllResult() {
      this.allPollings = [];
      this.restClient
          .getAllResult(this.$store.getters.roomId)
          .then((response) => {
            this.isPassedThreeSeconds = false
            this.isGetResult = true
            // document.getElementById("chart").style.display = "none";
            this.allPollings = response;
            this.selectedQuestion = {
              label: response[0].body,
              pollingId: response[0].pollingId,
              isOptional: response[0].isOptional
            };
            for (const el of response) {
              this.resultQuestion.push({label: el.body, pollingId: el.pollingId, isOptional: el.isOptional});
            }
          })
          .catch((error) => {
            this.isPassedThreeSeconds = true
            this.isGetResult = false
            console.error(error);
          })
          .finally(() => {
          });
    },
    getResultPolling(id) {
      this.arrayOfPercentage = [];
      for (let i = 0; i < this.allPollings.length; i++) {
        if (this.allPollings[i].pollingId === id) {
          this.pollingId = this.allPollings[i].pollingId;
        }
      }
      this.restClient
          .getResult(this.pollingId)
          .then((response) => {
            const createdAt = momentjs(response.createdAt).format('YYYY-MM-DD')
            this.createdAt = momentJalali(createdAt).format('jYYYY/jMM/jDD')
            nextTick(() => {
              if (response.isOption) {
                document.getElementById("chart").style.display = "none";
              }
            })

            if (response.isAnonymous) {
              for (let i = 0; i < response.pollingResultDto.length; i++) {
                response.pollingResultDto[i].username = "ناشناس";
              }
            }
            this.body = response.body;
            this.pollingResult = response.pollingResultDto;
            this.pollStatistics = response.pollStatistics;
            let question = "";
            let percentage = 0;
            if (response.pollingResultDto.length === 0) {
              this.isPassCoupleOfSeconds = true
            } else {

              this.isPassCoupleOfSeconds = false
            }
            if (response.isOptional && response.pollingResultDto.length !== 0) {
              document.getElementById("chart").style.display = "block";
              if (this.pollStatistics) {
                for (let i = 0; i < this.pollStatistics.length; i++) {
                  question = this.pollStatistics[i].question;
                  this.arrayOfPercentage.push(question);
                  percentage = this.pollStatistics[i].percentageOfVotes;
                  this.arrayOfPercentage.push(percentage);
                }
                let splittedArray = [];
                while (this.arrayOfPercentage.length > 0) {
                  splittedArray.push(this.arrayOfPercentage.splice(0, 2));
                }
                this.innerData = splittedArray;
                const options = {
                  data: {
                    columns: this.innerData,
                    type: "pie",
                  },
                };
                this.chartOptions = options
                // this.eventBus.emit("initChart", options);
              }
            }
            // else {
            //   document.getElementById("chart").style.display = "none";
            // }
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
          });
    },
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
          .finally(() => {
          });
    },
    createOptionalPolling() {
      this.addToQuestionList();
      this.sending = true;
      this.restClient
          .createPoll({
            isAnonymous: this.isAnonymous,
            title: this.questionTitle,
            body: this.questionTitle,
            isOption: true,
            meetingId: this.$store.getters.roomId,
            questionList: this.questionList,
            person: parseInt([...this.$store.getters.innerParticipants, ...this.$store.getters.outerParticipants].length),
          })
          .then((response) => {
            console.error(response)
            // const data = {
            //   isAnonymous: this.isAnonymous,
            //   title: this.questionTitle,
            //   questionText: this.questionTitle,
            //   isOption: true,
            //   pollingId: response.data.data,
            //   options: this.questionList,
            //   date: new Date(),
            // }
            // room_handler.sendPollingData(this.$store.getters.roomId, data)
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            this.sending = false;
          });
    },

    createDescriptivePolling() {
      this.restClient
          .createPoll({
            isAnonymous: this.isAnonymous,
            title: this.descriptiveQuestionTitle,
            body: this.descriptiveQuestionTitle,
            isOption: false,
            person: parseInt([...this.$store.getters.innerParticipants, ...this.$store.getters.outerParticipants].length),
            meetingId: this.$store.getters.roomId,
            questionList: [],
          })
          .then((response) => {
            console.error(response)
            // const data = {
            //   isAnonymous: this.isAnonymous,
            //   title: this.descriptiveQuestionTitle,
            //   questionText: this.descriptiveQuestionTitle,
            //   isOption: false,
            //   meetingId: this.$store.getters.roomId,
            //   options: [],
            //   pollingId: response.data.data,
            //   date: new Date(),
            // }
            // room_handler.sendPollingData(this.$store.getters.roomId, data)
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
          });
    },

    submitPoll() {
      this.isOptionsEmpty = false
      this.isOptionalQuestionEmpty = false
      this.isOptionsLengthZero = false
      this.isQuestionTitleEmpty = false
      if (this.isTestPoll) {
        const index = this.options.findIndex((option) => {
          return option.value === ''
        })
        if (this.questionTitle === '') {
          this.isOptionalQuestionEmpty = true
        } else if (this.options.length === 0) {
          this.isOptionsLengthZero = true
        } else if (index !== -1) {
          this.isOptionsEmpty = true
        }
        if (this.questionTitle !== '' && this.options.length !== 0 && index === -1) {
          this.createOptionalPolling();
          this.$emit("close-polling");
        }

      } else {
        if (this.descriptiveQuestionTitle !== '') {
          this.createDescriptivePolling();
          this.$emit("close-polling");
        } else {

          this.isQuestionTitleEmpty = true
        }
      }
    },

  },
  mounted() {
    this.eventBus.on('open-polling', (data) => {
      this.restClient.getResult(data)
          .then((response) => {
            this.eventBus.emit('Polling', response)

          })
          .catch((error) => {
            console.error(error);
          })
    })
    this.eventBus.on("close-option", (data) => {
      const optionIndex = this.options.findIndex((el, index) => {
        return data === index;
      });
      if (optionIndex !== -1) {
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
</style>
