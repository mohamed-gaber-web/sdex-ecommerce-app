const CORS = 'https://cors-anywhere.herokuapp.com/';
export const baseUrl = 'https://ecommerce-api.sdex.online';
export const corsBaseUrl = `${CORS}https://ecommerce-api.sdex.online`;

// account
export const userRegister = `${baseUrl}/api/Account/Register`;
export const userLogin = `${baseUrl}/api/Account/Login`;
export const userChangePassword = `${baseUrl}/api/Account/changePasswod`;
export const updatedUserProfile = `${baseUrl}/api/Account/UpdateUser`

// product
export const ApiProducts = `${baseUrl}/api/Product`;
export const productDetails = `${baseUrl}/api/Product/Details`
// export const onSaleProducts = `${corsBaseUrl}/api/Product/OnSaleProduct`;
// export const latestProducts = `${corsBaseUrl}/api/Product/LatestProduct`;


// Order
export const createOrder = `${baseUrl}/api/Order/Create`;
export const listOfOrder = `${baseUrl}/api/Order/GetByUser`;
export const getOrderDetails = `${baseUrl}/api/Order/GetOrderDetails`;

// Shipping Address
export const createShippingAddress = `${baseUrl}/api/ShippingAddress/Create`;
export const getShippingByUserId = `${baseUrl}/api/ShippingAddress/GetByUserId`;
export const removeShippingAddress = `${baseUrl}/api/ShippingAddress/Delete/`;
export const updateShippingAddress = `${baseUrl}/api/ShippingAddress/Update`;

// payment
export const createPayment = `${baseUrl}/api/Payment/MakePaymentAsync`;

// brands
export const getAllBrands = `${baseUrl}/api/Brand/GetFeaturedBrands`;

// slider
export const getSlider = `${baseUrl}/api/Slider/List`;
