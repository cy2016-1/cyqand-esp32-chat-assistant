# 微软语音库
import edge_tts
# 文件库
from utils.file_tools import get_edge_tts_config, save_edge_tts_config
# 字符工具
from utils.str_tools import get_hash

out_path = "static/tts/edge/"
rate = '-4%'
volume = '+0%'

# 支持的语音
support_voices = [
    "zh-CN-XiaoxiaoNeural",
    "zh-CN-XiaoyiNeural",
    "zh-CN-YunjianNeural",
    "zh-CN-YunxiNeural",
    "zh-CN-YunxiaNeural",
    "zh-CN-YunyangNeural",
    "zh-CN-liaoning-XiaobeiNeural",
    "zh-CN-shaanxi-XiaoniNeural",
    "zh-HK-HiuGaaiNeural",
    "zh-HK-HiuMaanNeural",
    "zh-HK-WanLungNeural",
    "zh-TW-HsiaoChenNeural",
    "zh-TW-HsiaoYuNeural",
    "zh-TW-YunJheNeural",
]


async def get_tts(content: str, voice: str = "zh-CN-YunxiNeural") -> None:
    # 生成唯一-hash值
    hash_data = get_hash(content)
    # 拼接文件名
    file_name = voice + "_" + hash_data + ".mp3"
    # 获取json文件内容
    json_data = get_edge_tts_config()
    # 对照数据内容，如果有直接返回内容的文件名字
    for data in json_data:
        if data["hash"] == hash_data and data["voice"] == voice:
            # print("存在该文本对应的内容，直接返回文件名即可")
            return file_name
    # 没有则添加内容进行重新获取
    # 生成语音内容
    # communicate = edge_tts.Communicate(content, voice, rate=rate, volume=volume)
    communicate = edge_tts.Communicate(content, voice)
    await communicate.save(out_path + file_name)
    # 将生成的名字存储进入文件
    add_data = {"hash": hash_data, "content": content, "voice": voice}
    json_data.append(add_data)
    # 将新生成的数据存入文件
    save_edge_tts_config(json_data)
    # 返回生成的文件名字
    return file_name


def is_voice_right(voice: str):
    if voice in support_voices:
        # print("存在该语音")
        return True
    # print("不存在该语音")
    return False


def get_support_voices():
    return support_voices


# 可供调用的方法
def audio_generate(file_name):
    """
    返回语音流
    :param file_name: 文件名字
    :return: 语音流
    """
    with open("static/tts/edge/" + file_name, 'rb') as f:
        data = f.read(1024)
        while data:
            yield data
            data = f.read(1024)

# 中文语音
"""
zh-CN-XiaoxiaoNeural Gender: Female
zh-CN-XiaoyiNeural Gender: Female
zh-CN-YunjianNeural Gender: Male
zh-CN-YunxiNeural Gender: Male
zh-CN-YunxiaNeural Gender: Male
zh-CN-YunyangNeural Gender: Male
zh-CN-liaoning-XiaobeiNeural Gender: Female
zh-CN-shaanxi-XiaoniNeural Gender: Female
zh-HK-HiuGaaiNeural Gender: Female
zh-HK-HiuMaanNeural Gender: Female
zh-HK-WanLungNeural Gender: Male
zh-TW-HsiaoChenNeural Gender: Female
zh-TW-HsiaoYuNeural Gender: Female
zh-TW-YunJheNeural Gender: Male
"""
