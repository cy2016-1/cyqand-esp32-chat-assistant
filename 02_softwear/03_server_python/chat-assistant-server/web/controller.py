from flask import Flask, request, jsonify, Response
from flask_mqtt import Mqtt

from ai import chat, tts, tts_edge
from utils import file_tools, global_var, web_tools, ai_tools
from web import mqtt_controller

# 时间库
import datetime
# 异步库
import asyncio

# 设置静态访问目录-该目录下的文件可以直接使用路径访问
app = Flask(import_name=__name__, static_folder='../static')

# 设置mqtt的连接信息
app.config['MQTT_BROKER_URL'] = file_tools.get_config().get("mqtt").get("ip")
app.config['MQTT_BROKER_PORT'] = file_tools.get_config().get("mqtt").get("port")
# 当你需要验证用户名和密码时，请设置该项
app.config['MQTT_USERNAME'] = file_tools.get_config().get("mqtt").get("username")
# 当你需要验证用户名和密码时，请设置该项
app.config['MQTT_PASSWORD'] = file_tools.get_config().get("mqtt").get("password")
app.config['MQTT_KEEPALIVE'] = 5  # 设置心跳时间，单位为秒
app.config['MQTT_TLS_ENABLED'] = False  # 如果你的服务器支持 TLS，请设置为 True

# 创建mqtt对象
global_var.mqtt_client = Mqtt(app)


# mqtt连接成功回调
@global_var.mqtt_client.on_connect()
def handle_connect(client, userdata, flags, rc):
    mqtt_controller.mqtt_connect(client, userdata, flags, rc)


# mqtt收到消息回调
@global_var.mqtt_client.on_message()
def handle_mqtt_message(client, userdata, msg):
    mqtt_controller.mqtt_message(client, userdata, msg)


# 建议关闭此功能，防止mqtt注入指令，造成不安全结果
# 命令模式-可以直接发送命令到语音助手
@app.route('/publish', methods=['POST'])
def publish_message():
    clientId = web_tools.get_request_param(request, "clientId")
    command = web_tools.get_request_param(request, "command")
    publish_result = global_var.mqtt_client.publish("voice/assistant/"+clientId+"/set", command)
    return jsonify({'code': publish_result[0]})


# 只录音模式开始
@app.route('/recOnlyStart', methods=['GET', 'POST'])
def rec_only_start():
    clientId = web_tools.get_request_param(request, "clientId")
    # 设置全局变量
    global_var.is_only_rec = True
    # 通知开始录音
    publish_result = global_var.mqtt_client.publish("voice/assistant/"+clientId+"/set", b"rec")
    return jsonify({"code": publish_result[0], "msg": "only rec start"})


# 只录音模式结束
@app.route('/recOnlyEnd', methods=['GET', 'POST'])
def rec_only_end():
    # 获取参数
    clientId = web_tools.get_request_param(request, "clientId")
    # 通知开始录音
    publish_result = global_var.mqtt_client.publish("voice/assistant/"+clientId+"/set", b"end")
    return jsonify({"code": publish_result[0], "msg": "only rec end"})


# 发送问题获取对话结果
@app.route('/getAnswer', methods=["GET", "POST"])
def get_answer():
    # 获取参数
    question = web_tools.get_request_param(request, "question")
    engine = web_tools.get_request_param(request, "engine")
    # 获取结果并返回
    return chat.get_chat_answer_by_engine(question, engine)


# 播放指定文字
@app.route('/say', methods=["GET", "POST"])
def say():
    # 获取参数
    clientId = web_tools.get_request_param(request, "clientId")
    # 获取参数
    content = web_tools.get_request_param(request, "content")
    # 获取读音
    link = tts.get_tts_voice_by_engine(content, file_tools.get_now_tts_engine(), file_tools.get_now_tts_voice())
    # 读出开
    global_var.mqtt_client.publish("voice/assistant/"+clientId+"/set", link)
    return "ok, speaking!"


# 播放指定链接mp3
@app.route('/playAudio', methods=["GET", "POST"])
def play_audio():
    # 获取参数
    clientId = web_tools.get_request_param(request, "clientId")
    # 获取参数
    link = web_tools.get_request_param(request, "link")
    # 播放链接
    global_var.mqtt_client.publish("voice/assistant/"+clientId+"/set", link)
    return "ok, playing!"


# 暂停播放内容
@app.route('/stop', methods=["GET", 'POST'])
def stop():
    # 获取参数
    clientId = web_tools.get_request_param(request, "clientId")
    # 发送停止指令
    global_var.mqtt_client.publish("voice/assistant/"+clientId+"/set", b"stop")
    return "ok, stopping!"


# 设置设备音量
@app.route('/vol', methods=["GET", "POST"])
def vol():
    # 获取参数
    clientId = web_tools.get_request_param(request, "clientId")
    # 获取参数
    volume = web_tools.get_request_param(request, "vol")
    volume_int = int(volume)
    volume_ctrl = "vol" + str(volume_int)
    # 发送停止指令
    global_var.mqtt_client.publish("voice/assistant/"+clientId+"/set", volume_ctrl.encode('utf-8'))
    return "ok, already set " + volume_ctrl


# 远程唤醒
@app.route('/awaken', methods=["GET", 'POST'])
def awaken():
    # 获取参数
    clientId = web_tools.get_request_param(request, "clientId")
    # 发送停止指令
    global_var.mqtt_client.publish("voice/assistant/"+clientId+"/set", b"recandautostop")
    return "ok, please say something!"


# 重置设备网络环境
@app.route('/reset', methods=["GET", 'POST'])
def reset():
    # 获取参数
    clientId = web_tools.get_request_param(request, "clientId")
    # 发送停止指令
    global_var.mqtt_client.publish("voice/assistant/"+clientId+"/set", b"reset")
    return "ok, please reset you web!"


# 语音回答文本内容
@app.route('/executeText', methods=["GET", "POST"])
def execute_text():
    # 获取参数
    clientId = web_tools.get_request_param(request, "clientId")
    # 获取参数
    text = web_tools.get_request_param(request, "text")
    engine = web_tools.get_request_param(request, "engine")
    # 获取回答
    answer = chat.get_chat_answer_by_engine(text, engine)
    # 获取读音
    link = tts.get_tts_voice_by_engine(answer, file_tools.get_now_tts_engine(), file_tools.get_now_tts_voice())
    # 读出开
    global_var.mqtt_client.publish("voice/assistant/"+clientId+"/set", link)
    return answer


# EDGE TTS API START


# 获取支持的语音列表
@app.route('/tts/voice', methods=["GET"])  # 获取url参数
def get_edge_tts_support_voices():
    return tts_edge.get_support_voices()


# 获取tts语音
@app.route('/tts', methods=["POST", "GET"])
def get_tts():
    """
    get获取tts语音文件路径的接口
    :return: 对应的语音文件
    """
    # 获取参数
    content = web_tools.get_request_param(request, "content")
    voice = web_tools.get_request_param(request, "voice")
    # 如果有voice设置voice
    if (not (voice is None)) and tts_edge.is_voice_right(voice):
        fileName = asyncio.run(tts_edge.get_tts(content, voice))
    else:
        fileName = asyncio.run(tts_edge.get_tts(content))
    return Response(tts_edge.audio_generate(fileName), mimetype='audio/mpeg')


# 获取tts语音链接
@app.route('/tts/link', methods=["POST", "GET"])
def get_tts_link():
    """
    get获取tts语音文件路径的接口
    :return: 对应的语音文件
    """
    # 获取参数
    content = web_tools.get_request_param(request, "content")
    voice = web_tools.get_request_param(request, "voice")
    # 如果有voice设置voice
    if (not (voice is None)) and tts_edge.is_voice_right(voice):
        file_name = asyncio.run(tts_edge.get_tts(content, voice))
    else:
        file_name = asyncio.run(tts_edge.get_tts(content))
    return "/static/tts/edge/" + file_name


# TTS API END


# 主动发起提问并向webhook地址发送问题和答案(关联变量----query/is_query_ing)
@app.route('/query', methods=["POST", "GET"])
def query_for_answer():
    # 获取参数
    clientId = web_tools.get_request_param(request, "clientId")
    # 设置全局变量为参数内容
    global_var.query_active_data["time"] = int(datetime.datetime.now().timestamp())
    global_var.query_active_data["question"] = web_tools.get_request_param(request, "question")
    global_var.query_active_data["webhook"] = web_tools.get_request_param(request, "webhook")
    # 判断非空
    if len(global_var.query_active_data.get("question"))==0:
        return "question不能为空"
    # 读出问题
    content = global_var.query_active_data.get("question")
    link = tts.get_tts_voice_by_engine(content, file_tools.get_now_tts_engine(), file_tools.get_now_tts_voice())
    # 读出
    global_var.mqtt_client.publish("voice/assistant/"+clientId+"/set", link)
    # 设置问询状态
    global_var.is_query_ing = True
    return "ok"


# 单独查询客户端设备
@app.route('/client/query', methods=["POST", "GET"])
def query_client():
    # 获取配置文件
    config = file_tools.get_config()
    return config["devices"]


# 删除客户端设备
@app.route('/client/remove', methods=["POST", "GET"])
def remove_client():
    # 获取参数
    client_id_index = int(web_tools.get_request_param(request, "index"))
    # 获取配置文件
    config = file_tools.get_config()
    # 删除id
    del config["devices"][client_id_index]
    # 保存到文件中
    file_tools.save_config(config)
    return "ok"


# 获取当前状态信息
@app.route('/info', methods=["POST", "GET"])
def get_info():
    return ai_tools.get_real_time_state()


# 设置当前的stt模型
@app.route('/select/stt/engine', methods=["POST", "GET"])
def set_stt_engine():
    # 获取参数
    index = web_tools.get_request_param(request, "index")
    # 设置stt的模型
    file_tools.set_config_value_2("stt", "select", int(index))
    return ai_tools.get_real_time_state()


# 设置当前的chat模型
@app.route('/select/chat/engine', methods=["POST", "GET"])
def set_chat_engine():
    # 获取参数
    index = web_tools.get_request_param(request, "index")
    # 设置stt的模型
    file_tools.set_config_value_2("chat", "select", int(index))
    return ai_tools.get_real_time_state()


# 设置当前的tts模型
@app.route('/select/tts/engine', methods=["POST", "GET"])
def set_tts_engine():
    # 获取参数
    index = web_tools.get_request_param(request, "index")
    # 设置stt的模型
    file_tools.set_config_value_2("tts", "select", int(index))
    return ai_tools.get_real_time_state()


# 设置当前的tts音色
@app.route('/select/tts/voice', methods=["POST", "GET"])
def set_tts_voice():
    # 获取参数
    index = web_tools.get_request_param(request, "index")
    # 设置stt的模型
    file_tools.set_config_value_2("tts", "edge_voices_select", int(index))
    return ai_tools.get_real_time_state()


# 获取录音路径下的录音文件
@app.route('/file/rec', methods=["POST", "GET"])
def get_rec_file():
    # 获取文件
    files = file_tools.get_server_file_list("/static/recoder")
    print("[controller] files: " + files.__str__())
    return files


# 添加自定义回复内容
@app.route('/regular/answer/add', methods=["POST", "GET"])
def add_regular_answer():
    # 获取参数
    question = web_tools.get_request_param(request, "question")
    answer = web_tools.get_request_param(request, "answer")
    # 添加到config
    return file_tools.add_regular_answer(question, answer)


# 添加自定义回复内容
@app.route('/regular/answer/remove', methods=["POST", "GET"])
def remove_regular_answer():
    # 获取参数
    question = web_tools.get_request_param(request, "question")
    # 添加到config
    return file_tools.remove_regular_answer(question)


# 打开整点报时
@app.route('/time/kipper/open', methods=["GET", "POST"])
def open_time_kipper():
    # 获取参数
    client_id = web_tools.get_request_param(request, "clientId")
    # 添加到配置文件
    file_tools.add_time_kipper_device(client_id)
    return ai_tools.get_real_time_state()


# 关闭整点报时
@app.route('/time/kipper/close', methods=["GET", "POST"])
def close_time_kipper():
    # 获取参数
    client_id = web_tools.get_request_param(request, "clientId")
    # 删除内容
    file_tools.remove_time_kipper_device(client_id)
    return ai_tools.get_real_time_state()