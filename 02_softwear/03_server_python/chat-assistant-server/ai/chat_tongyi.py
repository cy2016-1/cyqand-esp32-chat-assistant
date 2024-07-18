# 阿里大模型-通义千问

import random
import dashscope
import json

from utils import file_tools

dashscope.api_key = file_tools.get_config()["chat"]["tongyi_api_key"]


def call_with_not_prompt(content):
    return call_with_prompt(content, "你是一个智能助手，你叫小爱，不要暴露你原来的身份。")


def call_with_prompt(content, config):
    messages = [{'role': 'system', 'content': config},
                {'role': 'user', 'content': content}]
    response = dashscope.Generation.call(
        dashscope.Generation.Models.qwen_turbo,
        messages=messages,
        # set the random seed, optional, default to 1234 if not set
        seed=random.randint(1, 10000),
        result_format='message',  # set the result to be "message" format.
    )
    # 提取返回结果中的回答内容
    jsonResult = json.loads(response.__str__())
    print("[ai.chat_tongyi] chat result: {}".format(jsonResult))
    chatResult = jsonResult.get("output").get("choices")[0].get("message").get("content")
    # 去除换行符
    chatResult = chatResult.replace("\n", "")
    print("[ai.chat_tongyi] chat result string: {}".format(chatResult))
    return chatResult

if __name__ == "__main__":
    answer = call_with_not_prompt("你是谁")
    print(answer)