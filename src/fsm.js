class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
    	this.initial = config.initial;
    	this.states = config.states;
    	this.history = [this.initial];
    	this.deleted = [];
    	this.ondoIsCalled = 0;

    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
    	return this.initial;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
    	if(this.states[state]) {
    		this.initial = state;
    		this.history.push(state);
    		this.ondoIsCalled = 0;
    	} else throw new Error();
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
    	for(var key in this.states[this.initial].transitions) {
    		if(key === event) {
    			this.initial = this.states[this.initial].transitions[event];
    			this.history.push(this.initial);
    			this.ondoIsCalled = 0;
    			return this;
    		}
    	}
			throw new Error();
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
    	this.initial = 'normal';
    	this.history.length = 1;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
    	var states = [];
    	if(event === undefined) {
    		for(var key in this.states) {
    			states.push(key);
    		}
    	} else {
    		for(var name in this.states) {
    			if(this.states[name].transitions[event]) {
    				states.push(name);
    			}
    		}
    	}
    	return states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
    	if(this.history.length <= 1) {
    		return false;
    	} else {
    		this.deleted.push(this.history[this.history.length-1]);
    		this.history.pop();
    		this.initial = this.history[this.history.length-1];
    		this.ondoIsCalled = 1;
    	}
    	return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
    	if(this.deleted.length == 0) {
    		return false;
    	} else {
    		this.history.push(this.deleted[this.deleted.length-1]);
    		this.deleted.pop();
    		this.initial = this.history[this.history.length-1];
    		if(this.ondoIsCalled == 0) return false;
    	}
    	return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
    	this.history.length = 1;
    	
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
