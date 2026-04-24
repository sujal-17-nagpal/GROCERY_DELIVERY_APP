import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
// console.log(import.meta.env.VITE_BACKEND_URL)

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate()
    const [user,setUser] = useState(null)
    const [isSeller,setIsSeller] = useState(false)
    const [showUserLogin,setShowUserLogin] = useState(false)
    const [products,setProducts] = useState([])

    const [cartItems,setCartItems] = useState({})
    const [searchQuery,setSearchQuery] = useState("")

    // FETCH SELLER STATUS
    const fetchSeller = async()=>{
        try{
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true)
            } else {
                setIsSeller(false)
            }
        } catch(err){
            setIsSeller(false)
        }
    }


    // Fetch user Auth Status , User Data and cart items
    const fetchUser = async()=>{
        try{
            // console.log("chala1")

            const data = await axios.get('/api/user/is-auth',{})

            // console.log(data)
            // console.log(data.data.user)
            // console.log(data.status)
            if (data.data.status === 200) {
                // console.log('yup');
                setUser(data.data.user);
                // console.log(user)
                
                setCartItems(data.data.user.cartItems);
                // console.log(cartItems)
              }
              
        } catch(err){
            setUser(null)
        }
    }

    // FETCH ALL PRODUCTS
    const fetchProducts = async()=>{
        try{
            const {data} = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }
        } catch(error){
            toast.error(error.message)
        }
    }

    //ADD PRODUCT TO  CART
    const addTocart = (itemId)=>{
        let cartData = structuredClone(cartItems);

        if(cartData[itemId]){
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1; 
        }

        setCartItems(cartData);
        toast.success("Added to Cart")
    }

    //UPADTE CART ITEMS QUANTITY
    const updateCartItems = (itemId,quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData)
        toast.success("cart updated")
    }

    //REMOVE FROM CART
    const removeFromCart = (itemId) =>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -= 1;
            if(cartData[itemId] === 0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from cart")
        setCartItems(cartData)
    }

    //GET CART ITEMS COUNT 
    const getCartCount = () => {
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item];
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems){
            let itemInfo = products.find((product)=>product._id === items);
            if(cartItems[items]){
                totalAmount+= itemInfo.offerPrice * cartItems[items]
            }
        }
        return Math.floor(totalAmount * 100)/100;
     }

    useEffect(()=>{
        fetchSeller()
        fetchProducts()
        fetchUser()
    },[])

    // UPDATE DATABASE CART ITEMS
    useEffect(() => {
        const updateCart = async () => {
          try {
            const { data } = await axios.post('/api/cart/update', {
              userId: user._id,
              cartItems
            });
      
            if (!data.success) {
              toast.error(data.message);
            } 
          } catch (error) {
            toast.error(error.message);
          }
        };
      
        if (user) {
          updateCart();
        }
      }, [cartItems]);
      

    const value = {navigate,user,setUser,isSeller,setIsSeller,showUserLogin,setShowUserLogin,products,currency,addTocart,updateCartItems,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartCount,getCartAmount,axios,fetchProducts,setCartItems}
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext)
}