<template>
<div class="board">
  <div class="board__drawing-area"
       ref="canvas-container"
       :style="styleForFileOrVideoSharing"
       @mouseover="makeToolsVisible"
       @mouseout="makeToolsInvisible">
    <canvas ref="main-canvas"></canvas>
    <canvas ref="temp-canvas" @mousemove="layerMoving" @mousedown="startDrawing" @mouseup="stopDrawing" @mouseout="stopDrawingExceptText"></canvas>
    <textarea ref="temp-writing" @mouseup="stopWriting"></textarea>
    <div class="temp-writing-container" ref="temp-writing-container"></div>
  </div>
  <div class="board__tools-area" v-if="$store.getters.amIHaveBoardPermission" :class="toolsVisibility" @mouseover="makeToolsVisible" @mouseout="makeToolsInvisible">
<white-board-tools
    :drawing-tools="drawingTools"
    @select-drawing-tool="getSelectedDrawingTool"
>
</white-board-tools>
  <div class="board__properties">
    <div class="board__properties--text" v-if="currentTool !== 'not-selected' && currentTool === 'text'">
    </div>
    <div class="board__properties--drawing" v-if="currentTool !== 'not-selected' && currentTool !== 'text'">
      <input v-if="currentTool !== 'eraser'" type="color" v-model="strokeColorParameters.hexVal" @change="changeStrokeColor">
      <input type="range" v-model="strokeLineWidth" min="2" max="25" @change="changeLineWidth">
      <input v-if="currentTool !== 'eraser'" type="color" v-model="fillColorParameters.hexVal" @change="changeFillColor">
    </div>
  </div>
  </div>
</div>
</template>

<script>
import onReceivedDrawBrush from '../whiteboard/receiver_actions/on.received.draw.brush';
import onReceivedStraightLine from '../whiteboard/receiver_actions/on.received.straight.line';
import onReceivedDrawCircle from '../whiteboard/receiver_actions/on.received.draw.circle';
import onReceivedDrawRectangle from '../whiteboard/receiver_actions/on.received.draw.rectangle';
import onReceivedDrawEllipse from '../whiteboard/receiver_actions/on.received.draw.ellipse';
import onReceivedText from '../whiteboard/receiver_actions/on.text.received';
import onReceivedErase from '../whiteboard/receiver_actions/on.received.erase';
import onReceivedFillColor from '../whiteboard/receiver_actions/on.received.fill.color';
import onReceivedUndo from '../whiteboard/receiver_actions/on.received.undo';
import onReceivedClean from '../whiteboard/receiver_actions/on.received.clean';
// import socketCtsSignaller from "../whiteboard/socket_cts_signaller";
// import socketSTCGateway from '../whiteboard/socket_stc_gateway'
import WhiteBoardTools from "./WhiteBoardTools";
import others_handler from "../webSocketOthers/others_handler";
import {
  allToolsHandler
} from '../whiteboard/drawer_actions';
import hexToRGBConverter from "../whiteboard/utils/hexToRGBConverter";
// import {nextTick} from "vue";
// import eventBus from "../utilities/event_bus";
export default {
  name: "TheWhiteBoard",
  components: {WhiteBoardTools},
  props : ['number', 'initialCanvasInfo', 'isForFileOrVideoSharing', 'boardWidth', 'boardHeight'],
  emits : ['canvas-history', 'board-activated'],
  data(){
    return {
      canvasHistory : null,
      currentTool : 'not-selected',
      receivingCurrentTool : 'straight-line',
      mainCanvas : null,
      mainCanvasCtx : null,
      refreshableCanvasForUndo : null,
      tempCanvas : null,
      tempCanvasCtx : null,
      tempWritingContainer : null,
      tempWriting : null,
      isTextCreationStarted : false,
      fillColorParameters : {
        r: 0,
        g: 0,
        b: 0,
        alpha : 100,
        hexVal : '#000000'
      },
      strokeColorParameters :{
        r: 0,
        g: 0,
        b: 0,
        alpha : 100,
        hexVal : '#ffffff'
      },
      strokeLineWidth : 6,
      eraserColorHexVal : '#ffffff',
      undoHistory : [],
      otherDrawersUndoHistory : [],
      mouseCoordinates : {x : 0, y: 0},
      mouseStartingCoordinates : {x : 0, y: 0},
      undo : {
        counter : 0,
        undoArray : [],
      },
      drawingTools : [
        {
          label : 'brush',
          src : '/img/whiteboard/brush.svg',
          handlerScopeBound : null,
          receiverScopeBound : null,
          handlerClosure : () => {
            const thisCurrentTool = this.toolFinder();
            thisCurrentTool.handlerScopeBound = allToolsHandler.onDrawBrushHandler.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.tempCanvasCtx,
                this.mouseCoordinates,
                this.coordinatesCaptureArray
            );
            this.tempCanvas.addEventListener("mousemove", thisCurrentTool.handlerScopeBound, false);
          },
          receiverClosure : () => {
            this.drawingTools[0].receiverScopeBound = onReceivedDrawBrush.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.tempCanvasCtx,
                this.coordinatesCaptureArray
            )
          }

        },
        {
          label : 'straight-line',
          src : '/img/whiteboard/straight-line.svg',
          handlerScopeBound: null,
          receiverScopeBound : null,
          handlerClosure : () =>  {
            const thisCurrentTool = this.toolFinder();
            thisCurrentTool.handlerScopeBound = allToolsHandler.onDrawStraightLineHandler.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.tempCanvasCtx,
                this.mouseStartingCoordinates,
                this.mouseCoordinates
            );
            this.tempCanvas.addEventListener("mousemove", thisCurrentTool.handlerScopeBound, false);
          },
          receiverClosure : () => {
            this.drawingTools[1].receiverScopeBound = onReceivedStraightLine.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.tempCanvasCtx
            )
        }
        },
        {
          label : 'rectangle',
          src : '/img/whiteboard/rectangle.svg',
          handlerScopeBound: null,
          receiverScopeBound: null,
          handlerClosure : () =>  {
            const thisCurrentTool = this.toolFinder();
            thisCurrentTool.handlerScopeBound = allToolsHandler.onDrawRectangleHandler.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.tempCanvasCtx,
                this.mouseStartingCoordinates,
                this.mouseCoordinates
            );
            this.tempCanvas.addEventListener("mousemove", thisCurrentTool.handlerScopeBound, false);
          },
          receiverClosure : () => {
            this.drawingTools[2].receiverScopeBound = onReceivedDrawRectangle.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.tempCanvasCtx
            )
          }
        },
        {
          label : 'circle',
          src : '/img/whiteboard/circle.svg',
          handlerScopeBound: null,
          receiverScopeBound: null,
          handlerClosure : () =>  {
            const thisCurrentTool = this.toolFinder();
            thisCurrentTool.handlerScopeBound = allToolsHandler.onDrawCircleHandler.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.tempCanvasCtx,
                this.mouseStartingCoordinates,
                this.mouseCoordinates
            );
            this.tempCanvas.addEventListener("mousemove", thisCurrentTool.handlerScopeBound, false);
          },
          receiverClosure : () => {
            this.drawingTools[3].receiverScopeBound = onReceivedDrawCircle.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.tempCanvasCtx
            )
          }
        },
        {
          label : 'ellipse',
          src : '/img/whiteboard/ellipse.svg',
          handlerScopeBound: null,
          receiverScopeBound: null,
          handlerClosure : () =>  {
            const thisCurrentTool = this.toolFinder();
            thisCurrentTool.handlerScopeBound = allToolsHandler.onDrawEllipseHandler.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.tempCanvasCtx,
                this.mouseStartingCoordinates,
                this.mouseCoordinates
            );
            this.tempCanvas.addEventListener("mousemove", thisCurrentTool.handlerScopeBound, false);
          },
          receiverClosure : () => {
            this.drawingTools[4].receiverScopeBound = onReceivedDrawEllipse.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.tempCanvasCtx,
            )
          }
        },
        {
          label : 'text',
          src : '/img/whiteboard/text.svg',
          handlerScopeBound: null,
          receiverScopeBound: null,
          handlerClosure : () =>  {
            let allLines = this.tempWriting.value.split("\n");
            let previousLines = [];
            for (let i = 0; i < allLines.length; ++i) {
              let characters = allLines[i].length;
              for (let j = 0; j < characters; j++) {
                let currentTextNode = document.createTextNode(allLines[i][j]);
                this.tempWritingContainer.appendChild(currentTextNode);
                this.tempWritingContainer.style.position = 'absolute';
                this.tempWritingContainer.style.visibility = 'hidden';
                this.tempWritingContainer.style.display = 'block';
                this.tempWritingContainer.style.visibility = '';
                this.tempWritingContainer.style.display = 'none';
                this.tempWritingContainer.style.position = '';
              }
              previousLines.push(this.tempWritingContainer.textContent);
              this.tempWritingContainer.innerHTML = '';
            }
            const computedStyleOfText = getComputedStyle(this.tempWriting);
            const fontSize = computedStyleOfText.getPropertyValue('font-size');
            const fontFamily = computedStyleOfText.getPropertyValue('font-family');
            this.tempCanvasCtx.font = fontSize + ' ' + fontFamily;
            this.tempCanvasCtx.textBaseline = 'top';
            const lineDistancesFromTop = []
            if(allLines[0].length !== 0){
              this.isTextCreationStarted = false;
              for (let i = 0; i < previousLines.length; ++i) {
                let processedLine = previousLines[i];
                lineDistancesFromTop.push(parseInt(this.tempWriting.style.top) + i * parseInt(fontSize));
                this.tempCanvasCtx.fillText(
                    processedLine,
                    parseInt(this.tempWriting.style.left),
                    parseInt(this.tempWriting.style.top) + i * parseInt(fontSize)
                );
              }
              this.tempWriting.style.display = 'none';
              this.tempWriting.value = '';
              others_handler.createText({
                x: parseInt(this.tempWriting.style.left),
                lineDistancesFromTop,
                allLines,
                fontSize,
                fontFamily
              })
            } else {
              this.isTextCreationStarted = true;
            }
            const thisCurrentTool = this.toolFinder();
            thisCurrentTool.handlerScopeBound = allToolsHandler.onCreateTextHandler.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.tempCanvasCtx,
                this.tempWriting,
                this.mouseStartingCoordinates,
                this.mouseCoordinates
            );
            this.tempCanvas.addEventListener("mousemove", thisCurrentTool.handlerScopeBound, false);
          },
          receiverClosure : () => {
            this.drawingTools[5].receiverScopeBound = onReceivedText.bind(
                this,
                this.tempCanvasCtx,
                this.tempWritingContainer,
                this.tempWriting
            )
          }
        },
        {
          label : 'eraser',
          src : '/img/whiteboard/eraser.svg',
          handlerScopeBound: null,
          receiverScopeBound: null,
          handlerClosure : () =>  {
            const thisCurrentTool = this.toolFinder();
            thisCurrentTool.handlerScopeBound = allToolsHandler.onEraseHandler.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.mainCanvasCtx,
                this.mouseCoordinates,
                this.coordinatesCaptureArray
            );
            this.tempCanvas.addEventListener("mousemove", thisCurrentTool.handlerScopeBound, false);
          },
          receiverClosure : () => {
            this.drawingTools[6].receiverScopeBound = onReceivedErase.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.mainCanvasCtx,
                this.coordinatesCaptureArray
            )
          }
        },
        {
          label : 'fill-color',
          src : '/img/whiteboard/fill-color.svg',
          handlerScopeBound: null,
          receiverScopeBound: null,
          handlerClosure : () =>  {
            const thisCurrentTool = this.toolFinder();
            thisCurrentTool.handlerScopeBound = allToolsHandler.onFillColorHandler.call(
                this,
                this.mainCanvas,
                this.mainCanvasCtx,
                this.mouseStartingCoordinates,
                this.fillColorParameters
            );
          },
          receiverClosure : () => {
            this.drawingTools[7].receiverScopeBound = onReceivedFillColor.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.mainCanvasCtx
            )
          }
        },
        {
          label : 'clean',
          src : '/img/whiteboard/clean.svg',
          handlerScopeBound: null,
          receiverScopeBound: null,
          handlerClosure : () =>  {
            const thisCurrentTool = this.toolFinder();
            thisCurrentTool.handlerScopeBound = allToolsHandler.onCleanHandler.call(
                this,
                this.mainCanvasCtx,
                this.tempCanvasCtx,
                this.tempCanvas.width,
                this.tempCanvas.height
            );
          },
          receiverClosure : () => {
            this.drawingTools[8].receiverScopeBound = onReceivedClean.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.mainCanvasCtx,
                this.tempCanvasCtx
            )
          }
        },
        {
          label: 'undo',
          src : '/img/whiteboard/undo.svg',
          handlerScopeBound: null,
          receiverScopeBound: null,
          handlerClosure : () =>  {
            const thisCurrentTool = this.toolFinder();
            thisCurrentTool.handlerScopeBound = allToolsHandler.onUndoHandler.call(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.mainCanvasCtx,
                this.undoHistory
          );
          },
          receiverClosure : () => {
            this.drawingTools[9].receiverScopeBound = onReceivedUndo.bind(
                this,
                this.tempCanvas.width,
                this.tempCanvas.height,
                this.mainCanvasCtx,
                this.otherDrawersUndoHistory
            )
          }
        }
      ],
      coordinatesCaptureArray : [],
      colorInputIsFocused : false,
      areToolsVisible : false
    }
  },
  computed:{
    styleForFileOrVideoSharing(){
      let bgForFileOrVideoSharing;
      if(this.isForFileOrVideoSharing){
        bgForFileOrVideoSharing = {backgroundImage : 'none', backgroundColor : 'transparent', border : 'none'};
      }
      return bgForFileOrVideoSharing;
    },
    toolsVisibility(){
      return ({['board__tools-area--visible'] : this.areToolsVisible});
    }
  },
  watch: {
    // boardWidth : {
    //   handler(){
    //     nextTick(() => {
    //       // this.calculateCanvasSizes();
    //       if(this.$store.getters.boardsHistory.get(this.number)){
    //         const img = new Image()
    //         img.src = this.$store.getters.boardsHistory.get(this.number).mainCanvas;
    //         img.onload = () => {
    //           this.mainCanvasCtx.drawImage(img, 0, 0, this.mainCanvas.width, this.mainCanvas.width * img.height / img.width);
    //         }
    //       }
    //     })
    //   }
    // },
    // boardHeight : {
    //   immediate: true,
    //   handler(){
    //     nextTick(() => {
    //       // this.calculateCanvasSizes();
    //       this.mainCanvasCtx.lineWidth = 2;
    //       this.mainCanvasCtx.strokeStyle = '#ffffff';
    //       this.mainCanvasCtx.fillStyle = '#ffffff'
    //       this.mainCanvasCtx.drawImage(this.$store.getters.boardsHistory.get(this.number).mainCanvas, 0 ,0);
    //       // this.mainCanvasCtx.drawImage(this.$store.getters.boardsHistory.get(this.number).mainCanvas, 0 ,0);
    //     })
    //
    //   }
    // }
  },
  methods : {
    changeLineWidth(e){
      this.strokeLineWidth = e.target.value;
      this.tempCanvasCtx.lineWidth = e.target.value;
    },
    changeFillColor(e){
      this.fillColorParameters.hexVal = e.target.value;
      this.fillColorParameters.alpha = Math.round(this.tempCanvasCtx.globalAlpha * 255);
      this.fillColorParameters.r = hexToRGBConverter(this.fillColorParameters.hexVal).r;
      this.fillColorParameters.g = hexToRGBConverter(this.fillColorParameters.hexVal).g;
      this.fillColorParameters.b = hexToRGBConverter(this.fillColorParameters.hexVal).b;
      this.tempCanvasCtx.fillStyle = e.target.value;
    },
    changeStrokeColor(e){
      this.tempCanvasCtx.strokeStyle = e.target.value;
      this.strokeColorParameters.hexVal = e.target.value;
    },
    makeToolsVisible(){
      this.areToolsVisible = true;
    },
    makeToolsInvisible(){
      this.areToolsVisible = false;
    },
    getSelectedDrawingTool(tool){
      this.currentTool = tool;
      switch (tool){
        case 'clean' :
          this.toolFinder().handlerClosure();
        break;
        case 'undo' :
          this.toolFinder().handlerClosure();
        break;
      }
    },
    calculateCanvasSizes(width, height){
      // const canvasWidth = parseInt(getComputedStyle(this.$refs['canvas-container']).getPropertyValue('width'));
      // const canvasHeight = parseInt(getComputedStyle(this.$refs['canvas-container']).getPropertyValue('height'));
      this.mainCanvas.width = width;
      this.mainCanvas.height = height;
      this.tempCanvas.width = width;
      this.tempCanvas.height = height;
      if(this.$store.getters.boardsHistory.get(this.number)){
        const img = new Image()
        img.src = this.$store.getters.boardsHistory.get(this.number);
        img.onload = () => {
          this.mainCanvasCtx.drawImage(img, 0, 0, this.mainCanvas.width, this.mainCanvas.width * img.height / img.width);
        }
      }
      this.drawingTools.forEach(tool => {
        tool.receiverClosure();
      });
    },
    layerMoving(e){
      if(!this.$store.getters.amIHaveBoardPermission) return;
      this.mouseCoordinates.x = e.layerX;
        this.mouseCoordinates.y = e.layerY;
    },
    startDrawing(e){
      if(!this.$store.getters.amIHaveBoardPermission) return;
      this.tempCanvasCtx.lineWidth = this.strokeLineWidth;
        this.mainCanvasCtx.lineWidth = this.strokeLineWidth;
        this.tempCanvasCtx.globalAlpha = this.fillColorParameters.alpha / 100;
        this.tempCanvasCtx.fillStyle = this.fillColorParameters.hexVal;
        this.tempCanvasCtx.strokeStyle = this.strokeColorParameters.hexVal;
        others_handler.startDrawing(
            {
              number : this.number,
              mainCanvasWidth: this.mainCanvas.width,
              mainCanvasHeight: this.mainCanvas.height,
              lineWidth: this.strokeLineWidth,
              fillStyle: this.fillColorParameters.hexVal,
              strokeStyle: this.strokeColorParameters.hexVal
            }
        );
        this.mouseCoordinates.x = e.layerX;
        this.mouseCoordinates.y = e.layerY;
        this.mouseStartingCoordinates.x = this.mouseCoordinates.x;
        this.mouseStartingCoordinates.y = this.mouseCoordinates.y;
        const that = this;
        this.coordinatesCaptureArray.push({x: that.mouseCoordinates.x, y: that.mouseCoordinates.y});
        const foundTool = this.toolFinder();
        foundTool.handlerClosure();
    },
    stopDrawing(){
      if(!this.$store.getters.amIHaveBoardPermission) return;
      this.mainCanvasCtx.globalCompositeOperation = 'source-over';
      const foundTool = this.toolFinder();
      this.tempCanvas.removeEventListener("mousemove", foundTool.handlerScopeBound, false);
      if(!this.isTextCreationStarted){
        this.mainCanvasCtx.drawImage(this.tempCanvas, 0, 0);
        this.undoHistory.push(
            this.mainCanvasCtx.getImageData(0, 0, this.mainCanvas.width, this.mainCanvas.height)
        );
      } else return;
      this.canvasHistory = this.mainCanvas;
      this.$emit('canvas-history', {number : this.number, mainCanvas : this.mainCanvas.toDataURL('image/png')});
      this.tempCanvasCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
      this.coordinatesCaptureArray.length = 0;
      this.undo.undoArray.push(this.mainCanvas.toDataURL());
      this.undo.counter = 0;
      others_handler.mouseUp(this.number, this.mainCanvas);
    },
    stopDrawingExceptText(){
      if(!this.$store.getters.amIHaveBoardPermission) return;
      if(this.currentTool !== 'text'){
        this.stopDrawing();
      }
    },
    stopWriting(){
      const foundTool = this.toolFinder();
      this.tempCanvas.removeEventListener("mousemove", foundTool.handlerScopeBound, false);
    },
    toolFinder(){
      return this.drawingTools.find(tool => tool.label === this.currentTool);
    },
  },
   beforeMount() {
    this.$store.dispatch('setDrawingTools', {number : this.number, drawingTools : this.drawingTools});
   },
  mounted() {
    this.eventBus.on('board-container-size', ({number, width , height}) => {
      if(number === this.number){
        this.calculateCanvasSizes(width, height);
      }
    });
      this.mainCanvas = this.$refs['main-canvas'];
      this.mainCanvasCtx = this.mainCanvas.getContext('2d');
      this.tempCanvas= this.$refs['temp-canvas'];
      this.tempCanvasCtx = this.tempCanvas.getContext('2d');
      this.mainCanvasCtx.globalCompositeOperation = 'source-over';
      this.eventBus.on('received-boards-data', () => {
        if(this.$store.getters.boardsHistory.get(this.number)){
          const img = new Image()
          img.src = this.$store.getters.boardsHistory.get(this.number);
          img.onload = () => {
            this.mainCanvasCtx.drawImage(img, 0, 0, this.mainCanvas.width, this.mainCanvas.width * img.height / img.width);
          }
        }
      });
    this.tempWritingContainer = this.$refs['temp-writing-container'];
      this.tempWriting = this.$refs['temp-writing'];
      this.tempCanvasCtx.lineJoin = 'round';
      this.tempCanvasCtx.lineCap = 'round';
      this.fillColorParameters.alpha = Math.round(this.tempCanvasCtx.globalAlpha * 255);
      this.fillColorParameters.r = hexToRGBConverter(this.fillColorParameters.hexVal).r;
      this.fillColorParameters.g = hexToRGBConverter(this.fillColorParameters.hexVal).g;
      this.fillColorParameters.b = hexToRGBConverter(this.fillColorParameters.hexVal).b;
    this.refreshableCanvasForUndo = this.mainCanvas.toDataURL();
      this.undo.undoArray.push(this.refreshableCanvasForUndo);
    // this.calculateCanvasSizes();
    this.$store.dispatch('setBoardsTempCanvasesCtx', {number : this.number, tempCanvasCtx : this.tempCanvasCtx});
    this.$store.dispatch('setBoardsMainCanvases', {number : this.number, mainCanvas : this.mainCanvas});
    this.eventBus.on('mouseup', number => {
      if(number === this.number){
        this.mainCanvasCtx.globalCompositeOperation = 'source-over';
        this.mainCanvasCtx.drawImage(this.tempCanvas, 0, 0);
        this.tempCanvasCtx.clearRect(
            0,
            0,
            this.tempCanvas.width,
            this.tempCanvas.height
        );
        this.$emit('canvas-history', {number : this.number, mainCanvas : this.mainCanvas.toDataURL('image/png')});
        this.otherDrawersUndoHistory.push(
            this.mainCanvasCtx.getImageData(
                0,
                0,
                this.tempCanvas.width,
                this.tempCanvas.height)
        );
        this.coordinatesCaptureArray.length = 0 ;
      }
    });
    this.$emit('board-activated', {
      number : this.number,
      drawingTools :this.drawingTools,
      undoHistory : [...this.undoHistory, this.otherDrawersUndoHistory]
    });

    // socketSTCGateway(socket,
    // {
    //       drawingTools :this.drawingTools,
    //       infoForMouseUpEventCallback:  {
    //   tempCanvasWidth : this.tempCanvas.width,
    //       tempCanvasHeight : this.tempCanvas.height,
    //     tempCanvas : this.tempCanvas,
    //     mainCanvas : this.mainCanvas,
    //     mainCanvasCtx: this.mainCanvasCtx,
    //     tempCanvasCtx : this.tempCanvasCtx,
    //     otherDrawersUndoHistory : this.otherDrawersUndoHistory,
    //     coordinatesCaptureArray : this.coordinatesCaptureArray
    //           }
    //     }
    //     );
  },
}
</script>

<style scoped>
canvas{
  background-color: transparent;
  position: absolute;
  top: 0;
  left: 0;
  cursor: crosshair;
  border-radius: 1rem;
}
canvas:nth-child(2){
  background-color: transparent;
}
textarea{
  position: absolute;
  border: .2rem solid #bbb;
  outline: 0;
  display: none;
  /*font-family: "Courier New", "monospace";*/
  font-size: 14px;
  overflow: hidden;
  resize: none;
  white-space: nowrap;
}
.board{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.1rem;
}

.board__drawing-area{
  background-image: url('/img/img.jpg');
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 1rem;
  border: .1rem solid #1a73e8;

}
.board__tools-area{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  z-index: -1;
  width: 13%;
  height: 80%;
  display: flex;
  background-color: #efefef;
  border: .1rem solid black;
  border-left: none;
  flex-direction: column;
  justify-content: space-between;
  transition: transform .2s ease-in;
}
.board__tools-area--visible{
  transform: translate(100%, -50%);
}
.board__properties{
  /*margin-top: 3rem;*/
  width: 100%;
}
.board__properties--drawing{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.board__properties--drawing > input{
  width: 50%;
}
.board__properties--drawing > input:nth-child(2){
  width: 100%;
}
.temp-writing-container{
  display: none;
}
</style>