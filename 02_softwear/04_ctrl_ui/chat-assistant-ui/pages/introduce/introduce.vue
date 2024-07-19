<template>
	<view>
		<uni-card :cover="cover">
			<view>
				一、引言：
			</view>
			<view>
				<text class="uni-h6">
					本项目是以esp32为基础做成的一个语音助手项目。可以实现类似于智能音箱的功能。
					系统主要分为以下几个部分：服务端、前端、客户端硬件、客户端代码。
					本软件可以对客户端设备进行远程任意控制。希望大家一起学习进步，祝您玩的开心。
				</text>
			</view>
			<view>
				二、已实现功能：
			</view>
			<view>
				1、固定录制几秒的功能-以提供接口-mqtt发送rec开始录音,发送end结束录音
				2、唤醒词设置及离线语音模块的设置-可以直达的语音命令不在单独设置到esp32语音模块内部
				3、多国家语言支持-与接入模型相关
				4、音色修改-与接入tts相关
				5、远程录制功能并进行保存
				6、文字对话api-可以集成多个api进行开放
				7、读出固定文字内容/播放mp3文件内容(不是mp3的转码成mp3)
				8、将各个指令单独做成一个api接口
				9、执行对话命令功能-输入一段话，语音对于这段话直接进行回答
				10、将各个状态及功能做成homeassistant的实体可以进行远程控制(参考小爱同学-播放音乐、获取实时的聊天内容、按键唤醒、调整音量、播放和暂停)-解决方法-使用nodered通过提供的api实现
				11、重写tts模块-接入各种tts模块-并提供接口以供外部调用
				12、给设备添加几个指示灯进行状态的区分(wifi状态、录音状态、播放状态等)
				13、更改名称为聊天助手/对话助手
				14、更改mqtt主题,避免使用"-"(nodered中监听异常)
				15、写一个前端ui控制设备
				16、前端ui添加服务器网址设置功能
				17、server代码日志优化
				18、把所有信息统一封装到info接口
				19、添加各个大模型选择接口
				20、选择与语音读出音色
				21、录音客户端查看及播放
				22、多设备支持-服务器应对多个不同设备的请求给出不同回应-使用mqtt的不同topic进行区别。
				23、音色选择后播放展示
			</view>
			<!-- <view slot="actions" class="card-actions">
				<view class="card-actions-item" @click="actionsClick('分享')">
					<uni-icons type="paperplane" size="18" color="#999"></uni-icons>
					<text class="card-actions-item-text">分享</text>
				</view>
				<view class="card-actions-item" @click="actionsClick('点赞')">
					<uni-icons type="heart" size="18" color="#999"></uni-icons>
					<text class="card-actions-item-text">点赞</text>
				</view>
				<view class="card-actions-item" @click="actionsClick('评论')">
					<uni-icons type="chatbubble" size="18" color="#999"></uni-icons>
					<text class="card-actions-item-text">评论</text>
				</view>
			</view> -->
		</uni-card>
		<view class="gap"></view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				cover: "/static/about/esp-voice-assistant.png"
			}
		},
		methods: {
			onClick(){
				console.log(111);
			}
		}
	}
</script>

<style lang="scss">

	.container {
		overflow: hidden;
	}

	.custom-cover {
		flex: 1;
		flex-direction: row;
		position: relative;
	}

	.cover-content {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 40px;
		background-color: rgba($color: #000000, $alpha: 0.4);
		display: flex;
		flex-direction: row;
		align-items: center;
		padding-left: 15px;
		font-size: 14px;
		color: #fff;
	}

	.card-actions {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		height: 45px;
		border-top: 1px #eee solid;
	}
	.card-actions-item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.card-actions-item-text {
		font-size: 12px;
		color: #666;
		margin-left: 5px;
	}
	.cover-image {
		flex: 1;
		height: 150px;
	}
	.no-border {
		border-width: 0;
	}
</style>