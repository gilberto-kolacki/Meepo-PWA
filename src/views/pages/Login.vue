<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
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
                                    label-placeholder="Email"
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
                                    <vs-button class="w-full" :disabled="!validateForm" @click="login">Login</vs-button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            email: 'demo@demo.com',
            password: 'demodemo',
            checkbox_remember_me: false
        }
    },
    computed: {
        validateForm() {
            return this.email != '' && this.password != '';
        },
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
            });
        },
    }
}
</script>

<style lang="scss">
    #page-login {
        .social-login {
            .bg-facebook {
            background-color: #1551b1;
            }
            .bg-twitter {
            background-color: #00aaff;
            }
            .bg-google {
            background-color: #4285F4;
            }
            .bg-github {
            background-color: #333;
            }
        }
    }
</style>
