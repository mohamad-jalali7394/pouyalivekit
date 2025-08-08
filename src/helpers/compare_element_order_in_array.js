export default (purposeEl, targetEl, wholeArray, propertyFlag = null) => {
    let purposeElIdx;
    let targetElIdx;
    if(typeof purposeEl !== 'object' && typeof targetEl !== 'object'){
        purposeElIdx = wholeArray.findIndex(el => el === purposeEl);
        targetElIdx = wholeArray.findIndex(el => el === targetEl);
        if(!purposeEl || !targetEl || purposeElIdx === targetElIdx) return;
    } else {
        purposeElIdx = wholeArray.findIndex(el => el[propertyFlag.toString()] === purposeEl.toString());
        targetElIdx = wholeArray.findIndex(el => el[propertyFlag.toString()] === targetEl.toString());
        if(!purposeEl[propertyFlag.toString()] || !targetEl[propertyFlag.toString()] || purposeElIdx === targetElIdx) return;
    }
    return (purposeElIdx > targetElIdx)?
        {
            result: 'greater', difference: Math.abs(purposeElIdx - targetElIdx)
        } :
        {
           result : 'smaller', difference: Math.abs(purposeElIdx - targetElIdx)
        };

}