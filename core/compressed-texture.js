import WebGL2 from "./webgl2.js";
import Texture from "./texture.js";

const HEADER_LENGTH = 31;

const HEADER_MAGIC_NUMBER_INDEX = 0;
const HEADER_SIZE_INDEX = 1;
const HEADER_FLAGS_INDEX = 2;
const HEADER_HEIGHT_INDEX = 3;
const HEADER_WIDTH_INDEX = 4;
const HEADER_MIPMAP_COUNT_INDEX = 7;
const HEADER_PIXEL_FORMAT_FLAGS_INDEX = 20;
const HEADER_PIXEL_FORMAT_FOUR_CHARACTERS_INDEX = 21;

const DDS_MAGIC_NUMBER = 0x20534444;

const DDSD_MIPMAPCOUNT = 0x20000;

const DDPF_FOUR_CHARACTERS = 0x4;

const FOUR_CHARACTERS_DXT1 = 827611204;
const FOUR_CHARACTERS_DXT5 = 894720068;

export default class CompressedTexture extends Texture {
	constructor( context, data ){

		super(context, data);

		return this;

	}
	update(){

		this.bind();

		var extensions = this.context.getExtension("WEBGL_compressed_texture_s3tc");

		var header = new Int32Array(this.source, 0, HEADER_LENGTH);

		if( header[HEADER_MAGIC_NUMBER_INDEX] != DDS_MAGIC_NUMBER ){

			console.error("Cannot parse DDS texture datas, header's offset magic number is not matching.");

			this.delete();

		}

		if( !header[HEADER_PIXEL_FORMAT_FLAGS_INDEX] & DDPF_FOUR_CHARACTERS ){

			console.error("The Pixel format of the DDS texture is unknown.");

			this.delete();

		}

		var bytesPerBlock = 0;

		var internalFormat = null;

		switch( header[HEADER_PIXEL_FORMAT_FOUR_CHARACTERS_INDEX] ){

			case FOUR_CHARACTERS_DXT1:

				bytesPerBlock = 8;

				internalFormat = extensions.COMPRESSED_RGBA_S3TC_DXT1_EXT;

				break;

			case FOUR_CHARACTERS_DXT5:

				bytesPerBlock = 32;

				internalFormat = extensions.COMPRESSED_RGBA_S3TC_DXT5_EXT;

				break;

			default:

				console.error("The value of the four characters is unsupported.");

		}

		var mipmaps = 1;

		if( header[HEADER_FLAGS_INDEX] & DDSD_MIPMAPCOUNT ){

			mipmaps = Math.max(1, header[HEADER_MIPMAP_COUNT_INDEX]);

		}

		var width = header[HEADER_WIDTH_INDEX];

		var height = header[HEADER_HEIGHT_INDEX];

		var offset = header[HEADER_SIZE_INDEX] + 4;

		for( let index = 0; index < mipmaps; index++ ){

			let length = Math.max(4, width) / 4 * Math.max(4, height) / 4 * bytesPerBlock;

			let byteArray = new Uint8Array(this.source, offset, length);

			this.context.pixelStorei(WebGL2.UNPACK_FLIP_Y_WEBGL, false);

			this.context.compressedTexImage2D(WebGL2.TEXTURE_2D, index, internalFormat, width, height, 0, byteArray);

			offset += length;

			width *= 0.5;

			height *= 0.5;

		}

		return this;

	}
	static getInt32fromFourCharacters( value ){

		return value.charCodeAt(0) + (value.charCodeAt(1) << 8) + (value.charCodeAt(2) << 16) + (value.charCodeAt(3) << 24);

	}
	static getFourCharactersFromInt32( value ){

		return String.fromCharCode(value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff);

	}
}