
  ;(function(){
  let u=void 0,isReady=false,onReadyCallbacks=[],isServiceReady=false,onServiceReadyCallbacks=[];
  const __uniConfig = {"pages":[],"globalStyle":{"backgroundColor":"#F8F8F8","navigationBar":{"backgroundColor":"#F8F8F8","titleText":"uni-app","type":"default","titleColor":"#000000"},"isNVue":false},"nvue":{"compiler":"uni-app","styleCompiler":"uni-app","flex-direction":"column"},"renderer":"auto","appname":"chat-assistant-ui","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":true},"compilerVersion":"4.23","entryPagePath":"pages/index/index","entryPageQuery":"","realEntryPagePath":"","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000},"tabBar":{"position":"bottom","color":"#999999","selectedColor":"#007AFF","borderStyle":"white","blurEffect":"none","fontSize":"10px","iconWidth":"24px","spacing":"3px","height":"50px","backgroundColor":"#ffffff","list":[{"pagePath":"pages/index/index","iconPath":"/static/icon/tabbar/home.png","selectedIconPath":"/static/icon/tabbar/home1.png","text":"控制"},{"pagePath":"pages/set/set","iconPath":"/static/icon/tabbar/set.png","selectedIconPath":"/static/icon/tabbar/set1.png","text":"设置"},{"pagePath":"pages/introduce/introduce","iconPath":"/static/icon/tabbar/about.png","selectedIconPath":"/static/icon/tabbar/about1.png","text":"关于"}],"selectedIndex":0,"shown":true},"locales":{},"darkmode":false,"themeConfig":{}};
  const __uniRoutes = [{"path":"pages/index/index","meta":{"isQuit":true,"isEntry":true,"isTabBar":true,"tabBarIndex":0,"navigationBar":{"titleText":"语音助手控制","type":"default"},"isNVue":false}},{"path":"pages/introduce/introduce","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":2,"navigationBar":{"titleText":"介绍","type":"default"},"isNVue":false}},{"path":"pages/set/set","meta":{"isQuit":true,"isTabBar":true,"tabBarIndex":1,"navigationBar":{"titleText":"设置","type":"default"},"isNVue":false}},{"path":"pages/recoder/recoder","meta":{"navigationBar":{"titleText":"录音","type":"default"},"isNVue":false}},{"path":"pages/regular-answer/regular-answer","meta":{"navigationBar":{"titleText":"固定回复词设置","type":"default"},"isNVue":false}}].map(uniRoute=>(uniRoute.meta.route=uniRoute.path,__uniConfig.pages.push(uniRoute.path),uniRoute.path='/'+uniRoute.path,uniRoute));
  __uniConfig.styles=[];//styles
  __uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  __uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:16})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:u,window:u,document:u,frames:u,self:u,location:u,navigator:u,localStorage:u,history:u,Caches:u,screen:u,alert:u,confirm:u,prompt:u,fetch:u,XMLHttpRequest:u,WebSocket:u,webkit:u,print:u}}}}); 
  })();
  