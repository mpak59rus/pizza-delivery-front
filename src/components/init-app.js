import React, {useContext} from "react";
import {UserContext} from "../redux/context";
import {AuthService} from "../services/auth-service";
import {UserService} from "../services/user-service";
import {PizzaPromise} from "../helpers/promise";

export const InitApp = () => {
    return <UpdateUser/>
};

const UpdateUser = () => {
    const [user, setUser] = useContext(UserContext);

    if (AuthService.getToken() !== null && Object.keys(user).length === 0) {
        const callback = (data) => {
            if (data) {
                setUser(data);
            } else {
                UserService.logout(AuthService.getToken());
            }
        };

        UserService.getUserBytToken(AuthService.getToken(), new PizzaPromise(callback));
    }

    return null;
};
