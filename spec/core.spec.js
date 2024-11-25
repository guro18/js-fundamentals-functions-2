const {
  bakingTime,
  remainingBakeTime,
  calculatePreparationTime,
  totalTimeSpent
} = require('../src/core.js')

describe('bakingTime', () => {
  it('should return 50', () => {
    expect(bakingTime()).toEqual(50)
  })
})

describe('remainingBakeTime', () => {
  it('should calculate the remaining bake time', () => {
    expect(remainingBakeTime(20)).toEqual(30)
    expect(remainingBakeTime(10)).toEqual(40)
    expect(remainingBakeTime(50)).toEqual(0)
  })
})

describe('calculatePreparationTime', () => {
  it('should return 6 for 2', () => {
    expect(calculatePreparationTime(2)).toEqual(6)
  })

  it('should return 9 for 3', () => {
    expect(calculatePreparationTime(3)).toEqual(9)
  })

  it('should return 3 for 1', () => {
    expect(calculatePreparationTime(1)).toEqual(3)
  })

  it('should return 0 for 0', () => {
    expect(calculatePreparationTime(0)).toEqual(0)
  })
})

describe('totalTimeSpent', () => {
  it('should return 26 for 2 and 20', () => {
    expect(totalTimeSpent(2, 20)).toEqual(26)
  })

  it('should return 49 for 3 and 40', () => {
    expect(totalTimeSpent(3, 40)).toEqual(49)
  })

  it('should return 15 for 0 and 15', () => {
    expect(totalTimeSpent(0, 15)).toEqual(15)
  })

  it('should return 0 for 0 and 0', () => {
    expect(totalTimeSpent(0, 0)).toEqual(0)
  })
})
