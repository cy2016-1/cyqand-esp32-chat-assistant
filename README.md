# 一、mqtt及其接口功能:

## （一）设置类：下发

### topic:voice/assistant/ojun/set

- 1、[mp3 url]:发送一个http开头的mp3文件可以直接播放。
- 2、[stop]:停止播放音频。
- 3、[vol11]:其中的数字设置音量大小-可以设置0-21。
- 4、[rec]:远程开始录音（不会自动结束）
- 5、[end]:远程停止录音
- 6、[recandautostop]:远程开始录音，声音小了后自动结束录制
- 7、[reset]:重置wifi和mqtt并发射ap重新配网

## （二）状态类：上报

### topic:voice/assistant/ojun/available

- 1、[online]:在线
- 2、[offline]:离线

### topic:voice/assistant/ojun/state

- 1、[record start]:开始录制
- 2、[record end]:结束录制
- 3、[play start]:开始播放
- 4、[play end]:结束播放
- 5、[数字]:来自语音模块的数据,可以判断数据用作唤醒/其他用途

### topic:voice/assistant/ojun/data

上报音频数据用的topic

### topic:voice/assistant/register

开机时注册服务器设备-已经存在的不会重复注册


# 二、待实现功能：

- 4、蓝牙功能?
- 5、播放提示音-类似叮咚（唤醒、结束录音等时机播放）
- 8、设计一个外壳
- 10、远距离对讲
- 14、闹钟、日历提醒、天气查询、音乐播放、智能家居(编写助手的promp对助手进行洗脑让其输出特定的格式内容)
- 18、麦克风静音
- 19、语音关机
- 20、低功耗尝试
- 28、定时提醒功能
- 31、提升stt、chat、tts速度--流式tts读出尝试
- 32、设备音量反馈及mqtt获取音量接口-app无法知道当前的音量大小


# 三、bug:

- 录音逻辑-按键录音有时无法在松开按键时结束录音-已解决:esp32开发板网络不好的原因。√


# 四、已实现功能：

- 1、固定录制几秒的功能-以提供接口-mqtt发送rec开始录音,发送end结束录音
- 2、唤醒词设置及离线语音模块的设置-可以直达的语音命令不在单独设置到esp32语音模块内部
- 3、多国家语言支持-与接入模型相关
- 4、音色修改-与接入tts相关
- 5、远程录制功能并进行保存
- 6、文字对话api-可以集成多个api进行开放
- 7、读出固定文字内容/播放mp3文件内容(不是mp3的转码成mp3)
- 8、将各个指令单独做成一个api接口
- 9、执行对话命令功能-输入一段话，语音对于这段话直接进行回答
- 10、将各个状态及功能做成homeassistant的实体可以进行远程控制(参考小爱同学-播放音乐、获取实时的聊天内容、按键唤醒、调整音量、播放和暂停)-解决方法-使用nodered通过提供的api实现
- 11、重写tts模块-接入各种tts模块-并提供接口以供外部调用
- 12、给设备添加几个指示灯进行状态的区分(wifi状态、录音状态、播放状态等)
- 13、更改名称为聊天助手/对话助手
- 14、更改mqtt主题,避免使用"-"(nodered中监听异常)
- 15、写一个前端ui控制设备
- 16、前端ui添加服务器网址设置功能
- 17、server代码日志优化
- 18、把所有信息统一封装到info接口
- 19、添加各个大模型选择接口
- 20、选择与语音读出音色
- 21、录音客户端查看及播放
- 22、多设备支持-服务器应对多个不同设备的请求给出不同回应-使用mqtt的不同topic进行区别。
- 23、音色选择后播放展示
- 24、固定回复词:自定义语音回复-就像小爱同学的训练
- 25、时间和日期查询
- 26、在线状态-各个客户端的状态
- 27、连接ha的mqtt设备yaml文件编写
- 28、整点报时功能
- //添加功能
- 29、语音模块控制暂停播放和音量
- 30、模块发送晚安语


# 五、硬件问题
## 版本二：
- 1、led灯不能使用34、35引脚 √
- 2、开关方向更改 √
- 3、hlkv20换成asrpro √
- 4、放一个喇叭的线走位孔(使用螺丝孔) √
- 5、放几个螺丝孔用来固定 √
- 6、将inmp441变成3v3供电 √
- 7、将麦克风都集成到板子上 √

## 版本三：
- 1、添加复位按钮-方便重启烧录 √
- 2、添加重新配网按钮-io14-一共需要三个按钮-换成小的按钮 √
- 3、添加蜂鸣器? ×
- 4、led灯不要使用14引脚-io13 √
- 5、减少开关数量/使用小的拨片开关 √
- 6、放置元器件的时候要注意方向-max98357 √
- 7、串口能不能公用？不能，但是能放在一起省空间 √
- 8、选一个不是通孔的asrpro芯片封装 √
- 9、增加电源模块 √
- 10、c3电容更换为10uf √

## 版本四：（最新）
- 1、复位按键 √
- 2、max98357a引脚号标记 √
- 3、配网按键设置在内部 √
- 4、电池接口防呆设计
- 5、设备可以使用5v线路单独供电（由电源按键关闭时启动） √


# 六、硬件代码编译需要的库
- 1、WiFiManager
- 2、MyWifiManager -- MyWifiMqttManager.h -- https://gitee.com/cyqand/my-arduino-lib
- 3、ArduinoJson
- 4、PubSubClient
- 5、EspSoftwareSerial -- SoftwareSerial.h
- 6、ESP32-audioI2S -- audio.h -- https://github.com/schreibfaul1/ESP32-audioI2S


# 七、视频
## （一）硬件及语音模块
- 硬件组成
- 硬件大致连接图
- pcb
- asrpro
- asrpro代码

## （二）esp32代码
- 不足讲解
  - 串口设计,所以在调试编写代码过程中不能实时的显示日志,但是可以使用mqtt作为日志输出
  - 没有设计复位电路
  - io14引脚灯光开机自动亮起且微微亮。[原因见此](https://blog.csdn.net/m0_46509684/article/details/129105888)
  - asrpro音量不好通过服务端调整-探索调整方式
- 配网演示
- 语音助手原理讲解
- 硬件实现功能（软件）讲解
- 代码逐项讲解
  - 开源： [地址](https://gitee.com/cyqand/esp32-chat-assistant)
  - 环境配置：wifi库、及其他的库安装
  - 具体代码讲解

## （三）python端代码
- 最新实现功能
- python代码实现
  - mqtt与硬件的接口实现
  - http api接口讲解

## （四）ui-uniapp代码


## （五）连接homeassistant
示例代码如下：将此配置文件放在ha的configuration.yml中即可，另外请保证助手连接的mqtt服务器和ha连接的相同。
注意：修改其中的id为你的设备id。
```
mqtt:
  - switch:
      name: "record"
      unique_id: voice_assistant_record
      command_topic: "voice/assistant/ojun/set"
      payload_on: "rec"
      payload_off: "end"
      state_topic: "voice/assistant/ojun/state"
      state_on: "record start"
      state_off: "record end"
      availability_topic: "voice/assistant/ojun/available"
      device: 
        name: voice-assistant-ojun
        hw_version: 1.0.0
        sw_version: 1.0.0
        identifiers: 
          - "voice-assistant-ojun"
  - number:
      name: "volume"
      unique_id: voice_assistant_volume
      command_topic: "voice/assistant/ojun/set"
      availability_topic: "voice/assistant/ojun/available"
      command_template: vol{{value}}
      max: 21
      min: 0
      device: 
        name: voice-assistant-ojun
        hw_version: 1.0.0
        sw_version: 1.0.0
        identifiers: 
          - "voice-assistant-ojun"
  - text:
      name: "play-audio-link"
      unique_id: voice_assistant_play_audio
      command_topic: "voice/assistant/ojun/set"
      availability_topic: "voice/assistant/ojun/available"
      device: 
        name: voice-assistant-ojun
        hw_version: 1.0.0
        sw_version: 1.0.0
        identifiers: 
          - "voice-assistant-ojun"
  - button:
      name: "awake"
      unique_id: voice_assistant_awake
      command_topic: "voice/assistant/ojun/set"
      command_template: "recandautostop"
      availability_topic: "voice/assistant/ojun/available"
      device: 
        name: voice-assistant-ojun
        hw_version: 1.0.0
        sw_version: 1.0.0
        identifiers: 
          - "voice-assistant-ojun"
  - button:
      name: "stop-play"
      unique_id: voice_assistant_stop_play
      command_topic: "voice/assistant/ojun/set"
      command_template: "stop"
      availability_topic: "voice/assistant/ojun/available"
      device: 
        name: voice-assistant-ojun
        hw_version: 1.0.0
        sw_version: 1.0.0
        identifiers: 
          - "voice-assistant-ojun"
  - sensor:
    - name: "state"
      unique_id: voice_assistant_state
      state_topic: "voice/assistant/ojun/state"
      availability_topic: "voice/assistant/ojun/available"
      device: 
        name: voice-assistant-ojun
        hw_version: 1.0.0
        sw_version: 1.0.0
        identifiers: 
          - "voice-assistant-ojun"
  - binary_sensor:
      name: "playing"
      unique_id: voice_assistant_playing
      state_topic: "voice/assistant/ojun/state"
      payload_off: "play end"
      payload_on: "play start"
      availability_topic: "voice/assistant/ojun/available"
      device: 
        name: voice-assistant-ojun
        hw_version: 1.0.0
        sw_version: 1.0.0
        identifiers: 
          - "voice-assistant-ojun"
  - binary_sensor:
      name: "recording"
      unique_id: voice_assistant_recording
      state_topic: "voice/assistant/ojun/state"
      payload_off: "record end"
      payload_on: "record start"
      availability_topic: "voice/assistant/ojun/available"
      device: 
        name: voice-assistant-ojun
        hw_version: 1.0.0
        sw_version: 1.0.0
        identifiers: 
          - "voice-assistant-ojun"
```