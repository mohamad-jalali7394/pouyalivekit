<template>
  <div class="vuec3-chart"></div>
</template>

<script>
  import c3 from "c3";
  export default {
    name: "VueC3",
    // TODO: support for options prop
    props: {
      handler: {
        required: true,
        type: Object,
      },
      options:{
        required: true,
        type: Object,
      }
    },
    data: function () {
      return {
        $chart: null,
      };
    },
    watch:{
      options:{
        deep:true,
        handler(val){
          this.initChart(val);
        }
      }
    },
    methods: {
      destroyChart: function () {
        if (this.$chart) {
          this.$chart = this.$chart.destroy();
        }
      },
      initChart(options) {
        if (this.$chart) {
          this.destroyChart();
        }
        if (!options) {
          options = {};
        }
        options.bindto = this.$el;
        this.$chart = c3.generate(options);
      },
      dispatchChart: function (cb) {
        if (cb && this.$chart) {
          cb.call(null, this.$chart);
        }
      },
    },
    // mounted: function () {
    //   // console.error('aliiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
    //   this.eventBus.on("initChart", (data) => {
    //     // console.error('eventBuuuuuuuuuuuuuuuuuuuuuuuus')
    //     // console.error(this.chartId)
    //     this.initChart(data);
    //   });
    //   this.eventBus.once("event-bus",()=>{
    //     console.error('vent-bussssssssssssssssssssssssssssssssssssss')
    //   });
    //   // this.eventBus.on("event", (data) => {
    //   //   if (data === "initChart") {
    //   //     this.initChart();
    //   //   } else if (data === "destroyChart") {
    //   //     this.destroyChart();
    //   //   } else {
    //   //     this.dispatchChart();
    //   //   }
    //   // });
    // },
    beforeUnmount: function () {
      this.destroyChart();
    },
  };
</script>
<style>
/*.c3-legend-item {*/
/*  display: none;*/
/*  height: 0;*/
/*}*/
.legend span {
  width: 10rem;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  color: white;
}
</style>