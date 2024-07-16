#include <stdint.h>
#include <Arduino.h>
#include <driver/i2s.h>

//引脚定义
#define INMP441_WS 21
#define INMP441_SCK 19
#define INMP441_SD 18

#define SAMPLE_RATE 16000

#define CHECK(err)   if (err != ESP_OK) {Serial.printf("Failed installing driver: %d\n", err);while (true);}

const i2s_port_t REC_I2S_PORT = I2S_NUM_0;

//读出来的原始32位数据，长度128
int32_t *samples_32bit;
//转换后的16位数据，长度128
int16_t *samples_16bit;
//转换后的8位数据，长度128
uint8_t *samples_8bit ;
//接收后转换的16位数据，长度128
int16_t *recive_16bit;
//发送给扬声器的16位数据，长度256，因为传入数据是双声道所以*2
int16_t *output_16bit;

//发送数据内容
void sendData(const uint8_t  *data, uint16_t len){
  if(MQTT_CONNECTED==client.state()){
    if(false  == client.publish(mqtt_data_topic, data,len,0)){
      Serial.println("sendfailed");
    }
  }else{
    Serial.println("not connect");
  }
}

//mic读取音频配置
const i2s_config_t rec_i2s_config = {
  .mode = i2s_mode_t(I2S_MODE_MASTER | I2S_MODE_RX),
  .sample_rate = SAMPLE_RATE,
  .bits_per_sample = I2S_BITS_PER_SAMPLE_32BIT,
  .channel_format = I2S_CHANNEL_FMT_ONLY_RIGHT,
  .communication_format = i2s_comm_format_t(I2S_COMM_FORMAT_I2S| I2S_COMM_FORMAT_I2S_MSB),
  .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
  .dma_buf_count = 2,
  .dma_buf_len = 256,//单位是bits_per_sample
};

const i2s_pin_config_t rec_pin_config = {
  .bck_io_num = INMP441_SCK,
  .ws_io_num = INMP441_WS,
  .data_out_num = -1,
  .data_in_num = INMP441_SD
};

//i2S初始化
void initAudioIn(){
  samples_32bit = (int32_t *)malloc(sizeof(int32_t) * 128);
  samples_16bit = (int16_t *)malloc(sizeof(int16_t) * 128);
  samples_8bit =  (uint8_t *)malloc(sizeof(uint8_t) * 128);
  recive_16bit =  (int16_t *)malloc(sizeof(int16_t) * 128);
  output_16bit =  (int16_t *)malloc(2*sizeof(int16_t) * 128);

  esp_err_t err;
  err = i2s_driver_install(REC_I2S_PORT, &rec_i2s_config, 0, NULL);
  CHECK(err);
  err = i2s_set_pin(REC_I2S_PORT, &rec_pin_config);
  CHECK(err);
  //初始化完成
  Serial.println("[audioin] inmp411 I2S Init over!");
} 

//保持安静的次数
int silentCount = 0;
int voiceCount = 0;
//自动根据声音停止
bool isAutoStopByVoice = 0;

// read from i2s
int I2Sread(int16_t *samples, int count){
  size_t bytes_read = 0;
  if (count>128){
    count = 128;//最少读取128
  }
  i2s_read(REC_I2S_PORT, (char *)samples_32bit, sizeof(int32_t) * count, &bytes_read, portMAX_DELAY);
  int samples_read = bytes_read / sizeof(int32_t);
  //Serial.println(samples_read);
  //定义捕获的能量值
  float mean = 0;
  for (int i = 0; i < samples_read; i++){
    int32_t temp = samples_32bit[i] >> 11;
    samples[i] = (temp > INT16_MAX) ? INT16_MAX : (temp < -INT16_MAX) ? -INT16_MAX : (int16_t)temp;
    //将采样值相加
    mean += (samples[i]);
  }
  //取数据读数的平均值
  mean /= samples_read;
  // 串口绘图
  //Serial.println(abs(mean));
  //根据经验进行判断是否有声音！-此段代码需要自己调试。
  //Serial.println(silentCount);
  //Serial.println(voiceCount);
  if(abs(mean)<400){
    if(silentCount>100){
      Serial.println("silent");
      //如果从来没有声音，则不停止，直到声音出现
      if(voiceCount == 0){
        Serial.println("never voice");
      }else{
        //停止录制
        isAutoStopByVoice = 1;
        voiceCount = 0;
      }
    }
    silentCount += 1;
  }else if(abs(mean)>400){
    voiceCount += 1;
    silentCount = 0;
    //不自动停止
    isAutoStopByVoice = 0;
    Serial.println("voice");
  }
  return samples_read;
}

//16位数据转成8位
void covert_bit(int16_t *temp_samples_16bit,uint8_t*temp_samples_8bit,uint8_t len ){
  for(uint8_t i=0;i<len;i++){
    temp_samples_8bit[i]=(temp_samples_16bit[i] + 32768) >> 8;
  }
}

//读取并发送数据
void readAndSendData(){
  //读取数据
  int samples_read = I2Sread(samples_16bit,128);
  //发送时转换为8位
  covert_bit(samples_16bit,samples_8bit,samples_read);
  //发射数据
  sendData(samples_8bit,samples_read);
}