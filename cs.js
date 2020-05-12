'use strict';

// document.body.style.border = "5px solid red";

// background.js に Promise が返される
browser.runtime.onMessage.addListener((str_cmd) => {
	switch (str_cmd) {
		case 'test':
			return Promise.resolve(g_auto_ymplay.Test());

		case 'press_btn':
			g_auto_ymplay.PressBtn();
			return null;
	}
	throw new Error('不明な str_cmd -> ' + str_cmd);
});

// -----------------------------------------
function G_Test() {
	const time_info = document.getElementsByClassName('time-info');
	return time_info[0].textContent;
}

function G_Test2() {
	const test_elms = document.getElementsByTagName('paper-button');

	let ret_msg = 'attr-> ';
	for (let attr of test_elms[0].attributes) {
		ret_msg += attr.name + '->' + attr.value + '/ ';
	}

//	test_elms[0].click();

	return ret_msg;

//	return test_elms[0].className;
}


function G_Test3() {
	const test_elms = document.getElementsByTagName('paper-dialog');

	let ret_msg = 'attr-> ';
	for (let attr of test_elms[0].attributes) {
		ret_msg += attr.name + '->' + attr.value + '/ ';
	}

//	test_elms[0].click();

	return ret_msg;

//	return test_elms[0].className;
}


const g_auto_ymplay = new function () {
	let m_e_prog_bar = null;
	let m_e_play_pause_btn = null;

	function Init() {
		m_e_prog_bar = document.getElementById('progress-bar');
		if (m_e_prog_bar === null) {
			throw new Error('progress-bar の取得に失敗しました');
		}

		m_e_play_pause_btn = document.getElementById('play-pause-button');
		if (m_e_play_pause_btn === null) {
			throw new Error('play-pause-button の取得に失敗しました');
		}
	};

	this.PressBtn = () => {
		m_e_play_pause_btn.click();
	};

	this.Test = () => {
		if (m_e_prog_bar === null) { Init(); }

		return m_e_prog_bar.getAttribute('aria-valuenow');
/*
		const ary_elm = document.getElementsByTagName('paper-dialog');
		if (ary_elm.length === 0) {
			return {msg: null, status: 'paper-dialog は存在していません'};
		}

		if (ary_elm[0].style.display === 'none') {
			return {msg: null, status: "paper-dialog.style.display is none"};
		}
		
		return {msg: null, status: 'paper-dialog.style.display の none 解除'};
*/
/*
		const ary_elm = document.getElementById('play-pause-button');

		let ret_msg = '[attr] ';
		for (let attr of ary_elm.attributes) {
			ret_msg += attr.name + '->' + attr.value + '/ ';
		}

		ary_elm.click();
		return {msg: ret_msg, status: '調査中'};
*/
/*

		const e_paper_btn = document.getElementsByTagName('paper-button');
		if (e_paper_btn.length === 0) {
			return {msg: null, info: '!!! paper-dlg は存在するが、paper-button が見つからない'};
		}
		e_paper_btn[0].click();

		return {msg: 'paper-button に click() を実行', info: '*** clicked'};
*/
/*
		const e_iron_overlay = document.getElementsByTagName('iron-overlay-backdrop');
		if (e_iron_overlay.length === 0) {
			return null;
		}

		// 広告再生中の挙動が不明

		m_cntr++;
		return '*** 連続再生が実行されました / ' + m_cntr + '回目';
*/
	}
}
