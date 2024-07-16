//按键定义
#define BTN 16

//led定义
#define LED 32
#define LED2 33
#define LED3 14

//设备id-请用4位随机小写字母的组合
String device_id = "ojun";

//wifi配置
//主机配置时的ap设置
String wifi_ap_ssid_str = "esp-voice-assistant-"+device_id;
char* wifi_ap_ssid = const_cast<char*>(wifi_ap_ssid_str.c_str());
char* wifi_ap_password = "12345678";
//主机名字-与ap同名
char* wifi_host_name = wifi_ap_ssid;

//mqtt配置
//mqtt的客户端id-与ap同名
char* mqtt_client_id = wifi_ap_ssid;
//统一注册的topic
char* mqtt_regisert_topic = "voice/assistant/register";
//客户端topic前面共同部分
String command_topic_suffix = "voice/assistant/"+device_id+"/";
//音频数据信号发送topic
String mqtt_data_topic_str = command_topic_suffix+"data";
char* mqtt_data_topic = const_cast<char*>(mqtt_data_topic_str.c_str());
//设备状态上报topic
String mqtt_state_topic_str = command_topic_suffix+"state";
char* mqtt_state_topic = const_cast<char*>(mqtt_state_topic_str.c_str());
//设备上下线上报topic
String mqtt_available_topic_str = command_topic_suffix+"available";
char* mqtt_available_topic = const_cast<char*>(mqtt_available_topic_str.c_str());
//设置需要订阅的topic-set为服务端向下发送的控制指令
String mqtt_sub_topics[] = {
  command_topic_suffix+"set"
};
//设置订阅的数量-根据mqtt_sub_topics中填写的数量进行更改（如果数量不对会引发无线重启）
int mqtt_sub_topics_num = 1;

//设备实时状态定义
//是否远程录音
bool isRecRemote = 0;
//是否远程录音并自动关闭
bool isRecRemoteAutoStop = 0;
//是否在录音
bool isRecord = 0;
//上一个循环的是否播放变量状态  
bool isPlayAudioOld = 0;
