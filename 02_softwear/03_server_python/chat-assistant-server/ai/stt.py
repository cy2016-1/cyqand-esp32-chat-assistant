from ai import stt_fasterwhisper, stt_xunfei
from utils import web_tools


# post wav to whisper web server
def whisper_stt(filename):
    print("[stt.whisperStt] recognizing text of voice...")
    url = u'http://10.168.1.39:8000/asr'
    params = {
        "initial_prompt": "以下是普通话的句子",
        "language": "zh"
    }
    files = {
        "audio_file": open(filename, 'rb'),
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "form-data",
        "filename": filename
    }
    response = web_tools.request(method="post", url=url, files=files, params=params)
    if not isinstance(response, str):
        textResult = response.text
        print("[stt.whisperStt] chat result string: {}".format(textResult.strip()))
        return textResult.strip()


# 引擎-添加引擎时记得在config.json文件注册名字
def get_stt_text_by_engine(fileName, engine):
    if engine == "" or engine == None:
        engine = "whisper"
    elif engine == "whisper":
        return whisper_stt(fileName)
    elif engine == "xunfei":
        return stt_xunfei.get_xunfei_text(fileName)
    elif engine == "fasterwhisper":
        return stt_fasterwhisper.fasterwhisper_stt(fileName)
    else:
        return "error stt engine"


if __name__ == "__main__":
    # print(voskStt("output.wav", "resources/stt-models/vosk-model-small-cn-0.22"))
    # print(whisperStt("../static/output.wav"))
    # print(xunfei_stt("../static/output.wav"))
    print(stt_fasterwhisper.fasterwhisper_stt("../static/output.wav"))
