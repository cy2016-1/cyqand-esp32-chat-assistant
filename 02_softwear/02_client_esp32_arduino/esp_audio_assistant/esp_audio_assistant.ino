#include "Variable.h"
#include "MyWifiMqttManager.h"
#include "VoiceAwake.h"
#include "AudioIn.h"
#include "AudioOut.h"

//按键是否按下，判断录音与否
bool BtnisPressed(void){
  //读取按钮状态
  bool key=digitalRead(BTN);
  //判断按钮状态
  if(1==key){
    return 0;
  }else{
    return 1 ;
  }
}

//截取字符串
void remove_chars(char* str, int n) {
    char temp[100];
    strcpy(temp, str + n);
    strcpy(str, temp);
}

// MQTT监听函数
void mqttCallback(char *topic, byte *payload, unsigned int length) {
  //打印接收到的消息
  Serial.print("[mqttCallback] Message received on topic: ");
  Serial.println(topic);
  Serial.print("[mqttCallback] Message: ");
  //赋值给char*
  char payloadChars[length];
  for (int i = 0; i < length; i++) {
    payloadChars[i] = (char)payload[i];
  }
  payloadChars[length] = '\0';
  Serial.println(payloadChars);
  //接收mqtt指令并进行控制
  if(strcmp(payloadChars, "stop") == 0){
    //停止音频
    stopAudio();
  }if(strcmp(payloadChars, "rec") == 0){
    //远程控制开始录音
    isRecRemote = 1;
  }if(strcmp(payloadChars, "end") == 0){
    //远程控制关闭录音
    isRecRemote = 0;
  }if(strcmp(payloadChars, "recandautostop") == 0){
    //远程控制关闭录音
    isRecRemoteAutoStop = 1;
  }if(strcmp(payloadChars, "reset") == 0){
    //重置wifi/mqtt配置信息
    resetWifiMqtt();
  }else if(starts_with(payloadChars, "vol")){
    //格式为：vol13
    //截取字符串
    remove_chars(payloadChars, 3);
    //获取音量
    int volume = atoi(payloadChars);
    //设置音量
    setVolume(volume);
  }else if(starts_with(payloadChars, "http")){
    //尝试播放音频
    playAudio(payloadChars);
  }
}

void setup() {
  //串口初始化
  Serial.begin(115200);
  //初始化语音模块串口
  initVoiceWakeSerial();
  //指示灯初始化
  pinMode(LED, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  //按键
  pinMode(BTN, INPUT_PULLUP);
  //设置14指示灯为关闭-否则会有微光-可能与单片机启动后引脚为高电平相关
  digitalWrite(LED3,LOW);
  //清除配置内容，用于测试（此部分可以不设置）
  //void clearConfig();
  //设置参数（该部分可以不设置）-在init之前
  setWifiHostname(wifi_host_name);
  setMqttClientId(mqtt_client_id);
  //初始化-必须初始化
  initWifiMqtt(wifi_ap_ssid, wifi_ap_password, mqtt_available_topic, mqtt_sub_topics, mqtt_sub_topics_num, mqttCallback);
  //inmp441模块初始化(I2S)
  initAudioIn();
  //max98357A模块初始化(I2S)
  initAudioOut();
  //发送注册信号-服务端会根据id自动识别添加新设备
  String device_id_str = device_id;
  device_id_str = "[" + device_id_str + "]";
  Serial.print("[main] register device id:");
  Serial.println(device_id_str);
  client.publish(mqtt_regisert_topic, const_cast<char*>(device_id_str.c_str()));
}

void loop() {
  //mqtt循环获取值
  mqttLoop();
  //判断进行灯光设置
  if(mqttState){
    digitalWrite(LED3,HIGH);
  }else{
    digitalWrite(LED3,LOW);
  }
  //喇叭循环
  speekerLoop();
  //按下按键发射数据
  if(BtnisPressed() || isRecRemote || isRecRemoteAutoStop){
    //判断是否之前为停止状态，如果是，则表示录制刚开始
    if(isRecord == 0){
      //发送开始信号
      client.publish(mqtt_state_topic, "record start");
      //发射时开灯
      digitalWrite(LED,HIGH);
      //正在录制
      isRecord = 1;
    }
    //暂停现在播放的内容
    if(isPlayAudio){
      stopAudio();
    }
    //读取并发送该数据
    readAndSendData();
    //如果是远程控制的，根据声音大小自动控制结束
    if(isRecRemoteAutoStop && isAutoStopByVoice){
      isRecRemoteAutoStop = 0;
      //自动关闭位关闭
      isAutoStopByVoice = 0;
      Serial.println("[main] auto stop rec by voice");
    }
  }else{
    //判断是否之前为录制状态，如果是，则表示录制刚停止
    if(isRecord == 1){
      //发送结束信号
      client.publish(mqtt_state_topic, "record end");
      //结束时关灯
      digitalWrite(LED,LOW);
      //结束录制标记
      isRecord = 0;
    }
    //正在播放音频-打开灯光
    if(isPlayAudio==1 && isPlayAudioOld==0){
      //打开灯光
      digitalWrite(LED2,HIGH);
      //发送开始播放信号
      client.publish(mqtt_state_topic, "play start");
    }
    //停止播放音频-关闭灯光
    if(isPlayAudio==0 && isPlayAudioOld==1){
      //关闭灯光
      digitalWrite(LED2,LOW);
      //发送停止播放信号
      client.publish(mqtt_state_topic, "play end");
    }
    //将本次的isPlayAudio保存
    isPlayAudioOld = isPlayAudio;
  }
  //获取语音模块的数据并发送
  getVoiceWakeData();
}
