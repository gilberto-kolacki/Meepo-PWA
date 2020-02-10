/*=========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import router from '@/router'
import SincDataDB from '../../rapidsoft/db/sincDataDB'
import UsuarioDB from '../../rapidsoft/db/usuarioDB'
import usuarioService from '../../rapidsoft/service/usuarioService'

const verificaDataBase = () => {
    return new Promise((resolve) => {
        SincDataDB.jaTeveSincronizacao().then((simNao) => {
            if (simNao) {
                resolve({name: 'home'});
            } else {
                resolve({name: 'sincronizacao'});
            }
        });
    });
};

export default {

    loginAttempt({ dispatch }, payload) {
        return new Promise((resolve) => {
            dispatch('login', payload).then(() => {
                resolve(payload);
            });
        });
    },

    login({ commit, state }, payload) {
        return new Promise((resolve) => {
            // If user is already logged in notify and exit
            if (state.isUserLoggedIn()) {
                router.push('/');
                payload.notify({
                    title: 'Atenção',
                    text: 'Você já está logado!',
                    fixed: true,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                });
            } else {
                // Try to sigin
                usuarioService.signInWithUser(payload.userDetails.email, payload.userDetails.password).then((result) => {
                    if (payload.checkbox_remember_me) {
                        UsuarioDB.signIn(result.data).then((result) => {
                            verificaDataBase().then((endereco) => {
                                commit('UPDATE_AUTHENTICATED_USER', result);
                                router.push(endereco);
                                resolve();
                            });
                        });
                    } else {
                        verificaDataBase().then((endereco) => {
                            commit('UPDATE_AUTHENTICATED_USER', result.data);
                            router.push(endereco);
                            resolve();
                        });
                    }
                }, (err) => {
                    if (err.response === undefined) {
                        console.log(err.message);
                        payload.notify({
                            time: 2500,
                            title: 'Erro!',
                            text: err.message,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        });
                    } else if(err.response.status >= 400 ) {
                        payload.notify({
                            time: 2500,
                            title: 'Erro!',
                            text: err.response.data.mensagem,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        });
                    } else {
                        payload.notify({
                            time: 2500,
                            title: 'Error',
                            text: err.message,
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                            color: 'danger'
                        });
                    }
                    resolve();
                });
            }
        });
    },

    updateAuthenticatedUser({ commit }, payload) {
        commit('UPDATE_AUTHENTICATED_USER', payload);
    }
};
