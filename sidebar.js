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
};

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
	let m_timer_id = 0;

	this.Start = () =>  {
		if (m_timer_id !== 0) {
			g_frm_disp.Append_Txt('!!! 既に g_ym_continue は起動しています');
			return;
		}

		// 15 秒後ごとにチェックする
		m_timer_id = setInterval(Chk_YMPlayer, 15000);
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
			g_frm_disp.Append_Txt(ret);
		})
		.catch((err) => {
			g_frm_disp.Append_Txt('!!! catch: Prms_SendMsg_toCS() is failed.');
			g_frm_disp.Append_Txt(err.message);
		});

	};
};
