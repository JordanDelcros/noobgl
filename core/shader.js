export default class Shader {
	constructor( context, vertexSource, fragmentSource ){

		this.context = context;

		this.vertex = this.context.createShader(this.context.VERTEX_SHADER);

		this.context.shaderSource(this.vertex, vertexSource);

		this.context.compileShader(this.vertex);

		if( !this.context.getShaderParameter(this.vertex, this.context.COMPILE_STATUS) ){

			console.error(`Vertex shader compile: ${this.context.getShaderInfoLog(this.vertex)}`);

		}

		this.fragment = this.context.createShader(this.context.FRAGMENT_SHADER);

		this.context.shaderSource(this.fragment, fragmentSource);

		this.context.compileShader(this.fragment);

		if( !this.context.getShaderParameter(this.fragment, this.context.COMPILE_STATUS) ){

			console.error(`Fragment shader compile: ${this.context.getShaderInfoLog(this.fragment)}`);

		}

		return this;

	}
	delete(){

		this.context.deleteShader(this.vertex);

		this.context.deleteShader(this.fragment);

		return this;

	}
}