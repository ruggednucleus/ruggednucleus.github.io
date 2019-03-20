function Vector(x, y, z) {
    function self() {
        return Vector(x, y, z);
    }
    return {
        x: function() {
            return x;
        },

        y: function() {
            return y;
        },

        z: function() {
            return z;
        },

        add: function(v) {
            return Vector(x + v.x(), y + v.y(), z + v.z());
        },

        scale: function(s) {
            return Vector(x * s, y * s, z * s);
        },

        dot: function(v) {
            return x * v.x() + y * v.y() + z * v.z();
        },

        cross: function(v) {
            return Vector(y * v.z() - z * v.y(), z * v.x() - x * v.z(), x * v.y() - y * v.x());
        },

        normalise: function() {
            return self().scale(1 / Math.sqrt(self().dot(self())));
        },
    }
}

//G = [0, 134786, 135298, 139394, 237714, 139434, 135366, 249474, 0];
G = [0, 0, 0, 0, 512, 0, 0, 0, 0];


function sampler(o, d) {

    let result = tracer(o, d, Vector(0, 0, 0));

    let m = result.m;
    let n = result.n;
    let t = result.t;

    if(m === 0) {
        return Vector(0.7, 0.6, 1).scale(Math.pow(1 - d.z(), 4));
    }

    let h = o.add(d.scale(t));
    let l = Vector(9 + Math.random(), 9 + Math.random(), 16);
    l = l.add(h.scale(-1));
    l = l.normalise();
    let r = d.add(n.scale(n.dot(d.scale(-2))));
    
    let b = l.dot(n);

    if(b < 0) {
        b = 0;
    } else {
        result = tracer(h, l, n);
        t = result.t;
        n = result.n;

        if(result.m > 0) {
            b = 0;
        }
    }

    let p = Math.pow(l.dot(r.scale(b > 0 ? 1: 0)), 99);

    if((m & 1) === 1) {
        h = h.scale(0.2);
        let ceil = Math.ceil(h.x()) + Math.ceil(h.y());
        return ((ceil & 1) === 1 ? Vector(3,1,1) : Vector(3,3,3)).scale(b * 0.2 + 0.1);
    }

    return Vector(p, p, p).add(sampler(h, r).scale(0.5));
}

function tracer(o, d, n) {
    let t = 1e9;
    let m = 0;
    let p = -o.z() / d.z();

    if(0.01 < p) {
        t = p;
        n = Vector(0, 0, 1);
        m = 1;
    }

    for(let k = 19; k--;) {
        for(let j = 9; j--;) {
            if((G[j] & (1 << k)) > 0) {
                p = o.add(Vector(-k, 0, -j - 4));
                let b = p.dot(d);
                let c = p.dot(p) - 1;
                let q = b * b - c;

                if(q > 0) {
                    let s = -b - Math.sqrt(q);

                    if(s < t && s > 0.01) {
                        t = s;
                        n = p.add(d.scale(t)).normalise();
                        m = 2;
                    }
                }
            }
        }
    }

    return {m: m, n: n, t: t};
}

function line(y, a, b, c) {
    let data = [];

    for(let x = 0; x < 512; x++) {

        let p = Vector(13, 13, 13);
        for(let r = 64; r--;) {
            let t = a.scale(Math.random() - 0.5).scale(99);
            let t2 = b.scale(Math.random() - 0.5).scale(99);
            t.add(t2);

            let dirA = a.scale(Math.random() + x);
            let dirB = b.scale(Math.random() + y);
            let dirC = dirA.add(dirB).add(c);

            let dir = t.scale(-1).add(dirC.scale(16)).normalise();

            p = sampler(Vector(17, 16, 8).add(t), dir).scale(3.5).add(p);
        }

        data[x * 4] = p.x() << 0;
        data[x * 4 + 1] = p.y() << 0;
        data[x * 4 + 2] = p.z() << 0;
        data[x * 4 + 3] = 255;
    }

    return data;
}

onmessage = function() {
    let g = Vector(-6, -16, 0).normalise();
    let a = Vector(0,0,1).cross(g).normalise().scale(0.002);
    let b = g.cross(a).normalise().scale(0.002);
    let c = a.add(b).scale(-256).add(g);

    for(let y = 0; y < 512; y++) {
        let data = line(y, a, b, c);
        postMessage([511 - y, data, y === 511]);
    }
}