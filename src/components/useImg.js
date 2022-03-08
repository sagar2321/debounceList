import React, {useEffect, useState} from "react";
import img from "../components/assets/staticImg.jpg";
function UseImg(){
       
    
    return(
        <div className="img_main">
            <img className="static_img" src={img} ></img>

        </div>
    )
}

export default UseImg;