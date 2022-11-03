import { initMixin } from "./init";

// 声明Vue构造函数
function Vue(options) {
  // 这里调用的实例方法都在下面扩展来的
	this._init(options);
}

// 扩展Vue的原型方法
initMixin(Vue); // 扩展初始化方法

export default Vue;
