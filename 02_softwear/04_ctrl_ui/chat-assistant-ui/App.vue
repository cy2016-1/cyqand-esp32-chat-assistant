<script>
	export default {
		globalData: {
		    server: 'http://10.168.0.20:5000'
		},
		onLaunch: function() {
			console.log('App Launch');
			//对服务器的网址进行获取覆盖
			try {
				const value = uni.getStorageSync('server');
				if (value) {
					getApp().globalData.server = value;
				}
			} catch (e) {
				//添加到服务器
				uni.setStorageSync('server', getApp().globalData.server);
			}
			console.log(uni.getStorageSync("server"));
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	.section{
		margin-top: 20px;
		//border: 1px solid red;
	}
	.line{
		margin-top: 5px;
	}
	.section-textarea{
		border: 2px solid black;
		border-radius: 5px;
		width: 99%;
	}
	.section-input{
		border:2px solid black;
		border-radius: 5px;
		height: 42px;
	}
	.section-slider{
		border: 2px solid black;
		border-radius: 5px;
	}
	.section-left{
		padding-right: 2px;
	}
	.section-right{
		padding-left: 2px;
	}
	.section-picker{
		background-color: beige;
		text-align: center;
		border-radius: 5px;
		border: 2px solid black;
	}
	.gap{
		height: 50px;
	}
</style>
