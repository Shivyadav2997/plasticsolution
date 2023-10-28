import { useDispatch } from "react-redux";
import { login } from "features/User/UserSlice";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { autoLoginCheck } from "api/api";

const AutoLogin = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loginCheck = async () => {
    const loginResponse = await autoLoginCheck();
    if (loginResponse.sucess) {
      dispatch(login(loginResponse));
      history.push("/admin/dashboard");
    } else {
      history.push("/auth/login");
    }
  };
  useEffect(() => {
    loginCheck();
  }, []);
};

export default AutoLogin;
