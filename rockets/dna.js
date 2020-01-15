class DNA {
    constructor(genes) {
        this.genes = genes;
        this.index = 0;
    }

    next() {
        if(this.index < this.genes.length) {
            const gene = this.genes[this.index];
            this.index++;
            return gene;
        } else {
            return null;
        }
    }

    static crossover(a, b, mutationRate, engines, maxTime) {
        let genes = [];
        /*
        for(let i = 0; i < a.genes.length; i++) {
            if(Math.random() < mutationRate) {
                genes.push(DNA.randomGene(engines, maxTime));
            } else if(Math.random() > 0.5) {
                genes.push(a.genes[i]);
            } else {
                genes.push(b.genes[i]);
            }
        }*/
        
        const split = a.genes.length * Math.random() | 0;
        genes = genes.concat(a.genes.slice(0, split));
        genes = genes.concat(b.genes.slice(split));

        for(let i = 0; i < genes.length; i++) {
            if(Math.random() < mutationRate) {
                genes[i] = DNA.randomGene(engines, maxTime)
            }
        }

        return new DNA(genes);
    }

    static randomDNA(length, engines, maxTime) {
        const genes = [];
        for(let i = 0; i < length; i++) {
            genes.push(DNA.randomGene(engines, maxTime));
        }
        return new DNA(genes);
    }

    static randomGene(engines, maxTime) {
        return {
            engine: engines * Math.random() | 0,
            time: Math.random() * maxTime | 0,
        };
    }
}