//串口通讯
#include <SoftwareSerial.h>

// 定义语音模块的串行通信引脚和速率  
#define RX_PIN 4 // 假设语音模块的RX连接到ESP的4号引脚  
#define TX_PIN 5 // 假设语音模块的TX连接到ESP的5号引脚  
#define BAUD 115200 // 假设语音模块使用115200波特率  

// 初始化软件串行通信 
SoftwareSerial voiceWakeSerial(RX_PIN, TX_PIN);

//初始化
void initVoiceWakeSerial(){
  //打开串口
  voiceWakeSerial.begin(BAUD);
}

//循环获取语音模块的串口数据
void getVoiceWakeData(){
  //获取v20的串口内容--从语音模块读取响应数据
  if (voiceWakeSerial.available()>=1) {
    //接收语音模块数据
    int read1 = voiceWakeSerial.read();
    int read2 = voiceWakeSerial.read();
    Serial.print("收到内容：");
    Serial.print(read1);
    Serial.print(" ");
    Serial.print(read2);
    Serial.println();
    //判断
    char result[5] = "";
    itoa(read1, result, 10);
    //打印
    Serial.println("命令代码: ");
    Serial.println(result);
    //发送mqtt
    client.publish(mqtt_state_topic, result);
    //收到语音唤醒打开录音
    if(read1 == 1){
      isRecRemoteAutoStop = 1;
    }
  }
}