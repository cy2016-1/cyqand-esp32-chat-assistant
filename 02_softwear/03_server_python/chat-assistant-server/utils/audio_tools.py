import wave

# pcm文件定义
pcm_file = None


# 转化.pcm为wav
def conv_pcm_to_wav(pcm_file_path_name, wav_file_path_name):
    # 设置.wav文件的参数
    sample_width = 1  # 采样位深度，以字节为单位，比如2表示16位
    sample_rate = 16000  # 采样率，比如44100 Hz
    channels = 1  # 通道数，比如2表示立体声 1表示单声道
    # 打开.pcm文件进行读取
    pcm_data = open(pcm_file_path_name, 'rb').read()
    # 创建.wav文件并设置参数
    with wave.open(wav_file_path_name, 'wb') as wav:
        wav.setnchannels(channels)
        wav.setsampwidth(sample_width)
        wav.setframerate(sample_rate)
        # 写入音频数据
        wav.writeframes(pcm_data)


# 初始化pcm文件
def init_pcm_file(pcm_file_path_name):
    print("[audio_tools.init_pcm_file] init pcm file ...")
    global pcm_file
    # 设置PCM文件的参数
    pcm_file = wave.open(pcm_file_path_name, "w")
    # 设置声道，1为单声道，2为双声道
    pcm_file.setnchannels(1)
    # 设置位深度，单位为字节
    pcm_file.setsampwidth(1)
    # 设置采样率，单位为Hz
    pcm_file.setframerate(16000)


# 添加数据到pcm文件
def add_data_to_pcm(data):
    # print("[audioTools] add data to pcm file ...")
    pcm_file.writeframes(data)


# 结束时关闭文件
def close_pcm_file():
    pcm_file.close()
