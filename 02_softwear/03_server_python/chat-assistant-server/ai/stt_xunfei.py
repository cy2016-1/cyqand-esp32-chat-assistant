# -*- coding: utf-8 -*-
import base64
import hashlib
import hmac
import json
import os
import time
import urllib

from utils import file_tools

import requests

lfasr_host = 'https://raasr.xfyun.cn/v2/api'
# 请求的接口名
api_upload = '/upload'
api_get_result = '/getResult'

# 密钥
config = file_tools.get_config_value_2("stt", "xunfei")
app_id = config["appid"]
secret_key = config["secret_key"]


class RequestApi(object):
    def __init__(self, appid, secret_key, upload_file_path):
        self.appid = appid
        self.secret_key = secret_key
        self.upload_file_path = upload_file_path
        self.ts = str(int(time.time()))
        self.signa = self.get_signa()

    def get_signa(self):
        appid = self.appid
        secret_key = self.secret_key
        m2 = hashlib.md5()
        m2.update((appid + self.ts).encode('utf-8'))
        md5 = m2.hexdigest()
        md5 = bytes(md5, encoding='utf-8')
        # 以secret_key为key, 上面的md5为msg， 使用hashlib.sha1加密结果为signa
        signa = hmac.new(secret_key.encode('utf-8'), md5, hashlib.sha1).digest()
        signa = base64.b64encode(signa)
        signa = str(signa, 'utf-8')
        return signa

    def upload(self):
        print("[stt_xunfei.upload] 上传部分：")
        upload_file_path = self.upload_file_path
        file_len = os.path.getsize(upload_file_path)
        file_name = os.path.basename(upload_file_path)

        param_dict = {}
        param_dict['appId'] = self.appid
        param_dict['signa'] = self.signa
        param_dict['ts'] = self.ts
        param_dict["fileSize"] = file_len
        param_dict["fileName"] = file_name
        param_dict["duration"] = "200"
        print("[stt_xunfei.upload] upload参数：", param_dict)
        data = open(upload_file_path, 'rb').read(file_len)

        response = requests.post(url =lfasr_host + api_upload+"?"+urllib.parse.urlencode(param_dict),
                                headers = {"Content-type":"application/json"},data=data)
        print("[stt_xunfei.upload] upload_url:",response.request.url)
        result = json.loads(response.text)
        print("[stt_xunfei.upload] upload resp:", result)
        return result

    def get_result(self):
        uploadresp = self.upload()
        orderId = uploadresp['content']['orderId']
        param_dict = {}
        param_dict['appId'] = self.appid
        param_dict['signa'] = self.signa
        param_dict['ts'] = self.ts
        param_dict['orderId'] = orderId
        param_dict['resultType'] = "transfer,predict"
        print("[stt_xunfei.get_result] 查询部分：")
        print("[stt_xunfei.get_result] get result参数：", param_dict)
        status = 3
        # 建议使用回调的方式查询结果，查询接口有请求频率限制
        while status == 3:
            response = requests.post(url=lfasr_host + api_get_result + "?" + urllib.parse.urlencode(param_dict),
                                     headers={"Content-type": "application/json"})
            # print("get_result_url:",response.request.url)
            result = json.loads(response.text)
            print("[stt_xunfei.get_result] " + result.__str__())
            status = result['content']['orderInfo']['status']
            print("[stt_xunfei.get_result] status=",status)
            if status == 4:
                break
            time.sleep(5)
        print("[stt_xunfei.get_result] get_result resp:",result)
        return result


# 获取讯飞结果
def get_xunfei_text(file_path_name):
    api = RequestApi(appid=app_id,
                     secret_key=secret_key,
                     upload_file_path=file_path_name)
    result = api.get_result()
    # 数据处理
    order_result = result.get("content").get("orderResult")
    order_result_json = json.loads(order_result)
    ws = order_result_json.get("lattice2")[0].get("json_1best").get("st").get("rt")[0].get("ws")
    # 获得完整文字
    text = ""
    for item in ws:
        text += item.get("cw")[0].get("w")
    print("[stt_xunfei.get_xunfei_text] " + text.strip())
    return text.strip()

