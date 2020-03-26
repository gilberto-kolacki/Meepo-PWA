/*=========================================================================================
  File Name: state.js
  Description: Vuex Store - state
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import navbarSearchAndPinList from '@/layouts/components/navbarSearchAndPinList';
import themeConfig from '@/../themeConfig.js';
import colors from '@/../themeConfig.js';

const state = {
    isSidebarActive: true,
    breakpoint: null,
    sidebarWidth: "default",
    navbarType: "floating",
    reduceButton: themeConfig.sidebarCollapsed,
    bodyOverlay: false,
    sidebarItemsMin: false,
    theme: themeConfig.theme || 'light',
    navbarSearchAndPinList: navbarSearchAndPinList,
    AppActiveUser: JSON.parse(localStorage.getItem('userInfo')),
    isIOS: true,
    token: localStorage.getItem('token'),
    themePrimaryColor: colors.primary,
    starredPages: navbarSearchAndPinList.data.filter((page) => page.highlightAction),
    userRole: null,
    sincTotal: JSON.parse(localStorage.getItem('sincTotal')),

    // Can be used to get current window with
    // Note: Above breakpoint state is for internal use of sidebar component
    windowWidth: null,
    lastDateSinc: localStorage.getItem('last_sinc') || new Date().getTime(),
};

export default state;
