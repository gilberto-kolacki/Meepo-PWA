<template>
  <transition-group
    class="vue-tinder"
    tag="div"
    :css="false"
    @beforeEnter="beforeEnter"
    @leave="leave"
    @touchstart.native="start"
    @touchmove.native="move"
    @touchend.native="end"
    @touchcancel.native="end"
    @mousedown.native="start"
    @mousemove.native="move"
    @mouseup.native="end"
  >
    <template v-for="(item, index) in list">
      <TinderCard
        v-if="index < max + 1"
        :ready="index === max"
        :key="item.$vtKey || item[keyName]"
        :data-id="item.$vtKey || item[keyName]"
        :index="index"
        :state="state"
        :ratio="ratio"
        :tinder-mounted="tinderMounted"
        :scale-step="scaleStep"
        :offset-y="offsetY"
        :offset-unit="offsetUnit"
        @reverted="resetStatus"
      >
        <slot :data="item" :index="index" :status="status"></slot>
      </TinderCard>
    </template>
  </transition-group>
</template>

<script>
import TinderCard from './TinderCard.vue';
import queueHandle from './queue-handle';
import touchEvent from './touch-event';
import transitionEvent from './transition-event';
import openMethods from './open-methods';
import { initStatus } from './status';

let resizeTimer

export default {
  name: 'Tinder',
  mixins: [queueHandle, touchEvent, transitionEvent, openMethods],
  components: {
    TinderCard
  },
  props: {
    // TODO: Considere adicionar uma configuração que não force a renderização
    allowSuper: {
      type: Boolean,
      default: true
    },
    queue: {
      type: Array,
      default: () => []
    },
    keyName: {
      type: String,
      default: 'key'
    },
    /**
     * Ao mover horizontalmente até desaparecer, a proporção da distância móvel para a "meia largura" do cartão
     * Como é uma proporção de metade da largura do cartão, o padrão 0,5 é equivalente a 1/4 (0,5 * 0,5) de largura do cartão
     */
    pointerThreshold: {
      type: Number,
      default: 0.5
    },
    /**
     * Ao subir até desaparecer, a relação entre a distância móvel e a altura do cartão
     * O movimento padrão de 1/2 de altura atenderá às condições de remoção
     */
    superThreshold: {
      type: Number,
      default: 0.5
    },
    // Você precisa esperar o cartão desaparecer completamente para a próxima operação? O padrão é operação assíncrona
    sync: {
      type: Boolean,
      default: false
    },
    // Número máximo de renderizações
    max: {
      type: Number,
      default: 3
    },
    scaleStep: {
      type: Number,
      // default: 30
      default: 0.05
    },
    offsetY: {
      type: Number,
      default: 0
    },
    offsetUnit: {
      type: String,
      default: 'px'
    }
  },
  data: () => ({
    size: {
      top: 0,
      width: 0,
      height: 0
    },
    state: initStatus(), // O estado do toque e das coordenadas móveis
    list: [], //A lista real usada para comparar com a nova lista e manipular exclusivamente o novo item da lista para evitar a reutilização do dom
    tinderMounted: false
  }),
  computed: {
    status() {
      return this.state.status
    },
    // A proporção da distância percorrida no eixo x pela metade da largura do cartão
    ratio() {
      if (this.size.width) {
        const { start, move } = this.state
        const x = move.x - start.x || 0
        const ratio = x / (this.size.width * 0.5)
        return ratio
      }
      return 0
    },
    // Opacidade dos ícones de gostar / não gostar no cartão
    pointerOpacity() {
      return this.ratio / this.pointerThreshold
    },
    superOpacity() {
      if (!this.allowSuper) return 0;
      const disY = this.state.move.y - this.state.start.y;
      const ratio = disY / (-this.superThreshold * this.size.height);
      const pointerOpacity = Math.abs(this.pointerOpacity);
      return ratio > pointerOpacity ? ratio : 0;
    },
    likeOpacity() {
      //Se o cartão atual estiver deslizando para cima, você precisará ocultar gostos / desgostos
      if (this.superOpacity) return 0;
      return this.pointerOpacity;
    },
    nopeOpacity() {
      return -this.likeOpacity;
    }
  },
  watch: {
    queue(val) {
      const keyName = this.keyName
      const newKeys = val.map(item => item[keyName])
      const oldKeys = this.list.map(item => item[keyName])
      this.diff(newKeys, oldKeys)
    }
  },
  mounted() {
    // console.log("this.$el.offsetWidth", this.$el.offsetWidth);
    // console.log("this.$el.offsetHeight", this.$el.offsetHeight);
    if (!this.$el.offsetWidth || !this.$el.offsetHeight) {
      console.error('Defina a largura e a altura do vue-tinder');
      return
    }
    this.size = {
      top: this.$el.offsetTop,
      width: this.$el.offsetWidth,
      height: this.$el.offsetHeight
    }
    window.onresize = this.getSize;
    this.tinderMounted = true
  },
  created() {
    this.list = this.queue.slice(0);
  },
  destroyed() {
    window.removeEventListener('onresize', this.getSize);
  },
  methods: {
    // Obtenha o tamanho e a posição do componente para determinar o ângulo de rotação, exibir o status correspondente etc.
    getSize() {
      clearInterval(resizeTimer)
      resizeTimer = setTimeout(() => {
        this.size = {
          top: this.$el.offsetTop,
          width: this.$el.offsetWidth,
          height: this.$el.offsetHeight
        }
      }, 600)
    },
    // O cartão atual saiu
    resetStatus() {
      this.state = initStatus()
    }
  }
}
</script>

<style scoped>
.vue-tinder {
  position: relative;
  -webkit-tap-highlight-color: transparent;
}

/* style Sendo vinculado aos dados, você só pode usar !important para substituir*/
.v-move {
  transition: none !important;
}

.pointer-wrap {
  pointer-events: none;
  transition: opacity 0.2s ease;
}

/* Ao chamar a função para fazer o cartão desaparecer, o estado correspondente precisa ser exibido diretamente, sem animação de transição */
.tinder-card.nope .nope-pointer-wrap,
.tinder-card.like .like-pointer-wrap,
.tinder-card.super .super-pointer-wrap {
  opacity: 1 !important;
}

.tinder-card.nope .rewind-pointer-wrap,
.tinder-card.like .rewind-pointer-wrap,
.tinder-card.super .rewind-pointer-wrap {
  display: none;
}
</style>
