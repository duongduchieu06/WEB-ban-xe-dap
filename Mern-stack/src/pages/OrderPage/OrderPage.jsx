import React, { useEffect, useMemo, useState } from "react";
import { WrapperCountOrder, WrapperInfo, WrapperInputNumber, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDelivery, WrapperTotal } from "./style";
import { Checkbox, Form } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ButtonComponent from "../../compoments/ButtonComponent/ButtonComponent";
import ModalComponent from "../../compoments/ModalComponent/ModalComponent";
import Loading from '../../compoments/LoadingCompoment/Loading';
import InputComponentProduct from "../../compoments/InputCompoment/InputComponentProduct";
import { useDispatch, useSelector } from "react-redux";
import * as message from "../../compoments/Message/Message";
import { convertPrice } from "../../utils";
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import * as userService from "../../services/userService";
import { useMutationHooks } from "../../hook/useMutationHook";
import StepComponent from "../../compoments/StepComponent/StepComponent";



const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const { messageApi, contextHolder } = message.useCustomMessage();
  const dispatch = useDispatch()
  const [listChecked, setListChecked] = useState([]);
  const navigate = useNavigate()
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = []
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      });
      setListChecked(newListChecked)
    } else {
      setListChecked([])
    }
  }
  const handleRemoveAllOrder = () => {
    if (listChecked.length > 1) {
      dispatch(removeAllOrderProduct({ listChecked }))
    }
  }
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter((item) => item !== e.target.value);
      setListChecked(newListChecked)
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  }
  const handleChangeCount = (type, idProduct) => {
    if (type === 'increase') {
      dispatch(increaseAmount({ idProduct }))
    }
    else {
      dispatch(decreaseAmount({ idProduct }))
    }
  }
  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }))
  }
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  }
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = userService.updateUser(id, { ...rests }, token);
    return res;
  });

  const { isPending, data } = mutationUpdate;
  const handleAddCard = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm", messageApi);
    } else if (!user.name || !user.phone || !user.address || !user.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  }
  const handleUpdateInfoUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(userService({ name, address, city, phone }));
          },
          onSettled: () => {
            setIsOpenModalUpdateInfo(false);
            // navigate("/payment");
            window.location.reload();
          }

        }
      );
    }
  }
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  }
  const handleCancelUpdate = () => {
    setIsOpenModalUpdateInfo(false);
  };
  const [form] = Form.useForm();

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        ...stateUserDetails,
        name: user?.name,
        phone: user?.phone,
        city: user?.city,
        address: user?.address,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount));
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;
      return total + (priceMemo * (totalDiscount * cur.amount)) / 100;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 2000000 && priceMemo < 5000000) {
      return 10000;
    } else if (priceMemo >= 5000000) {
      return 0;
    } else if (order?.orderItemsSelected?.length === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

  const itemsDelivery = [
    {
      title: "20.000 đ",
      description: "Dưới 2.000.000 đ",
    },
    {
      title: "10.000 đ",
      description: "Từ 2.000.000 đến 5.000.000 đ",
      subTitle: "Left 00:00:08",
    },
    {
      title: "0 đ",
      description: "Trên 5.000.000 đ",
    },
  ];

  return (
    <>
      {contextHolder}
      <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h3>Giỏ hàng</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WrapperLeft>
              <WrapperStyleHeaderDelivery>
                <StepComponent
                  items={itemsDelivery}
                  current={
                    diliveryPriceMemo === 10000
                      ? 2
                      : diliveryPriceMemo === 20000
                        ? 1
                        : order.orderItemsSelected.length === 0
                          ? 0
                          : 3
                  }
                />
              </WrapperStyleHeaderDelivery>
              <WrapperStyleHeader>
                <span style={{ display: "inline-block", width: "390px" }}>
                  <Checkbox
                    onChange={handleOnchangeCheckAll}
                    checked={listChecked.length === order?.orderItems?.length}
                  ></Checkbox>
                  <span style={{ fontSize: '18px' }}> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                </span>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: '18px' }}>Đơn giá</span>
                  <span style={{ fontSize: '18px' }}>Số lượng</span>
                  <span style={{ fontSize: '18px' }}>Thành tiền</span>
                  <DeleteOutlined
                    style={{ cursor: "pointer", fontSize: "14px", fontWeight: "500" }}
                    onClick={handleRemoveAllOrder}
                  />
                </div>
              </WrapperStyleHeader>
              <WrapperListOrder>
                {order?.orderItems?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.product}>
                      <div
                        style={{
                          width: "390px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Checkbox
                          onChange={onChange}
                          value={order?.product}
                          checked={listChecked.includes(order?.product)}
                        ></Checkbox>
                        <img
                          src={order?.image}
                          style={{
                            width: "77px",
                            height: "79px",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            width: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order?.name}
                        </div>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            {convertPrice(order?.price)}
                          </span>
                        </span>
                        <WrapperCountOrder>
                          <button
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleChangeCount(
                                "decrease",
                                order?.product,
                                order?.amount === 1
                              )
                            }
                          >
                            <MinusOutlined
                              style={{ color: "#000", fontSize: "14px", padding: "0 4px" }}
                            />
                          </button>
                          <WrapperInputNumber
                            defaultValue={order?.amount}
                            value={order?.amount}
                            size="small"
                            min={1}
                            max={order?.countInStock}
                          />
                          <button
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleChangeCount(
                                "increase",
                                order?.product,
                                order?.amount === 1
                              )
                            }
                          >
                            <PlusOutlined
                              style={{ color: "#000", fontSize: "14px", padding: "0 4px" }}
                            />
                          </button>
                        </WrapperCountOrder>
                        <span
                          style={{
                            color: "rgb(255, 66, 78)",
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          {convertPrice(order?.price * order?.amount)}
                        </span>
                        <DeleteOutlined
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteOrder(order?.product)}
                        />
                      </div>
                    </WrapperItemOrder>
                  );
                })}
              </WrapperListOrder>
            </WrapperLeft>
            <WrapperRight>
              <div style={{ width: "100%" }}>
                <WrapperInfo>
                  <div>
                    <span style={{ color: "blue" }}>Địa chỉ giao hàng: </span>
                    <span
                      style={{ fontWeight: "bold" }}
                    >{`${user?.address} - ${user.city}`}</span>
                  </div>
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={handleChangeAddress}
                  >
                    Thay đổi địa chỉ
                  </span>
                </WrapperInfo>
                <WrapperInfo>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>Tạm tính</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(priceMemo)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>Giảm giá</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(priceDiscountMemo)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>Phí giao hàng</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(diliveryPriceMemo)}
                    </span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span style={{ fontSize: '18px' }}>Tổng tiền</span>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        color: "rgb(254, 56, 52)",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(totalPriceMemo)}
                    </span>
                    <span style={{ color: "#000", fontSize: "11px" }}>
                      (Đã bao gồm VAT nếu có)
                    </span>
                  </span>
                </WrapperTotal>
              </div>
              <ButtonComponent
                onClick={() => handleAddCard()}
                size={40}
                styleButton={{
                  background: "rgb(255, 57, 69)",
                  height: "48px",
                  width: "320px",
                  border: "none",
                  borderRadius: "4px",
                }}
                textbutton={"Mua hàng"}
                styletextbutton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
            </WrapperRight>
          </div>
        </div>
        <ModalComponent
          title="Cập nhật thông tin giao hàng"
          open={isOpenModalUpdateInfo}
          onCancel={handleCancelUpdate}
          onOk={handleUpdateInfoUser}
        >
          <Loading isPending={isPending}>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <InputComponentProduct
                  value={stateUserDetails["name"]}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please input your city!" }]}
              >
                <InputComponentProduct
                  value={stateUserDetails["city"]}
                  onChange={handleOnchangeDetails}
                  name="city"
                />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: "Please input your  phone!" }]}
              >
                <InputComponentProduct
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please input your  address!" },
                ]}
              >
                <InputComponentProduct
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  name="address"
                />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </div>
    </>)
};

export default OrderPage;
