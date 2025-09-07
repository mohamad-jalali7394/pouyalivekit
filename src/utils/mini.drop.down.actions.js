import eventBus from "./event.bus";

class MiniDropDownHandler
{
    constructor(miniDropDown, toggleParameter) {
         this.miniDropDown = miniDropDown;
        this.boundMouseDownCallback = this.mouseDownCallback.bind(this, miniDropDown);
        this.boundOpenDropDown = this.openDropDown.bind(this, toggleParameter);
        this.boundCloseDropDown = this.closeDropDown.bind(this, miniDropDown, toggleParameter);
        if(this.miniDropDown){
            this.miniDropDown.addEventListener('mousedown', this.boundMouseDownCallback);
        }
        eventBus.on('close-drop-down', this.boundCloseDropDown);
    }
    mouseDownCallback(miniDropDown){
        miniDropDown.addEventListener('mouseup', this.boundOpenDropDown);
    }
    openDropDown(toggleParameter){
        toggleParameter.flag = true;
    }
    closeDropDown(miniDropDown, toggleParameter){
        toggleParameter.flag = false;
        miniDropDown?.removeEventListener('mouseup', this.boundOpenDropDown);
        miniDropDown?.addEventListener('mousedown', this.boundMouseDownCallback);
    }
}

export default MiniDropDownHandler;