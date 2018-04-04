<template>
  <div class="good">
    <!-- ref -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <!-- 渲染左侧菜单列表 ooods数组内容通过请求数据获得，currentIndex是一个计算属性； 根据不同的index，添加类；点击实现对应的栏目实现滚动，$event是vue.js中内联语句的用法 -->
        <li v-for="(item, index) in goods" class="menu-item border-1px" :class="{'current':currentIndex === index}" @click="selectMenu(index, $event)">
          <span class="text">
            <!-- 根据返回的数据的item.type决定是否显示小图片 -->
            <span v-show="item.type>0" class=" icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <!-- 双重循环渲染 -->
            <li v-for="food in item.foods" class="food-item" @click="selectFood(food, $event)">
              <div class="icon">
                <!-- 图片 -->
                <img :src="food.icon" alt="" width="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span><span class="count">好评{{food.rating}}</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartControl-wrapper">
                  <!-- 点击按钮实现数量的增加减少 -->
                  <cartControl :food="food" @increment="incrementTotal"></cartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div>
      <shopCart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
                :min-price="seller.minPrice" ref="shopCart"></shopCart>
                <!-- 计算属性中的selectedFood -->
      <food :food="selectedFood" ref="food"></food>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopCart from '../shopcart/shopCart.vue';
  import cartControl from '../cartControl/cartControl.vue';
  import food from '../food/food.vue';
  import data from 'common/json/data.json';
  //  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        scrolly: 0,
        selectedFood: {}
      };
    },
    created() {
//      this.$http.get('/api/goods').then((response) => {
//        response = response.body;
//        if (response.errno === ERR_OK) {
//         this.goods = response.data;
//       this.$nextTick(() => {
//        this._initScroll();
//        this._calculateHeight();
//       });
//        }
//      });
      this.goods = data.goods;
      this.$nextTick(() => {
        // 生命周期钩子，实例插入完成后，就调用下面两个方法
        this._initScroll();
        this._calculateHeight();
      });
      // classMap的数值
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    mounted() {
//      this.$nextTick(() => {
//       this._initScroll();
//      });
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          // 没有滚动右边栏目时，scrolly的值是0，根据右侧菜单进行滚动，同时将左边对应栏目显示高亮
          if (!height2 || (this.scrolly >= height && this.scrolly < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        // good是一个数组对象，good参数相当于每个数组中每个对象元素，在good中又有foods数组对象，food相当于foods数组对象元素中每个对象元素
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    methods: {
      _initScroll() {
        // $refs一个对象，持有已注册过 ref 的所有子组件。menuWrapper是侧边菜单栏
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        // foodWrapper右侧对应的栏目
        this.foodScroll = new BScroll(this.$refs.foodWrapper, {
          // 作用：有时候我们需要知道滚动的位置。当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。如果没有设置该值，其默认值为 0，即不派发 scroll 事件
          probeType: 3,
          // better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true
          click: true
        });
        // 给右侧菜单添加滚动事件
        // 这是better-scroll插件的，监听当前实例上的自定义事件。如：scroll, scrollEnd, pullingUp, pullingDown
        // {String} type 事件名
        // {Function} fn 回调函数
        // {context} 函数执行的上下文环境，默认是 this
        this.foodScroll.on('scroll', (pos) => {
          // pos.y获取滚动的纵坐标
          this.scrolly = Math.abs(Math.round(pos.y));
        });
      },
      // 计算高度  获取每个li距离顶部得高度
      _calculateHeight() {
        //
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          // 原生js获取clientHeight
          height += item.clientHeight;
          this.listHeight.push(height);
          // console.log("height"+height)
        }
      },
      selectMenu(index, event) {
        // better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true
        if (!event._constructed) {
          // 去掉自带click事件的点击
          return;
        }
        //
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        // 调用better-scroll方法
        // scrollToElement(el, time, offsetX, offsetY, easing)
        this.foodScroll.scrollToElement(el, 300);
      },
      selectFood(food, event) {
        // better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true
        if (!event._constructed) {
          // _constructed这是better-scroll中的属性，去掉自带click事件的点击
          return;
        }
        this.selectedFood = food;
        // ？？？？.show()是什么用法？？？
        this.$refs.food.show();
      },
      incrementTotal(target) {
        this.$refs.shopCart.drop(target);
      }
    },
    components: {
      shopCart,
      cartControl,
      food
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "goods.styl";
</style>
