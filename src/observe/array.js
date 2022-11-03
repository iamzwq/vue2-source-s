// 重写数组的部分方法
const oldArrayProto = Array.prototype;

// newArrayProto.__proto__ = oldArrayProto
export const newArrayProto = Object.create(oldArrayProto);

const methods = [
	// 可以改变原数组的方法
	"push",
	"pop",
	"shift",
	"unshift",
	"reverse",
	"sort",
	"slpice",
];

methods.forEach(method => {
	newArrayProto[method] = function (...args) {
		const result = oldArrayProto[method].call(this, ...args);

    const ob = this.__ob__;

		// 对数组新增的值进行劫持
		let inserted;
		switch (method) {
			case "push":
			case "unshift":
				inserted = args;
				break;
			case "splice": // arr.splice(index, howmany, {a: 1}, {a: 1})
				inserted = args.slice(2);
				break;
			default:
				break;
		}

    if (inserted) { // 如果存在新增值，进行劫持
      ob.observeArray(inserted)
    }

    return result
	};
});
