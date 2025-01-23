import { permissions } from "../utils/roles";

const useAuth = () => {
    const user = {name:"Rahul",role:"admin"} // from redux
    return user; // Return true if user exists
};

export const isAuthorized = (role:string, path:string) => {
    return permissions[role]?.includes(path);
};

export default useAuth;