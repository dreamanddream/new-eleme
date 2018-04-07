<template>
  <div>
    <div class="shopCart">
      <!-- 点击出现选中的购物车列表 -->
      <div class="content" @click="toggleList($event)">
        <div class="content-left">
          <div class="logo-wrapper">
            <!-- 购物车数量及图标 -->
            <div class="logo" :class="{'highlight': totalCount > 0}">
              <!-- 在class中可以使用判断，如果total>0为true，那么就添加hightlight类 -->
              <i class="iconfont icon-gouwuche" :class="{'highlight': totalCount > 0}"></i>
            </div>
            <!-- 显示加入购物车的商品数量 -->
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <!-- 配送费 -->
          <div class="price" :class="{'highlight': totalPrice > 0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <!-- 结算 -->
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <!-- 点击执行对应得事件 -->
          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook">
              </div>
            </div>
          </transition>
        </div>
      </div>
      <!-- transition使用fade特性 -->
      <transition name="fade">
        <!-- 展示加入购物车得商品列表 -->
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="shopcart-food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price"><span>￥{{food.price * food.count}}</span></div>
                <div class="cartControl-wrapper">
                  <cartControl :food="food"></cartControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList()"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartControl from '../cartControl/cartControl.vue';
  import BScroll from 'better-scroll';
  export default {
    // 父组件传递
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [{price: 20, count: 2}];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
      // 获取总价格
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      // 获取选中的商品总数
      totalCount() {
        let count = 0;
        // 通过父组件传递过来foods数组，循环遍历得到数组下每个对象的count
        // 通过累加获得总数量，也就是所有商品而不是选中商品
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      // 去结算的内容各种情况显示
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      // 对类也使用计算属性
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      // 加入到购物车的内容
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            // 选中的商品列表内容滚动
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      // 购物车内容是否显示
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      // 设置count为0
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
          // console.log(this.selectFoods);
        });
      },
      // 隐藏蒙版
      hideList() {
        this.fold = false;
      },
      // 点击结算按钮
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert('支付' + this.totalPrice + '元');
      },
      // 关于这个ball不太明白是什么？？？
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            // console.log(ball.el);
            this.dropBalls.push(ball);
            // console.log(this.dropBalls);
            return;
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el) {
//          let rf = el.offestHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    },
    components: {
      cartControl
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "shopCart.styl";
</style>
