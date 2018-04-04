<template>
  <div class="star">
    <div class="star-item" :class="starType">
      <!-- itemClasses就是一个数组，里面的值是on或者off，或者half，其中itemClass就代表on这几种情况，也就是添加不同类，各种星星是在类中体现的 -->
      <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item" ></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';
  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {
        return 'star-' + this.size;
      },
      // 在计算属性中设置itemClasses数据，调用itemClasses返回result数组
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score * 2) / 2;
        // hasDecimal得到的结果是布尔值
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        // 判断是否有半星
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "star.styl";
</style>
