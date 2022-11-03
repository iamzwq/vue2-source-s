import { observe } from "./observe/index";

export function initState(vm) {
	const opts = vm.$options;

	// if (opts.props) {}

	if (opts.data) {
		initData(vm);
	}

	// if (opts.computed) {}
}

function initData(vm) {
	let data = vm.$options.data;

	data = typeof data === "function" ? data.call(vm) : data;

	vm._data = data;

	observe(data);

  // 将vm._data用vm来代理
	for (const key in data) {
		proxy(vm, "_data", key);
	}
}

function proxy(vm, target, key) {
	Object.defineProperty(vm, key, { // vm.name
		get() {
			return vm[target][key]; // vm._data.name
		},
		set(newValue) {
			vm[target][key] = newValue;
		},
	});
}
