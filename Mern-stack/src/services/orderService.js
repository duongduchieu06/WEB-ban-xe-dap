import axios from "axios"
import { axiosJWT } from "./userService"


export const createOrder = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_KEY}/order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}
export const getOrderByUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_KEY}/order/get-order-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        },
    }
    );
    return res.data;
};
