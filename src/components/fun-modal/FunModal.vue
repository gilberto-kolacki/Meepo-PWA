<template>
    <transition name="fun-modal">
        <div 
            class="vs-component con-vs-popup modal-mask" 
            v-show="active" 
            :class="[{'fullscreen':fullscreen}]"
            @click="close($event, true)">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <h3 v-if="title">{{title}}</h3>
                        <slot v-else name="header"></slot>
                        <vs-icon
                            v-if="!buttonCloseHidden"
                            ref="btnclose"
                            :icon-pack="iconPack"
                            :icon="iconClose"
                            class="vs-popup--close vs-popup--close--icon"
                            @click="close"
                        />
                    </div>
                    <div class="modal-body">
                        <slot name="body">default body</slot>
                    </div>
                    <div class="modal-footer" v-if="!footerHidden">
                        <slot name="footer"/>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'fun-modal',
    props: {
        active: {
            default:false,
            type: Boolean
        },
        title: {
            type: String,
            required: false,
            default: null,
        },
        buttonCloseHidden:{
            default:false,
            type:Boolean
        },
        iconPack:{
            default:'material-icons',
            type:String
        },
        iconClose:{
            default:'close',
            type:String
        },
        footerHidden:{
            default:false,
            type:Boolean
        },
        fullscreen:{
            default:false,
            type:Boolean
        },
    },
    methods: {
        close(event, con){
            if(con){
                if(event.target.className && event.target.className.indexOf && event.target.className.indexOf('vs-popup--background')!=-1){
                    this.$emit('update:active',false)
                    this.$emit('close', false)
                } else if(!this.buttonCloseHidden && event.srcElement == this.$refs.btnclose.$el){
                    this.$emit('update:active',false)
                    this.$emit('close', false)
                }
            }
        },
    },
}
</script>
<style lang="css" scoped>

.modal-mask {
    position: fixed;
    z-index: 29999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.4s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.fullscreen 
.modal-container {
    width: 98%;
    height: 99%;
}

.modal-container {
    z-index: 30000;
    width: 60%;
    margin: 0px auto;
    padding: 5px 5px;
    background-color: #fff;
    border-radius: 7px;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.90);
    transition: all 0.5s ease;
    font-family: Helvetica, Arial, sans-serif;
    overflow-x: hidden;
}

.modal-header {
    margin-top: 0;
    color: #000000;
    padding: 0.6rem 0.9rem;
    padding-bottom: 3px;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    float: right;
}

.vs-popup--close {
    position: relative;
    padding: 8px;
    cursor: pointer;
    -webkit-box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
    box-shadow: 0 5px 15px 0 rgba(0,0,0,.4);
    border-radius: 5px;
    -webkit-transform: translate(8px,-8px);
    transform: translate(8px,-8px);
    background: #fff;
    font-size: 1.25em;
    color: rgba(0,0,0,.6);
}

.vs-popup--close:hover {
    -webkit-box-shadow: 0 0 0 0 rgba(0,0,0,.1);
    box-shadow: 0.5px 4px 4px 0.5px rgba(0, 0, 0, 0.89);
    -webkit-transform: translate(5px,-5px);
    transform: translate(5px,-5px);
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

@media only screen and (max-width: 1200px) {

    .modal-container {
        width: 70%;
    }
}


@media only screen and (max-width: 800px) {

    .modal-container {
        width: 85%;
        max-height: 965px;
    }
}

</style>