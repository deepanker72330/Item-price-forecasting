import { Button, Card } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import alibaba from '../../common/images/ali.png';
import amazon from '../../common/images/ama.png';
import flipkart from '../../common/images/fl.png';
import bewakoof from '../../common/images/bew.png';
import snapdeal from '../../common/images/snap.jpeg';
import { WISHLIST_ENDPOINT, GET_USER_ENDPOINT, DELETE_WISHLIST_ENDPOINT } from "../../API";
import axios from "axios"
import { message } from "antd";

const { Meta } = Card;

const handlePic = (domain) => {
  if (domain === "flipkart") {
    return flipkart;
  }
  else if (domain === "amazon") {
    return amazon;
  }
  else if (domain === "alibaba") {
    return alibaba;
  }
  else if (domain === "bewakoof") {
    return bewakoof;
  }
  else if (domain === "snapdeal") {
    return snapdeal;
  }
  else {

  }
}

const deleteItemHandler = (productID) => {
  const jwtToken = localStorage.getItem('jwt');
  axios.post(GET_USER_ENDPOINT, {
    token: jwtToken
  })
    .then(res => {
      const userName = res.data[0].username;
      const data = {
        username: userName,
        pid: productID,
      }
      axios.post(DELETE_WISHLIST_ENDPOINT, data)
        .then(response => {
          message.success("Item Deleted Successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1800);
        })
        .catch(e => message.error("Delete Error"))
    })
    .catch(e => { message.error("Get user Error") })
}


export default function Item(props) {
  return (
    <div className="wish-card">
      <div style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 10fr" }}>
          <div><img src={handlePic(props.domain)} alt="amazon.in" style={{ width: "57px", height: "57px" }} /></div>
          <div><div className="productname">{props.productName.substring(0, 60)}...</div></div>
        </div>
        <Button type="primary" className="wishlist-button" style={{ width: "32%", borderLeft: "0px" }}>
          <a href={props.url} target="_blank">
            Goto Website
          </a>
        </Button>
        <Button type="primary" className="wishlist-button" style={{ width: "36%", borderLeft: "0px", borderRight: "0px" }}>
          <Link to={{
            pathname: '/predict',
            customProps: {
              pid: props.pid,
              url: props.url,
            }
          }}>
            Predict Price
          </Link>
        </Button>
        <Button
          type="primary"
          className="wishlist-button"
          style={{ width: "32%", borderRight: "0px" }}
          onClick={() => deleteItemHandler(props.pid)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
