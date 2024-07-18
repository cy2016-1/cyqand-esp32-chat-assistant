# mqtt客户端
mqtt_client = None
# 是否为只是录音
is_only_rec = False
# 是否已经保存了pcm文件，保存完成后进行转换和识别
is_save_pcm = True
# 主动问询是否操作设备内容
query_active_data = {
    "time": 0,
    "question": "",
    "answer": "",
    "webhook": "http://xxx"
}
# 是否正在主动问询状态
is_query_ing = False
# 在线客户端列表
device_online_list = []
