import os

# local_files_only=True 表示加载本地模型
# model_size_or_path=path 指定加载模型路径
# device="cuda" 指定使用cuda
# compute_type="int8_float16" 量化为8位
# language="zh" 指定音频语言
# vad_filter=True 开启vad
# vad_parameters=dict(min_silence_duration_ms=1000) 设置vad参数
from faster_whisper import WhisperModel

from utils import str_tools

# model_size = "large-v3"
# path = r"D:\Project\Python_Project\FasterWhisper\large-v3"

# 获取当前工作目录的路径
current_dir = os.getcwd()
# 打印当前工作目录的路径
print("当前工作目录的路径：", current_dir)

model_size = "small"
path = current_dir+"\static\whisper-small"
#path = r"/static/whisper-small"


# Run on GPU with FP16
model = WhisperModel(model_size_or_path=path, device="cpu", local_files_only=True)

# or run on GPU with INT8
# model = WhisperModel(model_size, device="cuda", compute_type="int8_float16")
# or run on CPU with INT8
# model = WhisperModel(model_size, device="cpu", compute_type="int8")


def fasterwhisper_stt(file_path_name):
    segments, info = model.transcribe(file_path_name, beam_size=5, language="zh", vad_filter=True,
                                      vad_parameters=dict(min_silence_duration_ms=1000))

    print("[stt_fasterwhisper.fasterwhisper_stt] Detected language '%s' with probability %f" % (info.language, info.language_probability))

    result = ""
    for segment in segments:
        print("[stt_fasterwhisper.fasterwhisper_stt] [%.2fs -> %.2fs] %s" % (segment.start, segment.end, segment.text))
        print("[stt_fasterwhisper.fasterwhisper_stt] "+str_tools.traditional_to_simplified(segment.text))
        result += str_tools.traditional_to_simplified(segment.text)
    return result

