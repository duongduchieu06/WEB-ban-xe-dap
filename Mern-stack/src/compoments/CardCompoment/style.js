import { Card } from "antd";
import styled from "styled-components";

export const WrapperCardStyle = styled(Card)`
  width: 200px;
  & img {
    height: 200px;
    width: 200px;
  }
  position: relative;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#fff")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const StyleNameProduct = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    color: rgb(56,56, 61);
    overflow: hidden;
    text-overflow: ellipsis;  
`

export const WrapperReportText = styled.div`
    font-size: 12px;
    color: rgb(128, 128, 137);
    display: flex;
    margin: 4px 0;
    align-items: center;
`

export const WrapperPriceText = styled.div`
    font-size: 16px;
    color: rgb(238, 77, 45);
    font-weight: 400;
    margin: 8px 0;
`

export const WrapperDiscountText = styled.span`
    font-size: 12px;
    color: rgb(238, 77,  45);
    font-weight: 400;
`
export const WrapperFavouriteText = styled.span`
    background-color: rgba(238, 77, 45, 1 );
    height: 14px;
    color: #fff;
    font-size: 10px;
    padding: 0 4px;
    border-radius: 4px;
`
