<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <!--seller.avatar一个图片  -->
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!-- seller.supports就是5种情况 -->
        <div v-if="seller.supports" class="support">
          <!-- 其中classMap是一个数组，通过结合seller中supports数组渲染classMap中的值 -->
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <!-- 头部5个按钮，当点击5个时弹框出来-->
      <div v-if="seller.supports" class="supports-count" @click="showDetail">
        <!-- 这里还有一个很强大的地方，seller.supports.length可以直接使用，自动会根据data.json中的seller.supports数据的长度自动渲染-->
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon iconfont icon-zuoyoujiantou"></i>
      </div>
    </div>
    <!-- 公告内容，当点击公告时也让弹框出来 -->
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon iconfont icon-zuoyoujiantou"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" alt="" class="" width="100%" height="100%">
    </div>
    <transition name="fade">
      <!-- 使用transition动画 -->
      <!-- 当点击按钮时设置detailShow的值为true，从而显示这部分内容 -->
      <!--  当点击蒙层时也消失-->
    <div v-show="detailShow" class="detail" @click="hideDetail" transition="fade">
      <div class="detail-wrapper clearFix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <!-- 使用star.vue组件 -->
            <!-- 在这里设定了size的大小，这样的话size是手写数据？？？？？-->
            <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <!-- 使用v-for动态渲染，将不同的标签输出，注意这里的灵活写法本身classMap就是一个数组classMap[seller.supports[index].type]-->
            <li class="support-item" v-for="(item, index) in seller.supports">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
        <i class="iconfont icon-cha"></i>
      </div>
    </div>
    </transition>
  </div>
</template>
<script type="text/ecmascript-6">
  import star from '../star/star.vue';
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false
      };
    },
    methods: {
      showDetail() {
        this.detailShow = true;
      },
      hideDetail() {
        this.detailShow = false;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    components: {
      star
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "header.styl";
</style>
