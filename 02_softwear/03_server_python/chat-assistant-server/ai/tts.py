import requests

from ai import tts_edge
from utils import file_tools

# 方法等待库
import asyncio


# def get_voice(content):
#     print("正在获取回答读音")
#     url = "http://10.168.1.32:10040"
#     get_data_url = url+'/tts/link'
#     headers = {
#         'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
#         'Accept-Language': 'en-US,en;q=0.9',
#         'Accept-Encoding': 'gzip, deflate, br',
#         'token': 'token'
#     }
#     params = {
#         "content": content,
#         "voice": "zh-CN-YunyangNeural"
#     }
#     post_response = requests.get(url=get_data_url, headers=headers, params=params)
#     url_path = post_response.content.decode("utf-8")
#     return url+url_path


# 通过引擎获取tts结果
def get_tts_voice_by_engine(content, engine:str = "", voice: str = "zh-CN-XiaoxiaoNeural"):
    result = ""
    # 设置默认引擎
    if engine == "":
        engine = "edge"
    # 判断引擎
    if engine == "edge":
        file_name = ""
        # 如果voice为空直接使用默认的音色
        if (not (voice is None)) and tts_edge.is_voice_right(voice):
            file_name = asyncio.run(tts_edge.get_tts(content, voice))
        else:
            file_name = asyncio.run(tts_edge.get_tts(content))
        # 拼接地址
        result = file_tools.get_config()["my_url"] + "/static/tts/edge/" + file_name
    else:
        return "error tts engine"
    return result

