import React from "react";
import NavbarCompoment from "../../compoments/NavbarCompoment/NavbarCompoment";
import CardCompoment from "../../compoments/CardCompoment/CardCompoment";
import { Col, Pagination, Row } from "antd";
import { WrapperProducts } from "../../compoments/TypeProduct/style";
import FooterCompoment from "../../compoments/FooterCompoment/FooterCompoment";

const TypeProductPage = () => {
  const handlePageNav = () => {};
  return (
    <>
      <Row
        style={{
          padding: "20px 120px",
          backgroundColor: "#efefef",
          flexWrap: "nowrap",
        }}
      >
        <Col
          span={4}
          style={{
            backgroundColor: "#fff ",
            marginRight: "12px",
            padding: "12px",
            borderRadius: "4px",
          }}
        >
          <NavbarCompoment />
        </Col>
        <WrapperProducts span={20}>
          <CardCompoment />
          <CardCompoment />
          <CardCompoment />
          <CardCompoment />
          <CardCompoment />
          <CardCompoment />
          <CardCompoment />
        </WrapperProducts>
      </Row>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          margin: "20px 0",
        }}
      >
        <Pagination defaultCurrent={1} total={50} onChange={handlePageNav} />
      </div>
      <FooterCompoment />
    </>
  );
};

export default TypeProductPage;
