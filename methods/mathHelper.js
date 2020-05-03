export const changeMinutesToHoursAndMinutes = (time)=>{
    return time > 60 ? `${parseInt(time / 60)} hr ${time - (60 * parseInt(time / 60))} min` : `${time} min`
}