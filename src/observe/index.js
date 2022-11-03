import { newArrayProto } from "./array";

class Observe {
	constructor(data) {
		// 这里添加属性 '__ob__' 带来的好处有两个
		// 1、是为了把Observe的实例的原型方法放到数据上，这样./array.js里面重写的数组方法中新增的数据劫持可以能调用obseveArray方法
		// 2、可以作为判断对象是否被劫持过
		// data.__ob__ = this; // 这么写会造成死循环，因为如果data是对象的话会新增一个—__ob__属性，在下面的defineReactive中会造成死循环，所以可以将这个属性设置为不可枚举，如下写法：
		Object.defineProperty(data, "__ob__", {
			value: this,
			enumerable: false,
		});

		if (Array.isArray(data)) {
			data.__proto__ = newArrayProto; // 需要保留数组的特性，并且可以重写部分方法
			this.observeArray(data); // 如果数组中存在对象，需劫持
		} else {
			this.walk(data);
		}
	}

	walk(data) {
		Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
	}

	observeArray(data) {
		data.forEach(item => observe(item));
	}
}

export function defineReactive(target, key, value) {
	// 如果value是对象，递归劫持
	observe(value);

	// "重新定义"属性 比较耗性能
	Object.defineProperty(target, key, {
		get() {
			return value;
		},
		set(newValue) {
			if (newValue === value) return;

			observe(newValue); // 设置值的时候如果是对象也进行递归劫持

			value = newValue;
		},
	});
}

export function observe(data) {
	if (typeof data !== "object" || data === null) return;

	// 判断是否已经被劫持过
	if (data.__ob__ instanceof Observe) {
		return data.__ob__;
	}

	// 只对没有被劫持的对象做劫持
	return new Observe(data);
}
