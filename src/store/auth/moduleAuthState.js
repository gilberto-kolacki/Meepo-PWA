/*=========================================================================================
  File Name: moduleAuthState.js
  Description: Auth Module State
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import auth from "../../rapidsoft/auth/authService";

export default {
    isUserLoggedIn: () => {
        return (localStorage.getItem('userInfo') && auth.isAuthenticated());
    },
}