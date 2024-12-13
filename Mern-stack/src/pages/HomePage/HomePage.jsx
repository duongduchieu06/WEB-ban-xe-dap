import React, { useEffect, useRef, useState } from "react";
import TypeProduct from "../../compoments/TypeProduct/TypeProduct";
import { WrapperTypeProduct } from "./style";
import SliderCompoment from "../../compoments/SliderCompoment/SliderCompoment";
import slider1 from "../../assets/images/slider1.jpg";
import slider2 from "../../assets/images/slider2.jpg";
import slider3 from "../../assets/images/slider3.jpg";
import slider4 from "../../assets/images/slider4.jpg";
import CardCompoment from "../../compoments/CardCompoment/CardCompoment";
import { Button } from "antd";
import FooterCompoment from "../../compoments/FooterCompoment/FooterCompoment";
import { useQuery } from "@tanstack/react-query";
import * as productService from "../../services/productService";
import { useSelector } from "react-redux";
import Loading from "../../compoments/LoadingCompoment/Loading";
import { useDebounce } from "../../hook/useDebounce";

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const refSearch = useRef();
  const [pending, setPending] = useState(false);
  const searchDebounce = useDebounce(searchProduct, 1000);
  const [stateProduct, setStateProduct] = useState([]);
  const [limit, setLimit] = useState(6);
  const arr = ["Xe Địa Hình", "Xe Thể Thao", "Xe Trẻ Em", "Xe cho người cao tuổi", "Xe đạp điện"];

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1];
    const search = context?.queryKey && context?.queryKey[2];
    const res = await productService.getAllProduct(search, limit);
    return res;
  };

  const {
    isPending,
    data: product,
    isPreviousData,
  } = useQuery({
    queryKey: ["product", limit, searchDebounce],
    queryFn: fetchProductAll,
    retry: 3,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  return (
    <>
      <div style={{ padding: "0 120px" }}>
        <WrapperTypeProduct>
          {arr.map((item, index) => {
            return <TypeProduct name={item} key={index} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div
        id="container"
        style={{
          backgroundColor: "#efefef",
          padding: "0 120px",
          height: "auto",
        }}
      >
        <SliderCompoment arrImages={[slider1, slider2, slider3, slider4]} />
        <Loading isPending={isPending || pending}>
          <div
            style={{
              marginTop: "32px",
              display: "flex",
              gap: "28px",
              flexWrap: "wrap",
            }}
          >
            {product?.data?.map((productItem) => {
              return (
                <CardCompoment
                  key={productItem._id}
                  countInStock={productItem.countInStock}
                  description={productItem.description}
                  image={productItem.image}
                  discount={productItem.discount}
                  name={productItem.name}
                  price={productItem.price}
                  rating={productItem.rating}
                  type={productItem.type}
                  id={productItem._id}
                />
              );
            })}
          </div>
          <div
            style={{ display: "grid", placeItems: "center", margin: "32px" }}
          >
            <Button
              type="primary"
              style={{
                margin: "32px",
                padding: "10px 20px",
                fontSize: "16px",
              }}
              onClick={() => setLimit((prev) => prev + 6)}
              disabled={
                product?.total === product?.data?.length ||
                product?.totalPage === 1
              }
            >
              Xem thêm
            </Button>
          </div>
        </Loading>
      </div>
      {/* <FooterCompoment /> */}
    </>
  );
};

export default HomePage;
