# ADVANCED REDUX TOOLKIT

Author : Smriti Pradhan <br/>
Credits : Maximilian Schwarzmüller

---

### Topics that will get covered

1.Handling Asynchronous Task with Redux
2.Using useEffect with Redux and the Problem with useEffect
3.Handling HTTP States and Feedbacks with Redux
4.Using an Action Creator Thunk , Fetching Data
5.Exploring Redux DevTools

---

### Side Effects , Async Task

Reducer function must be pure, side effect free and synchronous.When we dispatch some actions that would involve side effects like HTTP requests to be sent. Where should we put our code ?

There are two possible places
1.Inside the component (eg - useEffect()) So we dispatch action after sideEffect is done so Redux dont know anything about the side effect.

2. Action Creators

---
