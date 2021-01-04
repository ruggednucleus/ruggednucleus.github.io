const flag = document.getElementById("flag");
const new_flag = new Image();

let options = 4;
let url = new URL(window.location);
if(url.searchParams.get("options")) {
    options = parseInt(url.searchParams.get("options"));
}

let index = 0;
let click_time = -Infinity;
let delay = 500;

let correct_button;
let current_state;
let state_list = states.slice();
let continents = {};
states.forEach(state => {
    if(!continents[state.continent]) {
        continents[state.continent] = [];
    }

    continents[state.continent].push(state);
});

const buttons = [];
for(let i = 0; i < options; i++) {
    const button = document.createElement("button");
    buttons.push(button);
    button.addEventListener("click", (e) => {
        for(let i = 0; i < buttons.length; i++) {
            if(buttons[i] === correct_button) {
                buttons[i].classList.add("correct");
            }
        }
        if(e.target !== correct_button) {
            e.target.classList.add("wrong");
        }
        next_state();
        click_time = performance.now();
    });
    document.getElementById("button_container").appendChild(button);
}

function states_from_same_continent(state, n) {
    const states = [state];
    if(continents[state.continent].length >= n) {
        let i = 0;
        while(states.length < n && i < 1000) {
            i++;
            let new_state = continents[state.continent][continents[state.continent].length * Math.random() | 0];
            let included = false;
            for(let i = 0; i < states.length; i++) {
                if(states[i].name === new_state.name) {
                    included = true;
                    break;
                }
            }

            if(!included) {
                states.push(new_state);
            }
        }
    }
    return states;
}

function next_state() {
    current_state = state_list.splice(state_list.length * Math.random() | 0, 1)[0];
    new_flag.src = current_state.flag.replace("200px", `${window.innerWidth * 0.8 | 0}px`);
}

function set_flag() {
    flag.src = new_flag.src;
    for(let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("correct");
        buttons[i].classList.remove("wrong");
    }

    const states = states_from_same_continent(current_state, options);
    for(let i = 0; i < buttons.length; i++) {
        let state = states.splice(states.length * Math.random() | 0, 1)[0];
        buttons[i].innerText = state.name;
        if(state.name === current_state.name) {
            correct_button = buttons[i];
        }
    }
}

new_flag.addEventListener("load", () => {
    const wait = delay - (performance.now() - click_time);
    setTimeout(set_flag, wait);
});

next_state();