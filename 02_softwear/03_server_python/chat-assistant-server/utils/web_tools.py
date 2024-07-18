import requests


# 发送get/post请求获取结果
def request(method, url, headers=None, params=None, data=None, files=None):
    # url judge
    if not url.startswith("http"):
        print("[web_tools.request] url must start with http:// or https://")
        return "error url"
    # set headers, new headers should cover in old one.
    defaultHeaders = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br'
    }
    if headers is not None:
        defaultHeaders.update(headers)
    # define a var response
    response = None
    # send a http request
    if method.lower() == "get":
        try:
            response = requests.get(url=url, headers=headers, params=params, data=data, files=files)
        except requests.exceptions.ConnectionError:
            print("[web_tools.request] get连接建立失败")
            return "error get connect"
    elif method.lower() == "post":
        try:
            response = requests.post(url=url, headers=headers, params=params, data=data, files=files)
        except requests.exceptions.ConnectionError:
            print("[web_tools.request] post连接建立失败")
            return "error post connect"
    else:
        print("[web_tools.request] request method must either 'get' or 'post'")
        return "error method"
    # show result
    print("[web_tools.request] request status: {}".format(response.status_code))
    # return
    return response


# 获取用户请求的参数
def get_request_param(request_in, param_name):
    text = ""
    if request_in.method == "GET":
        text = request_in.args.get(param_name)
    if request_in.method == "POST":
        if request_in.content_type.startswith('application/json'):
            text = request_in.json.get(param_name)
        elif request_in.content_type.startswith('multipart/form-data'):
            text = request_in.form.get(param_name)
        else:
            text = request_in.values.get(param_name)
    return text
