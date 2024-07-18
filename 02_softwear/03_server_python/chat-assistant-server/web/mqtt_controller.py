from threading import Thread
from utils import audio_tools, global_var, ai_tools, time_tools, file_tools
from ai import tts

import datetime


# mqtt连接时触发
def mqtt_connect(client, userdata, flags, rc):
    if rc == 0:
        print('[mqtt_controller.mqtt_connect] Connected successfully')
        # 客户端注册-统一注册端口-符合格式要求才能注册-格式例如：[ojun]
        client.subscribe("voice/assistant/register")
        # 具体的客户端注册订阅-读取配置文件中的devices进行订阅
        # 获取配置
        config = file_tools.get_config()
        for device_id in config["devices"]:
            print("[mqtt_controller.mqtt_connect] 订阅客户端mqtt: " + device_id)
            client.subscribe("voice/assistant/"+device_id+"/data")
            client.subscribe("voice/assistant/"+device_id+"/state")
            client.subscribe("voice/assistant/"+device_id+"/available")
    else:
        print('[mqtt_controller.mqtt_connect] Bad connection. Code:', rc)


# mqtt收到消息时回调
def mqtt_message(client, userdata, msg):
    # 如果是注册客户端
    if msg.topic == "voice/assistant/register":
        # 转换为字符串
        message = bytes(msg.payload).decode("utf-8")
        # print(message)
        # 查看添加的格式对不对
        if message.startswith("[") and message.endswith("]"):
            print("[mqtt_controller.mqtt_message] 准备确认设备并注册"+message)
            # 进行添加设备
            new_device_id = message.replace("[", "")
            new_device_id = new_device_id.replace("]", "")
            # print(new_device_id)
            # 添加到配置文件中
            config = file_tools.get_config()
            # 防止重复添加
            if new_device_id not in config["devices"]:
                config["devices"].append(new_device_id)
            # 写入到文件
            file_tools.save_config(config)
        return
    # 获取设备的id
    device_id_str = msg.topic.replace("voice/assistant/", "")
    slash_index = device_id_str.rfind("/")
    device_id = device_id_str[:slash_index]
    # print(device_id)
    # 设置各个topic
    data_topic = "voice/assistant/"+device_id+"/data"
    state_topic = "voice/assistant/"+device_id+"/state"
    # data = dict(
    #    topic=msg.topic,
    #    payload=msg.payload.decode()
    # )
    # print('Received message on topic: {topic} with payload: {payload}'.format(**data))
    # 如果是数据的topic
    if msg.topic == data_topic:
        if global_var.is_save_pcm:
            global_var.is_save_pcm = False
            print("[mqtt_controller.mqtt_message] init file")
            audio_tools.init_pcm_file("static/"+device_id+"_output.pcm")
        # 添加数据
        audio_tools.add_data_to_pcm(msg.payload)
    # 如果为状态指令
    if msg.topic == state_topic:
        print("[mqtt_controller.mqtt_message] "+msg.topic+": "+bytes(msg.payload).decode("utf-8"))
        if msg.payload.endswith(b"record end"):
            # 首先保存pcm文件
            audio_tools.close_pcm_file()
            print("[mqtt_controller.mqtt_message] pcm file saved.")
            global_var.is_save_pcm = True
            if global_var.is_only_rec:
                # 获取当前日期
                now = datetime.datetime.now()
                formatted_datetime = now.strftime("%Y-%m-%d-%H-%M-%S")
                # 转化为wav文件-加上日期
                audio_tools.conv_pcm_to_wav("static/"+device_id+"_output.pcm", "static/recoder/"+device_id+"-output-" + formatted_datetime + ".wav")
                # 设置全局变量
                global_var.is_only_rec = False
            else:
                # 转化为wav文件
                audio_tools.conv_pcm_to_wav("static/"+device_id+"_output.pcm", "static/"+device_id+"_output.wav")
                # 开启线程进行操作，防止卡顿使mqtt断开重连
                if global_var.is_query_ing:
                    p = Thread(target=ai_tools.recognite_for_query, args=(client, device_id, global_var.query_active_data))
                    p.start()
                    global_var.is_query_ing = False
                else:
                    p = Thread(target=ai_tools.get_text_and_answer, args=(client, device_id))
                    p.start()
        if msg.payload.endswith(b"play end"):
            # 正在主动问询中，开始录音
            if global_var.is_query_ing:
                # 发送唤醒监听指令
                client.publish("voice/assistant/"+device_id+"/set", b"recandautostop")
        if msg.payload.endswith(b"56"):
            # 收到asrpro的消息-现在几点了
            # 获取现在时间
            time_str = time_tools.get_now_time_str()
            # 组装读出内容
            read_str = "当前是" + time_str
            # 获取读音
            link = tts.get_tts_voice_by_engine(read_str, file_tools.get_now_tts_engine(), file_tools.get_now_tts_voice())
            # 读出开
            client.publish("voice/assistant/"+device_id+"/set", link)
        if msg.payload.endswith(b"57"):
            # 收到asrpro的消息-今天几号了
            # 获取现在日期
            date_str = time_tools.get_now_date_str()
            # 组装读出内容
            read_str = "今天是" + date_str
            # 获取读音
            link = tts.get_tts_voice_by_engine(read_str, file_tools.get_now_tts_engine(), file_tools.get_now_tts_voice())
            # 读出开
            client.publish("voice/assistant/"+device_id+"/set", link)
    if msg.topic == "voice/assistant/"+device_id+"/available":
        if msg.payload.endswith(b"online"):
            # link = tts.get_tts_voice_by_engine("你好")
            # client.publish("voice/assistant/"+device_id+"/set", link)
            print("[mqtt_controller.mqtt_message] 客户端:"+device_id+"已上线")
            # 添加在线客户端
            global_var.device_online_list.append(device_id)
            # print(global_var.device_online_list)
        if msg.payload.endswith(b"offline"):
            # link = tts.get_tts_voice_by_engine("你好")
            # client.publish("voice/assistant/"+device_id+"/set", link)
            print("[mqtt_controller.mqtt_message] 客户端:"+device_id+"下线了")
            # 删除在线客户端
            del_index = -1
            for i in range(len(global_var.device_online_list)):
                if global_var.device_online_list[i] == device_id:
                    del_index = i
            if del_index != -1:
                del global_var.device_online_list[del_index]
            print(global_var.device_online_list)
