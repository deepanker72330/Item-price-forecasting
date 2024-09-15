import React, { useEffect, useState } from "react";
import Item from "../Item/Item";
import Loader from '../Loader/loader';
import axios from 'axios';
import { message } from 'antd';
import { GET_USER_ENDPOINT, WISHLIST_ENDPOINT } from '../../API';
import emptyCart from '../../common/images/EmptyCartBlack.png';

export default function Whislist(props) {

  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]); // wishlist is an array of object, where each object is a product in the user's wishlist

  useEffect(() => {
    const jwtToken = localStorage.getItem('jwt');
    axios.post(GET_USER_ENDPOINT, {
      token: jwtToken,
    })
      .then(response => {
        const username = response.data[0].username;
        axios.get(`${WISHLIST_ENDPOINT}?username=${username}`)
          .then(res => {
            setWishlist(res.data.map((item) => {
              return { ...item };
            }));
            setLoading(false);
          })
          .catch(err => {
            message.error("Error Occured in getting the wishlist, please reload the page");
          })
      })
      .catch(error => {
        message.error("Error Occured in getting the wishlist, please reload the page");
      })
  }, []);

  const emptyWishlist = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Your Wishlist is Empty !</h1>
      <div>
        <img src={emptyCart} style={{ height: '200px', width: '300px' }} />
      </div>
    </div>
  );

  return (
    !loading ?
      <div className="wishlist-grid-container">
        {wishlist.length === 0 ? emptyWishlist : wishlist.map((wishItem) => {
          return (
            <div className="wishlist-grid-item" key={wishItem.pid}>
              <Item
                {...wishItem}
              />
            </div>
          )
        })}
      </div> :
      <div style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', height: '80vh' }}>
        <Loader />
      </div>
  );
}
