import WebGL2 from "./webgl2.js";

export default class Program {
	constructor( context ){

		this.context = context;

		this.instance = context.createProgram();

		this.shader = null;

		this.drawLength = null;

		this.drawSize = null;
	
		return this;

	}
	enable( ...modes ){

		for( let mode of modes ){

			this.context.enable(mode);

		}

		return this;

	}
	attachShader( shader ){

		this.shader = shader;

		this.context.attachShader(this.instance, shader.vertex);

		this.context.attachShader(this.instance, shader.fragment);

		return this;

	}
	detachShader(){

		this.context.detachShader(this.instance, this.shader.vertex);

		this.context.detachShader(this.instance, this.shader.fragment);

		this.shader = null;

		return this;

	}
	setAttribute( name, data, size, type ){

		this.use();

		var location = this.context.getAttribLocation(this.instance, name);

		var buffer = this.context.createBuffer();

		this.context.bindBuffer(type, buffer);

		this.context.bufferData(type, data, WebGL2.STATIC_DRAW);

		this.context.vertexAttribPointer(location, size, WebGL2.FLOAT, true, 0, 0);

		this.context.enableVertexAttribArray(location);

		return this;

	}
	setVertexAttribute( name, data, size ){

		this.use();

		var vertexArray = this.context.createVertexArray();

		this.context.bindVertexArray(vertexArray);

		this.setAttribute(name, data, size, WebGL2.ARRAY_BUFFER);

		this.drawLength = data.length;

		this.drawSize = size;

		return this;

	}
	setUniform( name, type, ...values ){

		this.use();

		var location = this.context.getUniformLocation(this.instance, name);

		var size = values.length;

		this.context[`uniform${size}${type}v`](location, values);

		return this;

	}
	setUniformMatrix( name, matrix, transpose = false ){

		this.use();

		var location = this.context.getUniformLocation(this.instance, name);

		var size = Math.sqrt(matrix.length);

		this.context[`uniformMatrix${size}fv`](location, transpose, matrix);

		return this;

	}
	link(){

		this.context.linkProgram(this.instance);

		this.context.validateProgram(this.instance);

		if( !this.context.getProgramParameter(this.instance, WebGL2.LINK_STATUS) ){

			let info = this.context.getProgramInfoLog(this.instance);

			console.error(`Program linking: ${info}`);

			this.delete();

		}

		return this;

	}
	use(){

		this.context.useProgram(this.instance);

		return this;

	}
	render( mode = WebGL2.TRIANGLES, offset = 0, length = this.drawLength / this.drawSize ){

		this.use();

		this.context.drawArrays(mode, offset, length);

		return this;

	}
	delete(){

		this.context.deleteProgram(this.instance);

		return this;

	}
}