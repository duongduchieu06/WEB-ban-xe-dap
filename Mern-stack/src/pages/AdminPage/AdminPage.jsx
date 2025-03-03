import { Menu } from "antd";
import React, { useState } from "react";
import { UserOutlined, ProductOutlined } from "@ant-design/icons";
import HeaderCompomment from "../../compoments/HeaderCompoment/HeaderCompoment";
import AdminUser from "../../compoments/AdminCompoment/AdminUser/AdminUser";
import AdminProduct from "../../compoments/AdminCompoment/AdminProduct/AdminProduct";

const AdminPage = () => {
  const items = [
    {
      key: "product",
      icon: <ProductOutlined />,
      label: "Sản phẩm",
    },
    {
      key: "user",
      icon: <UserOutlined />,
      label: "Người dùng",
    },
  ];

  const [keySelected, setKeySelected] = useState("product");
  const handleOnClickMenu = ({ key }) => {
    setKeySelected(key);
  };
  const renderPage = (key) => {
    switch (key) {
      case "product":
        return <AdminProduct />;
      case "user":
        return <AdminUser />;
      default:
        return <></>;
    }
  };
  return (
    <>
      <HeaderCompomment isHiddenSearch isHiddenCart />
      <div style={{ display: "flex" }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            height: "100vh",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          items={items}
          onClick={handleOnClickMenu}
        />
        <div style={{ flex: 1, padding: "15px" }}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
