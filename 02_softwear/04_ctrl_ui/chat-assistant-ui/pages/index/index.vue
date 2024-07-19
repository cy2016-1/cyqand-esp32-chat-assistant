<template>
	<view class="content">
		<uni-card title="文字对话模型">
			<view class="section-content line">
				<input class="section-input" placeholder="输入问题" v-model="question"/>
			</view>
			<view class="section-content line">
				<uni-row>
					<uni-col :span="12">
						<view class="section-left">
							<input class="section-input" placeholder="模型选择" v-model="model"/>
						</view>
					</uni-col>
					<uni-col :span="12">
						<view class="section-right">
							<button type="primary" @click="getModelAnswer">获取回答</button>
						</view>
					</uni-col>
				</uni-row>
			</view>
			<view class="section-content line">
				<textarea class="section-textarea">{{answer}}</textarea>
			</view>
		</uni-card>
		
		<uni-card title="设备id" :extra="onlineShowText">
			<view class="section-content line">
				<uni-row>
					<uni-col :span="12">
						<view class="section-left">
							请选择控制的设备id
						</view>
					</uni-col>
					<uni-col :span="12">
						<view class="section-right">
							<picker @change="bindPickerChange" :value="selectedIndex" :range="deviceIdArray">
								<view class="section-picker">{{deviceIdArray[selectedIndex]}}</view>
							</picker>
						</view>
					</uni-col>
				</uni-row>
			</view>
		</uni-card>
		
		<uni-card title="读出内容">
			<view class="section-content line">
				<input class="section-input" placeholder="请输入要读出的内容" v-model="sayText"/>
			</view>
			<view class="section-content line">
				<button type="primary" @click="sayContent">读出内容</button>
			</view>
		</uni-card>
		
		<uni-card title="播放音频">
			<view class="section-content line">
				<input class="section-input" placeholder="请输入要播放的mp3网址链接" v-model="playAudioLink"/>
			</view>
			<view class="section-content line">
				<button type="primary" @click="playAudio">播放音频</button>
			</view>
		</uni-card>
		
		<uni-card title="文本提问">
			<view class="section-content line">
				<input class="section-input" placeholder="请输入要语音回答的问题" v-model="questionByText"/>
			</view>
			<view class="section-content line">
				<input class="section-input" placeholder="模型选择" v-model="exeModel"/>
			</view>
			<view class="section-content line">
				<button type="primary" @click="textAsk">文本提问</button>
			</view>
		</uni-card>
		
		<view class="gap"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//文字模型对话
				question: "",
				model: "",
				answer: "回答内容",
				//设备id
				deviceIdArray: [],
				selectedIndex: 0,
				//在线的设备
				onlineDeviceId: [],
				onlineShowText: "",
				//读出内容
				sayText: "",
				//播放音频
				playAudioLink: "",
				//文本提问
				questionByText: "",
				exeModel: ""
			}
		},
		onLoad() {
			//获取设备id合集
			uni.request({
			    url: getApp().globalData.server+'/info',
			    success: (res) => {
			        console.log(res.data);
					this.deviceIdArray = res.data.config.devices;
					this.onlineDeviceId = res.data.online;
					//判断是否在线
					if(this.onlineDeviceId.includes(this.deviceIdArray[this.selectedIndex])){
						this.onlineShowText = "在线";
					}else{
						this.onlineShowText = "下线";
					}
			    }
			});
		},
		methods: {
			getModelAnswer(){
				//非空判断
				if(this.question.trim() == "" || this.model.trim() == ""){
					uni.showToast({
						title: "输入不能为空",
						duration: 2000
					});
					return;
				}
				//设置textarea
				this.answer = "思考中...";
				//获取模型回答的文本
				uni.request({
				    url: getApp().globalData.server+'/getAnswer',
				    data: {
				        question: this.question,
						engine: this.model
				    },
				    success: (res) => {
				        console.log(res.data);
						this.answer = res.data;
				    }
				});
			},
			bindPickerChange(e){
				//设置选择的内容
				this.selectedIndex = e.detail.value
			},
			sayContent(){
				//非空判断
				if(this.sayText.trim() == ""){
					uni.showToast({
						title: "输入不能为空",
						duration: 2000
					});
					return;
				}
				//读出内容
				uni.request({
				    url: getApp().globalData.server+'/say',
				    data: {
				        clientId: this.deviceIdArray[this.selectedIndex],
						content: this.sayText
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			},
			playAudio(){
				//非空判断
				if(this.playAudioLink.trim() == ""){
					uni.showToast({
						title: "输入不能为空",
						duration: 2000
					});
					return;
				}
				//读出内容
				uni.request({
				    url: getApp().globalData.server+'/playAudio',
				    data: {
				        clientId: this.deviceIdArray[this.selectedIndex],
						link: this.playAudioLink
				    },
				    success: (res) => {
				        console.log(res.data);
				    }
				});
			},
			textAsk(){
				//非空判断
				if(this.questionByText.trim() == "" || this.exeModel.trim() == ""){
					uni.showToast({
						title: "输入不能为空",
						duration: 2000
					});
					return;
				}
				//文本提问
				uni.request({
				    url: getApp().globalData.server+'/executeText',
				    data: {
				        clientId: this.deviceIdArray[this.selectedIndex],
						text: this.questionByText,
						engine: this.exeModel
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
