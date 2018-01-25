import WebGL2 from "./webgl2.js";

var TEXTURE_LOCATION = 0;

export default class Texture {
	constructor( context, source ){

		this.context = context;

		this.source = source;

		this.location = WebGL2.TEXTURE0 + TEXTURE_LOCATION;

		this.context.activeTexture(this.location);

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
	getParameter( parameter ){

		return this.context.getParameter(parameter);

	}
	delete(){

		this.context.deleteTexture(this.instance);

		return this;

	}
}