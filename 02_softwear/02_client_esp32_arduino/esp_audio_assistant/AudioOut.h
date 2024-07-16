#include "Arduino.h"
#include "Audio.h"

// Digital I/O used
#define I2S_DOUT      25
#define I2S_BCLK      27
#define I2S_LRC       26

// Audio audio;
Audio audio(false, 3, I2S_NUM_1);

// 是否正在播放音频
bool isPlayAudio = 0;
// 播放错误次数
int playErrorCount = 0;
// 当前播放的url
char* audioUrl = "";

//播放指定网址的音频
void playAudio(char* url){
  //设置正在播放的音频地址
  audioUrl = url;
  //停止之前放的内容
  audio.stopSong();
  //播放新内容
  audio.connecttohost(url);
}

//停止播放音频
void stopAudio(){
  //停止播放
  audio.stopSong();
  //标定状态
  isPlayAudio = 0;
  Serial.print("[audio] stopped play audio.");
}

//设置音量
void setVolume(int volume){
  //设置音量
  audio.setVolume(volume);
  Serial.print("[audio] set volume: ");
  Serial.println(volume);
}

//初始化喇叭
void initAudioOut(){
  //设置引脚
  audio.setPinout(I2S_BCLK, I2S_LRC, I2S_DOUT);
  //设置默认的音量
  audio.setVolume(21); // 0...21
  //播放欢迎语
  //playAudio("http://gohttp.cyqand.fun/tts.mp3");
  Serial.println("[audioin] max98357 I2S Init over!");
}

//循环喇叭
void speekerLoop(){
  //循环喇叭，进行播放
  audio.loop();
}

//字符是否以什么开头
int starts_with(const char *str, const char *prefix) {
    return strncmp(str, prefix, strlen(prefix)) == 0;
}

// optional
void audio_info(const char *info){
  Serial.print("[audio] info        ");
  Serial.println(info);
  //标记开始播放
  const char* startPrefix = "Connect to new host";
  if(starts_with(info, startPrefix)){
    //设置正在播放标记
    isPlayAudio = 1;
  }
  //标记结束播放
  const char* endPrefix = "End of webstream";
  if(starts_with(info, endPrefix)){
    //停止播放
    isPlayAudio = 0;
    //错误次数归零
    playErrorCount = 0;
  }
}
void audio_id3data(const char *info){  //id3 metadata
  Serial.print("[audio] id3data     ");
  Serial.println(info);
}
void audio_eof_mp3(const char *info){  //end of file
  Serial.print("[audio] eof_mp3     ");
  Serial.println(info);
}
void audio_showstation(const char *info){
  Serial.print("[audio] station     ");
  Serial.println(info);
}
void audio_showstreamtitle(const char *info){
  Serial.print("[audio] streamtitle ");
  Serial.println(info);
}
void audio_bitrate(const char *info){
  Serial.print("[audio] bitrate     ");
  Serial.println(info);
}
void audio_commercial(const char *info){  //duration in sec
  Serial.print("[audio] commercial  ");
  Serial.println(info);
}
void audio_icyurl(const char *info){  //homepage
  Serial.print("[audio] icyurl      ");
  Serial.println(info);
  //无法播放，重新进行连接
  if(playErrorCount<3){
    //失败次数加一
    playErrorCount = playErrorCount + 1;
    Serial.println(playErrorCount);
    //重新播放
    playAudio(audioUrl);
  }else{
    //不再尝试
    playErrorCount = 0;
    //停止播放
    isPlayAudio = 0;
  }
}
void audio_lasthost(const char *info){  //stream URL played
  Serial.print("[audio] lasthost    ");
  Serial.println(info);
}