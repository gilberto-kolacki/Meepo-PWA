<!-- =========================================================================================
  File Name: TheNavbar.vue
  Description: Navbar component
  Component Name: TheNavbar
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
<div class="relative">
  <div class="vx-navbar-wrapper">
    <vs-navbar class="vx-navbar navbar-custom" :color="navbarColor" :class="classObj">

      <!-- SM - OPEN SIDEBAR BUTTON -->
      <feather-icon class="sm:inline-flex xl:hidden cursor-pointer mr-1" icon="MenuIcon" @click.stop="showSidebar"></feather-icon>
      <vs-spacer></vs-spacer>

      <!-- USER META -->
      <div class="the-navbar__user-meta flex items-center">
        <div class="text-right leading-tight hidden sm:block" v-if="breakpoint != 'sm'">
          <p class="font-semibold mb-1">{{ user_displayName }}</p>
          <small>Última sinc: {{lastDateSinc | formatDate }}</small>
        </div>
        <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
          <div class="con-img ml-3">
            <b-img
              :src="require(`@/assets/images/rapidsoft/${activeUserImg}`)"
              alt="user-img"
              width="40"
              height="40"
              class="rounded-full shadow-md cursor-pointer block" />
          </div>
          <vs-dropdown-menu class="vx-navbar-dropdown">
            <ul style="min-width: 9rem">
                <!-- <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="$router.push('/pages/profile')"><feather-icon icon="UserIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Profile</span></li>
                <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="$router.push('/apps/email')"><feather-icon icon="MailIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Inbox</span></li>
                <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="$router.push('/apps/todo')"><feather-icon icon="CheckSquareIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Tasks</span></li>
                <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="$router.push('/apps/chat')"><feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Chat</span></li>
                <vs-divider class="m-1"></vs-divider> -->
                <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="logoutAlert">
                    <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4"></feather-icon> <span class="ml-2">Sair</span>
                </li>
            </ul>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>
    </vs-navbar>
    </div>
</div>

</template>

<script>
import auth from "../../rapidsoft/auth/authService";
// import SincDataDB from '../../rapidsoft/db/sincDataDB';

export default {
    name: "the-navbar",
    props: {
        navbarColor: {
            type: String,
            default: "#fff",
        },
    },
    data() {
        return {
            settings: { // perfectscrollbar settings
                maxScrollbarLength: 60,
                wheelSpeed: .60,
            },
        }
    },
    watch: {
    },
    computed: {
        // HELPER
        sidebarWidth() {
            return this.$store.state.sidebarWidth;
        },
        breakpoint() {
            return this.$store.state.breakpoint;
        },
        lastDateSinc() {
            return this.$store.state.lastDateSinc;
        },

        // NAVBAR STYLE
        classObj() {
            if (this.sidebarWidth == "default") return "navbar-default";
            else if (this.sidebarWidth == "reduced") return "navbar-reduced";
            else if (this.sidebarWidth) return "navbar-full";
        },
        // PROFILE
        user_displayName() {
            return JSON.parse(localStorage.getItem('userInfo')).displayName;
        },
        activeUserImg() {
            return JSON.parse(localStorage.getItem('userInfo')).img || this.$store.state.AppActiveUser.img;
        }
    },
    methods: {
        showSidebar() {
            this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true);
        },
        logout() {
            this.$vs.loading();
            auth.logOut(() => {
                setTimeout(() => {
                    this.$vs.loading.close();
                }, 300)
            });
        },
        logoutAlert() {
            this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: 'Deseja sair da aplicação?',
                text: 'Ao sair da aplicação é necessário estar on-line para entrar novamente.',
                acceptText: 'Sair',
                cancelText: 'Cancelar',
                accept: this.logout
            });
        },
    },
    directives: {

    },
    mounted() {
        
    },
}
</script>
