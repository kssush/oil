import Input from "../../components/Input/Input";
import Button from "../../components/button/Button";

const Auth = () => {
    return(
        <div>
            <p>Login</p>
            <Input label={'Login'}/>
            <Input label={'Password'}/>
            <Button label={'Login'}/>
        </div>
    )
};

export default Auth;
