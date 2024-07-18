import json
import os


# 获取项目路径下的文件列表
def get_server_file_list(path_in_server):
    # 工作路径
    current_dir = os.getcwd()
    # 文件列表
    file_list = os.listdir(current_dir + "/" + path_in_server)
    # 返回
    return file_list


# 获取文件文字
def get_text(file_name):
    f = open(file_name, encoding='utf-8')
    txt = []
    for line in f:
        txt.append(line.strip())
    print("[fileTools.getText] get text :{}".format(txt))
    return txt


# 保存文件文字
def save_text(file_name, data):
    with open(file_name, "w", encoding='utf-8') as f:
        f.write(data)


# 保存json到文件
def save_json(file_name, data):
    with open(file_name, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, indent=4, ensure_ascii=False)


# 获取文件的json
def get_json(file_name):
    with open(file_name, 'r', encoding='utf-8') as jsonfile:
        data = json.load(jsonfile)
        return data


# edge_tts配置文件设置
def get_edge_tts_config():
    return get_json("static/tts/edge/tts_map.json")


def save_edge_tts_config(data):
    save_json("static/tts/edge/tts_map.json", data)


# 程序配置文件设置
def get_config():
    return get_json("static/config.json")


def save_config(data):
    save_json("static/config.json", data)


# 修改配置文件的数据
def set_config_value(key, value):
    # 读取文件数据内容
    config = get_config()
    # 修改数据内容
    config[key] = value
    # 保存数据内容
    save_config(config)


# 获取配置文件的键值对
def get_config_value(key):
    # 读取文件数据内容
    config = get_config()
    return config[key]


# 修改配置文件的数据-第二层
def set_config_value_2(key1, key2, value):
    # 读取文件数据内容
    config = get_config()
    # 修改数据内容
    config[key1][key2] = value
    # 保存数据内容
    save_config(config)


# 获取配置文件的键值对-第二层
def get_config_value_2(key1, key2):
    # 读取文件数据内容
    config = get_config()
    return config[key1][key2]


# 以下为具体的获取内容


# 获取当前stt引擎
def get_now_stt_engine():
    # 获取当前的引擎设置
    engines = get_config_value_2("stt", "engines")
    select = get_config_value_2("stt", "select")
    # 打印
    print("[file_tools.get_now_stt_engine] 当前语音识别引擎为：" + engines[select])
    return engines[select]


# 获取当前chat引擎
def get_now_chat_engine():
    # 获取当前的引擎设置
    engines = get_config_value_2("chat", "engines")
    select = get_config_value_2("chat", "select")
    # 打印
    print("[file_tools.get_now_chat_engine] 当前聊天引擎为：" + engines[select])
    return engines[select]


# 获取当前tts引擎
def get_now_tts_engine():
    # 获取当前的引擎设置
    engines = get_config_value_2("tts", "engines")
    select = get_config_value_2("tts", "select")
    # 打印
    print("[file_tools.get_now_tts_engine] 当前语音生成引擎为：" + engines[select])
    return engines[select]


# 获取当前tts音色
def get_now_tts_voice():
    # 获取当前的引擎设置
    engines = get_config_value_2("tts", "edge_voices")
    select = get_config_value_2("tts", "edge_voices_select")
    # 打印
    print("[file_tools.get_now_tts_voice] 当前语音音色为：" + engines[select])
    return engines[select]


# 获取固定问题的回复内容-没有则回复None
def get_regular_answer(question):
    # 获取配置中的内容
    regular_answers = get_config_value_2("chat", "regular_answers")
    # 查询内容
    for regular_answer in regular_answers:
        if regular_answer["question"] == question:
            return regular_answer["answer"]
    return None


# 增加固定问题回复-返回添加结果字符串
def add_regular_answer(question, answer):
    # 获取配置中的内容
    regular_answers = get_config_value_2("chat", "regular_answers")
    # 防止重复添加内容
    for regular_answer in regular_answers:
        if regular_answer["question"] == question:
            return "the question is duplicate!"
    # 构建内容
    new_regular_answer = {
        "question": question,
        "answer": answer
    }
    # 添加内容
    regular_answers.append(new_regular_answer)
    # 重新设置到配置文件中去
    set_config_value_2("chat", "regular_answers", regular_answers)
    return "add success."


# 删除固定问题回复
def remove_regular_answer(question):
    # 获取配置中的内容
    regular_answers = get_config_value_2("chat", "regular_answers")
    # 定义删除的index
    del_index = -1
    # 遍历并进行比较
    for i in range(len(regular_answers)):
        if regular_answers[i]["question"] == question:
            del_index = i
    # 删除内容
    if del_index == -1:
        return "can't find the question in config!"
    else:
        del regular_answers[del_index]
        # 重新写入到文件
        set_config_value_2("chat", "regular_answers", regular_answers)
        return "remove success."


# 整点报时配置
def get_time_kipper_devices():
    return get_config_value_2("time_kipper", "devices")


# 添加整点报时设备
def add_time_kipper_device(device_id):
    # 获取初始配置
    time_kipper_config_devices = get_config_value_2("time_kipper", "devices")
    # 判断是否有重复的
    for time_kipper_config_device in time_kipper_config_devices:
        if time_kipper_config_device == device_id:
            return "duplicate"
    # 添加内容
    time_kipper_config_devices.append(device_id)
    # 写入到文件中
    set_config_value_2("time_kipper", "devices", time_kipper_config_devices)
    return "add success."


# 删除整点报时设备
def remove_time_kipper_device(device_id):
    # 获取初始配置
    time_kipper_config_devices = get_config_value_2("time_kipper", "devices")
    # 定义删除的index
    del_index = -1
    # 判断是否有重复的
    for i in range(len(time_kipper_config_devices)):
        if time_kipper_config_devices[i] == device_id:
            del_index = i
    if del_index != -1:
        del time_kipper_config_devices[del_index]
        # 写入到文件中
        set_config_value_2("time_kipper", "devices", time_kipper_config_devices)
        return "remove success."
    else:
        return "can't find device [" + device_id + "]"
