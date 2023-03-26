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
![front-endvs-backend](https://user-images.githubusercontent.com/47382260/227760753-4e532470-1aa7-4c79-bcd6-eb268db0619c.png)

