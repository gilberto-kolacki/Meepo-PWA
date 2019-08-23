/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import router from '@/router'
import usuarioDB from '../../rapidsoft/db/usuarioDB'
import usuarioService from '../../rapidsoft/service/usuarioService'

export default {

    loginAttempt({ dispatch }, payload) {
        return new Promise((resolve) => {
            dispatch('login', payload)
            resolve(payload)
        })
    },

    login({ commit, state }, payload) {

        // If user is already logged in notify and exit
        if (state.isUserLoggedIn()) {
            payload.notify({
                title: 'Login Attempt',
                text: 'Você já está logado!',
                fixed: true,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'warning'
            });
            return false
        }

        // Try to sigin
        usuarioService.signInWithUser(payload.userDetails.email, payload.userDetails.password).then((result) => {
            if (payload.checkbox_remember_me) {
                usuarioDB.signIn(result.data).then((result) => {
                    router.push('/');
                    commit('UPDATE_AUTHENTICATED_USER', result)
                })
            } else {
                router.push('/');
                commit('UPDATE_AUTHENTICATED_USER', result.data)
            }
        }, (err) => {
            payload.notify({
                time: 2500,
                title: 'Error',
                text: err.message,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
            });
        })
    },

    updateAuthenticatedUser({ commit }, payload) {
        commit('UPDATE_AUTHENTICATED_USER', payload)
    }
}
