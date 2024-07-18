from ai import stt, chat, tts
from utils import web_tools, file_tools, global_var, time_tools


# 获取语音文本
def recognite_for_query(mqtt_client, device_id, query):
    # 获取文本内容
    text = stt.get_stt_text_by_engine("static/"+device_id+"_output.wav", file_tools.get_now_stt_engine())
    # 设置结果
    query["answer"] = text
    print("[ai_tools.recognite_for_query] 主动问询数据内容：" + query)
    # 发送内容到webhook
    web_tools.request("get", query["webhook"], params=query)


# 获取语音文本并回答内容
def get_text_and_answer(mqtt_client, device_id):
    # 根据配置文件的配置获取文本内容
    text = stt.get_stt_text_by_engine("static/"+device_id+"_output.wav", file_tools.get_now_stt_engine())
    # 消除硬件的请说
    text = text.replace("请说", "")
    print("[ai_tools.get_text_and_answer] " + text)
    # 获取回答
    if text == "":
        print("[ai_tools.get_text_and_answer] 内容为空，不进行回答")
        return
    # 首先获取是否有固定的回答内容
    answer = file_tools.get_regular_answer(text)
    if answer is None:
        # 根据配置文件的配置获取对话结果
        answer = chat.get_chat_answer_by_engine(text, file_tools.get_now_chat_engine())
        print("[ai_tools.get_text_and_answer] 使用模型回答内容" + answer)
    else:
        print("[ai_tools.get_text_and_answer] 使用固定回答：" + answer)
    # 读出内容
    link = tts.get_tts_voice_by_engine(answer, file_tools.get_now_tts_engine(), file_tools.get_now_tts_voice())
    print("[ai_tools.get_text_and_answer] "+link)
    # 读出开
    mqtt_client.publish("voice/assistant/"+device_id+"/set", link)


# 获取各实时数据内容
def get_real_time_state():
    # 创建一个元组，用来接收各种内容
    result = {}
    # 1、获取配置config.json内容-可以获取实时的在线deviceId
    config = file_tools.get_config()
    # 添加到result
    result["config"] = config
    # 2、添加当前在线的客户端id
    result["online"] = global_var.device_online_list
    return result


# 整点报时
def time_kipper():
    # 获取是否在整点报时的范围内
    if time_tools.is_hour_in_range():
        # 遍历需要读出的设备
        devices = file_tools.get_time_kipper_devices()
        for device in devices:
            # 获取读音
            link = tts.get_tts_voice_by_engine("当前"+time_tools.get_now_time_str(), file_tools.get_now_tts_engine(), file_tools.get_now_tts_voice())
            # 读出开
            global_var.mqtt_client.publish("voice/assistant/" + device + "/set", link)
