import React, {useState, useEffect} from 'react';
import './NavBar.scss';
import SideBar from './SideBar/SideBar';
import {Button, Modal, Form} from 'react-bootstrap';
import {NavLink, useNavigate} from 'react-router-dom'
import {useStateValue } from '../../Reducer/StateProvider';
import { Autocomplete, TextField } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuOpenSharpIcon from '@mui/icons-material/MenuOpenSharp';
import logoImg from '../../img/MedLogo.png';
import Selector from './Select';
import { useLocalStorage } from '../../Reducer/useLocalStorage';

function NavBar() {
  const navigate = useNavigate();
  const [items] = useLocalStorage("Items");
  const [user] = useLocalStorage("User", {});
  const [exchange, setExchange] = useLocalStorage("ExchangeRate", {});
  const [{cart, currency}, dispatch] = useStateValue();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [searchItemID, setSearchItemID] = useState('');

  useEffect(() => {
    const fetchExchangeAPI=async()=>{

      const date = new Date().toLocaleDateString('en-CA');

      if(date !== exchange.date){

        var myHeaders = new Headers();
        myHeaders.append("apikey", "sHAFPNOqSW1MuCezoLSu5YVTs9G9a19L");
        
        var requestOptions = {
          method: 'GET',
          redirect: 'follow',
          headers: myHeaders
        };
        
        fetch("https://api.apilayer.com/exchangerates_data/latest?symbols=LAK&base=USD", requestOptions)
        .then(response => response.json())
          .then(result => setExchange(result))
          .catch(error => console.log('error', error));
      }
    }

    fetchExchangeAPI();
  }, [setExchange, exchange])
 
  const handleModalClose = () => {
    setModalShow(false);
    setSearchItemID('');
  }
  
  const handleCurrencyChange = (e)=>{
    const newCurrency = e.target.value;
    const currencyLabel = newCurrency.split("_")[0];
    const currencyAbbr = newCurrency.split("_")[1];

    dispatch({
      type:"CHANGE_CURRENCY",
      label:currencyLabel,
      abbr:currencyAbbr
    })
  }

  const handleModalShow = () => setModalShow(true);

  const handleSwitch=()=> setOpenSidebar(true);

  const goToCart = () => navigate('../cart')

  const handleSearchItem=async()=> {

    if(searchItemID!==""){
      await navigate(`./product/${searchItemID}`)
      handleModalClose();
    }

  }

  return (
    <div className='nav_wrapper'>
      <section className='logo_section'>
        <img src={logoImg} alt=""/>
      </section>
      <section className='menu_section'>
        <div className='subMenu_list'>
          <div className="shop_info">
            <span className='sub_menu'><LocalPhoneIcon className='sub_menu_icon'/> Phone: (+856) 12231 222 11</span>
            <span className='sub_menu'><AccessAlarmIcon className='sub_menu_icon'/> Mon-Fri (8am - 6pm)</span>
            <span className='sub_menu'><MailOutlineIcon className='sub_menu_icon'/> adfadssasdssdsfa@gmail.com</span>
          </div>

          <Selector/>

          {/* currency box only for phone size */}
          <select className='currency_tablet_selector' value={currency.label + "_" + currency.abbr} onChange={handleCurrencyChange}>
            <option value="Dollar_USD">USD</option>
            <option value="LAOKIP_LAK">KIP</option>
          </select>
          
          <div className='cart_box' onClick={goToCart}>
            <ShoppingCartIcon className='cart_icon'/>
            <span className='cart_number'>
              {cart.reduce((count, curItem) => {
                return count + curItem.quantity;
              }, 0)}
          </span>
          </div>
           
          {/* search box only for phone size */}
          <div className='tablet_search_box' onClick={handleModalShow}>
            <SearchIcon className='tablet_search_icon'/>
          </div>

          {/* only for phone size */}
          <div className='bar_icon' onClick={handleSwitch}>
            <MenuOpenSharpIcon/>
          </div>

        </div>

        <div className='menu_list'>
          <ul>
            <NavLink className={(navData)=>navData.isActive? 'nav_link active' : 'nav_link' } to="/">
              <li>Home <AddIcon className='plus_icon'/> </li>
            </NavLink>

            <NavLink className={(navData)=>navData.isActive? 'nav_link active' : 'nav_link' } to="/product/discover">
              <li>Shop <AddIcon className='plus_icon'/></li>
            </NavLink>

            <NavLink className={(navData)=>navData.isActive? 'nav_link active' : 'nav_link' } to="/order_list">
              <li>Order List <AddIcon className='plus_icon'/></li>
            </NavLink>

            <NavLink className={(navData)=>navData.isActive? 'nav_link active' : 'nav_link' } to="/user">
              <li>User <AddIcon className='plus_icon'/></li>
            </NavLink>
          </ul>

          <div className='currency_selector'>
            <select id="" value={currency.label + "_" + currency.abbr} onChange={handleCurrencyChange}>
              <option value="Dollar_USD">USD</option>
              <option value="LAOKIP_LAK">KIP</option>
            </select>
          </div>

          <Button variant='primary mx-2 py-1 px-2 ' className='main_search_btn' onClick={handleModalShow}>
            <SearchIcon/>
          </Button>

          <div className='user_box'>
            <div className='user_name_box'>
              <PersonOutlineIcon className='user_icon'/>
              {Object.keys(user).length !== 0? user.username : "Guest"}
            </div>
            <p>{Object.keys(user).length !== 0? user.email : "Email None"}</p>
          </div>

        </div>
      </section>

      {/* sidebar only for phone size */}
      {openSidebar&&
        <SideBar click={()=>setOpenSidebar(false)}/>
      }

      {/* search Modal */}
      <Modal show={modalShow} onHide={handleModalClose}>
        <Modal.Header >
          <Form className='search_form'>
            <Form.Group>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                onChange={(e, value)=>{
                  setSearchItemID(value.id)
                }}
                options={items.map(item=>({id:item.id, label:item.title}))}
                renderInput={(params) => <TextField {...params} label="Medicines" />}
              />
            </Form.Group> 
          </Form>
          <Button onClick={handleSearchItem} className='search_form_btn mx-1 py-3'>
            <SearchIcon/>
          </Button>
        </Modal.Header>
      </Modal>
      
    </div>
  )
}

export default NavBar