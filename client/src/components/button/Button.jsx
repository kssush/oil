import React from "react";
import st from "./Button.module.scss";

const Button = ({children, ...props}) => {
    return(
        <button className={st.button} {...props}>
            {children}
        </button>
    )
};

export default Button;
