if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const ComponentClass$1 = "uni-col";
  const _sfc_main$8 = {
    name: "uniCol",
    props: {
      span: {
        type: Number,
        default: 24
      },
      offset: {
        type: Number,
        default: -1
      },
      pull: {
        type: Number,
        default: -1
      },
      push: {
        type: Number,
        default: -1
      },
      xs: [Number, Object],
      sm: [Number, Object],
      md: [Number, Object],
      lg: [Number, Object],
      xl: [Number, Object]
    },
    data() {
      return {
        gutter: 0,
        sizeClass: "",
        parentWidth: 0,
        nvueWidth: 0,
        marginLeft: 0,
        right: 0,
        left: 0
      };
    },
    created() {
      let parent = this.$parent;
      while (parent && parent.$options.componentName !== "uniRow") {
        parent = parent.$parent;
      }
      this.updateGutter(parent.gutter);
      parent.$watch("gutter", (gutter) => {
        this.updateGutter(gutter);
      });
    },
    computed: {
      sizeList() {
        let {
          span,
          offset,
          pull,
          push
        } = this;
        return {
          span,
          offset,
          pull,
          push
        };
      },
      pointClassList() {
        let classList = [];
        ["xs", "sm", "md", "lg", "xl"].forEach((point) => {
          const props = this[point];
          if (typeof props === "number") {
            classList.push(`${ComponentClass$1}-${point}-${props}`);
          } else if (typeof props === "object" && props) {
            Object.keys(props).forEach((pointProp) => {
              classList.push(
                pointProp === "span" ? `${ComponentClass$1}-${point}-${props[pointProp]}` : `${ComponentClass$1}-${point}-${pointProp}-${props[pointProp]}`
              );
            });
          }
        });
        return classList.join(" ");
      }
    },
    methods: {
      updateGutter(parentGutter) {
        parentGutter = Number(parentGutter);
        if (!isNaN(parentGutter)) {
          this.gutter = parentGutter / 2;
        }
      }
    },
    watch: {
      sizeList: {
        immediate: true,
        handler(newVal) {
          let classList = [];
          for (let size in newVal) {
            const curSize = newVal[size];
            if ((curSize || curSize === 0) && curSize !== -1) {
              classList.push(
                size === "span" ? `${ComponentClass$1}-${curSize}` : `${ComponentClass$1}-${size}-${curSize}`
              );
            }
          }
          this.sizeClass = classList.join(" ");
        }
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-col", $data.sizeClass, $options.pointClassList]),
        style: vue.normalizeStyle({
          paddingLeft: `${Number($data.gutter)}rpx`,
          paddingRight: `${Number($data.gutter)}rpx`
        })
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-28ff6624"], ["__file", "A:/6_appFile/Hbuilder_Uniapp_Project/chat-assistant-ui/uni_modules/uni-row/components/uni-col/uni-col.vue"]]);
  const ComponentClass = "uni-row";
  const modifierSeparator = "--";
  const _sfc_main$7 = {
    name: "uniRow",
    componentName: "uniRow",
    props: {
      type: String,
      gutter: Number,
      justify: {
        type: String,
        default: "start"
      },
      align: {
        type: String,
        default: "top"
      },
      // nvue如果使用span等属性，需要配置宽度
      width: {
        type: [String, Number],
        default: 750
      }
    },
    created() {
    },
    computed: {
      marginValue() {
        if (this.gutter) {
          return -(this.gutter / 2);
        }
        return 0;
      },
      typeClass() {
        return this.type === "flex" ? `${ComponentClass + modifierSeparator}flex` : "";
      },
      justifyClass() {
        return this.justify !== "start" ? `${ComponentClass + modifierSeparator}flex-justify-${this.justify}` : "";
      },
      alignClass() {
        return this.align !== "top" ? `${ComponentClass + modifierSeparator}flex-align-${this.align}` : "";
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-row", $options.typeClass, $options.justifyClass, $options.alignClass]),
        style: vue.normalizeStyle({
          marginLeft: `${Number($options.marginValue)}rpx`,
          marginRight: `${Number($options.marginValue)}rpx`
        })
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-097353af"], ["__file", "A:/6_appFile/Hbuilder_Uniapp_Project/chat-assistant-ui/uni_modules/uni-row/components/uni-row/uni-row.vue"]]);
  const _sfc_main$6 = {
    name: "UniCard",
    emits: ["click"],
    props: {
      title: {
        type: String,
        default: ""
      },
      subTitle: {
        type: String,
        default: ""
      },
      padding: {
        type: String,
        default: "10px"
      },
      margin: {
        type: String,
        default: "15px"
      },
      spacing: {
        type: String,
        default: "0 10px"
      },
      extra: {
        type: String,
        default: ""
      },
      cover: {
        type: String,
        default: ""
      },
      thumbnail: {
        type: String,
        default: ""
      },
      isFull: {
        // 内容区域是否通栏
        type: Boolean,
        default: false
      },
      isShadow: {
        // 是否开启阴影
        type: Boolean,
        default: true
      },
      shadow: {
        type: String,
        default: "0px 0px 3px 1px rgba(0, 0, 0, 0.08)"
      },
      border: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      onClick(type) {
        this.$emit("click", type);
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-card", { "uni-card--full": $props.isFull, "uni-card--shadow": $props.isShadow, "uni-card--border": $props.border }]),
        style: vue.normalizeStyle({ "margin": $props.isFull ? 0 : $props.margin, "padding": $props.spacing, "box-shadow": $props.isShadow ? $props.shadow : "" })
      },
      [
        vue.createCommentVNode(" 封面 "),
        vue.renderSlot(_ctx.$slots, "cover", {}, () => [
          $props.cover ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "uni-card__cover"
          }, [
            vue.createElementVNode("image", {
              class: "uni-card__cover-image",
              mode: "widthFix",
              onClick: _cache[0] || (_cache[0] = ($event) => $options.onClick("cover")),
              src: $props.cover
            }, null, 8, ["src"])
          ])) : vue.createCommentVNode("v-if", true)
        ], true),
        vue.renderSlot(_ctx.$slots, "title", {}, () => [
          $props.title || $props.extra ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "uni-card__header"
          }, [
            vue.createCommentVNode(" 卡片标题 "),
            vue.createElementVNode("view", {
              class: "uni-card__header-box",
              onClick: _cache[1] || (_cache[1] = ($event) => $options.onClick("title"))
            }, [
              $props.thumbnail ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "uni-card__header-avatar"
              }, [
                vue.createElementVNode("image", {
                  class: "uni-card__header-avatar-image",
                  src: $props.thumbnail,
                  mode: "aspectFit"
                }, null, 8, ["src"])
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("view", { class: "uni-card__header-content" }, [
                vue.createElementVNode(
                  "text",
                  { class: "uni-card__header-content-title uni-ellipsis" },
                  vue.toDisplayString($props.title),
                  1
                  /* TEXT */
                ),
                $props.title && $props.subTitle ? (vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: 0,
                    class: "uni-card__header-content-subtitle uni-ellipsis"
                  },
                  vue.toDisplayString($props.subTitle),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true)
              ])
            ]),
            vue.createElementVNode("view", {
              class: "uni-card__header-extra",
              onClick: _cache[2] || (_cache[2] = ($event) => $options.onClick("extra"))
            }, [
              vue.createElementVNode(
                "text",
                { class: "uni-card__header-extra-text" },
                vue.toDisplayString($props.extra),
                1
                /* TEXT */
              )
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ], true),
        vue.createCommentVNode(" 卡片内容 "),
        vue.createElementVNode(
          "view",
          {
            class: "uni-card__content",
            style: vue.normalizeStyle({ padding: $props.padding }),
            onClick: _cache[3] || (_cache[3] = ($event) => $options.onClick("content"))
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          4
          /* STYLE */
        ),
        vue.createElementVNode("view", {
          class: "uni-card__actions",
          onClick: _cache[4] || (_cache[4] = ($event) => $options.onClick("actions"))
        }, [
          vue.renderSlot(_ctx.$slots, "actions", {}, void 0, true)
        ])
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-ae4bee67"], ["__file", "A:/6_appFile/Hbuilder_Uniapp_Project/chat-assistant-ui/uni_modules/uni-card/components/uni-card/uni-card.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {
        //文字模型对话
        question: "",
        model: "",
        answer: "回答内容",
        //设备id
        deviceIdArray: [],
        selectedIndex: 0,
        //在线的设备
        onlineDeviceId: [],
        onlineShowText: "",
        //读出内容
        sayText: "",
        //播放音频
        playAudioLink: "",
        //文本提问
        questionByText: "",
        exeModel: ""
      };
    },
    onLoad() {
      uni.request({
        url: getApp().globalData.server + "/info",
        success: (res) => {
          formatAppLog("log", "at pages/index/index.vue:107", res.data);
          this.deviceIdArray = res.data.config.devices;
          this.onlineDeviceId = res.data.online;
          if (this.onlineDeviceId.includes(this.deviceIdArray[this.selectedIndex])) {
            this.onlineShowText = "在线";
          } else {
            this.onlineShowText = "下线";
          }
        }
      });
    },
    methods: {
      getModelAnswer() {
        if (this.question.trim() == "" || this.model.trim() == "") {
          uni.showToast({
            title: "输入不能为空",
            duration: 2e3
          });
          return;
        }
        this.answer = "思考中...";
        uni.request({
          url: getApp().globalData.server + "/getAnswer",
          data: {
            question: this.question,
            engine: this.model
          },
          success: (res) => {
            formatAppLog("log", "at pages/index/index.vue:139", res.data);
            this.answer = res.data;
          }
        });
      },
      bindPickerChange(e) {
        this.selectedIndex = e.detail.value;
      },
      sayContent() {
        if (this.sayText.trim() == "") {
          uni.showToast({
            title: "输入不能为空",
            duration: 2e3
          });
          return;
        }
        uni.request({
          url: getApp().globalData.server + "/say",
          data: {
            clientId: this.deviceIdArray[this.selectedIndex],
            content: this.sayText
          },
          success: (res) => {
            formatAppLog("log", "at pages/index/index.vue:165", res.data);
          }
        });
      },
      playAudio() {
        if (this.playAudioLink.trim() == "") {
          uni.showToast({
            title: "输入不能为空",
            duration: 2e3
          });
          return;
        }
        uni.request({
          url: getApp().globalData.server + "/playAudio",
          data: {
            clientId: this.deviceIdArray[this.selectedIndex],
            link: this.playAudioLink
          },
          success: (res) => {
            formatAppLog("log", "at pages/index/index.vue:186", res.data);
          }
        });
      },
      textAsk() {
        if (this.questionByText.trim() == "" || this.exeModel.trim() == "") {
          uni.showToast({
            title: "输入不能为空",
            duration: 2e3
          });
          return;
        }
        uni.request({
          url: getApp().globalData.server + "/executeText",
          data: {
            clientId: this.deviceIdArray[this.selectedIndex],
            text: this.questionByText,
            engine: this.exeModel
          },
          success: (res) => {
            formatAppLog("log", "at pages/index/index.vue:208", res.data);
          }
        });
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_col = resolveEasycom(vue.resolveDynamicComponent("uni-col"), __easycom_1);
    const _component_uni_row = resolveEasycom(vue.resolveDynamicComponent("uni-row"), __easycom_2);
    const _component_uni_card = resolveEasycom(vue.resolveDynamicComponent("uni-card"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createVNode(_component_uni_card, { title: "文字对话模型" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "section-input",
                placeholder: "输入问题",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.question = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.question]
            ])
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createVNode(_component_uni_row, null, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-left" }, [
                      vue.withDirectives(vue.createElementVNode(
                        "input",
                        {
                          class: "section-input",
                          placeholder: "模型选择",
                          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.model = $event)
                        },
                        null,
                        512
                        /* NEED_PATCH */
                      ), [
                        [vue.vModelText, $data.model]
                      ])
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-right" }, [
                      vue.createElementVNode("button", {
                        type: "primary",
                        onClick: _cache[2] || (_cache[2] = (...args) => $options.getModelAnswer && $options.getModelAnswer(...args))
                      }, "获取回答")
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                })
              ]),
              _: 1
              /* STABLE */
            })
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createElementVNode(
              "textarea",
              { class: "section-textarea" },
              vue.toDisplayString($data.answer),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode(_component_uni_card, {
        title: "设备id",
        extra: $data.onlineShowText
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createVNode(_component_uni_row, null, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-left" }, " 请选择控制的设备id ")
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-right" }, [
                      vue.createElementVNode("picker", {
                        onChange: _cache[3] || (_cache[3] = (...args) => $options.bindPickerChange && $options.bindPickerChange(...args)),
                        value: $data.selectedIndex,
                        range: $data.deviceIdArray
                      }, [
                        vue.createElementVNode(
                          "view",
                          { class: "section-picker" },
                          vue.toDisplayString($data.deviceIdArray[$data.selectedIndex]),
                          1
                          /* TEXT */
                        )
                      ], 40, ["value", "range"])
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                })
              ]),
              _: 1
              /* STABLE */
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["extra"]),
      vue.createVNode(_component_uni_card, { title: "读出内容" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "section-input",
                placeholder: "请输入要读出的内容",
                "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.sayText = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.sayText]
            ])
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createElementVNode("button", {
              type: "primary",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.sayContent && $options.sayContent(...args))
            }, "读出内容")
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode(_component_uni_card, { title: "播放音频" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "section-input",
                placeholder: "请输入要播放的mp3网址链接",
                "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $data.playAudioLink = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.playAudioLink]
            ])
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createElementVNode("button", {
              type: "primary",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.playAudio && $options.playAudio(...args))
            }, "播放音频")
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode(_component_uni_card, { title: "文本提问" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "section-input",
                placeholder: "请输入要语音回答的问题",
                "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $data.questionByText = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.questionByText]
            ])
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "section-input",
                placeholder: "模型选择",
                "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.exeModel = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.exeModel]
            ])
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createElementVNode("button", {
              type: "primary",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.textAsk && $options.textAsk(...args))
            }, "文本提问")
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createElementVNode("view", { class: "gap" })
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "A:/6_appFile/Hbuilder_Uniapp_Project/chat-assistant-ui/pages/index/index.vue"]]);
  const _sfc_main$4 = {
    components: {},
    data() {
      return {
        cover: "/static/about/esp-voice-assistant.png"
      };
    },
    methods: {
      onClick() {
        formatAppLog("log", "at pages/introduce/introduce.vue:71", 111);
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_card = resolveEasycom(vue.resolveDynamicComponent("uni-card"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode(_component_uni_card, { cover: $data.cover }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", null, " 一、引言： "),
          vue.createElementVNode("view", null, [
            vue.createElementVNode("text", { class: "uni-h6" }, " 本项目是以esp32为基础做成的一个语音助手项目。可以实现类似于智能音箱的功能。 系统主要分为以下几个部分：服务端、前端、客户端硬件、客户端代码。 本软件可以对客户端设备进行远程任意控制。希望大家一起学习进步，祝您玩的开心。 ")
          ]),
          vue.createElementVNode("view", null, " 二、已实现功能： "),
          vue.createElementVNode("view", null, ' 1、固定录制几秒的功能-以提供接口-mqtt发送rec开始录音,发送end结束录音 2、唤醒词设置及离线语音模块的设置-可以直达的语音命令不在单独设置到esp32语音模块内部 3、多国家语言支持-与接入模型相关 4、音色修改-与接入tts相关 5、远程录制功能并进行保存 6、文字对话api-可以集成多个api进行开放 7、读出固定文字内容/播放mp3文件内容(不是mp3的转码成mp3) 8、将各个指令单独做成一个api接口 9、执行对话命令功能-输入一段话，语音对于这段话直接进行回答 10、将各个状态及功能做成homeassistant的实体可以进行远程控制(参考小爱同学-播放音乐、获取实时的聊天内容、按键唤醒、调整音量、播放和暂停)-解决方法-使用nodered通过提供的api实现 11、重写tts模块-接入各种tts模块-并提供接口以供外部调用 12、给设备添加几个指示灯进行状态的区分(wifi状态、录音状态、播放状态等) 13、更改名称为聊天助手/对话助手 14、更改mqtt主题,避免使用"-"(nodered中监听异常) 15、写一个前端ui控制设备 16、前端ui添加服务器网址设置功能 17、server代码日志优化 18、把所有信息统一封装到info接口 19、添加各个大模型选择接口 20、选择与语音读出音色 21、录音客户端查看及播放 22、多设备支持-服务器应对多个不同设备的请求给出不同回应-使用mqtt的不同topic进行区别。 23、音色选择后播放展示 '),
          vue.createCommentVNode(` <view slot="actions" class="card-actions">\r
				<view class="card-actions-item" @click="actionsClick('分享')">\r
					<uni-icons type="paperplane" size="18" color="#999"></uni-icons>\r
					<text class="card-actions-item-text">分享</text>\r
				</view>\r
				<view class="card-actions-item" @click="actionsClick('点赞')">\r
					<uni-icons type="heart" size="18" color="#999"></uni-icons>\r
					<text class="card-actions-item-text">点赞</text>\r
				</view>\r
				<view class="card-actions-item" @click="actionsClick('评论')">\r
					<uni-icons type="chatbubble" size="18" color="#999"></uni-icons>\r
					<text class="card-actions-item-text">评论</text>\r
				</view>\r
			</view> `)
        ]),
        _: 1
        /* STABLE */
      }, 8, ["cover"]),
      vue.createElementVNode("view", { class: "gap" })
    ]);
  }
  const PagesIntroduceIntroduce = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "A:/6_appFile/Hbuilder_Uniapp_Project/chat-assistant-ui/pages/introduce/introduce.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        //服务器网址
        defaultServer: "",
        serverUrl: "",
        //设备id数组
        deviceIdArray: [],
        selectedIndex: 0,
        //整点报时显示字符串
        timeKipperDevices: [],
        timeKipperState: false,
        //当前音量
        volValue: 21,
        //音色展示读出的内容
        voiceShowContent: "你好，我是你的智能小助理",
        //语音生成音色选择
        ttsVoiceArray: [],
        ttsVoiceSelect: 0,
        //语音识别模型
        sttModelArray: [],
        sttModelSelect: 0,
        //对话模型
        chatModelArray: [],
        chatModelSelect: 0,
        //语音生成模型
        ttsModelArray: [],
        ttsModelSelect: 0
      };
    },
    onLoad() {
      this.defaultServer = getApp().globalData.server;
      uni.request({
        url: getApp().globalData.server + "/info",
        success: (res) => {
          formatAppLog("log", "at pages/set/set.vue:174", res.data);
          this.ttsVoiceArray = res.data.config.tts.edge_voices;
          this.ttsVoiceSelect = res.data.config.tts.edge_voices_select;
          this.deviceIdArray = res.data.config.devices;
          this.sttModelArray = res.data.config.stt.engines;
          this.sttModelSelect = res.data.config.stt.select;
          this.chatModelArray = res.data.config.chat.engines;
          this.chatModelSelect = res.data.config.chat.select;
          this.ttsModelArray = res.data.config.tts.engines;
          this.ttsModelSelect = res.data.config.tts.select;
          this.timeKipperDevices = res.data.config.time_kipper.devices;
          if (this.timeKipperDevices.indexOf(this.deviceIdArray[this.selectedIndex]) != -1) {
            this.timeKipperState = true;
          }
        }
      });
    },
    methods: {
      setServer() {
        getApp().globalData.server = this.serverUrl;
        uni.setStorageSync("server", this.serverUrl);
      },
      deviceIdChange(e) {
        this.selectedIndex = e.detail.value;
      },
      wakeAssistant() {
        uni.request({
          url: getApp().globalData.server + "/awaken",
          data: {
            clientId: this.deviceIdArray[this.selectedIndex]
          },
          success: (res) => {
            formatAppLog("log", "at pages/set/set.vue:212", res.data);
          }
        });
      },
      stopPlay() {
        uni.request({
          url: getApp().globalData.server + "/stop",
          data: {
            clientId: this.deviceIdArray[this.selectedIndex]
          },
          success: (res) => {
            formatAppLog("log", "at pages/set/set.vue:224", res.data);
          }
        });
      },
      resetWeb() {
        uni.request({
          url: getApp().globalData.server + "/reset",
          data: {
            clientId: this.deviceIdArray[this.selectedIndex]
          },
          success: (res) => {
            formatAppLog("log", "at pages/set/set.vue:236", res.data);
          }
        });
      },
      viewRec() {
        uni.navigateTo({
          url: "/pages/recoder/recoder"
        });
      },
      setRegularAnswer() {
        uni.navigateTo({
          url: "/pages/regular-answer/regular-answer"
        });
      },
      toggleTimeKipper() {
        if (this.timeKipperState) {
          uni.request({
            url: getApp().globalData.server + "/time/kipper/close",
            data: {
              clientId: this.deviceIdArray[this.selectedIndex]
            },
            success: (res) => {
              formatAppLog("log", "at pages/set/set.vue:262", res.data);
              this.timeKipperState = false;
            }
          });
        } else {
          uni.request({
            url: getApp().globalData.server + "/time/kipper/open",
            data: {
              clientId: this.deviceIdArray[this.selectedIndex]
            },
            success: (res) => {
              formatAppLog("log", "at pages/set/set.vue:274", res.data);
              this.timeKipperState = true;
            }
          });
        }
      },
      startOnlyRec() {
        uni.request({
          url: getApp().globalData.server + "/recOnlyStart",
          data: {
            clientId: this.deviceIdArray[this.selectedIndex]
          },
          success: (res) => {
            formatAppLog("log", "at pages/set/set.vue:288", res.data);
          }
        });
      },
      endOnlyRec() {
        uni.request({
          url: getApp().globalData.server + "/recOnlyEnd",
          data: {
            clientId: this.deviceIdArray[this.selectedIndex]
          },
          success: (res) => {
            formatAppLog("log", "at pages/set/set.vue:300", res.data);
          }
        });
      },
      sliderChange(e) {
        formatAppLog("log", "at pages/set/set.vue:306", e);
        uni.request({
          url: getApp().globalData.server + "/vol",
          data: {
            clientId: this.deviceIdArray[this.selectedIndex],
            vol: e.detail.value
          },
          success: (res) => {
            formatAppLog("log", "at pages/set/set.vue:314", res.data);
          }
        });
      },
      ttsVoiceChange(e) {
        this.ttsVoiceSelect = e.detail.value;
        uni.request({
          url: getApp().globalData.server + "/select/tts/voice",
          data: {
            index: this.ttsVoiceSelect
          },
          success: (res) => {
            formatAppLog("log", "at pages/set/set.vue:328", res.data);
          }
        });
        var that = this;
        uni.request({
          url: getApp().globalData.server + "/tts/link",
          data: {
            content: this.voiceShowContent,
            voice: this.ttsVoiceArray[this.ttsVoiceSelect]
          },
          success: (res) => {
            formatAppLog("log", "at pages/set/set.vue:340", res.data);
            const backgroundAudioManager = uni.getBackgroundAudioManager();
            backgroundAudioManager.src = that.defaultServer + res.data;
          }
        });
      },
      sttModelChange(e) {
        this.sttModelSelect = e.detail.value;
        uni.request({
          url: getApp().globalData.server + "/select/stt/engine",
          data: {
            index: this.sttModelSelect
          },
          success: (res) => {
            formatAppLog("log", "at pages/set/set.vue:358", res.data);
          }
        });
      },
      chatModelChange(e) {
        this.chatModelSelect = e.detail.value;
        uni.request({
          url: getApp().globalData.server + "/select/chat/engine",
          data: {
            index: this.chatModelSelect
          },
          success: (res) => {
            formatAppLog("log", "at pages/set/set.vue:372", res.data);
          }
        });
      },
      ttsModelChange(e) {
        this.ttsModelSelect = e.detail.value;
        uni.request({
          url: getApp().globalData.server + "/select/tts/engine",
          data: {
            index: this.ttsModelSelect
          },
          success: (res) => {
            formatAppLog("log", "at pages/set/set.vue:386", res.data);
          }
        });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_card = resolveEasycom(vue.resolveDynamicComponent("uni-card"), __easycom_0);
    const _component_uni_col = resolveEasycom(vue.resolveDynamicComponent("uni-col"), __easycom_1);
    const _component_uni_row = resolveEasycom(vue.resolveDynamicComponent("uni-row"), __easycom_2);
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createVNode(_component_uni_card, { title: "服务器网址设置" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.withDirectives(vue.createElementVNode("input", {
              class: "section-input",
              placeholder: $data.defaultServer,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.serverUrl = $event)
            }, null, 8, ["placeholder"]), [
              [vue.vModelText, $data.serverUrl]
            ])
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createElementVNode("button", {
              type: "primary",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.setServer && $options.setServer(...args))
            }, "设置网址")
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode(_component_uni_card, { title: "当前设备id" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createVNode(_component_uni_row, null, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-left" }, " 请选择控制的设备id ")
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-right" }, [
                      vue.createElementVNode("picker", {
                        onChange: _cache[2] || (_cache[2] = (...args) => $options.deviceIdChange && $options.deviceIdChange(...args)),
                        value: $data.selectedIndex,
                        range: $data.deviceIdArray
                      }, [
                        vue.createElementVNode(
                          "view",
                          { class: "section-picker" },
                          vue.toDisplayString($data.deviceIdArray[$data.selectedIndex]),
                          1
                          /* TEXT */
                        )
                      ], 40, ["value", "range"])
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                })
              ]),
              _: 1
              /* STABLE */
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode(_component_uni_card, { title: "设置" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createVNode(_component_uni_row, null, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-left" }, [
                      vue.createElementVNode("button", {
                        type: "primary",
                        onClick: _cache[3] || (_cache[3] = (...args) => $options.wakeAssistant && $options.wakeAssistant(...args))
                      }, "唤醒助手")
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-right" }, [
                      vue.createElementVNode("button", {
                        type: "primary",
                        onClick: _cache[4] || (_cache[4] = (...args) => $options.stopPlay && $options.stopPlay(...args))
                      }, "暂停播放")
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                })
              ]),
              _: 1
              /* STABLE */
            })
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createVNode(_component_uni_row, null, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-left" }, [
                      vue.createElementVNode("button", {
                        type: "primary",
                        onClick: _cache[5] || (_cache[5] = (...args) => $options.resetWeb && $options.resetWeb(...args))
                      }, "重置网络")
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-right" }, [
                      vue.createElementVNode("button", {
                        type: "primary",
                        onClick: _cache[6] || (_cache[6] = (...args) => $options.viewRec && $options.viewRec(...args))
                      }, "查看录音")
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                })
              ]),
              _: 1
              /* STABLE */
            })
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createVNode(_component_uni_row, null, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-left" }, [
                      vue.createElementVNode("button", {
                        type: "primary",
                        onClick: _cache[7] || (_cache[7] = (...args) => $options.setRegularAnswer && $options.setRegularAnswer(...args))
                      }, "回复设置")
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                }),
                vue.createVNode(_component_uni_col, { span: 12 }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("view", { class: "section-left" }, [
                      vue.createElementVNode(
                        "button",
                        {
                          type: "primary",
                          onClick: _cache[8] || (_cache[8] = (...args) => $options.toggleTimeKipper && $options.toggleTimeKipper(...args))
                        },
                        vue.toDisplayString($data.timeKipperState ? "关闭" : "打开") + "报时",
                        1
                        /* TEXT */
                      )
                    ])
                  ]),
                  _: 1
                  /* STABLE */
                })
              ]),
              _: 1
              /* STABLE */
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode(_component_uni_card, { title: "静默录音" }, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_uni_row, { class: "section-content line" }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_uni_col, { span: 12 }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", { class: "section-left" }, [
                    vue.createElementVNode("button", {
                      type: "primary",
                      onClick: _cache[9] || (_cache[9] = (...args) => $options.startOnlyRec && $options.startOnlyRec(...args))
                    }, "开始录音")
                  ])
                ]),
                _: 1
                /* STABLE */
              }),
              vue.createVNode(_component_uni_col, { span: 12 }, {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", { class: "section-right" }, [
                    vue.createElementVNode("button", {
                      type: "primary",
                      onClick: _cache[10] || (_cache[10] = (...args) => $options.endOnlyRec && $options.endOnlyRec(...args))
                    }, "结束录音")
                  ])
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode(_component_uni_card, { title: "音量设置" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line section-slider" }, [
            vue.createElementVNode("slider", {
              min: "0",
              max: "21",
              value: $data.volValue,
              onChange: _cache[11] || (_cache[11] = (...args) => $options.sliderChange && $options.sliderChange(...args)),
              step: "1",
              "show-value": ""
            }, null, 40, ["value"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode(_component_uni_card, { title: "音色设置" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createElementVNode("picker", {
              onChange: _cache[12] || (_cache[12] = (...args) => $options.ttsVoiceChange && $options.ttsVoiceChange(...args)),
              value: $data.ttsVoiceSelect,
              range: $data.ttsVoiceArray
            }, [
              vue.createElementVNode(
                "view",
                { class: "section-picker" },
                vue.toDisplayString($data.ttsVoiceArray[$data.ttsVoiceSelect]),
                1
                /* TEXT */
              )
            ], 40, ["value", "range"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      vue.createVNode(_component_uni_card, { title: "模型选择" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line" }, " 语音识别模型 "),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createElementVNode("picker", {
              onChange: _cache[13] || (_cache[13] = (...args) => $options.sttModelChange && $options.sttModelChange(...args)),
              value: $data.sttModelSelect,
              range: $data.sttModelArray
            }, [
              vue.createElementVNode(
                "view",
                { class: "section-picker" },
                vue.toDisplayString($data.sttModelArray[$data.sttModelSelect]),
                1
                /* TEXT */
              )
            ], 40, ["value", "range"])
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, " 对话模型 "),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createElementVNode("picker", {
              onChange: _cache[14] || (_cache[14] = (...args) => $options.chatModelChange && $options.chatModelChange(...args)),
              value: $data.chatModelSelect,
              range: $data.chatModelArray
            }, [
              vue.createElementVNode(
                "view",
                { class: "section-picker" },
                vue.toDisplayString($data.chatModelArray[$data.chatModelSelect]),
                1
                /* TEXT */
              )
            ], 40, ["value", "range"])
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, " 语音生成模型 "),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createElementVNode("picker", {
              onChange: _cache[15] || (_cache[15] = (...args) => $options.ttsModelChange && $options.ttsModelChange(...args)),
              value: $data.ttsModelSelect,
              range: $data.ttsModelArray
            }, [
              vue.createElementVNode(
                "view",
                { class: "section-picker" },
                vue.toDisplayString($data.ttsModelArray[$data.ttsModelSelect]),
                1
                /* TEXT */
              )
            ], 40, ["value", "range"])
          ])
        ]),
        _: 1
        /* STABLE */
      })
    ]);
  }
  const PagesSetSet = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "A:/6_appFile/Hbuilder_Uniapp_Project/chat-assistant-ui/pages/set/set.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        recFiles: [],
        serverUrl: ""
      };
    },
    onLoad() {
      this.serverUrl = getApp().globalData.server;
    },
    onShow() {
      uni.request({
        url: getApp().globalData.server + "/file/rec",
        success: (res) => {
          formatAppLog("log", "at pages/recoder/recoder.vue:30", res.data);
          this.recFiles = res.data;
        }
      });
    },
    methods: {}
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_card = resolveEasycom(vue.resolveDynamicComponent("uni-card"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.recFiles, (item) => {
          return vue.openBlock(), vue.createElementBlock("view", { key: "item" }, [
            vue.createVNode(_component_uni_card, {
              title: item,
              thumbnail: "static/recoder/player.png"
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode("view", { style: { "text-align": "center" } }, [
                  vue.createElementVNode("audio", {
                    src: $data.serverUrl + "/static/recoder/" + item,
                    controls: ""
                  }, null, 8, ["src"])
                ])
              ]),
              _: 2
              /* DYNAMIC */
            }, 1032, ["title"])
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const PagesRecoderRecoder = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "A:/6_appFile/Hbuilder_Uniapp_Project/chat-assistant-ui/pages/recoder/recoder.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        //添加
        addQuestion: "",
        addAnswer: "",
        //固定回复词对
        regularAnswers: []
      };
    },
    onLoad() {
      this.refreshPageData();
    },
    methods: {
      refreshPageData() {
        uni.request({
          url: getApp().globalData.server + "/info",
          success: (res) => {
            formatAppLog("log", "at pages/regular-answer/regular-answer.vue:56", res.data);
            this.regularAnswers = res.data.config.chat.regular_answers;
          }
        });
      },
      addRegularAnswer() {
        if (this.addQuestion.trim() == "" || this.addAnswer.trim() == "") {
          uni.showToast({
            title: "输入不能为空",
            duration: 2e3
          });
          return;
        }
        uni.request({
          url: getApp().globalData.server + "/regular/answer/add",
          data: {
            question: this.addQuestion,
            answer: this.addAnswer
          },
          success: (res) => {
            formatAppLog("log", "at pages/regular-answer/regular-answer.vue:78", res.data);
            uni.showToast({
              title: res.data,
              duration: 2e3
            });
            this.refreshPageData();
          }
        });
      },
      removeRegularAnswer(question) {
        uni.request({
          url: getApp().globalData.server + "/regular/answer/remove",
          data: {
            question
          },
          success: (res) => {
            formatAppLog("log", "at pages/regular-answer/regular-answer.vue:96", res.data);
            uni.showToast({
              title: res.data,
              duration: 2e3
            });
            this.refreshPageData();
          }
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_card = resolveEasycom(vue.resolveDynamicComponent("uni-card"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createVNode(_component_uni_card, { title: "添加固定回复词" }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "section-content line" }, " 问题： "),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "section-input",
                placeholder: "请输入问题",
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.addQuestion = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.addQuestion]
            ])
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, " 回答： "),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                class: "section-input",
                placeholder: "请输入回答内容",
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.addAnswer = $event)
              },
              null,
              512
              /* NEED_PATCH */
            ), [
              [vue.vModelText, $data.addAnswer]
            ])
          ]),
          vue.createElementVNode("view", { class: "section-content line" }, [
            vue.createElementVNode("button", {
              type: "primary",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.addRegularAnswer && $options.addRegularAnswer(...args))
            }, "添加")
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.regularAnswers, (item) => {
          return vue.openBlock(), vue.createElementBlock("view", { key: "item" }, [
            vue.createVNode(
              _component_uni_card,
              { title: "回复词" },
              {
                default: vue.withCtx(() => [
                  vue.createElementVNode(
                    "view",
                    { class: "section-content line" },
                    " 问题：" + vue.toDisplayString(item.question),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "section-content line" },
                    " 回答：" + vue.toDisplayString(item.answer),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", {
                    class: "section-content line",
                    style: { "text-align": "right" }
                  }, [
                    vue.createElementVNode("button", {
                      type: "warn",
                      size: "mini",
                      onClick: ($event) => $options.removeRegularAnswer(item.question)
                    }, "删除", 8, ["onClick"])
                  ])
                ]),
                _: 2
                /* DYNAMIC */
              },
              1024
              /* DYNAMIC_SLOTS */
            )
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const PagesRegularAnswerRegularAnswer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "A:/6_appFile/Hbuilder_Uniapp_Project/chat-assistant-ui/pages/regular-answer/regular-answer.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/introduce/introduce", PagesIntroduceIntroduce);
  __definePage("pages/set/set", PagesSetSet);
  __definePage("pages/recoder/recoder", PagesRecoderRecoder);
  __definePage("pages/regular-answer/regular-answer", PagesRegularAnswerRegularAnswer);
  const _sfc_main = {
    globalData: {
      server: "http://10.168.0.20:5000"
    },
    onLaunch: function() {
      formatAppLog("log", "at App.vue:7", "App Launch");
      try {
        const value = uni.getStorageSync("server");
        if (value) {
          getApp().globalData.server = value;
        }
      } catch (e) {
        uni.setStorageSync("server", getApp().globalData.server);
      }
      formatAppLog("log", "at App.vue:18", uni.getStorageSync("server"));
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:21", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:24", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "A:/6_appFile/Hbuilder_Uniapp_Project/chat-assistant-ui/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
