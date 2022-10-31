class ColourGenerator {
    static hue = Math.random();
    static golden_ratio_conjugate = 0.618033988749895;

    static hsv_to_rgb(h, s, v) {
        let r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    static generate(n) {
        //this.hue += this.golden_ratio_conjugate;
        //this.hue %= 1;
        return this.hsv_to_rgb((this.hue + this.golden_ratio_conjugate * n) % 1, 0.6, 0.80);
    }
}