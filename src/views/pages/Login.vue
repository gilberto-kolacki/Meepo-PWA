<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div id="login">
        <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
            <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
                <vx-card>
                    <div slot="no-body" class="full-page-bg-color">
                        <div class="vx-row no-gutter justify-center items-center">
                            <div class="vx-col hidden lg:block lg:w-1/2">
                                <img src="@/assets/images/pages/login.png" alt="login" class="mx-auto">
                            </div>
                            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
                                <div class="p-8">
                                    <div class="vx-card__title mb-8">
                                        <h4 class="mb-4">Login</h4>
                                    </div>
                                    <vs-input
                                        name="email"
                                        icon="icon icon-user"
                                        icon-pack="feather"
                                        label-placeholder="Login"
                                        v-model="email"
                                        class="w-full no-icon-border"/>

                                    <vs-input
                                        type="password"
                                        name="password"
                                        icon="icon icon-lock"
                                        icon-pack="feather"
                                        label-placeholder="Password"
                                        v-model="password"
                                        class="w-full mt-6 no-icon-border" />

                                    <div class="my-5">
                                        <vs-button class="w-full" :disabled="!validateForm" @click="login()">Entrar</vs-button>
                                    </div>
                                    <div class="my-5">
                                        <vs-button class="w-full" v-if="isIos && !isInStandaloneMode" type="filled" icon-pack="feather" icon="icon-download" color="dark" @click="instalar()">Instalar</vs-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>
        <vs-popup classContent="popup-example" title="Instalar" :active.sync="popupInstall">
            <vx-card>
                <div slot="no-body">
                    <img :src="require(`@/assets/images/rapidsoft/install_IOS.png`)" alt="content-img" class="responsive card-img-top">
                </div>
                <h5 class="mb-2">Como Instalar</h5>
                <p class="text-grey">-precisone o botão "Tela de início" no menu de opções</p>
                <p class="text-grey">-Pronto!</p>
            </vx-card>
        </vs-popup>
    </div>
</template>

<script>

import UsuarioDB from '../../rapidsoft/db/usuarioDB';
import ErrorDB from '../../rapidsoft/db/errorDB';

export default {
    data() {
        return {
            email: '',
            password: '',
            checkbox_remember_me: true,
            popupInstall: false,
        }
    },
    computed: {
        validateForm() {
            return this.email != '' && this.password != '';
        },
        isIos() {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test( userAgent );
        },
        isInStandaloneMode() {
            if ('standalone' in window.navigator && window.navigator.standalone) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        login() {
            this.$vs.loading();
            const payload = {
                checkbox_remember_me: this.checkbox_remember_me,
                userDetails: {
                    email: this.email,
                    password: this.password
                },
                notify: this.$vs.notify
            }
            this.$store.dispatch('auth/loginAttempt', payload).then(() => {
                setTimeout(() => {
                    this.$vs.loading.close();
                }, 600)
            }).catch((error) => {
                console.log(error);
            });
        },
        instalar() {
            this.popupInstall=true
        }

    },
    mounted() {
        UsuarioDB.limparBase().then(() => {
            this.$store.dispatch('updateUserActive', null);
            localStorage.removeItem('carrinho');
        });
    },
    errorCaptured(err, vm, info) {
        ErrorDB._criarLog({err, vm, info});
        return true;
    }
}
</script>

<style lang="scss">
</style>
