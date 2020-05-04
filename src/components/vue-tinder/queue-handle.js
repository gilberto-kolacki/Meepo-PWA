import { STATUS } from './status';

const difference = (array, exclude) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (exclude.indexOf(array[i]) > -1) {
      break;
    }
    result.push(array[i]);
  }
  return result;
}

export default {
  data: () => ({
    /**
     * A chave que está sendo removida está inserida apenas no momento, sem excluir após a remoção
     */
    leavingKeys: [],
    /**
     * O número de retrocessos dessa vez, cada atualização de diferenças, será útil quando a animação for removida, usada para determinar o estado de destino do cartão após ocultar
     */
    onceRewindCount: 0
  }),
  methods: {
    /**
     * É necessário distinguir se a alteração da matriz está aumentando ou diminuindo
     * @param {Array} list
     * @param {Array} old
     */
    diff(list, old) {
      // 新增或 rewind
      const keyName = this.keyName;
      const add = difference(list, old);
      let onceRewindCount = 0;
      if (add.length) {
        for (let i = 0; i < add.length; i++) {
          const item = this.queue[i];
          if (item[keyName] && add[i] === item[keyName]) {
            onceRewindCount++
            const id = item[keyName]
            const newVueTinderkey = id + Math.random()
            if (
              this.leavingKeys.indexOf(item.$vtKey) > -1 ||
              this.leavingKeys.indexOf(id) > -1 ||
              this.rewindKeys.indexOf(item.$vtKey) > -1 ||
              this.rewindKeys.indexOf(id) > -1
            ) {
              // Ele foi removido e reapareceu.Para evitar que o dom seja reutilizado e interrompa a animação que desapareceu anteriormente, é necessário fornecer uma nova chave
              item.$vtKey = newVueTinderkey
              // Como em beforeEnter, o ID de dados é armazenado em rewindKeys,
              // O data-id aceita $vtKey como uma prioridade mais alta.Se você remover diretamente o objeto removido anteriormente rewind，
              // É muito provável que exista um atributo $ vtKey, portanto, o id do indexOf sozinho pode não ser encontrado
              // Então você também precisa encontrar $vtKey e, para o seguro, também precisa atribuir uma nova $vtKey
              const rewindIndex = Math.max(
                this.rewindKeys.indexOf(item.$vtKey),
                this.rewindKeys.indexOf(id)
              )
              if (rewindIndex > -1) {
                this.rewindKeys[rewindIndex] = newVueTinderkey
                this.state.status = STATUS.REWINDING
              }
            }
          } else {
            break
          }
        }
      }
      this.onceRewindCount = onceRewindCount

      // Remover
      const remove = difference(old, list)
      if (remove.length) {
        // Apenas um caso é considerado aqui: a remoção manual do cabeçote não é responsável e as filas de operação manual devem ser evitadas, exceto para anexar ao contrário.
        this.leavingKeys.push(this.list[0].$vtKey || this.list[0][keyName])
        for (let i = this.max + 1; i < this.max + 1 + remove.length; i++) {
          const item = this.list[i]
          if (item) {
            if (
              this.leavingKeys.indexOf(item[keyName]) > -1 ||
              // Ele está oculto, mas o próximo item precisa criar $vtKey para evitar ser oculto (conflito com a key que acabou de sair)
              this.hidingKeys.indexOf(item[keyName]) > -1
            ) {
              item.$vtKey = item[keyName] + Math.random()
            }
          }
        }
      }

      this.list = this.queue.slice(0)
    }
  }
}
