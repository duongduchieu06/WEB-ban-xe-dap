import React from 'react';
import * as orderService from "../../services/orderService";
import { useQuery } from '@tanstack/react-query';
import Loading from '../../compoments/LoadingCompoment/Loading';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent from "../../compoments/ButtonComponent/ButtonComponent";
import { WrapperContainer, WrapperFooterItem, WrapperHeaderItem, WrapperItemOrder, WrapperListOrder, WrapperStatus } from './style';
import { convertPrice } from "../../utils";

const MyOrderPage = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();

    const fetchMyOrder = async () => {
        const res = await orderService.getOrderByUserId(state?.id, state?.token);
        return res.data;
    };

    const queryOrder = useQuery({
        queryKey: ["orders"],
        queryFn: fetchMyOrder,
        enabled: Boolean(state?.id && state?.token),
    });

    const { isPending, data } = queryOrder;
    console.log("data: ", data)

    // const handleDetailsOrder = (id) => {
    //     navigate(`/details-order/${id}`, {
    //         state: {
    //             token: state?.token,
    //         },
    //     });
    // };

    const renderProduct = (orderItems) => {
        return orderItems?.map((item) => {
            return (
                <WrapperHeaderItem key={item?._id}>
                    <img
                        src={item?.image}
                        style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            border: "1px solid rgb(238, 238, 238)",
                            padding: "2px",
                        }}
                    />
                    <div
                        style={{
                            width: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginLeft: "10px",
                        }}
                    >
                        {item?.name}
                    </div>
                    <span
                        style={{ fontSize: "13px", color: "#242424", marginLeft: "auto" }}
                    >
                        {convertPrice(item?.price)}
                    </span>
                </WrapperHeaderItem>
            );
        });
    };

    return (
        <Loading isPending={isPending}>
            <WrapperContainer>
                <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
                    <h4>Đơn hàng của tôi</h4>
                    <WrapperListOrder>
                        {data?.map((order) => {
                            console.log("data", data)
                            return (
                                <WrapperItemOrder key={order?._id}>
                                    <WrapperStatus>
                                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                                            Trạng thái
                                        </span>
                                        <div>
                                            <span style={{ color: "rgb(255, 66, 78)" }}>
                                                Giao hàng:
                                            </span>
                                            {`${order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"}`}
                                        </div>
                                        <div>
                                            <span style={{ color: "rgb(255, 66, 78)" }}>
                                                Thanh toán:
                                            </span>
                                            {`${order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}`}
                                        </div>
                                    </WrapperStatus>
                                    {renderProduct(order?.orderItems)}
                                    <WrapperFooterItem>
                                        <div>
                                            <span style={{ color: "rgb(255, 66, 78)" }}>
                                                Tổng tiền:
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: "13px",
                                                    color: "rgb(56, 56, 61)",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {convertPrice(order?.totalPrice)}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <ButtonComponent
                                                // onClick={() => handleCanceOrder(order)}
                                                size={40}
                                                styleButton={{
                                                    height: "36px",
                                                    border: "1px solid rgb(11, 116, 229)",
                                                    borderRadius: "4px",
                                                }}
                                                textbutton={"Hủy đơn hàng"}
                                                styletextbutton={{
                                                    color: "rgb(11, 116, 229)",
                                                    fontSize: "14px",
                                                }}
                                            ></ButtonComponent>
                                            <ButtonComponent
                                                // onClick={() => handleDetailsOrder(order?._id)}
                                                size={40}
                                                styleButton={{
                                                    height: "36px",
                                                    border: "1px solid rgb(11, 116, 229)",
                                                    borderRadius: "4px",
                                                }}
                                                textbutton={"Xem chi tiết"}
                                                styletextbutton={{
                                                    color: "rgb(11, 116, 229)",
                                                    fontSize: "14px",
                                                }}
                                            ></ButtonComponent>
                                        </div>
                                    </WrapperFooterItem>
                                </WrapperItemOrder>
                            );
                        })}
                    </WrapperListOrder>
                </div>
            </WrapperContainer>
        </Loading>
    );
}

export default MyOrderPage;