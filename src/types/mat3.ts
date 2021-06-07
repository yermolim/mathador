
import { Mat } from "../common";
import { Vec2 } from "./vec2";

export class Mat3 implements Mat {
  readonly length = 9;
  private readonly _matrix: number[] = new Array(this.length);
  
  //#region components
  get x_x(): number {
    return this._matrix[0];
  }
  get x_y(): number {
    return this._matrix[1];
  }
  get x_z(): number {
    return this._matrix[2];
  }
  get y_x(): number {
    return this._matrix[3];
  }
  get y_y(): number {
    return this._matrix[4];
  }
  get y_z(): number {
    return this._matrix[5];
  }
  get z_x(): number {
    return this._matrix[6];
  }
  get z_y(): number {
    return this._matrix[7];
  }
  get z_z(): number {
    return this._matrix[8];
  }
  //#endregion

  constructor() {
    this._matrix[0] = 1;
    this._matrix[1] = 0;
    this._matrix[2] = 0;

    this._matrix[3] = 0;
    this._matrix[4] = 1;
    this._matrix[5] = 0;

    this._matrix[6] = 0;
    this._matrix[7] = 0;
    this._matrix[8] = 1;
  }

  static fromMat3(m: Mat3): Mat3 {
    return new Mat3().setFromMat3(m);
  }
  
  static fromMat4(m: Mat): Mat3 {
    return new Mat3().setFromMat4(m);
  }
   
  /**
   * get the transformation matrix between two line segments (from the first one to the second one)
   * @param aMin starting point of the first segment
   * @param aMax end point of the first segment
   * @param bMin starting point of the second segment
   * @param bMax end point of the second segment
   * @param noRotation true
   * @returns 
   */
  static from4Vec2(aMin: Vec2, aMax: Vec2, bMin: Vec2, bMax: Vec2, 
    noRotation = false): Mat3 {
    const mat = new Mat3();
  
    mat.applyTranslation(-aMin.x, -aMin.y); // move to 0, 0 before transforming
  
    const aLen = Vec2.substract(aMax, aMin).getMagnitude();
    const bLen = Vec2.substract(bMax, bMin).getMagnitude();
    const scale = bLen / aLen;
    mat.applyScaling(scale);
  
    if (!noRotation) {
      const aTheta = Math.atan2(aMax.y - aMin.y, aMax.x - aMin.x);
      const bTheta = Math.atan2(bMax.y - bMin.y, bMax.x - bMin.x);
      const rotation = aTheta - bTheta;
      mat.applyRotation(rotation);
    }
  
    mat.applyTranslation(bMin.x, bMin.y);
  
    return mat;
  }

  static multiply(m1: Mat3, m2: Mat3): Mat3 {    
    const [a11,a12,a13,a21,a22,a23,a31,a32,a33] = m1._matrix; 
    const [b11,b12,b13,b21,b22,b23,b31,b32,b33] = m2._matrix;

    const m = new Mat3();
    m.set(
      a11 * b11 + a12 * b21 + a13 * b31,
      a11 * b12 + a12 * b22 + a13 * b32,
      a11 * b13 + a12 * b23 + a13 * b33,
      a21 * b11 + a22 * b21 + a23 * b31,
      a21 * b12 + a22 * b22 + a23 * b32,
      a21 * b13 + a22 * b23 + a23 * b33,
      a31 * b11 + a32 * b21 + a33 * b31,
      a31 * b12 + a32 * b22 + a33 * b32,
      a31 * b13 + a32 * b23 + a33 * b33,
    );
    return m;
  }

  static multiplyScalar(m: Mat3, s: number): Mat3 {
    const res = new Mat3();
    for (let i = 0; i < this.length; i++) {
      res._matrix[i] = m._matrix[i] * s;
    }
    return res;
  }

  static transpose(m: Mat3): Mat3 {
    const res = new Mat3();
    res.set(
      m.x_x, m.y_x, m.z_x,
      m.x_y, m.y_y, m.z_y,
      m.x_z, m.y_z, m.z_z
    );
    return res;
  }
  
  static invert(m: Mat3): Mat3 {
    const mTemp = new Mat3();
    // calculate minors matrix
    mTemp.set(
      m.y_y * m.z_z - m.z_y * m.y_z,
      m.y_x * m.z_z - m.z_x * m.y_z,
      m.y_x * m.z_y - m.z_x * m.y_y,

      m.x_y * m.z_z - m.z_y * m.x_z,
      m.x_x * m.z_z - m.z_x * m.x_z,
      m.x_x * m.z_y - m.z_x * m.x_y,

      m.x_y * m.y_z - m.y_y * m.x_z,
      m.x_x * m.y_z - m.y_x * m.x_z,
      m.x_x * m.y_y - m.y_x * m.x_y
    );
    // calculate cofactor matrix
    mTemp.set(
      mTemp.x_x, -mTemp.x_y, mTemp.x_z,
      -mTemp.y_x, mTemp.y_y, -mTemp.y_z,
      mTemp.z_x, -mTemp.z_y, mTemp.z_z
    );
    // calculate determinant
    const det = m.x_x * mTemp.x_x + m.x_y * mTemp.x_y + m.x_z * mTemp.x_z;
    const inversed = new Mat3();
    if (!det) {
      inversed.set(0,0,0,0,0,0,0,0,0);
    } else {
      // calculate adjugate multiplied by inversed determinant
      const detInv = 1/det;
      inversed.set(
        detInv * mTemp.x_x, detInv * mTemp.y_x, detInv * mTemp.z_x,
        detInv * mTemp.x_y, detInv * mTemp.y_y, detInv * mTemp.z_y,
        detInv * mTemp.x_z, detInv * mTemp.y_z, detInv * mTemp.z_z
      );
    }

    return inversed;
  }

  static buildScale(x: number, y: number = undefined): Mat3 {
    y ??= x;
    return new Mat3().set(
      x, 0, 0,
      0, y, 0,
      0, 0, 1
    );
  } 

  static buildRotation(theta: number): Mat3 {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return new Mat3().set(
      c, -s, 0,
      s, c, 0,
      0, 0, 1
    );
  }
  
  static buildTranslate(x: number, y: number): Mat3 {
    return new Mat3().set(
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    );
  }

  static equals(m1: Mat3, m2: Mat3, precision = 6): boolean {
    return m1.equals(m2, precision);
  }

  clone(): Mat3 {
    return new Mat3().set(
      this.x_x, this.x_y, this.x_z,
      this.y_x, this.y_y, this.y_z,
      this.z_x, this.z_y, this.z_z
    );
  }
  
  set(...elements: number[]): Mat3;
  set(x_x: number, x_y: number, x_z: number,
    y_x: number, y_y: number, y_z: number,
    z_x: number, z_y: number, z_z: number): Mat3 {
    this._matrix[0] = x_x;
    this._matrix[1] = x_y;
    this._matrix[2] = x_z;
    this._matrix[3] = y_x;
    this._matrix[4] = y_y;
    this._matrix[5] = y_z;
    this._matrix[6] = z_x;
    this._matrix[7] = z_y;
    this._matrix[8] = z_z;
    return this;
  }
  
  reset(): Mat3 {
    this._matrix[0] = 1;
    this._matrix[1] = 0;
    this._matrix[2] = 0;

    this._matrix[3] = 0;
    this._matrix[4] = 1;
    this._matrix[5] = 0;

    this._matrix[6] = 0;
    this._matrix[7] = 0;
    this._matrix[8] = 1;
    return this;
  }

  setFromMat3(m: Mat3): Mat3 {
    for (let i = 0; i < this.length; i++) {
      this._matrix[i] = m._matrix[i];
    }
    return this;
  }  
  
  setFromMat4(m: Mat): Mat3 {
    const elements = m.toArray();
    if (elements.length !== 16) {
      throw new Error("Matrix must contain 16 elements");
    }
    const [x_x, x_y, x_z,, y_x, y_y, y_z,, z_x, z_y, z_z] = elements;  
    for (let i = 0; i < this.length; i++) {
      this._matrix[0] = x_x;
      this._matrix[1] = x_y;
      this._matrix[2] = x_z;
      this._matrix[3] = y_x;
      this._matrix[4] = y_y;
      this._matrix[5] = y_z;
      this._matrix[6] = z_x;
      this._matrix[7] = z_y;
      this._matrix[8] = z_z;
    }
    return this;
  }  

  multiply(m: Mat3): Mat3 {
    const [a11,a12,a13,a21,a22,a23,a31,a32,a33] = this._matrix; 
    const [b11,b12,b13,b21,b22,b23,b31,b32,b33] = m._matrix;  

    this._matrix[0] = a11 * b11 + a12 * b21 + a13 * b31;
    this._matrix[1] = a11 * b12 + a12 * b22 + a13 * b32;
    this._matrix[2] = a11 * b13 + a12 * b23 + a13 * b33;
    this._matrix[3] = a21 * b11 + a22 * b21 + a23 * b31;
    this._matrix[4] = a21 * b12 + a22 * b22 + a23 * b32;
    this._matrix[5] = a21 * b13 + a22 * b23 + a23 * b33;
    this._matrix[6] = a31 * b11 + a32 * b21 + a33 * b31;
    this._matrix[7] = a31 * b12 + a32 * b22 + a33 * b32;
    this._matrix[8] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  multiplyScalar(s: number): Mat3 {
    for (let i = 0; i < this.length; i++) {
      this._matrix[i] *= s;
    }
    return this;
  }

  transpose(): Mat3 {
    const temp = new Mat3().setFromMat3(this);
    this.set(
      temp.x_x, temp.y_x, temp.z_x,
      temp.x_y, temp.y_y, temp.z_y,
      temp.x_z, temp.y_z, temp.z_z
    );
    return this;
  }

  invert(): Mat3 {
    const mTemp = new Mat3();
    // calculate minors matrix
    mTemp.set(
      this.y_y * this.z_z - this.z_y * this.y_z,
      this.y_x * this.z_z - this.z_x * this.y_z,
      this.y_x * this.z_y - this.z_x * this.y_y,

      this.x_y * this.z_z - this.z_y * this.x_z,
      this.x_x * this.z_z - this.z_x * this.x_z,
      this.x_x * this.z_y - this.z_x * this.x_y,

      this.x_y * this.y_z - this.y_y * this.x_z,
      this.x_x * this.y_z - this.y_x * this.x_z,
      this.x_x * this.y_y - this.y_x * this.x_y
    );
    // calculate cofactor matrix
    mTemp.set(
      mTemp.x_x, -mTemp.x_y, mTemp.x_z,
      -mTemp.y_x, mTemp.y_y, -mTemp.y_z,
      mTemp.z_x, -mTemp.z_y, mTemp.z_z
    );
    // calculate determinant
    const det = this.x_x * mTemp.x_x + this.x_y * mTemp.x_y + this.x_z * mTemp.x_z;
    if (!det) {
      this.set(0,0,0,0,0,0,0,0,0);
    } else {
      // calculate adjugate multiplied by inversed determinant
      const detInv = 1/det;
      this.set(
        detInv * mTemp.x_x, detInv * mTemp.y_x, detInv * mTemp.z_x,
        detInv * mTemp.x_y, detInv * mTemp.y_y, detInv * mTemp.z_y,
        detInv * mTemp.x_z, detInv * mTemp.y_z, detInv * mTemp.z_z
      );
    }

    return this;
  }

  getDeterminant(): number {
    const [a,b,c,d,e,f,g,h,i] = this._matrix;
    return a*e*i-a*f*h + b*f*g-b*d*i + c*d*h-c*e*g;
  }
  
  getTRS(): {t: Vec2; r: number; s: Vec2} {
    const t = new Vec2(this.z_x, this.z_y);
    
    const s_x = Math.sqrt(this.x_x * this.x_x + this.x_y * this.x_y); 
    const s_y = Math.sqrt(this.y_x * this.y_x + this.y_y * this.y_y);
    const s = new Vec2(s_x, s_y);

    const sign = Math.atan(- this.x_y / this.x_x);
    const angle = Math.acos(this.x_x / s_x);

    let r: number;
    if ((angle > Math.PI / 2 && sign > 0)
      || (angle < Math.PI / 2 && sign < 0)) {
      r = 2 * Math.PI - angle;
    } else {
      r = angle;
    }

    return {t, r, s};
  }

  equals(m: Mat3, precision = 6): boolean {
    for (let i = 0; i < this.length; i++) {
      if (+this._matrix[i].toFixed(precision) !== +m._matrix[i].toFixed(precision)) {
        return false;
      }
    }
    return true;
  }

  applyScaling(x: number, y: number = undefined): Mat3 {
    const m = Mat3.buildScale(x, y);
    return this.multiply(m);
  }

  applyTranslation(x: number, y: number): Mat3 {
    const m = Mat3.buildTranslate(x, y);
    return this.multiply(m);
  }

  applyRotation(theta: number): Mat3 {
    const m = Mat3.buildRotation(theta);
    return this.multiply(m);
  }

  toArray(): number[] {
    return this._matrix.slice();
  }

  toIntArray(): Int32Array {
    return new Int32Array(this);
  } 

  toFloatArray(): Float32Array {
    return new Float32Array(this);
  } 

  *[Symbol.iterator](): Iterator<number> {
    for (let i = 0; i < 9; i++) {      
      yield this._matrix[i];
    }
  }
}
