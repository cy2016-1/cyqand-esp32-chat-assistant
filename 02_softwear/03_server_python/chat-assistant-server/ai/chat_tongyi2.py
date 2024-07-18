import dashscope

from http import HTTPStatus
from dashscope.api_entities.dashscope_response import Role
from utils import file_tools

dashscope.api_key = file_tools.get_config()["chat"]["tongyi_api_key"]

# 角色system为总体约束，让助手可以永远记住
messages = [
    {'role': Role.SYSTEM, 'content': '你是一个智能助手，你叫小爱，不要暴露你原来的身份。我是你的主人，我叫cyqand。请尽量简短的回答我的问题，如果用户没有指定字数的话，尽量使用50字以内回答我。'},
    # {'role': Role.USER, 'content': '1'},
    # {'role': Role.ASSISTANT, 'content': '2'},
    # {'role': Role.USER, 'content': '3'},
    # {'role': Role.ASSISTANT, 'content': '4'},
    # {'role': Role.USER, 'content': '5'},
    # {'role': Role.ASSISTANT, 'content': '6'},
    # {'role': Role.USER, 'content': '7'},
    # {'role': Role.ASSISTANT, 'content': '8'},
    # {'role': Role.USER, 'content': '9'},
    # {'role': Role.ASSISTANT, 'content': '10'},
    # {'role': Role.USER, 'content': '11'},
    # {'role': Role.ASSISTANT, 'content': '12'}
]
# 最多保存多少轮对话内容
remember_context_num = 5


def get_context_msg():
    print("[chat_tonyi2.get_context_msg] " + messages.__str__())
    # 定义当前对话的回合数
    now_context_long = 0
    # 定义用户说话的序列号，方便后面删除
    user_text_index = []
    # 获取当前对话的长度
    for i in range(len(messages)):
        print("[chat_tonyi2.get_context_msg] " + messages[i].__str__())
        # 只计算用户的提问数量
        if messages[i]["role"] == "user":
            # 计数+1
            now_context_long += 1
            # 保存坐标
            user_text_index.append(i)
    # 输出
    # print("[chat_tonyi2.get_context_msg] " + now_context_long)
    # print("[chat_tonyi2.get_context_msg] " + user_text_index)
    # 判断
    if now_context_long > remember_context_num:
        # 获取多出来的部分
        residue = now_context_long - remember_context_num
        # 获取要去除到哪个index
        # print(user_text_index[residue])
        # 进行去除-由于第一个为系统system的内容背景，进行保留
        for j in range(user_text_index[1]-1, 0, -1):
            # print(j)
            del messages[j]
    # 输出删除后的内容
    print("[chat_tonyi2.get_context_msg] chat prompt: " + messages.__str__())


def multi_round_conversation(content: str):
    global messages
    # 上下文保留设置的条数
    get_context_msg()
    # 添加
    messages.append({'role': Role.USER, 'content': content})
    response = dashscope.Generation.call(
        'qwen-72b-chat',
        messages=messages,
        result_format='message'
    )
    if response.status_code == HTTPStatus.OK:
        # print(response)
        messages.append({
                'role': response.output.choices[0]['message']['role'],
                'content': response.output.choices[0]['message']['content']
            }
        )
        # print(messages)
        chatResult = response.output.choices[0]['message']['content']
        # 去除换行符
        chatResult = chatResult.replace("\n", "")
        print("[chat_tonyi2.multi_round_conversation] chat result string: {}".format(chatResult))
        return chatResult
    else:
        print('[chat_tonyi2.multi_round_conversation] Request id: %s, Status code: %s, error code: %s, error message: %s' % (
            response.request_id, response.status_code,
            response.code, response.message
        ))


# if __name__ == "__main__":
#     while 1:
#         question = input()
#         print(multi_round_conversation(question))
    # get_context_msg()
