export interface IVec2 {
	x: number;
	y: number;
}

export class Vec2 implements IVec2 {
    public x: number;
    public y: number;

    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
	    this.y = y;
	}

	public set(v: Vec2) {
		this.x = v.x;
		this.y = v.y;

		return this;
	}

    public setX(x: number) {
		this.x = x;

		return this;
    }
    
    public setY(y: number) {
		this.y = y;

		return this;
    }
    
    public copy(v: Vec2) {
		this.x = v.x;
		this.y = v.y;

		return this;
	}

	public clone() {
		return new Vec2(this.x, this.y);
	}

	public add(v: Vec2) {

		this.x += v.x;
		this.y += v.y;

		return this;
	}

	public sub(v: Vec2) {

		this.x -= v.x;
		this.y -= v.y;

		return this;
	}

	public addScalar(s: number) {
		this.x += s;
		this.y += s;

		return this;
    }
    
    public addScaledVector(v: Vec2, s: number) {
		this.x += v.x * s;
		this.y += v.y * s;

		return this;
    }
    
    public multiply(v: Vec2) {
		this.x *= v.x;
		this.y *= v.y;

		return this;
	}

	public multiplyScalar(scalar: number) {
		this.x *= scalar;
		this.y *= scalar;

		return this;
    }
    

	public negate() {
		this.x = - this.x;
		this.y = - this.y;

		return this;
	}

	public dot(v: Vec2) {
		return this.x * v.x + this.y * v.y;
    }
    
    public length() {
		return Math.sqrt( this.x * this.x + this.y * this.y );
    }

    public divideScalar(scalar: number) {
		return this.multiplyScalar( 1 / scalar );
	}
    
    public normalize() {
		return this.divideScalar( this.length() || 1 );
	}
	
	public equal(v: Vec2): boolean {
		return this.x === v.x && this.y === v.y;
	}

	public rotateAround(center: Vec2, angle: number) {
		const c = Math.cos(angle);
		const s = Math.sin(angle);

		const x = this.x - center.x;
		const y = this.y - center.y;

		this.x = x * c - y * s + center.x;
		this.y = x * s + y * c + center.y;

		return this;
	}
}
