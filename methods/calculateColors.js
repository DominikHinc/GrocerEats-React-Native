import Colors from "../constants/Colors";


export const calculateServingsColor = (numberOfServings) =>{
    return numberOfServings <= 4 ? Colors.green : numberOfServings <= 8 ? Colors.yellow : Colors.blue;
}
export const calculateTimeColor = (time) =>{
    return time <= 45 ? Colors.green : time <= 75 ? Colors.yellow : Colors.red;
}
export const calculateHearthColor = (likes) =>{
    return likes < 1000 ? Colors.green : likes < 10000 ? Colors.yellow : Colors.red
}
export const calculateStarColor = (rating) =>{
    return rating <= 30 ? Colors.red : rating <= 70 ? Colors.yellow : Colors.green
}