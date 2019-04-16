//VUE版
<template>
 <div class="userCard">
 <div class="basic">
 <div class="avatar">
 <img src="info.portrait"></img>
 </view>
 <view class="info">
 <view class="name">{{info.nickName}}</view>
 <view class="label" v-if="info.label">
 <view class="label-text" v-for="(item,key) in info.label">{{item}}</view>
 </view>
 <view class="onsale">在售宝贝{{sellingCount}}</view>
 <view class="follow " @click="follow">{{isFollow ? '取消关注' : '关注'}}</view>
 </view>
 </view>
 </view>
</template>
<style lang="less" rel="stylesheet/less" scoped>
.userCard {
  position:relative;
  background: #FFFFFF;
  box-shadow: 0 0 10rpx 0 rgba(162,167,182,0.31);
  border-radius: 3*@px;
  padding:20*@px;
  position: relative;
}
/* css太多了，省略其他内容 */
</style>
<script>
export default {
  props : {
    info:{
      type:Object,
 default:{}
 }
 }
  data(){
 return {
      isFollow: false,
 }
 }

  methods : {
 async follow() {
 await someHttpRequest() //请求某个接口
 this.isFollow = !this.isFollow
 }
 }
  computed : {
    sellingCount(){
 return this.info.sellingCount || 1
 }
 }
  created() {
 this.$log('view')
 }
}
</script>