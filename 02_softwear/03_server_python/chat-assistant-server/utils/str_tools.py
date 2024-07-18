# 繁体转化为简体库
import zhconv
# 生成hash库
import hashlib
# json库
import json


# 中文繁体转化为简体字
def traditional_to_simplified(traditional_text):
    simplified_text = zhconv.convert(traditional_text, 'zh-hans')
    return simplified_text


# 获取文本的hash值
def get_hash(string:str):
    """
    生成字符串的hash唯一值
    :param string:
    :return:
    """
    return hashlib.md5(string.encode()).hexdigest()


# 将字符串转化为json格式数据
def str_to_json(string:str):
    """
    将字符串转化为json对象
    :param string: 要转换的对象
    :return: json对象
    """
    return json.loads(string)


# 判断字符串是否为json格式数据
def is_json(json_str):
    try:
        json.loads(json_str)
        return True
    except json.JSONDecodeError:
        return False
