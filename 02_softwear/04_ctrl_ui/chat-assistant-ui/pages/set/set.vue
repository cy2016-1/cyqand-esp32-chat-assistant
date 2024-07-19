<template>
	<view class="content">
		
		<uni-card title="服务器网址设置">
			<view class="section-content line">
				<input class="section-input" :placeholder="defaultServer" v-model="serverUrl"/>
			</view>
			<view class="section-content line">
				<button type="primary" @click="setServer">设置网址</button>
			</view>
		</uni-card>
		
		<uni-card title="当前设备id">
			<view class="section-content line">
				<uni-row>
					<uni-col :span="12">
						<view class="section-left">
							请选择控制的设备id
						</view>
					</uni-col>
					<uni-col :span="12">
						<view class="section-right">
							<picker @change="deviceIdChange" :value="selectedIndex" :range="deviceIdArray">
								<view class="section-picker">{{deviceIdArray[selectedIndex]}}</view>
							</picker>
						</view>
					</uni-col>
				</uni-row>
			</view>
		</uni-card>
		
		<uni-card title="设置">
			<view class="section-content line">
				<uni-row>
					<uni-col :span="12">
						<view class="section-left">
							<button type="primary" @click="wakeAssistant">唤醒助手</button>
						</view>
					</uni-col>
					<uni-col :span="12">
						<view class="section-right">
							<button type="primary" @click="stopPlay">暂停播放</button>
						</view>
					</uni-col>
				</uni-row>
			</view>
			<view class="section-content line">
				<uni-row>
					<uni-col :span="12">
						<view class="section-left">
							<button type="primary" @click="resetWeb">重置网络</button>
						</view>
					</uni-col>
					<uni-col :span="12">
						<view class="section-right">
							<button type="primary" @click="viewRec">查看录音</button>
						</view>
					</uni-col>
				</uni-row>
			</view>
			<view class="section-content line">
				<uni-row>
					<uni-col :span="12">
						<view class="section-left">
							<button type="primary" @click="setRegularAnswer">回复设置</button>
						</view>
					</uni-col>
					<uni-col :span="12">
						<view class="section-left">
							<button type="primary" @click="toggleTimeKipper">{{timeKipperState?"关闭":"打开"}}报时</button>
						</view>
					</uni-col>
				</uni-row>
			</view>
		</uni-card>
		
		<uni-card title="静默录音">
			<uni-row class="section-content line">
				<uni-col :span="12">
					<view class="section-left">
						<button type="primary" @click="startOnlyRec">开始录音</button>
					</view>
				</uni-col>
				<uni-col :span="12">
					<view class="section-right">
						<button type="primary" @click="endOnlyRec">结束录音</button>
					</view>
				</uni-col>
			</uni-row>
		</uni-card>
		
		<uni-card title="音量设置">
			<view class="section-content line section-slider">
				<slider min="0" max="21" :value="volValue" @change="sliderChange" step="1" show-value />
			</view>
		</uni-card>
		
		<uni-card title="音色设置">
			<view class="section-content line">
				<picker @change="ttsVoiceChange" :value="ttsVoiceSelect" :range="ttsVoiceArray">
					<view class="section-picker">{{ttsVoiceArray[ttsVoiceSelect]}}</view>
				</picker>
			</view>
		</uni-card>
		
		<uni-card title="模型选择">
			<view class="section-content line">
				语音识别模型
			</view>
			<view class="section-content line">
				<picker @change="sttModelChange" :value="sttModelSelect" :range="sttModelArray">
					<view class="section-picker">{{sttModelArray[sttModelSelect]}}</view>
				</picker>
			</view>
			<view class="section-content line">
				对话模型
			</view>
			<view class="section-content line">
				<picker @change="chatModelChange" :value="chatModelSelect" :range="chatModelArray">
					<view class="section-picker">{{chatModelArray[chatModelSelect]}}</view>
				</picker>
			</view>
			<view class="section-content line">
				语音生成模型
			</view>
			<view class="section-content line">
				<picker @change="ttsModelChange" :value="ttsModelSelect" :range="ttsModelArray">
					<view class="section-picker">{{ttsModelArray[ttsModelSelect]}}</view>
				</picker>
			</view>
		</uni-card>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//服务器网址
				defaultServer: "",
				serverUrl: "",
				//设备id数组
				deviceIdArray: [],
				selectedIndex: 0,
				//整点报时显示字符串
				timeKipperDevices: [],
				timeKipperState: false,
				//当前音量
				volValue: 21,
				//音色展示读出的内容
				voiceShowContent: "你好，我是你的智能小助理",
				//语音生成音色选择
				ttsVoiceArray: [],
				ttsVoiceSelect: 0,
				//语音识别模型
				sttModelArray: [],
				sttModelSelect: 0,
				//对话模型
				chatModelArray: [],
				chatModelSelect: 0,
				//语音生成模型
				ttsModelArray: [],
				ttsModelSelect: 0,
			}
		},
		onLoad() {
			//设置服务器默认网址
			this.defaultServer = getApp().globalData.server;
			//获取模型
			uni.request({
			    url: getApp().globalData.server+'/info',
			    success: (res) => {
			        console.log(res.data);
					this.ttsVoiceArray = res.data.config.tts.edge_voices;
					this.ttsVoiceSelect = res.data.config.tts.edge_voices_select;
					this.deviceIdArray = res.data.config.devices;
					this.sttModelArray = res.data.config.stt.engines;
					this.sttModelSelect = res.data.config.stt.select;
					this.chatModelArray = res.data.config.chat.engines;
					this.chatModelSelect = res.data.config.chat.select;
					this.ttsModelArray = res.data.config.tts.engines;
					this.ttsModelSelect = res.data.config.tts.select;
					//判断整点报时
					this.timeKipperDevices = res.data.config.time_kipper.devices;
					//判断整点报时的参数
					if(this.timeKipperDevices.indexOf(this.deviceIdArray[this.selectedIndex]) != -1){
						this.timeKipperState = true;
					}
			    }
			});
		},
		methods: {
			setServer(){
				//设置服务器网址
				getApp().globalData.server = this.serverUrl;
				//保存到本地
				uni.setStorageSync("server", this.serverUrl);
			},
			deviceIdChange(e){
				//设置选择的内容
				this.selectedIndex = e.detail.value
			},
			wakeAssistant(){
				//唤醒助手
				uni.request({
				    url: getApp().globalData.server+'/awaken',
				    data: {
				        clientId: this.deviceIdArray[this.selectedIndex]
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			},
			stopPlay(){
				//暂停播放
				uni.request({
				    url: getApp().globalData.server+'/stop',
				    data: {
				        clientId: this.deviceIdArray[this.selectedIndex]
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			},
			resetWeb(){
				//重置网络
				uni.request({
				    url: getApp().globalData.server+'/reset',
				    data: {
				        clientId: this.deviceIdArray[this.selectedIndex]
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			},
			viewRec(){
				//跳转
				uni.navigateTo({
					url: '/pages/recoder/recoder'
				});
			},
			setRegularAnswer(){
				//跳转
				uni.navigateTo({
					url: '/pages/regular-answer/regular-answer'
				});
			},
			toggleTimeKipper(){
				//转换报时功能
				if(this.timeKipperState){
					//关闭报时功能
					uni.request({
					    url: getApp().globalData.server+'/time/kipper/close',
					    data: {
					        clientId: this.deviceIdArray[this.selectedIndex]
					    },
					    success: (res) => {
					        console.log(res.data);
							this.timeKipperState = false;
					    }
					});
				}else{
					//打开报时功能
					uni.request({
					    url: getApp().globalData.server+'/time/kipper/open',
					    data: {
					        clientId: this.deviceIdArray[this.selectedIndex]
					    },
					    success: (res) => {
					        console.log(res.data);
							this.timeKipperState = true;
					    }
					});
				}
			},
			startOnlyRec(){
				//开始静默录音
				uni.request({
				    url: getApp().globalData.server+'/recOnlyStart',
				    data: {
				        clientId: this.deviceIdArray[this.selectedIndex]
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			},
			endOnlyRec(){
				//结束静默录音
				uni.request({
				    url: getApp().globalData.server+'/recOnlyEnd',
				    data: {
				        clientId: this.deviceIdArray[this.selectedIndex]
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			},
			sliderChange(e){
				//设置音量
				console.log(e);
				uni.request({
				    url: getApp().globalData.server+'/vol',
				    data: {
				        clientId: this.deviceIdArray[this.selectedIndex],
						vol: e.detail.value
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			},
			ttsVoiceChange(e){
				//设置选择的内容
				this.ttsVoiceSelect = e.detail.value
				//服务端设置
				uni.request({
				    url: getApp().globalData.server+'/select/tts/voice',
				    data: {
				        index: this.ttsVoiceSelect
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
				var that = this;
				//音色展示
				uni.request({
				    url: getApp().globalData.server+'/tts/link',
				    data: {
				        content: this.voiceShowContent,
						voice: this.ttsVoiceArray[this.ttsVoiceSelect]
				    },
				    success: (res) => {
				        console.log(res.data);
						// 获取背景音频管理器实例
						const backgroundAudioManager = uni.getBackgroundAudioManager();
						// 设置音频源
						backgroundAudioManager.src = that.defaultServer + res.data;
				    }
				});
			},
			sttModelChange(e){
				//设置选择的内容
				this.sttModelSelect = e.detail.value
				//服务端设置
				uni.request({
				    url: getApp().globalData.server+'/select/stt/engine',
				    data: {
				        index: this.sttModelSelect
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			},
			chatModelChange(e){
				//设置选择的内容
				this.chatModelSelect = e.detail.value
				//服务端设置
				uni.request({
				    url: getApp().globalData.server+'/select/chat/engine',
				    data: {
				        index: this.chatModelSelect
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			},
			ttsModelChange(e){
				//设置选择的内容
				this.ttsModelSelect = e.detail.value
				//服务端设置
				uni.request({
				    url: getApp().globalData.server+'/select/tts/engine',
				    data: {
				        index: this.ttsModelSelect
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			}
		}
	}
</script>

<style>

</style>
