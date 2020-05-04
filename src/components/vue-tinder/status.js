export const initStatus = revert => ({
  status: revert ? 3 : 0,
  touchId: null,
  start: {},
  move: {},
  startPoint: 1, // O dedo cai na metade superior do cartão (1), na metade inferior (-1)
  result: null
})

export const STATUS = {
  NORMAL: 0,
  MOVING: 1,
  LEAVING: 2,
  REVERT: 3,
  REWINDING: 4
}
