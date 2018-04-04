<template>
  <div>
    <!-- 头部 -->
    <v-header :seller="seller"></v-header>
    <!-- 主体切换 -->
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link v-bind:to="'/goods'">
          商品

        </router-link>

      </div>
      <div class="tab-item">
        <router-link to="/ratings">
          评论
        </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">
          商家
        </router-link>
      </div>
    </div>
    <!-- 头部 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>


  </div>
</template>
<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  // {urlParse}这个写法？
  import {urlParse} from 'common/js/util';
  import data from 'common/json/data.json';
//  const ERR_OK = 0;
  export default {
    data() {
      return {
        seller: {},
        id: (() => {
          let queryParam = urlParse();
          // console.log("url"+url)
          console.log(queryParam);
          return queryParam.id;
        })()
      };
    },
    // 在实例创建完成后被立即调用实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
    created() {
//      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
//        response = response.body;
//        if (response.errno === ERR_OK) {
//          this.seller = response.data;
//          this.seller = Object.assign({}, this.seller, response.data);
//        }
//      });

      this.seller = data.seller;
    },
    components: {
      'v-header': header
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/mixin.styl";

  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    /*border: 1px solid rgba(7,17,27,0.1);*/
  border-1px(rgba(7, 17, 27, 0.1));
  }

  .tab .tab-item {
    flex: 1;
    text-align: center;
  }

  .tab .tab-item a {
    display: block;
    font-size: 14px;
    color: rgb(77, 85, 93);
  }

  .tab .tab-item .active {
    color: rgb(240, 20, 20);
  }
</style>
