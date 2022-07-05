import {React,useState,useEffect} from "react";
import './App.css';
import Auth from "./pages/AuthPage/auth";
import LinkHeader from "./component/header/header";
import {Route,Routes} from "react-router-dom";
import Add from "./pages/Add/Add";
import Home from "./pages/HomePage/home";
import Users from "./pages/users/users"
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import AllMusic from "./pages/allMusicsPage/AllMusic";
import MusicPage from "./pages/musicPage/musicPage";

function App() {
  return (
      <>
          <LinkHeader>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/auth" element={<Auth/>}/>
              <Route path="/add" element={<Add/>}/>
              <Route path="/music" element={<AllMusic/>}/>
              <Route path="/users" element={<Users/>}/>
                <Route path="/music/:id" element={<MusicPage/>}/>
            </Routes>
        </LinkHeader>
          <ToastContainer/>
      </>

  );
}

export default App;
