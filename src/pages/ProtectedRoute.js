import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const history = useHistory();
  const { user } = useSelector((store) => store.user);
  if (!user) {
    return history.push("/auth/login");
  }
  return children;
};

export default ProtectedRoute;
