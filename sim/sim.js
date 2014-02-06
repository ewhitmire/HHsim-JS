/******************************************************************************
* Eric Whitmire
*
* Hodgkin Huxley Simulation
******************************************************************************/

var HHSIM = new function()
{
	// Max conductivities
	G_NA = 120;
	G_K = 36;
	G_L = 0.3;

	// Nernst Potentials
	E_NA = 115;
	E_K = -12;
	E_L = 10.6;

	C_M = 1;	// membrane capacitance

	Q = 3;

	T_STEP = 0.001;
	T_MAX = 20;

	this.utils = {};

	this.makeStim = function(amp, start, stop){
		return zeros(start/T_STEP).concat(arrayValue((stop - start)/T_STEP, amp)).concat(zeros(T_MAX/T_STEP - stop/T_STEP))
	};

	this.simulate = function(Istim)
	{
		iterations = T_MAX/T_STEP

		// Set up containers
		v_ms = zeros(iterations)
		ms = zeros(iterations)
		hs = zeros(iterations)
		ns = zeros(iterations)

		// Initial conditions
		v_m = 0
		m = this.utils.m_ss(v_m)
		h = this.utils.h_ss(v_m)
		n = this.utils.n_ss(v_m)

		function rateStep(prev, rateInfo){
			return rateInfo.ss - (rateInfo.ss-prev)*Math.exp(-T_STEP/rateInfo.tau)
		}

		for (var index = 0; index < iterations; index++){

			// Record current state
			ms[index] = m
			ns[index] = n
			hs[index] = h
			v_ms[index] = v_m

			// Compute updated m, n, h values
			m = rateStep(m, this.utils.m_ss_tau(v_m));
			n = rateStep(n, this.utils.n_ss_tau(v_m));
			h = rateStep(h, this.utils.h_ss_tau(v_m));

			// Compute new current
			Ina = G_NA * Math.pow(m, 3) * h * (v_m - E_NA)
			Ik = G_K * Math.pow(n, 4) * (v_m - E_K)
			Il = G_L * (v_m - E_L)

			// Compute voltage change
			delV_m = (Istim[index] - Ik - Ina - Il) * T_STEP / C_M;
			v_m += delV_m;
		}

		return {
			t: _.range(0, T_MAX, T_STEP), 
			v_m: v_ms,
			m: ms, 
			n:ns, 
			h:hs
		};
	}

}
