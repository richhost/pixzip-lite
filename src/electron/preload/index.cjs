const { contextBridge } = require('electron');

const pixzip = {
	os: process.platform
};

contextBridge.exposeInMainWorld('pixzip', pixzip);
