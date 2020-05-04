import { STATUS } from './status';

export default {
  data: () => ({
    rewindKeys: []
  }),
  methods: {
    /**
     * Clique no botão para fazer uma seleção
     * @param {String} type like: like, nope: não gosto, super: super like
     */
    decide(type) {
      if (this.state.touchId || this.status !== STATUS.NORMAL) return;
      this.state.start = { x: 0, y: 0 };
      this.state.move = {
        x: type === 'super' ? 0 : type === 'next' ? 1 : -1,
        y: type === 'super' ? -1 : 0
      }
      this.state.startPoint = 1;
      this.shiftCard(type);
    },
    /**
     * Restaurar uma lista
     * @param {Array} list
     */
    rewind(list) {
      const keyName = this.keyName;
      // TODO: De fato, você pode colocar o ID em outro local.No momento, o principal motivo para fazer isso é configurar o local de origem para retroceder posteriormente.
      for (const item of list) {
        this.rewindKeys.push(item[keyName] + ''); // Evite a identificação do tipo numérico que causa incompatibilidade no julgamento subsequente
      }
      this.queue.unshift(...list);
    },
    /***************** Os métodos a seguir não são abertos ao público, use a função acima para operação em fila *****************/
    /**
     * Remover cartão
     * @param {String} type Método de remoção, como: like, nope: dislike, super: super like
     */
    shiftCard(type) {
      this.state.status = STATUS.LEAVING;
      this.state.result = type;
      const item = this.queue.shift();
      this.$emit('update:queue', this.queue);
      this.submitDecide(type, item);
    },
    /**
     * Enviar seleção
     * @param {Boolean} type Digite, like: like, nope: don't like, super: super like
     * @param {String}  key  A chave do cartão atual
     * @param {Object}  item Objeto de cartão
     */
    submitDecide(type, item) {
      this.$emit('submit', { type, key: item[this.keyName], item });
    }
  }
}
