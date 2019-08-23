/*=========================================================================================
  File Name: moduleAuthMutations.js
  Description: Auth Module Mutations
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default {
	UPDATE_AUTHENTICATED_USER(state, user) {
		localStorage.setItem('userInfo', JSON.stringify(user));
		localStorage.setItem('token', JSON.stringify(user.token));
		localStorage.setItem('tokenExpiry', new Date(new Date().getTime() + (15 * 24 * 60 * 60 * 1000)).getTime());
		localStorage.setItem('userRole', 'admin');
	},
}