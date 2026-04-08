import React from "react";
import st from "./Input.module.scss";

const Input = ({label, ...props}) => {
    return(
        <div className={st.bi}>
            <label htmlFor={props.id}>{label}</label>
            <input id={props.id} {...props}/>
        </div>  
    )
};

export default Input;
