'use strict';

function Create_Btn(parent, txt) {
	const e_btn = document.createElement('button');
	e_btn.textContent = txt;
	parent.appendChild(e_btn);
	return e_btn;
}

function Create_FlexStg(parent) {
	const e_stg = document.createElement('div');
	e_stg.style.display = 'flex';
	e_stg.style.flexWrap = 'wrap';
	parent.appendChild(e_stg);
	return e_stg;
}

function Create_TxtDiv(parent, txt) {
	const e_div_txt = document.createElement('div');
	e_div_txt.textContent = txt;
	parent.appendChild(e_div_txt);
	return e_div_txt;
}

// =========================================
function Prms_SendMsg_toCS(request) {
	return browser.tabs.query({currentWindow: true, active: true})
	.then((tabs) => {
		if (tabs.length > 1) {
			throw new Error('browser.tabs.query が複数個のtabを返しました。個数 -> ' + tabs.length);
		}

		// tabs.sendMessage() は、必ず Promise を返してくる
		return browser.tabs.sendMessage(tabs[0].id, request);
	})
	.catch((err) => { throw err; });
}

// =========================================
const g_frm_general = new function() {
	const m_e_frm = Create_FlexStg(document.body);

	const m_e_btn_start = Create_Btn(m_e_frm, '開始');
	const m_e_btn_stop = Create_Btn(m_e_frm, '停止');
	m_e_btn_stop.disabled = true;

	const m_e_btn_clear_disp = Create_Btn(m_e_frm, '画面クリア');
	const m_e_btn_clear_info = Create_Btn(m_e_frm, 'info クリア');

	m_e_btn_start.onclick = () => {
		g_frm_disp.Append_Txt('--- 連続再生開始');
		m_e_btn_start.disabled = true;
		m_e_btn_stop.disabled = false;

		g_ym_continue.Start();
	};

	m_e_btn_stop.onclick = () => {
		g_frm_disp.Append_Txt('--- 連続再生停止');
		g_ym_continue.Stop();

		m_e_btn_start.disabled = false;
		m_e_btn_stop.disabled = true;
	};

	m_e_btn_clear_disp.onclick = () => {
		g_frm_disp.Clear();
	};

	m_e_btn_clear_info.onclick = () => {
		g_ym_continue.ClearElapsedTime();
		g_frm_info.SetTxt('');
	};
};

// -----------------------------------------
function InfoFrame(str) {
	const mc_str_title = '　' + str + ': ';
	const m_e_frm = Create_TxtDiv(document.body);
	m_e_frm.textContent = mc_str_title;

	this.SetTxt = (txt) => {
		m_e_frm.textContent = mc_str_title + txt;
	};
};

const g_frm_elps_time = new InfoFrame('経過時間');
const g_frm_info = new InfoFrame('info');

// -----------------------------------------
const g_frm_disp = new function() {

	const m_e_frm = document.createElement('textarea');
	document.body.appendChild(m_e_frm);
	m_e_frm.classList.add('frm_disp');

	this.Append_Txt = (txt) => {
		m_e_frm.value = m_e_frm.value + '\n' + txt;
	};

	this.Clear = () => {
		m_e_frm.value = '';
	};
};

// =========================================
const g_ym_continue = new function() {
	const mc_sec_interval = 5;

	let m_timer_id = 0;
	let m_elapsed_sec = 0;

	this.Start = () =>  {
		if (m_timer_id !== 0) {
			g_frm_disp.Append_Txt('!!! 既に g_ym_continue は起動しています');
			return;
		}

		m_timer_id = setInterval(Chk_YMPlayer, mc_sec_interval * 1000);
	};

	this.Stop = () => {
		if (m_timer_id === 0) {
			g_frm_disp.Append_Txt('!!! g_ym_continue は起動していません');
			return;
		}

		clearInterval(m_timer_id);
		m_timer_id = 0;
	};

	const Chk_YMPlayer = () => {

		Prms_SendMsg_toCS(null)
		.then((ret) => {
			if (ret.msg !== null) {
				g_frm_disp.Append_Txt(ret.msg);
			}
			g_frm_info.SetTxt(ret.info);
		})
		.catch((err) => {
			g_frm_disp.Append_Txt('!!! catch: Prms_SendMsg_toCS() is failed.');
			g_frm_disp.Append_Txt(err.message);
		});

		m_elapsed_sec += mc_sec_interval;
		const minutes = parseInt(m_elapsed_sec / 60) % 60;
		const hours = parseInt(m_elapsed_sec / 3600);
		g_frm_elps_time.SetTxt(hours + '時間 ' + minutes + '分 ' + (m_elapsed_sec % 60) + '秒');
	};

	this.ClearElapsedTime = () => {
		m_elapsed_sec = 0;
		g_frm_elps_time.SetTxt('0時間 0分 0秒');
	};
};

