<!-- =========================================================================================
    File Name: Main.vue
    Description: Main layout
    ----------------------------------------------------------------------------------------
    Item Name: Vuesax Admin - VueJS Dashboard Admin Template
    Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
    <div class="layout--main" :class="[navbarClasses, footerClasses, {'app-page': isAppPage}]">

        <vx-sidebar :sidebarItems="sidebarItems" :logo="require('@/assets/images/logo/logo.png')" title="Live - FV" parent=".layout--main" />

        <div id="content-area" :class="[contentAreaClass, {'show-overlay': bodyOverlay}]">

            <div id="content-overlay"></div>

            <div class="content-wrapper">

                <the-navbar :navbarColor="navbarColor" :class="[{'text-white': isNavbarDark && !isThemeDark}, {'text-base': !isNavbarDark && isThemeDark}]" />

                <div class="router-view">
                    <div class="router-content" :class="{'mt-0': navbarType == 'hidden'}">
                        <transition :name="routerTransition">
                        <div class="router-header flex flex-wrap items-center mb-6" v-if="$route.meta.breadcrumb || $route.meta.pageTitle">
                            <div class="content-area__heading" :class="{'pr-4 border-0 md:border-r border-t-0 border-b-0 border-l-0 border-solid border-grey-light' : $route.meta.breadcrumb}">
                                <h2 class="mb-1">{{ routeTitle }}</h2>
                            </div>

                            <!-- BREADCRUMB -->
                            <vx-breadcrumb class="ml-4 md:block hidden" v-if="$route.meta.breadcrumb" />

                            <!-- DROPDOWN -->
                            <vs-dropdown class="ml-auto md:block hidden cursor-pointer" vs-trigger-click>
                                <vs-button radius icon="icon-settings" icon-pack="feather"></vs-button>

                                <vs-dropdown-menu class="w-32">

                                    <vs-dropdown-item>
                                      <div @click="$router.push('/pages/profile')" class="flex items-center">
                                        <feather-icon icon="UserIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                                        <span>Profile</span>
                                      </div>
                                    </vs-dropdown-item>

                                    <vs-dropdown-item>
                                      <div @click="$router.push('/apps/todo')" class="flex items-center">
                                        <feather-icon icon="CheckSquareIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                                        <span>Tasks</span>
                                      </div>
                                    </vs-dropdown-item>

                                    <vs-dropdown-item>
                                      <div @click="$router.push('/apps/email')" class="flex items-center">
                                        <feather-icon icon="MailIcon" class="inline-block mr-2" svgClasses="w-4 h-4" />
                                        <span>Inbox</span>
                                      </div>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </div>
                        </transition>
                        <div class="content-area__content">
                            <back-to-top bottom="5%" visibleoffset="500" v-if="!hideScrollToTop" @scrolled="backToTop()">
                                <vs-button icon-pack="feather" icon="icon-arrow-up" class="shadow-lg" />
                            </back-to-top>
                            <transition :name="routerTransition" mode="out-in">
                                <router-view @changeRouteTitle="changeRouteTitle" @setAppClasses="(classesStr) => $emit('setAppClasses', classesStr)" />
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
            <the-footer></the-footer>
        </div>
    </div>
</template>

<script>
import VxSidebar from '@/layouts/components/vx-sidebar/VxSidebar.vue';
import TheNavbar from '../components/TheNavbar.vue';
import TheFooter from '../components/TheFooter.vue';
import themeConfig from '@/../themeConfig.js';
import sidebarItems from "@/layouts/components/vx-sidebar/sidebarItems.js";
import BackToTop from 'vue-backtotop';

export default {
    data() {
        return {
            navbarType: this.$route.meta.navBar ? (themeConfig.navbarType || 'floating') : 'hidden',
            navbarColor: themeConfig.navbarColor || '#fff',
            footerType: themeConfig.footerType || 'static',
            routerTransition: themeConfig.routerTransition || 'none',
            isNavbarDark: false,
            routeTitle: this.$route.meta.pageTitle,
            sidebarItems: sidebarItems,
            disableCustomizer: themeConfig.disableCustomizer,
            windowWidth: window.innerWidth, //width of windows
            hideScrollToTop: themeConfig.hideScrollToTop,
            disableThemeTour: themeConfig.disableThemeTour
        }
    },
    watch: {
        '$route'() {
            this.routeTitle = this.$route.meta.pageTitle;
        },
        '$route.meta.navBar'(mostrar) {
            this.navbarType = mostrar ? themeConfig.navbarType || 'floating' : 'hidden';
        },
        isThemeDark(val) {
            if(this.navbarColor == "#fff" && val) {
                this.updateNavbarColor("#10163a")
            }else {
                this.updateNavbarColor("#fff")
            }
        },
    },
    computed: {
        isAppPage() {
            if(this.$route.path.includes('/apps/')) return true
            else return false
        },
        isThemeDark() { return this.$store.state.theme == 'dark' },
        sidebarWidth() {
            return this.$store.state.sidebarWidth;
        },
        bodyOverlay() {
            return this.$store.state.bodyOverlay;
        },
        contentAreaClass() {
            if(this.sidebarWidth == "default") return "content-area-default"
            else if(this.sidebarWidth == "reduced") return "content-area-reduced"
            else if(this.sidebarWidth) return "content-area-full"
        },
        navbarClasses() {
            return {
                'navbar-hidden': this.navbarType == 'hidden',
                'navbar-sticky': this.navbarType == 'sticky',
                'navbar-static': this.navbarType == 'static',
                'navbar-floating': this.navbarType == 'floating',
            }
        },
        footerClasses() {
            return {
                'footer-hidden': this.footerType == 'hidden',
                'footer-sticky': this.footerType == 'sticky',
                'footer-static': this.footerType == 'static',
            }
        },
    },
    methods: {
        changeRouteTitle(title) {
            this.routeTitle = title;
        },
        updateNavbarColor(val) {
            this.navbarColor = val;
            if(val == "#fff") this.isNavbarDark = false
            else this.isNavbarDark = true
        },
        handleWindowResize(event) {
            this.windowWidth = event.currentTarget.innerWidth;
            this.setSidebarWidth();
        },
        setSidebarWidth() {
            if (this.windowWidth < 1200) {
                this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', false)
                this.$store.dispatch('updateSidebarWidth', 'no-sidebar')
                this.disableThemeTour = true;
            }
            else if(this.windowWidth < 1200) {
                this.$store.dispatch('updateSidebarWidth', 'reduced')
            }
            else {
                this.$store.commit('TOGGLE_IS_SIDEBAR_ACTIVE', true)
            }
        },
        toggleHideScrollToTop(val) {
            this.hideScrollToTop = val;
        },
        setIsPlatForm() {
            this.$store.dispatch('updatePlatform', /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()));
        },
        backToTop() {
            window.scrollTo(0, 0);
        },
    },
    components: {
        VxSidebar,
        TheNavbar,
        TheFooter,
        BackToTop
    },
    created() {
        this.setIsPlatForm();
        this.setSidebarWidth();
        if(this.navbarColor == "#fff" && this.isThemeDark) {
            this.updateNavbarColor("#10163a")
        } else {
            this.updateNavbarColor(this.navbarColor)
        }
    },
    mounted() {
        // document.addEventListener('gesturestart', (e) => e.preventDefault());
        document.addEventListener('touchmove', (event) => {
            event = event.originalEvent || event;
            if(event.scale > 1) {
                event.preventDefault();
            }
        }, false);
    },
}
</script>

<style lang="scss">

html, body {
    -webkit-user-select: none;
    -moz-user-select: -moz-none;
    -ms-user-select: none;
    /* -webkit-overflow-scrolling: touch;  */
    user-select: none;
    /* overflow: auto; */
    background-color: #fff;
}

.modal-xl {
    max-width: 1024px;
    width: 97% !important; 
    margin: 0.3rem 0.0rem 0.3rem 0.0rem;
    z-index: 200000 !important;
    left: 12px;
}

.btn-left {
    position: fixed;
    top:50%;
    left: 262px;    
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
    z-index: 1000;
    height: 6vh !important;
}


.btn-right {
    position: fixed;
    top:50%;
    right: 0;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
    z-index: 1000;
    // z-index: 300001;
    height: 6vh !important;
}

.btn-confirm {
    position: fixed;
    top: 50%;
    right: -50px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 1000;
    width: 10rem;
    transform: rotate(-90deg);
    margin-right: -5px;
}

.btn-cancel {
    position: fixed;
    top: 50%;
    left: 217px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    z-index: 1000;
    width: 10rem;
    transform: rotate(90deg);
    margin-left: -5px;
}

.btn-carrinho {
    position: fixed;
    bottom: 5%;
    right: 8vw;
    z-index: 1000;
    width: 60px !important;
    height: 60px !important;
    border-radius: 50%;
    
    .vs-icon{        
        color: inherit;
        text-align: center;
        font-size: 30px;
    }
}

.input-line-group-rapid {
    input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
}

.btn-line-group-rapid {
    margin-top: 26px;
    height: 38px !important;
    width: 15% !important;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.input-group-rapid {
    margin-top: 26px;
    height: 38px !important;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}

.rapid-input-date {
    font-size: 1rem !important;
    padding: .4rem !important;
}

.vs-input--input.normal {
    font-size: 0.75rem;
}

.vs-input--input:disabled {
    opacity: 1;
}

.th-acoes {
    width: 10%;
}

.padding-zero {
    .con-content--item {
        padding: 0px !important;
    }
}

.on-scroll::-webkit-scrollbar-track
{
	background-color: #fff;
}

.on-scroll::-webkit-scrollbar
{
	width: 4px;
    height: 10px;
	background-color: #fff;
}

.on-scroll::-webkit-scrollbar-thumb
{
	background-color: #fff;    
}

@media only screen and (max-width: 1200px) {

    .btn-left {
        left: 0;    
    }

    .btn-cancel {
        left: -50px;
    }
}

</style>
