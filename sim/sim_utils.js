/******************************************************************************
* Eric Whitmire
*
* Utility functions based on the Hodgkin-Huxley equations to compute steady-
* state values of m, n, and h.
******************************************************************************/

HHSIM.utils = {
	qp: 1,

	updateQ: function(temp){
		this.qp = Math.pow(Q, (temp - 6.3)/10);
	},

	ss: function(alpha, beta){
		return alpha / (alpha + beta);
	},

	tau: function(alpha, beta){
		return 1 / (alpha + beta)
	},

	// helper function
	ss_tau: function(alpha, beta){
		return {ss: this.ss(alpha, beta), tau: this.tau(alpha, beta)}
	},

	n_ss_tau: function(v_m){
		return this.ss_tau(this.alpha_n(v_m), this.beta_n(v_m));
	},

	m_ss_tau: function(v_m){
		return this.ss_tau(this.alpha_m(v_m), this.beta_m(v_m));
	},

	h_ss_tau: function(v_m){
		return this.ss_tau(this.alpha_h(v_m), this.beta_h(v_m));
	},

	n_ss: function(v_m){
		return this.ss(this.alpha_n(v_m), this.beta_n(v_m));
	},

	m_ss: function(v_m){
		return this.ss(this.alpha_m(v_m), this.beta_m(v_m));
	},

	h_ss: function(v_m){
		return this.ss(this.alpha_h(v_m), this.beta_h(v_m));
	},

	alpha_h: function(v_m){
		return this.qp * 0.07 * Math.exp(-v_m / 20.0);
	},

	beta_h: function(v_m){
		return this.qp * 1 / (Math.exp((30.0 - v_m) / 10) + 1);
	},

	alpha_m: function(v_m){
		den = Math.exp(0.1 * (25.0 - v_m)) - 1;
		return this.qp * (den == 0 ? 1 : 0.1 * (25.0 - v_m) / den);
	},

	beta_m: function(v_m){
		return this.qp * 4 * Math.exp(-v_m / 18.0);
	},

	alpha_n: function(v_m){
		den = Math.exp((10.0 - v_m) / 10) - 1;
		return this.qp * (den == 0 ? 0.1 : 0.01 * (10 - v_m) / den);
	},

	beta_n: function(v_m){
		return this.qp * 0.125 * Math.exp(-v_m / 80.0)
	}
}