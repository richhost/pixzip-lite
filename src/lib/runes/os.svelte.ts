class OS {
	os: NodeJS.Platform;

	constructor() {
		this.os = window.pixzip.os;
	}
}

export default new OS();
