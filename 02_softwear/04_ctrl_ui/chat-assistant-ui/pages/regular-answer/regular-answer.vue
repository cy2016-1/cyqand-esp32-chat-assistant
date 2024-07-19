<template>
	<view>
		<uni-card title="添加固定回复词">
			<view class="section-content line">
				问题：
			</view>
			<view class="section-content line">
				<input class="section-input" placeholder="请输入问题" v-model="addQuestion"/>
			</view>
			<view class="section-content line">
				回答：
			</view>
			<view class="section-content line">
				<input class="section-input" placeholder="请输入回答内容" v-model="addAnswer"/>
			</view>
			<view class="section-content line">
				<button type="primary" @click="addRegularAnswer">添加</button>
			</view>
		</uni-card>
		<view v-for="item in regularAnswers" key="item">
			<uni-card title="回复词">
				<view class="section-content line">
					问题：{{item.question}}
				</view>
				<view class="section-content line">
					回答：{{item.answer}}
				</view>
				<view class="section-content line" style="text-align: right;">
					<button type="warn" size="mini" @click="removeRegularAnswer(item.question)">删除</button>
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//添加
				addQuestion: "",
				addAnswer: "",
				//固定回复词对
				regularAnswers: []
			}
		},
		onLoad() {
			this.refreshPageData();
		},
		methods: {
			refreshPageData(){
				//获取模型
				uni.request({
				    url: getApp().globalData.server+'/info',
				    success: (res) => {
				        console.log(res.data);
						this.regularAnswers = res.data.config.chat.regular_answers;
				    }
				});
			},
			addRegularAnswer(){
				//防止空白
				if(this.addQuestion.trim() == "" || this.addAnswer.trim() == ""){
					uni.showToast({
						title: "输入不能为空",
						duration: 2000
					});
					return;
				}
				//添加
				uni.request({
				    url: getApp().globalData.server+'/regular/answer/add',
				    data: {
				        question: this.addQuestion,
						answer: this.addAnswer
				    },
				    success: (res) => {
				        console.log(res.data);
						uni.showToast({
							title: res.data,
							duration: 2000
						});
						//重新刷新内容
						this.refreshPageData();
				    }
				});
			},
			removeRegularAnswer(question){
				//删除
				uni.request({
				    url: getApp().globalData.server+'/regular/answer/remove',
				    data: {
				        question: question
				    },
				    success: (res) => {
				        console.log(res.data);
						uni.showToast({
							title: res.data,
							duration: 2000
						});
						//重新刷新内容
						this.refreshPageData();
				    }
				});
			}
		}
	}
</script>

<style>

</style>
