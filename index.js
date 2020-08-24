//对象收编变量
let bird = {
  skyPosition: 0,
  skyStep: 2,
  birdTop: 235,
  birdX: 0,
  startColor: 'blue',
  flag: false,
  birdStepY: 0,
  minTop: 0,
  maxTop: 570,
  timer: null,
  pipe: 7,
  pipeList: [],
  pipeLastIndex: 6,
  scoreNumber: 0,
  scoreList: [],
  initData() {
    this.el = document.getElementsByClassName('game')[0]
    this.bird = this.el.getElementsByClassName('bird')[0]
    this.start = this.el.getElementsByClassName('start')[0]
    this.score = this.el.getElementsByClassName('score')[0]
    this.mask = this.el.getElementsByClassName('mask')[0]
    this.desc = this.el.getElementsByClassName('desc')[0]
    this.result = this.el.getElementsByClassName('desc_score')[0]
    this.ul = this.el.getElementsByClassName('rank-list')[0]
    this.reStart = this.el.getElementsByClassName('desc_restart')[0]
    this.scoreList = this.getScore()
    console.log(this.el,this.bird,this.start)
  },
  init() {
    bird.initData()
    bird.animiate()
    this.handleStart()
    this.handleClick()
    this.haneleReStartGame()
    if (sessionStorage.getItem('play')) {
      this.start1()
    }
  },
  animiate() {
    let count = 0
   this.timer = setInterval(() => {
      this.skyMove()    
      if (this.flag) {
        this.birdDrop()
        this.pipeMove()
      }
      count ++
      if (count % 10 === 0) {
        if (!this.flag) {
          this.startBound()
          this.birdJump()
        }
       
        this.birdFly(count)
      }
    }, 30);
  },
  skyMove() {
    let that = this//保存this 如果不用箭头函数的话
   // setInterval(() => {
      //找元素 拿x 
      this.skyPosition -= this.skyStep
      this.el.style.backgroundPositionX = this.skyPosition + 'px' 
   // } , 30);
  },
  birdJump() {
    this.birdTop = this.birdTop === 220 ? 260 :220
    this.bird.style.top = this.birdTop + 'px'
  },
  birdFly(count) {
    //this.birdX -= count
    this.bird.style.backgroundPositionX = count % 3 * -30 + 'px'
  },
  //游戏开始之后消失之后的元素的事件需要停止
  startBound() {
    let pre  = this.startColor
    this.startColor = this.startColor === 'blue' ? 'white' : 'blue'
    //console.log(this.start.classList)
    this.start.classList.remove('start-'+ pre)
    //console.log(this.start.classList.remove('start-blue'))
    this.start.classList.add('start-'+ this.startColor)
  },
  //游戏开始
  handleStart() {
    let that = this //事件的this=绑定的元素
    this.start.onclick = this.start1.bind(this)
  },
  start1() {
    let that = this
    that.flag = true
    that.start.style.display = 'none'
    that.score.style.display = 'block'
    that.bird.style.left = 80 + 'px'
    that.bird.style.transition = 'none'
    that.skyStep = 5
    for (let i = 0; i < that.pipe; i++) {
      that.createPipe(300*(i+1))
      
    }
  },
  createPipe(x) {
     let upHeight = 50 + parseInt(Math.random() * 175)
     let downHight = 450 - upHeight
    // let divUp = document.createElement('div')
    // divUp.classList.add('pipe')
    // divUp.classList.add('pipe_up')
    // //console.log(div)
    // //上下距离相等 150
    // //上柱子 50 - 225
    // divUp.style.left = x + 'px'
    // divUp.style.height = upHeight + 'px'
    // this.el.appendChild(divUp)

    // let divDown = document.createElement('div')
    // divDown.classList.add('pipe')
    // divDown.classList.add('pipe_down')
    // divDown.style.left = x + 'px'
    // divDown.style.height = downHight + 'px'
    // this.el.appendChild(divDown)
    // this.createEle('div')
    let divUp = createEle('div',['pipe','pipe_up'],{
      height: upHeight + 'px',
      left: x + 'px'
    })
    let divdown = createEle('div',['pipe','pipe_down'],{
      height: downHight + 'px',
      left: x + 'px'
    })
    this.el.appendChild(divUp)
    this.el.appendChild(divdown)
    this.pipeList.push({
      up: divUp,
      down: divdown,
      y: [upHeight,upHeight + 150 - 30]
    })
  },
  pipeMove() {
    for (let i = 0; i < this.pipe; i++) {
      let updiv = this.pipeList[i].up
      let downdiv = this.pipeList[i].down
      let step = updiv.offsetLeft - this.skyStep
      if (step < -52) {
        let pipeLeft = this.pipeList[this.pipeLastIndex].up.offsetLeft
        updiv.style.left = pipeLeft + 300 + 'px'
        downdiv.style.left = pipeLeft + 300 + 'px'
        this.pipeLastIndex = i
        continue
      }
      updiv.style.left = step + 'px'
      downdiv.style.left = step + 'px'
    }
  },
  birdDrop() {
    this.birdTop += ++this.birdStepY
    this.bird.style.top = this.birdTop + 'px'
    //碰撞检测  边界值和撞到柱子
    this.judgeKnock()
    this.addScore()
  },
  addScore() {
    let pipe = this.scoreNumber % this.pipeList.length
    let pipeX =  this.pipeList[pipe].up.offsetLeft
    if (pipeX < 13) {
      
      this.score.innerText = ++this.scoreNumber
    }
  },
  judgeKnock() {
    //边界
    this.judgeBoundary() 
    //撞到柱子
    this.judgePipe()
  },
  judgeBoundary() {
    if (this.birdTop <= this.minTop || this.birdTop >= this.maxTop) {
      this.gameOver()
    }
  },
  judgePipe() {
    let index = this.scoreNumber % this.pipeList.length
   // console.log(typeof this.scoreNumber,this.pipeList,index,this.pipeList.length,0%7)
    let pipeX = this.pipeList[index].up.offsetLeft
    let pipeY = this.pipeList[index].y
    console.log(pipeY,this.birdTop)
    let birdY = this.birdTop
     //水平范围13-95
      if ((pipeX >= 13 && pipeX <= 95) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
       this.gameOver()
     }  
  },
  //父元素绑定点击事件
  handleClick() {
    let that = this
    this.el.addEventListener('click', function (e) {
      let dom = e.target
      let classs = dom.classList.contains('start')
       //console.log(dom,dom.classList,classs)
      //e.target.stopPropagation() //阻止冒泡
      if (!classs) {
        that.birdStepY = -10
      }
    })
  },
  gameOver() {
    console.log('over')
    clearInterval(this.timer)
    this.saveScore()
    this.mask.style.display = 'block'
    this.desc.style.display = 'block'
    this.bird.style.display = 'none'
    this.score.style.display = 'none'
    this.result.innerText = this.scoreNumber
    this.renderList()
  },
  saveScore() {
    this.scoreList.push({
      score: this.scoreNumber,
      time: this.getTime()
    })
    this.scoreList.sort(function (a, b) {
      return b.score - a.score
    })
    this.scoreList = this.scoreList.splice(0,8)
    setLocal('score',this.scoreList)
  },

  getTime() {
    let time = new Date()
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();
    month = month >= 10 ? month : '0' + month 
    day = day >= 10 ? day : '0' + day 
    hour = hour >= 10 ? hour : '0' + hour 
    minute = minute >= 10 ? minute : '0' + minute 
    second = second >= 10 ? second : '0' + second  

    return `${year}.${month}.${day} ${hour}:${minute}:${second}`;

  },
  getScore() {
    let value = getLocal('score')
     return value ? value : []
  },
  //渲染排行榜
  renderList() {
    let template = ''
    for (let i = 0; i < this.scoreList.length; i++) {
      let degreeClass = ''
      switch (i) {
        case 0: 
          degreeClass = 'first'
          break;
        case 1: 
          degreeClass = 'second'
          break;
        case 2: 
          degreeClass = 'third'
        break;
        default:
          break;
      }
      template += `
        <li class="list_item">
          <span class="item_degree ${degreeClass}">${i + 1}</span>
          <span class="item_score">${this.scoreList[i].score}</span>
          <span class="item_time">${this.scoreList[i].time}</span>
        </li>
      `;
      
      
    }
    this.ul.innerHTML = template
  },
  haneleReStartGame() {
    this.reStart.addEventListener('click', function (params) {
      sessionStorage.setItem('play', true) //第一次点击开始 然后重新开始的时候直接开始游戏 不显示开始游戏这个步骤
      window.location.reload()
    })
  }
  
}
bird.init()



