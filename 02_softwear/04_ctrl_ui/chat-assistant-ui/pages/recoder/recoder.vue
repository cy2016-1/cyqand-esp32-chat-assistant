<template>
	<view class="content">
		<view v-for="item in recFiles" key="item">
			<uni-card :title="item" thumbnail="static/recoder/player.png">
				<view style="text-align: center;">
					<audio :src="serverUrl + '/static/recoder/'+item" controls></audio>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				recFiles: [],
				serverUrl: "",
			}
		},
		onLoad() {
			//获取全局变量
			this.serverUrl = getApp().globalData.server;
		},
		onShow() {
			//获取文件列表
			uni.request({
			    url: getApp().globalData.server+'/file/rec',
			    success: (res) => {
			        console.log(res.data);
					//设置到全局变量
					this.recFiles = res.data;
			    }
			});
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
