import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './locale/i18n';
import {Routes, Route} from 'react-router-dom';
import Home from './components/Home/Home';
import ProductList from './components/Products/List/ProductList';
import Product from './components/Products/Detail/Product';
import Cart from './components/Cart/Cart';
import Payment from './components/Payment/Payment'
import User from './components/User/User';
import NavBar from './components/Nav/NavBar';
import OrderList from './components/OrderList/OrderList';
import { useStateValue } from './Reducer/StateProvider';
import AboutUs from './components/AboutUs/AboutUs';

function App() {

  const [{language}] = useStateValue();
  const [font, setFont] = useState();

  useEffect(() => {
   if(language==="en") setFont("Times New Roman");
   if(language==="la") setFont("Phetsarath OT");
  }, [language])
  
  return (
      <div style={{fontFamily:`${font} !important`}}>
        <NavBar/>
        <main>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/about" element={<AboutUs/>}/>
            <Route path="/product/discover" element={<ProductList/>}/>
            <Route path="/product/:productId" element={<Product/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/cart/payment/:total" element={<Payment/>}/>
            <Route path="/order_list" element={<OrderList/>}/>
            <Route path="/user" element={<User/>}/>
          </Routes>
        </main>
      </div>
  )
}

export default App