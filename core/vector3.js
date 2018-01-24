export default class Vector3 {
	constructor( x = 0, y = 0, z = 0 ){

		this.set(x, y, z);

		return this;

	}
	set( x, y, z ){

		this.x = x;

		this.y = y;

		this.z = z;

		return this;

	}
	add( x, y, z ){

		this.x += x;

		this.y += y;

		this.z += z;

		return this;

	}
	subtract( x, y, z ){

		this.x -= x;

		this.y -= y;

		this.z -= z;

		return this;

	}
	multiply( x, y, z ){

		this.x *= x;

		this.y *= y;

		this.z *= z;

		return this;

	}
	divide( x, y, z ){

		this.x /= x;

		this.y /= y;

		this.z /= z;

		return this;

	}
	cross( x, y, z ){

		this.set(this.y * z - this.z * y, this.z * x - this.x * z, this.x * y - this.y * x);

		return this;

	}
	normalize(){

		var length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

		if( length > 0.00001 ){

			var x = this.x / length;

			var y = this.y / length;

			var z = this.z / length;

			this.set(x, y, z);

		};

		return this;

	}
	clone(){

		return new Vector3(this.x, this.y, this.z);

	}
}