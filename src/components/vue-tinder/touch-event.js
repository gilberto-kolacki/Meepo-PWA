import { STATUS, initStatus } from './status';

export default {
  methods: {
    /**
     * Start moving
     * @param {Object} e Touch / mouse events
     */
    start(e) {
      const state = this.state;
      if (state.touchId !== null ||
          this.status === STATUS.LEAVING ||
            this.status === STATUS.REVERT ||
              this.status === STATUS.REWINDING) {
        return;
      }
      let pageX, pageY;
      if (e.type === 'touchstart') {
        pageX = e.changedTouches[0].pageX;
        pageY = e.changedTouches[0].pageY;
        // TODO: iOS deslizando de volta para a área, não deve continuar, esta área precisa ser ajustada, se necessário, também precisa distinguir entre iOS / Android
        // if (pageX < ?) {
        //   return
        // }
      } else {
        pageX = e.clientX;
        pageY = e.clientY;
      }
      // Determinar se a posição inicial do toque está na parte superior ou inferior do cartão
      const top = this.size.top;
      const height = this.size.height;
      const centerY = top + height / 2;
      const startPoint = pageY > centerY ? -1 : 1;
      // Inicializar
      this.state = {
        status: STATUS.MOVING,
        touchId:
          e.type === 'touchstart' ? e.changedTouches[0].identifier : 'mouse',
        start: {
          x: pageX,
          y: pageY
        },
        move: Object.create(null),
        startPoint,
        result: null
      }
    },
    /**
     * Cartão móvel
     * @param {Object} e Eventos de toque / mouse
     */
    move(e) {
      e.preventDefault();
      const state = this.state;
      if (state.touchId === null ||
        this.status === STATUS.LEAVING ||
          this.status === STATUS.REVERT ||
            this.status === STATUS.REWINDING ||
              (e.type === 'touchmove' && state.touchId !== e.changedTouches[0].identifier)) {
        return;
      }
      let pageX, pageY;
      if (e.type === 'touchmove') {
        pageX = e.changedTouches[0].pageX;
        pageY = e.changedTouches[0].pageY;
      } else {
        pageX = e.clientX;
        pageY = e.clientY;
      }
      state.move = {
        x: pageX,
        y: pageY
      };
    },
    /**
     * Fim do movimento, analise o comportamento
     * @param {Object} e Eventos de toque / mouse
     */
    end(e) {
      if (e.type === 'touchstart' && this.state.touchId !== e.changedTouches[0].identifier) {
        return;
      }
      if (this.status === STATUS.LEAVING || this.status === STATUS.REVERT || this.status === STATUS.REWINDING) {
        return
      }
      if (Math.abs(this.pointerOpacity) >= 1 || this.superOpacity >= 1) {
        const result = this.superOpacity >= 1 ? 'super' : (this.pointerOpacity > 0 ? 'prev' : 'next');
        this.shiftCard(result);
      } else if (this.status === STATUS.MOVING) {
        // A operação é cancelada e a posição original é retornada.Depois de retornar à posição original, o status notificará o Tinder via TinderCard para redefinir o status para 0
        this.state = initStatus('reverted');
      }
    }
  }
}
