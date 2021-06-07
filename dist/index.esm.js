function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomArrayElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function radToDeg(rad) {
    return rad * 180 / Math.PI;
}
function degToRad(deg) {
    return deg * Math.PI / 180;
}
function getDistance2D(x1, y1, x2, y2) {
    const x = x2 - x1;
    const y = y2 - y1;
    return Math.sqrt(x * x + y * y);
}
function getDistance3D(x1, y1, z1, x2, y2, z2) {
    const x = x2 - x1;
    const y = y2 - y1;
    const z = z2 - z1;
    return Math.sqrt(x * x + y * y + z * z);
}
function clamp(v, min, max) {
    return Math.max(min, Math.min(v, max));
}
function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
}
function smoothstep(v, min, max, perlin) {
    v = clamp((v - min) / (max - min), 0, 1);
    return perlin
        ? v * v * v * (v * (v * 6 - 15) + 10)
        : v * v * (3 - 2 * v);
}
function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

class EulerAngles {
    constructor(x = 0, y = 0, z = 0, order = "XYZ") {
        this.x = x;
        this.y = y;
        this.z = z;
        this.order = order;
    }
    static fromEuler(ea) {
        return new EulerAngles().setFromEuler(ea);
    }
    static fromRotationMatrix(m, order) {
        return new EulerAngles().setFromRotationMatrix(m, order);
    }
    static equals(ea1, ea2) {
        return ea1.equals(ea2);
    }
    clone() {
        return new EulerAngles(this.x, this.y, this.z, this.order);
    }
    set(x, y, z, order = "XYZ") {
        this.x = x;
        this.y = y;
        this.z = z;
        this.order = order;
        return this;
    }
    setFromEuler(ea) {
        this.x = ea.x;
        this.y = ea.y;
        this.z = ea.z;
        this.order = ea.order;
        return this;
    }
    equals(ea) {
        return this.x === ea.x
            && this.y === ea.y
            && this.z === ea.z
            && this.order === ea.order;
    }
    setFromRotationMatrix(m, order) {
        const elements = m.toArray();
        if (elements.length !== 16) {
            throw new Error("Matrix must contain 16 elements");
        }
        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = elements;
        switch (order) {
            case "XYZ":
                this.y = Math.asin(clamp(z_x, -1, 1));
                if (Math.abs(z_x) < 0.999999) {
                    this.x = Math.atan2(-z_y, z_z);
                    this.z = Math.atan2(-y_x, x_x);
                }
                else {
                    this.x = Math.atan2(y_z, y_y);
                    this.z = 0;
                }
                break;
            case "XZY":
                this.z = Math.asin(-clamp(y_x, -1, 1));
                if (Math.abs(y_x) < 0.999999) {
                    this.x = Math.atan2(y_z, y_y);
                    this.y = Math.atan2(z_x, x_x);
                }
                else {
                    this.x = Math.atan2(-z_y, z_z);
                    this.y = 0;
                }
                break;
            case "YXZ":
                this.x = Math.asin(-clamp(z_y, -1, 1));
                if (Math.abs(z_y) < 0.999999) {
                    this.y = Math.atan2(z_x, z_z);
                    this.z = Math.atan2(x_y, y_y);
                }
                else {
                    this.y = Math.atan2(-x_z, x_x);
                    this.z = 0;
                }
                break;
            case "YZX":
                this.z = Math.asin(clamp(x_y, -1, 1));
                if (Math.abs(x_y) < 0.999999) {
                    this.x = Math.atan2(-z_y, y_y);
                    this.y = Math.atan2(-x_z, x_x);
                }
                else {
                    this.x = 0;
                    this.y = Math.atan2(z_x, z_z);
                }
                break;
            case "ZXY":
                this.x = Math.asin(clamp(y_z, -1, 1));
                if (Math.abs(y_z) < 0.999999) {
                    this.y = Math.atan2(-x_z, z_z);
                    this.z = Math.atan2(-y_x, y_y);
                }
                else {
                    this.y = 0;
                    this.z = Math.atan2(x_y, x_x);
                }
                break;
            case "ZYX":
                this.y = Math.asin(-clamp(x_z, -1, 1));
                if (Math.abs(x_z) < 0.999999) {
                    this.x = Math.atan2(y_z, z_z);
                    this.z = Math.atan2(x_y, x_x);
                }
                else {
                    this.x = 0;
                    this.z = Math.atan2(-y_x, y_y);
                }
                break;
        }
        this.order = order;
        return this;
    }
}

class Vec2 {
    constructor(x = 0, y = 0) {
        this.length = 2;
        this.x = x;
        this.y = y;
    }
    static multiplyByScalar(v, s) {
        return new Vec2(v.x * s, v.y * s);
    }
    static addScalar(v, s) {
        return new Vec2(v.x + s, v.y + s);
    }
    static normalize(v) {
        return new Vec2().setFromVec2(v).normalize();
    }
    static add(v1, v2) {
        return new Vec2(v1.x + v2.x, v1.y + v2.y);
    }
    static substract(v1, v2) {
        return new Vec2(v1.x - v2.x, v1.y - v2.y);
    }
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static applyMat3(v, m) {
        return v.clone().applyMat3(m);
    }
    static lerp(v1, v2, t) {
        return v1.clone().lerp(v2, t);
    }
    static rotate(v, center, theta) {
        return v.clone().rotate(center, theta);
    }
    static equals(v1, v2, precision = 6) {
        if (!v1) {
            return false;
        }
        return v1.equals(v2);
    }
    static getDistance(v1, v2) {
        const x = v2.x - v1.x;
        const y = v2.y - v1.y;
        return Math.sqrt(x * x + y * y);
    }
    static minMax(...values) {
        const min = new Vec2(Math.min(...values.map(x => x.x)), Math.min(...values.map(x => x.y)));
        const max = new Vec2(Math.max(...values.map(x => x.x)), Math.max(...values.map(x => x.y)));
        return { min, max };
    }
    clone() {
        return new Vec2(this.x, this.y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    setFromVec2(vec2) {
        this.x = vec2.x;
        this.y = vec2.y;
        return this;
    }
    multiplyByScalar(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        return this;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        const m = this.getMagnitude();
        if (m) {
            this.x /= m;
            this.y /= m;
        }
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    substract(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    dotProduct(v) {
        return Vec2.dotProduct(this, v);
    }
    applyMat3(m) {
        if (m.length !== 9) {
            throw new Error("Matrix must contain 9 elements");
        }
        const { x, y } = this;
        const [x_x, x_y, , y_x, y_y, , z_x, z_y,] = m;
        this.x = x * x_x + y * y_x + z_x;
        this.y = x * x_y + y * y_y + z_y;
        return this;
    }
    lerp(v, t) {
        this.x += t * (v.x - this.x);
        this.y += t * (v.y - this.y);
        return this;
    }
    rotate(center, theta) {
        const s = Math.sin(theta);
        const c = Math.cos(theta);
        const x = this.x - center.x;
        const y = this.y - center.y;
        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;
        return this;
    }
    equals(v, precision = 6) {
        if (!v) {
            return false;
        }
        return +this.x.toFixed(precision) === +v.x.toFixed(precision)
            && +this.y.toFixed(precision) === +v.y.toFixed(precision);
    }
    toArray() {
        return [this.x, this.y];
    }
    toIntArray() {
        return new Int32Array(this);
    }
    toFloatArray() {
        return new Float32Array(this);
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
    }
}

class Mat3 {
    constructor() {
        this.length = 9;
        this._matrix = new Array(this.length);
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
    get x_x() {
        return this._matrix[0];
    }
    get x_y() {
        return this._matrix[1];
    }
    get x_z() {
        return this._matrix[2];
    }
    get y_x() {
        return this._matrix[3];
    }
    get y_y() {
        return this._matrix[4];
    }
    get y_z() {
        return this._matrix[5];
    }
    get z_x() {
        return this._matrix[6];
    }
    get z_y() {
        return this._matrix[7];
    }
    get z_z() {
        return this._matrix[8];
    }
    static fromMat3(m) {
        return new Mat3().setFromMat3(m);
    }
    static fromMat4(m) {
        return new Mat3().setFromMat4(m);
    }
    static from4Vec2(aMin, aMax, bMin, bMax, noRotation = false) {
        const mat = new Mat3();
        mat.applyTranslation(-aMin.x, -aMin.y);
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
    static multiply(m1, m2) {
        const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = m1._matrix;
        const [b11, b12, b13, b21, b22, b23, b31, b32, b33] = m2._matrix;
        const m = new Mat3();
        m.set(a11 * b11 + a12 * b21 + a13 * b31, a11 * b12 + a12 * b22 + a13 * b32, a11 * b13 + a12 * b23 + a13 * b33, a21 * b11 + a22 * b21 + a23 * b31, a21 * b12 + a22 * b22 + a23 * b32, a21 * b13 + a22 * b23 + a23 * b33, a31 * b11 + a32 * b21 + a33 * b31, a31 * b12 + a32 * b22 + a33 * b32, a31 * b13 + a32 * b23 + a33 * b33);
        return m;
    }
    static multiplyScalar(m, s) {
        const res = new Mat3();
        for (let i = 0; i < this.length; i++) {
            res._matrix[i] = m._matrix[i] * s;
        }
        return res;
    }
    static transpose(m) {
        const res = new Mat3();
        res.set(m.x_x, m.y_x, m.z_x, m.x_y, m.y_y, m.z_y, m.x_z, m.y_z, m.z_z);
        return res;
    }
    static invert(m) {
        const mTemp = new Mat3();
        mTemp.set(m.y_y * m.z_z - m.z_y * m.y_z, m.y_x * m.z_z - m.z_x * m.y_z, m.y_x * m.z_y - m.z_x * m.y_y, m.x_y * m.z_z - m.z_y * m.x_z, m.x_x * m.z_z - m.z_x * m.x_z, m.x_x * m.z_y - m.z_x * m.x_y, m.x_y * m.y_z - m.y_y * m.x_z, m.x_x * m.y_z - m.y_x * m.x_z, m.x_x * m.y_y - m.y_x * m.x_y);
        mTemp.set(mTemp.x_x, -mTemp.x_y, mTemp.x_z, -mTemp.y_x, mTemp.y_y, -mTemp.y_z, mTemp.z_x, -mTemp.z_y, mTemp.z_z);
        const det = m.x_x * mTemp.x_x + m.x_y * mTemp.x_y + m.x_z * mTemp.x_z;
        const inversed = new Mat3();
        if (!det) {
            inversed.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
        else {
            const detInv = 1 / det;
            inversed.set(detInv * mTemp.x_x, detInv * mTemp.y_x, detInv * mTemp.z_x, detInv * mTemp.x_y, detInv * mTemp.y_y, detInv * mTemp.z_y, detInv * mTemp.x_z, detInv * mTemp.y_z, detInv * mTemp.z_z);
        }
        return inversed;
    }
    static buildScale(x, y = undefined) {
        y !== null && y !== void 0 ? y : (y = x);
        return new Mat3().set(x, 0, 0, 0, y, 0, 0, 0, 1);
    }
    static buildRotation(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Mat3().set(c, -s, 0, s, c, 0, 0, 0, 1);
    }
    static buildTranslate(x, y) {
        return new Mat3().set(1, 0, 0, 0, 1, 0, x, y, 1);
    }
    static equals(m1, m2, precision = 6) {
        return m1.equals(m2, precision);
    }
    clone() {
        return new Mat3().set(this.x_x, this.x_y, this.x_z, this.y_x, this.y_y, this.y_z, this.z_x, this.z_y, this.z_z);
    }
    set(x_x, x_y, x_z, y_x, y_y, y_z, z_x, z_y, z_z) {
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
    reset() {
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
    setFromMat3(m) {
        for (let i = 0; i < this.length; i++) {
            this._matrix[i] = m._matrix[i];
        }
        return this;
    }
    setFromMat4(m) {
        const elements = m.toArray();
        if (elements.length !== 16) {
            throw new Error("Matrix must contain 16 elements");
        }
        const [x_x, x_y, x_z, , y_x, y_y, y_z, , z_x, z_y, z_z] = elements;
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
    multiply(m) {
        const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = this._matrix;
        const [b11, b12, b13, b21, b22, b23, b31, b32, b33] = m._matrix;
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
    multiplyScalar(s) {
        for (let i = 0; i < this.length; i++) {
            this._matrix[i] *= s;
        }
        return this;
    }
    transpose() {
        const temp = new Mat3().setFromMat3(this);
        this.set(temp.x_x, temp.y_x, temp.z_x, temp.x_y, temp.y_y, temp.z_y, temp.x_z, temp.y_z, temp.z_z);
        return this;
    }
    invert() {
        const mTemp = new Mat3();
        mTemp.set(this.y_y * this.z_z - this.z_y * this.y_z, this.y_x * this.z_z - this.z_x * this.y_z, this.y_x * this.z_y - this.z_x * this.y_y, this.x_y * this.z_z - this.z_y * this.x_z, this.x_x * this.z_z - this.z_x * this.x_z, this.x_x * this.z_y - this.z_x * this.x_y, this.x_y * this.y_z - this.y_y * this.x_z, this.x_x * this.y_z - this.y_x * this.x_z, this.x_x * this.y_y - this.y_x * this.x_y);
        mTemp.set(mTemp.x_x, -mTemp.x_y, mTemp.x_z, -mTemp.y_x, mTemp.y_y, -mTemp.y_z, mTemp.z_x, -mTemp.z_y, mTemp.z_z);
        const det = this.x_x * mTemp.x_x + this.x_y * mTemp.x_y + this.x_z * mTemp.x_z;
        if (!det) {
            this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
        else {
            const detInv = 1 / det;
            this.set(detInv * mTemp.x_x, detInv * mTemp.y_x, detInv * mTemp.z_x, detInv * mTemp.x_y, detInv * mTemp.y_y, detInv * mTemp.z_y, detInv * mTemp.x_z, detInv * mTemp.y_z, detInv * mTemp.z_z);
        }
        return this;
    }
    getDeterminant() {
        const [a, b, c, d, e, f, g, h, i] = this._matrix;
        return a * e * i - a * f * h + b * f * g - b * d * i + c * d * h - c * e * g;
    }
    getTRS() {
        const t = new Vec2(this.z_x, this.z_y);
        const s_x = Math.sqrt(this.x_x * this.x_x + this.x_y * this.x_y);
        const s_y = Math.sqrt(this.y_x * this.y_x + this.y_y * this.y_y);
        const s = new Vec2(s_x, s_y);
        const sign = Math.atan(-this.x_y / this.x_x);
        const angle = Math.acos(this.x_x / s_x);
        let r;
        if ((angle > Math.PI / 2 && sign > 0)
            || (angle < Math.PI / 2 && sign < 0)) {
            r = 2 * Math.PI - angle;
        }
        else {
            r = angle;
        }
        return { t, r, s };
    }
    equals(m, precision = 6) {
        for (let i = 0; i < this.length; i++) {
            if (+this._matrix[i].toFixed(precision) !== +m._matrix[i].toFixed(precision)) {
                return false;
            }
        }
        return true;
    }
    applyScaling(x, y = undefined) {
        const m = Mat3.buildScale(x, y);
        return this.multiply(m);
    }
    applyTranslation(x, y) {
        const m = Mat3.buildTranslate(x, y);
        return this.multiply(m);
    }
    applyRotation(theta) {
        const m = Mat3.buildRotation(theta);
        return this.multiply(m);
    }
    toArray() {
        return this._matrix.slice();
    }
    toIntArray() {
        return new Int32Array(this);
    }
    toFloatArray() {
        return new Float32Array(this);
    }
    toIntShortArray() {
        return new Int32Array([
            this._matrix[0],
            this._matrix[1],
            this._matrix[3],
            this._matrix[4],
            this._matrix[6],
            this._matrix[7],
        ]);
    }
    toFloatShortArray() {
        return new Float32Array([
            +(this._matrix[0].toFixed(5)),
            +(this._matrix[1].toFixed(5)),
            +(this._matrix[3].toFixed(5)),
            +(this._matrix[4].toFixed(5)),
            +(this._matrix[6].toFixed(5)),
            +(this._matrix[7].toFixed(5)),
        ]);
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < 9; i++) {
            yield this._matrix[i];
        }
    }
}

class Quaternion {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    static fromRotationMatrix(m) {
        return new Quaternion().setFromRotationMatrix(m);
    }
    static fromEuler(e) {
        return new Quaternion().setFromEuler(e);
    }
    static fromVec3Angle(v, theta) {
        return new Quaternion().setFromVec3Angle(v, theta);
    }
    static fromVec3s(v1, v2) {
        return new Quaternion().setFromVec3s(v1, v2);
    }
    static normalize(q) {
        return q.clone().normalize();
    }
    static invert(q) {
        return q.clone().normalize().invert();
    }
    static dotProduct(q1, q2) {
        return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
    }
    static getAngle(q1, q2) {
        return q1.getAngle(q2);
    }
    static multiply(q1, q2) {
        return q1.clone().multiply(q2);
    }
    static slerp(q1, q2, t) {
        return q1.clone().slerp(q2, t);
    }
    static equals(q1, q2, precision = 6) {
        return q1.equals(q2, precision);
    }
    clone() {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }
    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    setFromVec3s(v1, v2) {
        v1 = v1.clone().normalize();
        v2 = v2.clone().normalize();
        let w = v1.dotProduct(v2) + 1;
        if (w < 0.000001) {
            w = 0;
            if (Math.abs(v1.x) > Math.abs(v1.z)) {
                this.x = -v1.y;
                this.y = v1.x;
                this.z = 0;
            }
            else {
                this.x = 0;
                this.y = -v1.z;
                this.z = v1.y;
            }
        }
        else {
            const { x, y, z } = v1.crossProduct(v2);
            this.x = x;
            this.y = y;
            this.z = z;
        }
        this.w = w;
        return this.normalize();
    }
    setFromQ(q) {
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
        return this;
    }
    setFromRotationMatrix(m) {
        if (m.length !== 16) {
            throw new Error("Matrix must contain 16 elements");
        }
        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m;
        const trace = x_x + y_y + z_z;
        if (trace > 0) {
            const s = 0.5 / Math.sqrt(1 + trace);
            this.set((y_z - z_y) * s, (z_x - x_z) * s, (x_y - y_x) * s, 0.25 / s);
        }
        else if (x_x > y_y && x_x > z_z) {
            const s = 2 * Math.sqrt(1 + x_x - y_y - z_z);
            this.set(0.25 * s, (y_x + x_y) / s, (z_x + x_z) / s, (y_z - z_y) / s);
        }
        else if (y_y > z_z) {
            const s = 2 * Math.sqrt(1 + y_y - x_x - z_z);
            this.set((y_x + x_y) / s, 0.25 * s, (z_y + y_z) / s, (z_x - x_z) / s);
        }
        else {
            const s = 2 * Math.sqrt(1 + z_z - x_x - y_y);
            this.set((z_x + x_z) / s, (z_y + y_z) / s, 0.25 * s, (x_y - y_x) / s);
        }
        return this;
    }
    setFromEuler(e) {
        const c_x = Math.cos(e.x / 2);
        const c_y = Math.cos(e.y / 2);
        const c_z = Math.cos(e.z / 2);
        const s_x = Math.sin(e.x / 2);
        const s_y = Math.sin(e.y / 2);
        const s_z = Math.sin(e.z / 2);
        switch (e.order) {
            case "XYZ":
                this.x = s_x * c_y * c_z + c_x * s_y * s_z;
                this.y = c_x * s_y * c_z - s_x * c_y * s_z;
                this.z = c_x * c_y * s_z + s_x * s_y * c_z;
                this.w = c_x * c_y * c_z - s_x * s_y * s_z;
                break;
            case "XZY":
                this.x = s_x * c_y * c_z - c_x * s_y * s_z;
                this.y = c_x * s_y * c_z - s_x * c_y * s_z;
                this.z = c_x * c_y * s_z + s_x * s_y * c_z;
                this.w = c_x * c_y * c_z + s_x * s_y * s_z;
                break;
            case "YXZ":
                this.x = s_x * c_y * c_z + c_x * s_y * s_z;
                this.y = c_x * s_y * c_z - s_x * c_y * s_z;
                this.z = c_x * c_y * s_z - s_x * s_y * c_z;
                this.w = c_x * c_y * c_z + s_x * s_y * s_z;
                break;
            case "YZX":
                this.x = s_x * c_y * c_z + c_x * s_y * s_z;
                this.y = c_x * s_y * c_z + s_x * c_y * s_z;
                this.z = c_x * c_y * s_z - s_x * s_y * c_z;
                this.w = c_x * c_y * c_z - s_x * s_y * s_z;
                break;
            case "ZXY":
                this.x = s_x * c_y * c_z - c_x * s_y * s_z;
                this.y = c_x * s_y * c_z + s_x * c_y * s_z;
                this.z = c_x * c_y * s_z + s_x * s_y * c_z;
                this.w = c_x * c_y * c_z - s_x * s_y * s_z;
                break;
            case "ZYX":
                this.x = s_x * c_y * c_z - c_x * s_y * s_z;
                this.y = c_x * s_y * c_z + s_x * c_y * s_z;
                this.z = c_x * c_y * s_z - s_x * s_y * c_z;
                this.w = c_x * c_y * c_z + s_x * s_y * s_z;
                break;
        }
        return this;
    }
    setFromVec3Angle(v, theta) {
        const vNorm = v.clone().normalize();
        const halfTheta = theta / 2;
        const halfThetaSin = Math.sin(halfTheta);
        this.x = vNorm.x * halfThetaSin;
        this.y = vNorm.y * halfThetaSin;
        this.z = vNorm.z * halfThetaSin;
        this.w = Math.cos(halfTheta);
        return this;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    normalize() {
        const m = this.getMagnitude();
        if (m) {
            this.x /= m;
            this.y /= m;
            this.z /= m;
            this.w /= m;
        }
        return this;
    }
    invert() {
        this.normalize();
        this.x *= -1;
        this.y *= -1;
        this.z *= -1;
        return this;
    }
    dotProduct(q) {
        return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
    }
    getAngle(q) {
        return 2 * Math.acos(Math.abs(clamp(this.dotProduct(q), -1, 1)));
    }
    multiply(q) {
        const { x, y, z, w } = this;
        const { x: X, y: Y, z: Z, w: W } = q;
        this.x = x * W + w * X + y * Z - z * Y;
        this.y = y * W + w * Y + z * X - x * Z;
        this.z = z * W + w * Z + x * Y - y * X;
        this.w = w * W - x * X - y * Y - z * Z;
        return this;
    }
    slerp(q, t) {
        t = clamp(t, 0, 1);
        if (!t) {
            return this;
        }
        if (t === 1) {
            return this.setFromQ(q);
        }
        const { x, y, z, w } = this;
        const { x: X, y: Y, z: Z, w: W } = q;
        const halfThetaCos = x * X + y * Y + z * Z + w * W;
        if (Math.abs(halfThetaCos) >= 1) {
            return this;
        }
        const halfTheta = Math.acos(halfThetaCos);
        const halfThetaSin = Math.sin(halfTheta);
        if (Math.abs(halfThetaSin) < 0.000001) {
            this.x = 0.5 * (x + X);
            this.y = 0.5 * (y + Y);
            this.z = 0.5 * (z + Z);
            this.w = 0.5 * (w + W);
            return this;
        }
        const a = Math.sin((1 - t) * halfTheta) / halfThetaSin;
        const b = Math.sin(t * halfTheta) / halfThetaSin;
        this.x = a * x + b * X;
        this.y = a * y + b * Y;
        this.z = a * z + b * Z;
        this.w = a * w + b * W;
        return this;
    }
    equals(q, precision = 6) {
        return +this.x.toFixed(precision) === +q.x.toFixed(precision)
            && +this.y.toFixed(precision) === +q.y.toFixed(precision)
            && +this.z.toFixed(precision) === +q.z.toFixed(precision)
            && +this.w.toFixed(precision) === +q.w.toFixed(precision);
    }
}

class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.length = 3;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static multiplyByScalar(v, s) {
        return new Vec3(v.x * s, v.y * s, v.z * s);
    }
    static addScalar(v, s) {
        return new Vec3(v.x + s, v.y + s, v.z + s);
    }
    static normalize(v) {
        return new Vec3().setFromVec3(v).normalize();
    }
    static add(v1, v2) {
        return new Vec3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static substract(v1, v2) {
        return new Vec3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    static crossProduct(v1, v2) {
        return new Vec3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
    }
    static onVector(v1, v2) {
        return v1.clone().onVector(v2);
    }
    static onPlane(v, planeNormal) {
        return v.clone().onPlane(planeNormal);
    }
    static applyMat3(v, m) {
        return v.clone().applyMat3(m);
    }
    static applyMat4(v, m) {
        return v.clone().applyMat4(m);
    }
    static lerp(v1, v2, t) {
        return v1.clone().lerp(v2, t);
    }
    static equals(v1, v2, precision = 6) {
        if (!v1) {
            return false;
        }
        return v1.equals(v2, precision);
    }
    static getDistance(v1, v2) {
        const x = v2.x - v1.x;
        const y = v2.y - v1.y;
        const z = v2.z - v1.z;
        return Math.sqrt(x * x + y * y + z * z);
    }
    static getAngle(v1, v2) {
        return v1.getAngle(v2);
    }
    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    setFromVec3(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    multiplyByScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    getAngle(v) {
        const d = this.getMagnitude() * v.getMagnitude();
        if (!d) {
            return Math.PI / 2;
        }
        const cos = this.dotProduct(v) / d;
        return Math.acos(clamp(cos, -1, 1));
    }
    normalize() {
        const m = this.getMagnitude();
        if (m) {
            this.x /= m;
            this.y /= m;
            this.z /= m;
        }
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    substract(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }
    dotProduct(v) {
        return Vec3.dotProduct(this, v);
    }
    crossProduct(v) {
        this.x = this.y * v.z - this.z * v.y;
        this.y = this.z * v.x - this.x * v.z;
        this.z = this.x * v.y - this.y * v.x;
        return this;
    }
    onVector(v) {
        const magnitude = this.getMagnitude();
        if (!magnitude) {
            return this.set(0, 0, 0);
        }
        return v.clone().multiplyByScalar(v.clone().dotProduct(this) / (magnitude * magnitude));
    }
    onPlane(planeNormal) {
        return this.substract(this.clone().onVector(planeNormal));
    }
    applyMat3(m) {
        if (m.length !== 9) {
            throw new Error("Matrix must contain 9 elements");
        }
        const { x, y, z } = this;
        const [x_x, x_y, x_z, y_x, y_y, y_z, z_x, z_y, z_z] = m;
        this.x = x * x_x + y * y_x + z * z_x;
        this.y = x * x_y + y * y_y + z * z_y;
        this.z = x * x_z + y * y_z + z * z_z;
        return this;
    }
    applyMat4(m) {
        if (m.length !== 16) {
            throw new Error("Matrix must contain 16 elements");
        }
        const { x, y, z } = this;
        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m;
        const w = 1 / (x * x_w + y * y_w + z * z_w + w_w);
        this.x = (x * x_x + y * y_x + z * z_x + w_x) * w;
        this.y = (x * x_y + y * y_y + z * z_y + w_y) * w;
        this.z = (x * x_z + y * y_z + z * z_z + w_z) * w;
        return this;
    }
    lerp(v, t) {
        this.x += t * (v.x - this.x);
        this.y += t * (v.y - this.y);
        this.z += t * (v.z - this.z);
        return this;
    }
    equals(v, precision = 6) {
        if (!v) {
            return false;
        }
        return +this.x.toFixed(precision) === +v.x.toFixed(precision)
            && +this.y.toFixed(precision) === +v.y.toFixed(precision)
            && +this.z.toFixed(precision) === +v.z.toFixed(precision);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    toIntArray() {
        return new Int32Array(this);
    }
    toFloatArray() {
        return new Float32Array(this);
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
    }
}

class Mat4 {
    constructor() {
        this.length = 16;
        this._matrix = new Array(this.length);
        this._matrix[0] = 1;
        this._matrix[1] = 0;
        this._matrix[2] = 0;
        this._matrix[3] = 0;
        this._matrix[4] = 0;
        this._matrix[5] = 1;
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = 0;
        this._matrix[10] = 1;
        this._matrix[11] = 0;
        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[14] = 0;
        this._matrix[15] = 1;
    }
    get x_x() {
        return this._matrix[0];
    }
    get x_y() {
        return this._matrix[1];
    }
    get x_z() {
        return this._matrix[2];
    }
    get x_w() {
        return this._matrix[3];
    }
    get y_x() {
        return this._matrix[4];
    }
    get y_y() {
        return this._matrix[5];
    }
    get y_z() {
        return this._matrix[6];
    }
    get y_w() {
        return this._matrix[7];
    }
    get z_x() {
        return this._matrix[8];
    }
    get z_y() {
        return this._matrix[9];
    }
    get z_z() {
        return this._matrix[10];
    }
    get z_w() {
        return this._matrix[11];
    }
    get w_x() {
        return this._matrix[12];
    }
    get w_y() {
        return this._matrix[13];
    }
    get w_z() {
        return this._matrix[14];
    }
    get w_w() {
        return this._matrix[15];
    }
    static fromMat4(m) {
        return new Mat4().setFromMat4(m);
    }
    static fromTRS(t, r, s) {
        return new Mat4().setFromTRS(t, r, s);
    }
    static fromQuaternion(q) {
        return new Mat4().setFromQuaternion(q);
    }
    static multiply(m1, m2) {
        const m = new Mat4();
        m.set(m1.x_x * m2.x_x + m1.x_y * m2.y_x + m1.x_z * m2.z_x + m1.x_w * m2.w_x, m1.x_x * m2.x_y + m1.x_y * m2.y_y + m1.x_z * m2.z_y + m1.x_w * m2.w_y, m1.x_x * m2.x_z + m1.x_y * m2.y_z + m1.x_z * m2.z_z + m1.x_w * m2.w_z, m1.x_x * m2.x_w + m1.x_y * m2.y_w + m1.x_z * m2.z_w + m1.x_w * m2.w_w, m1.y_x * m2.x_x + m1.y_y * m2.y_x + m1.y_z * m2.z_x + m1.y_w * m2.w_x, m1.y_x * m2.x_y + m1.y_y * m2.y_y + m1.y_z * m2.z_y + m1.y_w * m2.w_y, m1.y_x * m2.x_z + m1.y_y * m2.y_z + m1.y_z * m2.z_z + m1.y_w * m2.w_z, m1.y_x * m2.x_w + m1.y_y * m2.y_w + m1.y_z * m2.z_w + m1.y_w * m2.w_w, m1.z_x * m2.x_x + m1.z_y * m2.y_x + m1.z_z * m2.z_x + m1.z_w * m2.w_x, m1.z_x * m2.x_y + m1.z_y * m2.y_y + m1.z_z * m2.z_y + m1.z_w * m2.w_y, m1.z_x * m2.x_z + m1.z_y * m2.y_z + m1.z_z * m2.z_z + m1.z_w * m2.w_z, m1.z_x * m2.x_w + m1.z_y * m2.y_w + m1.z_z * m2.z_w + m1.z_w * m2.w_w, m1.w_x * m2.x_x + m1.w_y * m2.y_x + m1.w_z * m2.z_x + m1.w_w * m2.w_x, m1.w_x * m2.x_y + m1.w_y * m2.y_y + m1.w_z * m2.z_y + m1.w_w * m2.w_y, m1.w_x * m2.x_z + m1.w_y * m2.y_z + m1.w_z * m2.z_z + m1.w_w * m2.w_z, m1.w_x * m2.x_w + m1.w_y * m2.y_w + m1.w_z * m2.z_w + m1.w_w * m2.w_w);
        return m;
    }
    static multiplyScalar(m, s) {
        const res = new Mat4();
        for (let i = 0; i < this.length; i++) {
            res._matrix[i] = m._matrix[i] * s;
        }
        return res;
    }
    static transpose(m) {
        const res = new Mat4();
        res.set(m.x_x, m.y_x, m.z_x, m.w_x, m.x_y, m.y_y, m.z_y, m.w_y, m.x_z, m.y_z, m.z_z, m.w_z, m.x_w, m.y_w, m.z_w, m.w_w);
        return res;
    }
    static invert(m) {
        const s = 1 / m.getDeterminant();
        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m._matrix;
        const res = new Mat4().set((y_z * z_w * w_y - y_w * z_z * w_y + y_w * z_y * w_z - y_y * z_w * w_z - y_z * z_y * w_w + y_y * z_z * w_w) * s, (x_w * z_z * w_y - x_z * z_w * w_y - x_w * z_y * w_z + x_y * z_w * w_z + x_z * z_y * w_w - x_y * z_z * w_w) * s, (x_z * y_w * w_y - x_w * y_z * w_y + x_w * y_y * w_z - x_y * y_w * w_z - x_z * y_y * w_w + x_y * y_z * w_w) * s, (x_w * y_z * z_y - x_z * y_w * z_y - x_w * y_y * z_z + x_y * y_w * z_z + x_z * y_y * z_w - x_y * y_z * z_w) * s, (y_w * z_z * w_x - y_z * z_w * w_x - y_w * z_x * w_z + y_x * z_w * w_z + y_z * z_x * w_w - y_x * z_z * w_w) * s, (x_z * z_w * w_x - x_w * z_z * w_x + x_w * z_x * w_z - x_x * z_w * w_z - x_z * z_x * w_w + x_x * z_z * w_w) * s, (x_w * y_z * w_x - x_z * y_w * w_x - x_w * y_x * w_z + x_x * y_w * w_z + x_z * y_x * w_w - x_x * y_z * w_w) * s, (x_z * y_w * z_x - x_w * y_z * z_x + x_w * y_x * z_z - x_x * y_w * z_z - x_z * y_x * z_w + x_x * y_z * z_w) * s, (y_y * z_w * w_x - y_w * z_y * w_x + y_w * z_x * w_y - y_x * z_w * w_y - y_y * z_x * w_w + y_x * z_y * w_w) * s, (x_w * z_y * w_x - x_y * z_w * w_x - x_w * z_x * w_y + x_x * z_w * w_y + x_y * z_x * w_w - x_x * z_y * w_w) * s, (x_y * y_w * w_x - x_w * y_y * w_x + x_w * y_x * w_y - x_x * y_w * w_y - x_y * y_x * w_w + x_x * y_y * w_w) * s, (x_w * y_y * z_x - x_y * y_w * z_x - x_w * y_x * z_y + x_x * y_w * z_y + x_y * y_x * z_w - x_x * y_y * z_w) * s, (y_z * z_y * w_x - y_y * z_z * w_x - y_z * z_x * w_y + y_x * z_z * w_y + y_y * z_x * w_z - y_x * z_y * w_z) * s, (x_y * z_z * w_x - x_z * z_y * w_x + x_z * z_x * w_y - x_x * z_z * w_y - x_y * z_x * w_z + x_x * z_y * w_z) * s, (x_z * y_y * w_x - x_y * y_z * w_x - x_z * y_x * w_y + x_x * y_z * w_y + x_y * y_x * w_z - x_x * y_y * w_z) * s, (x_y * y_z * z_x - x_z * y_y * z_x + x_z * y_x * z_y - x_x * y_z * z_y - x_y * y_x * z_z + x_x * y_y * z_z) * s);
        return res;
    }
    static lookAt(source, target, up) {
        const vZ = Vec3.equals(source, target)
            ? new Vec3(0, 0, 1)
            : Vec3.substract(source, target).normalize();
        let vX = Vec3.crossProduct(up, vZ).normalize();
        if (!vX.getMagnitude()) {
            if (Math.abs(up.z) === 1) {
                vZ.x += 0.00001;
            }
            else {
                vZ.z += 0.00001;
            }
            vZ.normalize();
            vX = Vec3.crossProduct(up, vZ).normalize();
        }
        const vY = Vec3.crossProduct(vZ, vX).normalize();
        return new Mat4().set(vX.x, vX.y, vX.z, 0, vY.x, vY.y, vY.z, 0, vZ.x, vZ.y, vZ.z, 0, source.x, source.y, source.z, 1);
    }
    static buildScale(x, y = undefined, z = undefined) {
        y !== null && y !== void 0 ? y : (y = x);
        z !== null && z !== void 0 ? z : (z = x);
        return new Mat4().set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    }
    static buildRotationX(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Mat4().set(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
    }
    static buildRotationY(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Mat4().set(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
    }
    static buildRotationZ(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return new Mat4().set(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    static buildTranslate(x, y, z) {
        return new Mat4().set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1);
    }
    static buildOrthographic(near, far, left, right, bottom, top) {
        return new Mat4().set(2 / (right - left), 0, 0, 0, 0, 2 / (top - bottom), 0, 0, 0, 0, 2 / (near - far), 0, (left + right) / (left - right), (bottom + top) / (bottom - top), (near + far) / (near - far), 1);
    }
    static buildPerspective(near, far, ...args) {
        if (args.length === 4) {
            const [left, right, bottom, top] = args;
            return new Mat4().set(2 * near / (right - left), 0, 0, 0, 0, 2 * near / (top - bottom), 0, 0, (right + left) / (right - left), (top + bottom) / (top - bottom), (near + far) / (near - far), -1, 0, 0, 2 * near * far / (near - far), 0);
        }
        else if (args.length === 2) {
            const [fov, aspectRatio] = args;
            const f = Math.tan(0.5 * Math.PI - 0.5 * fov);
            return new Mat4().set(f / aspectRatio, 0, 0, 0, 0, f, 0, 0, 0, 0, (near + far) / (near - far), -1, 0, 0, 2 * near * far / (near - far), 0);
        }
        else {
            throw new Error("Incorrect args quantity");
        }
    }
    static equals(m1, m2, precision = 6) {
        return m1.equals(m2, precision);
    }
    clone() {
        return new Mat4().set(this.x_x, this.x_y, this.x_z, this.x_w, this.y_x, this.y_y, this.y_z, this.y_w, this.z_x, this.z_y, this.z_z, this.z_w, this.w_x, this.w_y, this.w_z, this.w_w);
    }
    set(x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w) {
        this._matrix[0] = x_x;
        this._matrix[1] = x_y;
        this._matrix[2] = x_z;
        this._matrix[3] = x_w;
        this._matrix[4] = y_x;
        this._matrix[5] = y_y;
        this._matrix[6] = y_z;
        this._matrix[7] = y_w;
        this._matrix[8] = z_x;
        this._matrix[9] = z_y;
        this._matrix[10] = z_z;
        this._matrix[11] = z_w;
        this._matrix[12] = w_x;
        this._matrix[13] = w_y;
        this._matrix[14] = w_z;
        this._matrix[15] = w_w;
        return this;
    }
    reset() {
        this._matrix[0] = 1;
        this._matrix[1] = 0;
        this._matrix[2] = 0;
        this._matrix[3] = 0;
        this._matrix[4] = 0;
        this._matrix[5] = 1;
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = 0;
        this._matrix[10] = 1;
        this._matrix[11] = 0;
        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[14] = 0;
        this._matrix[15] = 1;
        return this;
    }
    setFromMat4(m) {
        for (let i = 0; i < this.length; i++) {
            this._matrix[i] = m._matrix[i];
        }
        return this;
    }
    setFromTRS(t, r, s) {
        const x_x = 2 * r.x * r.x;
        const x_y = 2 * r.y * r.x;
        const x_z = 2 * r.z * r.x;
        const y_y = 2 * r.y * r.y;
        const y_z = 2 * r.z * r.y;
        const z_z = 2 * r.z * r.z;
        const w_x = 2 * r.x * r.w;
        const w_y = 2 * r.y * r.w;
        const w_z = 2 * r.z * r.w;
        this.set((1 - y_y - z_z) * s.x, (x_y + w_z) * s.x, (x_z - w_y) * s.x, 0, (x_y - w_z) * s.y, (1 - x_x - z_z) * s.y, (y_z + w_x) * s.y, 0, (x_z + w_y) * s.z, (y_z - w_x) * s.z, (1 - x_x - y_y) * s.z, 0, t.x, t.y, t.z, 1);
        return this;
    }
    setFromQuaternion(q) {
        return this.setFromTRS(new Vec3(0, 0, 0), q, new Vec3(1, 1, 1));
    }
    multiply(mat) {
        const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p] = this._matrix;
        const [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P] = mat._matrix;
        this._matrix[0] = a * A + b * E + c * I + d * M;
        this._matrix[1] = a * B + b * F + c * J + d * N;
        this._matrix[2] = a * C + b * G + c * K + d * O;
        this._matrix[3] = a * D + b * H + c * L + d * P;
        this._matrix[4] = e * A + f * E + g * I + h * M;
        this._matrix[5] = e * B + f * F + g * J + h * N;
        this._matrix[6] = e * C + f * G + g * K + h * O;
        this._matrix[7] = e * D + f * H + g * L + h * P;
        this._matrix[8] = i * A + j * E + k * I + l * M;
        this._matrix[9] = i * B + j * F + k * J + l * N;
        this._matrix[10] = i * C + j * G + k * K + l * O;
        this._matrix[11] = i * D + j * H + k * L + l * P;
        this._matrix[12] = m * A + n * E + o * I + p * M;
        this._matrix[13] = m * B + n * F + o * J + p * N;
        this._matrix[14] = m * C + n * G + o * K + p * O;
        this._matrix[15] = m * D + n * H + o * L + p * P;
        return this;
    }
    multiplyScalar(s) {
        for (let i = 0; i < this.length; i++) {
            this._matrix[i] *= s;
        }
        return this;
    }
    transpose() {
        const temp = new Mat4().setFromMat4(this);
        this.set(temp.x_x, temp.y_x, temp.z_x, temp.w_x, temp.x_y, temp.y_y, temp.z_y, temp.w_y, temp.x_z, temp.y_z, temp.z_z, temp.w_z, temp.x_w, temp.y_w, temp.z_w, temp.w_w);
        return this;
    }
    invert() {
        const s = 1 / this.getDeterminant();
        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = this._matrix;
        this.set((y_z * z_w * w_y - y_w * z_z * w_y + y_w * z_y * w_z - y_y * z_w * w_z - y_z * z_y * w_w + y_y * z_z * w_w) * s, (x_w * z_z * w_y - x_z * z_w * w_y - x_w * z_y * w_z + x_y * z_w * w_z + x_z * z_y * w_w - x_y * z_z * w_w) * s, (x_z * y_w * w_y - x_w * y_z * w_y + x_w * y_y * w_z - x_y * y_w * w_z - x_z * y_y * w_w + x_y * y_z * w_w) * s, (x_w * y_z * z_y - x_z * y_w * z_y - x_w * y_y * z_z + x_y * y_w * z_z + x_z * y_y * z_w - x_y * y_z * z_w) * s, (y_w * z_z * w_x - y_z * z_w * w_x - y_w * z_x * w_z + y_x * z_w * w_z + y_z * z_x * w_w - y_x * z_z * w_w) * s, (x_z * z_w * w_x - x_w * z_z * w_x + x_w * z_x * w_z - x_x * z_w * w_z - x_z * z_x * w_w + x_x * z_z * w_w) * s, (x_w * y_z * w_x - x_z * y_w * w_x - x_w * y_x * w_z + x_x * y_w * w_z + x_z * y_x * w_w - x_x * y_z * w_w) * s, (x_z * y_w * z_x - x_w * y_z * z_x + x_w * y_x * z_z - x_x * y_w * z_z - x_z * y_x * z_w + x_x * y_z * z_w) * s, (y_y * z_w * w_x - y_w * z_y * w_x + y_w * z_x * w_y - y_x * z_w * w_y - y_y * z_x * w_w + y_x * z_y * w_w) * s, (x_w * z_y * w_x - x_y * z_w * w_x - x_w * z_x * w_y + x_x * z_w * w_y + x_y * z_x * w_w - x_x * z_y * w_w) * s, (x_y * y_w * w_x - x_w * y_y * w_x + x_w * y_x * w_y - x_x * y_w * w_y - x_y * y_x * w_w + x_x * y_y * w_w) * s, (x_w * y_y * z_x - x_y * y_w * z_x - x_w * y_x * z_y + x_x * y_w * z_y + x_y * y_x * z_w - x_x * y_y * z_w) * s, (y_z * z_y * w_x - y_y * z_z * w_x - y_z * z_x * w_y + y_x * z_z * w_y + y_y * z_x * w_z - y_x * z_y * w_z) * s, (x_y * z_z * w_x - x_z * z_y * w_x + x_z * z_x * w_y - x_x * z_z * w_y - x_y * z_x * w_z + x_x * z_y * w_z) * s, (x_z * y_y * w_x - x_y * y_z * w_x - x_z * y_x * w_y + x_x * y_z * w_y + x_y * y_x * w_z - x_x * y_y * w_z) * s, (x_y * y_z * z_x - x_z * y_y * z_x + x_z * y_x * z_y - x_x * y_z * z_y - x_y * y_x * z_z + x_x * y_y * z_z) * s);
        return this;
    }
    getDeterminant() {
        const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p] = this._matrix;
        const det = d * g * j * m - c * h * j * m - d * f * k * m + b * h * k * m +
            c * f * l * m - b * g * l * m - d * g * i * n + c * h * i * n +
            d * e * k * n - a * h * k * n - c * e * l * n + a * g * l * n +
            d * f * i * o - b * h * i * o - d * e * j * o + a * h * j * o +
            b * e * l * o - a * f * l * o - c * f * i * p + b * g * i * p +
            c * e * j * p - a * g * j * p - b * e * k * p + a * f * k * p;
        return det;
    }
    getTRS() {
        const t = new Vec3(this.w_x, this.w_y, this.w_z);
        const d = this.getDeterminant();
        const s_x = new Vec3(this.x_x, this.x_y, this.x_z).getMagnitude() * (d < 0 ? -1 : 1);
        const s_y = new Vec3(this.y_x, this.y_y, this.y_z).getMagnitude();
        const s_z = new Vec3(this.z_x, this.z_y, this.z_z).getMagnitude();
        const s = new Vec3(s_x, s_y, s_z);
        const rm = new Mat4().set(this.x_x / s_x, this.x_y / s_x, this.x_z / s_x, 0, this.y_x / s_y, this.y_y / s_y, this.y_z / s_y, 0, this.z_x / s_z, this.z_y / s_z, this.z_z / s_z, 0, 0, 0, 0, 1);
        const r = Quaternion.fromRotationMatrix(rm);
        return { t, r, s };
    }
    equals(m, precision = 6) {
        for (let i = 0; i < this.length; i++) {
            if (+this._matrix[i].toFixed(precision) !== +m._matrix[i].toFixed(precision)) {
                return false;
            }
        }
        return true;
    }
    applyScaling(x, y = undefined, z = undefined) {
        const m = Mat4.buildScale(x, y, z);
        return this.multiply(m);
    }
    applyTranslation(x, y, z) {
        const m = Mat4.buildTranslate(x, y, z);
        return this.multiply(m);
    }
    applyRotation(axis, theta) {
        let m;
        switch (axis) {
            case "x":
            default:
                m = Mat4.buildRotationX(theta);
                break;
            case "y":
                m = Mat4.buildRotationY(theta);
                break;
            case "z":
                m = Mat4.buildRotationZ(theta);
                break;
        }
        return this.multiply(m);
    }
    toArray() {
        return this._matrix.slice();
    }
    toIntArray() {
        return new Int32Array(this);
    }
    toFloatArray() {
        return new Float32Array(this);
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++) {
            yield this._matrix[i];
        }
    }
}

class Plane {
    constructor(normal = new Vec3(0, 0, 1), d = 0) {
        if (!normal.getMagnitude()) {
            throw new Error("Normal length is zero. Cannot define direction");
        }
        this.normal = normal.clone().normalize();
        this.d = d;
    }
    get point() {
        return this.normal.clone().multiplyByScalar(-this.d);
    }
    static equals(p1, p2, precision = 6) {
        return p1.equals(p2, precision);
    }
    static fromNormalAndPoint(normal, pointOnPlane) {
        return new Plane().setFromNormalAndPoint(normal, pointOnPlane);
    }
    static fromVec3s(a, b, c) {
        return new Plane().setFromPoints(a, b, c);
    }
    static applyMat4(p, m) {
        return p.clone().applyMat4(m);
    }
    static multiplyByScalar(p, s) {
        return p.clone().multiplyByScalar(s);
    }
    static translate(p, v) {
        return p.clone().translate(v);
    }
    static projectPoint(p, v) {
        return p.projectPoint(v);
    }
    clone() {
        return new Plane(this.normal, this.d);
    }
    set(normal, d) {
        if (!normal.getMagnitude()) {
            throw new Error("Normal length is zero. Cannot define direction");
        }
        this.normal = normal.clone().normalize();
        this.d = d;
        return this;
    }
    setFromNormalAndPoint(normal, pointOnPlane) {
        if (!normal.getMagnitude()) {
            throw new Error("Normal length is zero. Cannot define direction");
        }
        this.normal.setFromVec3(normal).normalize();
        this.d = -pointOnPlane.dotProduct(normal);
        return this;
    }
    setFromPoints(a, b, c) {
        const normal = Vec3.substract(b, a).crossProduct(Vec3.substract(c, a));
        if (!normal.getMagnitude()) {
            throw new Error("Normal length is zero. Points are equal or collinear");
        }
        this.setFromNormalAndPoint(normal, a);
        return this;
    }
    applyMat4(m) {
        const normalMat = m.clone().invert().transpose();
        const transformedPoint = this.point.applyMat4(m);
        this.normal.applyMat4(normalMat).normalize();
        this.d = -transformedPoint.dotProduct(this.normal);
        return this;
    }
    normalize() {
        const inversedNormalMagnitude = 1 / this.normal.getMagnitude();
        return this.multiplyByScalar(inversedNormalMagnitude);
    }
    multiplyByScalar(s) {
        this.normal.multiplyByScalar(s);
        this.d *= s;
        return this;
    }
    translate(v) {
        this.d -= v.dotProduct(this.normal);
        return this;
    }
    equals(p, precision = 6) {
        return this.normal.equals(p.normal, precision)
            && +this.d.toFixed(precision) === +p.d.toFixed(precision);
    }
    getDistanceToPoint(v) {
        return this.normal.dotProduct(v) + this.d;
    }
    projectPoint(v) {
        return Vec3.multiplyByScalar(this.normal, -this.getDistanceToPoint(v)).add(v);
    }
}

class Segment {
    constructor(a, b) {
        this.a = a.clone();
        this.b = b.clone();
    }
    static fromLine(s) {
        return new Segment(s.a, s.b);
    }
    static applyMat4(s, m) {
        return new Segment(Vec3.applyMat4(s.a, m), Vec3.applyMat4(s.b, m));
    }
    static equals(s1, s2) {
        return s1.equals(s2);
    }
    clone() {
        return new Segment(this.a, this.b);
    }
    set(a, b) {
        this.a = a.clone();
        this.b = b.clone();
        return this;
    }
    setFromLine(s) {
        this.a = s.a.clone();
        this.b = s.b.clone();
        return this;
    }
    getCenter() {
        return Vec3.add(this.a, this.b).multiplyByScalar(0.5);
    }
    getDelta() {
        return Vec3.substract(this.b, this.a);
    }
    getLength() {
        return getDistance3D(this.a.x, this.a.y, this.a.z, this.b.x, this.b.y, this.b.z);
    }
    applyMat4(m) {
        this.a.applyMat4(m);
        this.b.applyMat4(m);
        return this;
    }
    equals(s, precision = 6) {
        if (this.a.equals(s.a, precision)
            && this.b.equals(s.b, precision)) {
            return true;
        }
        return false;
    }
}

class Triangle {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    static fromTriangle(t) {
        return new Triangle(t.a, t.b, t.c);
    }
    static equals(t1, t2, precision = 6) {
        return t1.equals(t2, precision);
    }
    clone() {
        return new Triangle(this.a, this.b, this.c);
    }
    set(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    setFromTriangle(t) {
        this.a = t.a.clone();
        this.b = t.b.clone();
        this.c = t.c.clone();
        return this;
    }
    getArea() {
        const u = this.b.clone().substract(this.a);
        const v = this.c.clone().substract(this.a);
        return u.crossProduct(v).getMagnitude() / 2;
    }
    getCenter() {
        return this.a.clone().add(this.b).add(this.c).multiplyByScalar(1 / 3);
    }
    getNormal() {
        const u = this.b.clone().substract(this.a);
        const v = this.c.clone().substract(this.a);
        return u.crossProduct(v).normalize();
    }
    getBary(v) {
        const ac = this.c.clone().substract(this.a);
        const ab = this.b.clone().substract(this.a);
        const av = v.clone().substract(this.a);
        const acSqr = ac.dotProduct(ac);
        const acab = ac.dotProduct(ab);
        const acav = ac.dotProduct(av);
        const abSqr = ab.dotProduct(ab);
        const abav = ab.dotProduct(av);
        const d = acSqr * abSqr - acab * acab;
        if (!d) {
            return null;
        }
        const baryB = (acSqr * abav - acab * acav) / d;
        const baryC = (abSqr * acav - acab * abav) / d;
        const baryA = 1 - baryB - baryC;
        return new Vec3(baryA, baryB, baryC);
    }
    getUV(v, uvA, uvB, uvC) {
        const bary = this.getBary(v);
        return new Vec2()
            .add(uvA.clone().multiplyByScalar(bary.x))
            .add(uvB.clone().multiplyByScalar(bary.y))
            .add(uvC.clone().multiplyByScalar(bary.z));
    }
    valid(v) {
        const bary = this.getBary(v);
        return !!bary;
    }
    contains(v) {
        const bary = this.getBary(v);
        return bary.x >= 0
            && bary.y >= 0
            && (bary.x + bary.y) <= 1;
    }
    equals(t, precision = 6) {
        if (this.a.equals(t.a, precision)
            && this.b.equals(t.b, precision)
            && this.c.equals(t.c, precision)) {
            return true;
        }
        return false;
    }
}

class Vec4 {
    constructor(x = 0, y = 0, z = 0, w = 1) {
        this.length = 4;
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    static fromVec3(v) {
        return new Vec4(v.x, v.y, v.z);
    }
    static multiplyByScalar(v, s) {
        return new Vec4(v.x * s, v.y * s, v.z * s, v.w * s);
    }
    static addScalar(v, s) {
        return new Vec4(v.x + s, v.y + s, v.z + s, v.w + s);
    }
    static normalize(v) {
        return new Vec4().setFromVec4(v).normalize();
    }
    static add(v1, v2) {
        return new Vec4(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
    }
    static substract(v1, v2) {
        return new Vec4(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
    }
    static dotProduct(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    }
    static applyMat4(v, m) {
        return v.clone().applyMat4(m);
    }
    static lerp(v1, v2, t) {
        return v1.clone().lerp(v2, t);
    }
    static equals(v1, v2, precision = 6) {
        if (!v1) {
            return false;
        }
        return v1.equals(v2, precision);
    }
    clone() {
        return new Vec4(this.x, this.y, this.z, this.w);
    }
    set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    setFromVec3(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = 1;
    }
    setFromVec4(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
    multiplyByScalar(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        this.w *= s;
        return this;
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        this.w += s;
        return this;
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    normalize() {
        const m = this.getMagnitude();
        if (m) {
            this.x /= m;
            this.y /= m;
            this.z /= m;
            this.w /= m;
        }
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    }
    substract(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    }
    dotProduct(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }
    applyMat4(m) {
        if (m.length !== 16) {
            throw new Error("Matrix must contain 16 elements");
        }
        const { x, y, z, w } = this;
        const [x_x, x_y, x_z, x_w, y_x, y_y, y_z, y_w, z_x, z_y, z_z, z_w, w_x, w_y, w_z, w_w] = m;
        this.x = x * x_x + y * y_x + z * z_x + w * w_x;
        this.y = x * x_y + y * y_y + z * z_y + w * w_y;
        this.z = x * x_z + y * y_z + z * z_z + w * w_z;
        this.w = x * x_w + y * y_w + z * z_w + w * w_w;
        return this;
    }
    lerp(v, t) {
        this.x += t * (v.x - this.x);
        this.y += t * (v.y - this.y);
        this.z += t * (v.z - this.z);
        this.w += t * (v.w - this.w);
        return this;
    }
    equals(v, precision = 6) {
        if (!v) {
            return false;
        }
        return +this.x.toFixed(precision) === +v.x.toFixed(precision)
            && +this.y.toFixed(precision) === +v.y.toFixed(precision)
            && +this.z.toFixed(precision) === +v.z.toFixed(precision)
            && +this.w.toFixed(precision) === +v.w.toFixed(precision);
    }
    toArray() {
        return [this.x, this.y, this.z, this.w];
    }
    toIntArray() {
        return new Int32Array(this);
    }
    toFloatArray() {
        return new Float32Array(this);
    }
    *[Symbol.iterator]() {
        yield this.x;
        yield this.y;
        yield this.z;
        yield this.w;
    }
}

export { EulerAngles, Mat3, Mat4, Plane, Quaternion, Segment, Triangle, Vec2, Vec3, Vec4, clamp, degToRad, getDistance2D, getDistance3D, getRandomArrayElement, getRandomFloat, getRandomInt, isPowerOf2, lerp, radToDeg, smoothstep };
