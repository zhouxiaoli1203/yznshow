class Luck {
  constructor() {
    this.index = 0; //当前转动到哪个位置，起点位置
    this.count = 10; //总共有多少个位置
    this.timer = 0; //setTimeout的ID
    this.speed = 20; //初始转动速度
    this.times = 0; //转动次数
    this.cycle = 50; //转动基本次数：即至少需要转动多少次再进入抽奖环节
    this.prize = -1; //中奖位置
    this.code = ''; //中奖奖品code
  }
  init(count, index) {
    if (count > 0) {
      this.count = count;
      this.index = index
    }
  }
  roll() {
    let index = this.index;
    let count = this.count;
    index += 1;
    if (index > count - 1) {
      index = 0;
    }

    this.index = index;
    return index;
  }
}

export default new Luck();
