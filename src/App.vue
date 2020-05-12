<!-- =========================================================================================
	File Name: App.vue
	Description: Main vue file - APP
	----------------------------------------------------------------------------------------
	Item Name: Vuesax Admin - VueJS Dashboard Admin Template
	Author: Pixinvent
	Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
	<div id="app" :class="vueAppClasses">
		<router-view @setAppClasses="setAppClasses"/>
	</div>
</template>

<script>
import themeConfig from '@/../themeConfig.js'

export default {
  data () {
    return {
      vueAppClasses: []
    }
  },
  watch: {
    '$store.state.theme'(val) {
      this.toggleClassInBody(val);
    }
  },
  async created() {
    try {
      await this.$auth.renewTokens();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    toggleClassInBody(className) {
      if (className == 'dark') {
        if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark');
        document.body.classList.add('theme-dark');
      } else if (className == 'semi-dark') {
        if (document.body.className.match('theme-dark')) document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-semi-dark');
      } else {
        if (document.body.className.match('theme-dark')) document.body.classList.remove('theme-dark');
        if (document.body.className.match('theme-semi-dark')) document.body.classList.remove('theme-semi-dark');
      }
    },
    setAppClasses (classesStr) {
      this.vueAppClasses.push(classesStr)
    },
    handleWindowResize(event) {
      this.$store.dispatch('updateWindowWidth', event.currentTarget.innerWidth);
    },
  },
  mounted() {
    this.toggleClassInBody(themeConfig.theme)
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleWindowResize);
    });
    this.$store.dispatch('updateWindowWidth', window.innerWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize);
  },
}

</script>
