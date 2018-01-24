import WebGL2 from "./webgl2.js";

var TEXTURE_LOCATION = 0;

export default class Texture {
	constructor( context, image ){

		this.context = context;

		this.source = image;

		this.location = TEXTURE_LOCATION;

		this.context.activeTexture(WebGL2.TEXTURE0 + TEXTURE_LOCATION);

		TEXTURE_LOCATION++;

		this.instance = this.context.createTexture();

		this.update();

		return this;

	}
	bind(){

		this.context.bindTexture(WebGL2.TEXTURE_2D, this.instance);

		return this;

	}
	update(){

		this.bind();

		this.context.texImage2D(WebGL2.TEXTURE_2D, 0, WebGL2.RGB, this.source.width, this.source.height, 0, WebGL2.RGB, WebGL2.UNSIGNED_BYTE, this.source);

		this.context.generateMipmap(WebGL2.TEXTURE_2D);

		return this;

	}
	setParameter( parameter, value ){

		this.bind();

		this.context.texParameteri(WebGL2.TEXTURE_2D, parameter, value);

		return this;

	}
	setPixelStorageParameter( name, value ){

		this.bind();

		this.context.pixelStorei(name, value);

		return this;

	}
	getParameter( name ){

		return this.context.getParameter(name);

	}
	delete(){

		this.context.deleteTexture(this.instance);

		return this;

	}
}