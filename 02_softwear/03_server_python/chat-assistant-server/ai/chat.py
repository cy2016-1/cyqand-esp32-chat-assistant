import json
import re

from utils import web_tools, str_tools
from ai import chat_tongyi2


# 青云客
def qingyunke_talk(problem):
    url = 'http://api.qingyunke.com/api.php'
    params = {
        "key": "free",
        "appid": 0,
        "msg": problem
    }
    response = web_tools.request(method="GET", url=url, params=params)
    if not isinstance(response, str):
        chatJsonText = response.text
        jsonResult = json.loads(chatJsonText)
        print("[chat.qingyunkeTalk] chat result: {}".format(jsonResult))
        chatResult = jsonResult.get("content")
        # delete the {xxx} of result
        strinfo = re.compile('\{.*?\}')
        chatResult = strinfo.sub(',', chatResult)
        chatResult = chatResult.replace("*", "")
        chatResult = chatResult.replace("&quot;", "")
        chatResult = chatResult.replace("★", "")
        chatResult = chatResult.strip()
        print("[chat.qingyunkeTalk] chat result string: {}".format(chatResult))
        return chatResult


# 星火大模型-api接口-需要自己写服务
# def sparkdesk_talk(problem):
#     url = 'http://10.168.1.39:7000/chat'
#     params = {
#         "text": problem,
#     }
#     response = web_tools.request(method="get", url=url, params=params)
#     if not isinstance(response, str):
#         chatJsonText = response.text
#         print("[chat.tongyiTalk] chat result: {}".format(chatJsonText))
#         if str_tools.is_json(chatJsonText):
#             jsonResult = json.loads(chatJsonText)
#             print("[chat.tongyiTalk] chat result: {}".format(jsonResult))
#             chatResult = jsonResult.get("msg")
#             if chatResult == None or chatResult == "":
#                 chatResult = jsonResult.get("result")
#             # 去除换行符
#             print("[chat.tongyiTalk] chat result string: {}".format(chatResult))
#             return chatResult
#         return chatJsonText


# 总结：外界获取接口
def get_chat_answer_by_engine(problem, engine):
    if engine == "" or engine == None:
        engine = "qingyunke"
    if engine == "tongyi":
        answer = chat_tongyi2.multi_round_conversation(problem)
    elif engine == "qingyunke":
        answer = qingyunke_talk(problem)
    # elif engine == "sparkdesk":
    #     answer = sparkdesk_talk(problem)
    else:
        return "error chat engine"
    return answer

# 测试接口
# if __name__ == "__main__":
#     print(get_chat_answer_by_engine("你好啊", "qingyunkeTalk"))