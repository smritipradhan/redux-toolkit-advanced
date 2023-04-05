# ADVANCED REDUX TOOLKIT

Author : Smriti Pradhan <br/>
Credits : Maximilian Schwarzmüller

---

### Topics that will get covered

1. Handling Asynchronous Task with Redux
2. Using useEffect with Redux and the Problem with useEffect
3. Handling HTTP States and Feedbacks with Redux
4. Using an Action Creator Thunk , Fetching Data
5. Exploring Redux DevTools

---

<img width="1432" alt="Screenshot 2023-03-26 at 11 50 26 AM" src="https://user-images.githubusercontent.com/47382260/227759136-4bc39991-de7d-4c50-bf7c-af3828e7255b.png">
<img width="1435" alt="Screenshot 2023-03-26 at 11 50 35 AM" src="https://user-images.githubusercontent.com/47382260/227759140-76a38af3-e0a5-4472-9788-020621905b04.png">
---

### Side Effects , Async Task

Reducer function must be pure, side effect free and synchronous.When we dispatch some actions that would involve side effects like HTTP requests to be sent. Where should we put our code ?

There are two possible places
1.Inside the component (eg - useEffect()) So we dispatch action after sideEffect is done so Redux dont know anything about the side effect.

2. Action Creators

---

### Setting up the Project

Install react-redux with @reduxjs/toolkit
1 . npm i  
2 . npm install @reduxjs/toolkit react-redux

After the installation we will setup the store.We are going to make 2 slices. One is for cart and another is for toggling the cart card.

1 . ui-slice.js
2 . cart-slice.js

ui-slice.js

We can write mutating code here because when using Redux Toolkit,we are not really mutating the state,even though it looks like we do,but instead Redux Toolkit will kind of capture this code and use another third party library imer to ensure that this is actually translated to some immutable code which creates a new state object instead of manipulating the existing one.

---

Note - Reference - Arrays and Objects

```
let arr = [
    { name:"string 1", value:"hey", other: "that" },
    { name:"string 2", value:"hello", other: "that" }
];

let obj = arr.find(o => o.name === 'string 1');
obj.name = "Smriiti";
console.log(arr);

//{name: "Smriiti", value: "this", oth...}
//{name: "string 2", value: "this", ot...}

```

Mutation in the original object. This concept of mutation can be used in Redux Toolkit which is prohibited in Redux as Redux Toolkit use a third party library immur internally which does not mutate internally.Behind the scenes , immur handles the object.

### Cart Slice

```
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      state.totalQuantity++;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (!existingItem) {
        //If there is no existing item
        state.items.push({
          id: newItem.id,
          name: newItem.title,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.totalPrice + newItem.price;
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      state.totalQuantity--;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;
      }
    },
  },
});

export default cartSlice.reducer;
export const cartActions = cartSlice.actions;

```

Adding products and displaying it in the cart.

### UI Slice

For toggle of Cart Details .

```
import { createSlice } from "@reduxjs/toolkit";

const initialState = { cartIsVisible: false }; //Cart is visible or not visible

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggle(state) {
      state.cartIsVisible = !state.cartIsVisible;
    },
  },
});

export default uiSlice.reducer;
export const uiActions = uiSlice.actions;

```

For dispatching

```
dispatch(
      cartActions.addToCart({
        id,
        title,
        price,
      })
    );
```

### Redux and Async Code

We want to make an HTTP request to the server and then when our project reload the cart should be in the Screen. As of now whenever we are reloading the application the cart item is lost so we can store the data in the Database and whenever the application reload we can fetch it .

For our Application we will be using Firebase as backend. We can also use Node JS.

![front-endvs-backend](https://user-images.githubusercontent.com/47382260/227760753-4e532470-1aa7-4c79-bcd6-eb268db0619c.png)

Here, in our Application we are using Firebase with no logic and just storing the data.So, we need to do more work in the frontend to handle the cart. We cannnot send a HTTP request inside the reducer. We wrote code in the frontend to handle the cart Information.For example adding the product to cart when it was not there and adding when the product existed. THe same with the removing it. This can also be handled in the backend side where we could do less work in the frontend side but this is not the case here.
So, we need to handle everything in the frontend side.

There are two ways to achieve-

1. Inside the Component (eg useEffect);
2. Action Creator

When there is a choice for where to put our Code. There are Fat Reducers VS Fat Components VS Fat Actions.
Two types of code -
Side Effect Free Synchronous Code -- Prefer Reducers
Asynchronous Code with Side Effect. -- Prefer Action Creator or Components.

### Using useEffect with Redux

.Sync our new state to the server . We can first do work on the frontend that is Redux update its store and then we send a request to the server.

In App.js or Product.js
We will listen to changes of the cart using useSelector and then send HTTP request to the server.
We will send a PUT request to the server as we will replace the entire cart data.

We face one problem when using useEffect the way we currently do it: It will execute when our app starts.Why is this an issue It's a problem because this will send the initial (i.e. empty) cart to our backend and overwrite any data stored there.

### Handling HTTP states and Feedback with Redux

Here we will add a notification component which is a bar at the top with some message like sending request , or something wrong happened .The problem of whenever the App starts it will send the inital cart which is empty.

Adding Notification Component and using with Redux

App.js

```
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

```

ui-slice.js

```
import { createSlice } from "@reduxjs/toolkit";

const initialState = { cartIsVisible: false, notification: null }; //Cart is visible or not visible

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggle(state) {
      state.cartIsVisible = !state.cartIsVisible;
    },
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
  },
});

export default uiSlice.reducer;
export const uiActions = uiSlice.actions;


```

<img width="1429" alt="Screenshot 2023-04-05 at 9 10 59 AM" src="https://user-images.githubusercontent.com/47382260/229975871-102d5f34-7e2c-40db-8d77-d6d97371ef57.png">

# Action Creator Thunk (Important)
