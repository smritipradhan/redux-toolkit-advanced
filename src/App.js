import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const cartIsVisible = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    const sendCartData = async () => {
      if (isInitial) {
        isInitial = false;
        return;
      }

      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending Cart Data",
          message: "Sending Cart Data",
        })
      );
      const response = await fetch(
        "https://react-post-call-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("Sending Cart Data failed");
      }

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Sending Cart Data Success",
          message: "Data Sent Successfully",
        })
      );
    };

    sendCartData(cart).catch((err) => {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Sending Cart Data Failed",
          message: "Error in Sending Cart Data",
        })
      );
    });
  }, [cart, dispatch]);

  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          message={notification.message}
          title={notification.title}
        />
      )}
      <Layout>
        {cartIsVisible && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
