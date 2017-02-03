class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.states = config.states;
        this.state = config.initial;
        this.history = {
            step: 0,
            states: [this.state],
            statusRedo: false
        };
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {

        if(this.states[state]!==undefined) {
            this.state = state;
            this.setHistory(this.state);
        }
        else {
            throw new Error('State not found');
        }

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {

        if(this.states[this.state].transitions[event]!==undefined) {
            this.state = this.states[this.state].transitions[event];
            this.setHistory(this.state);
        }
        else {
            throw new Error('State not found');
        }

    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.history.states[0];
        this.clearHistory();
    }

    setHistory(state) {
        this.history.states.push(state);
        this.history.step++;
        this.history.statusRedo = false;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let statesArray = [];
        if(event == undefined || event == '') {
            for (let key in this.states) {
                statesArray.push(key);
            }
        }
        else {
            for(let state in this.states) {
                for(let transition in this.states[state].transitions) {
                    if(transition === event) statesArray.push(state);
                }
            }
        }

        return statesArray;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(this.history.step < 1) return false;

        this.history.step--;
        this.state = this.history.states[this.history.step];
        this.history.statusRedo = true;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(this.history.states[this.history.step + 1]===undefined || !this.history.statusRedo) return false;

        this.history.step++;
        this.state = this.history.states[this.history.step];

        return true;
    }
    /**
     * Clears transition history
     */
    clearHistory() {
        this.history.step = 0;
        this.history.states = [this.history.states[0]]
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
