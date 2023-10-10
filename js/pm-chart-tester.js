/*
	This Javascript is part of a package found at https://github.com/mattriffle/pm-chart-tester
	Copyright (c) 2023 Matthew Riffle
	See site for license details.

*/

let Counters = {
	pg_correct: 0,
	pg_errors: 0,
	ka_correct: 0,
	ka_errors: 0,
	pr_correct: 0,
	pr_errors: 0
}

// Set up 

const start = Date.now();
let started = null;

draw_results();

let all_inputs = document.getElementsByTagName("input");
for (let i = 0; i < all_inputs.length; i++) {
	all_inputs[i].addEventListener('blur', function() {
		this.value = "";
		this.classList.remove("wrong_answer");
		this.classList.remove("wrong_location");
	});
}

// This is not encryption, nor is it intended to be.  Just making it slightly harder
// to cheat (yourself).
const ProcessGroups = {
	pg1: "SW5pdGlhdGluZw==",
	pg2: "UGxhbm5pbmc=",
	pg3: "RXhlY3V0aW5n",
	pg4: "TW9uaXRvcmluZyAmIENvbnRyb2xsaW5n",
	pg5: "Q2xvc2luZw=="
};
const KnowledgeAreas = {
	ka1: "UHJvamVjdCBJbnRlZ3JhdGlvbiBNYW5hZ2VtZW50",
	ka2: "UHJvamVjdCBTY29wZSBNYW5hZ2VtZW50",
	ka3: "UHJvamVjdCBTY2hlZHVsZSBNYW5hZ2VtZW50",
	ka4: "UHJvamVjdCBDb3N0IE1hbmFnZW1lbnQ=",
	ka5: "UHJvamVjdCBRdWFsaXR5IE1hbmFnZW1lbnQ=",
	ka6: "UHJvamVjdCBSZXNvdXJjZSBNYW5hZ2VtZW50",
	ka7: "UHJvamVjdCBDb21tdW5pY2F0aW9ucyBNYW5hZ2VtZW50",
	ka8: "UHJvamVjdCBSaXNrIE1hbmFnZW1lbnQ=",
	ka9: "UHJvamVjdCBQcm9jdXJlbWVudCBNYW5hZ2VtZW50",
	ka10: "UHJvamVjdCBTdGFrZWhvbGRlciBNYW5hZ2VtZW50"
};
const Processes = {
	"cGxhbiBjb3N0IG1hbmFnZW1lbnQ=": "ka4_pg2",
	"bWFuYWdlIHRlYW0=": "ka6_pg3",
	"ZXN0aW1hdGUgYWN0aXZpdHkgcmVzb3VyY2Vz": "ka6_pg2",
	"cGVyZm9ybSBpbnRlZ3JhdGVkIGNoYW5nZSBjb250cm9s": "ka1_pg4",
	"Y29udHJvbCBjb3N0cw==": "ka4_pg4",
	"ZGVmaW5lIHNjb3Bl": "ka2_pg2",
	"Y2xvc2UgcHJvamVjdCBvciBwaGFzZQ==": "ka1_pg5",
	"cGxhbiBzY29wZSBtYW5hZ2VtZW50": "ka2_pg2",
	"ZXN0aW1hdGUgY29zdHM=": "ka4_pg2",
	"c2VxdWVuY2UgYWN0aXZpdGllcw==": "ka3_pg2",
	"ZXN0aW1hdGUgYWN0aXZpdHkgZHVyYXRpb25z": "ka3_pg2",
	"aWRlbnRpZnkgcmlza3M=": "ka8_pg2",
	"YWNxdWlyZSByZXNvdXJjZXM=": "ka6_pg3",
	"cGxhbiBzY2hlZHVsZSBtYW5hZ2VtZW50": "ka3_pg2",
	"Y29uZHVjdCBwcm9jdXJlbWVudHM=": "ka9_pg3",
	"cGxhbiBzdGFrZWhvbGRlciBlbmdhZ2VtZW50": "ka10_pg2",
	"bWFuYWdlIHByb2plY3Qga25vd2xlZGdl": "ka1_pg3",
	"cGxhbiBwcm9jdXJlbWVudCBtYW5hZ2VtZW50": "ka9_pg2",
	"ZGVmaW5lIGFjdGl2aXRpZXM=": "ka3_pg2",
	"bWFuYWdlIHN0YWtlaG9sZGVyIGVuZ2FnZW1lbnQ=": "ka10_pg3",
	"cGxhbiByaXNrIHJlc3BvbnNlcw==": "ka8_pg2",
	"aW1wbGVtZW50IHJpc2sgcmVzcG9uc2Vz": "ka8_pg3",
	"Y29udHJvbCByZXNvdXJjZXM=": "ka6_pg4",
	"cGVyZm9ybSBxdWFsaXRhdGl2ZSByaXNrIGFuYWx5c2lz": "ka8_pg2",
	"dmFsaWRhdGUgc2NvcGU=": "ka2_pg4",
	"aWRlbnRpZnkgc3Rha2Vob2xkZXJz": "ka10_pg1",
	"ZGV0ZXJtaW5lIGJ1ZGdldA==": "ka4_pg2",
	"Y29udHJvbCBzY29wZQ==": "ka2_pg4",
	"cGxhbiBxdWFsaXR5IG1hbmFnZW1lbnQ=": "ka5_pg2",
	"ZGV2ZWxvcCBzY2hlZHVsZQ==": "ka3_pg2",
	"Y29udHJvbCBxdWFsaXR5": "ka5_pg4",
	"bWFuYWdlIHF1YWxpdHk=": "ka5_pg3",
	"cGxhbiByaXNrIG1hbmFnZW1lbnQ=": "ka8_pg2",
	"bW9uaXRvciByaXNrcw==": "ka8_pg4",
	"Y3JlYXRlIHdicw==": "ka2_pg2",
	"cGxhbiByZXNvdXJjZSBtYW5hZ2VtZW50": "ka6_pg2",
	"bWFuYWdlIGNvbW11bmljYXRpb25z": "ka7_pg3",
	"bW9uaXRvciBhbmQgY29udHJvbCBwcm9qZWN0IHdvcms=": "ka1_pg4",
	"cGVyZm9ybSBxdWFudGl0YXRpdmUgcmlzayBhbmFseXNpcw==": "ka8_pg2",
	"ZGV2ZWxvcCBwcm9qZWN0IG1hbmFnZW1lbnQgcGxhbg==": "ka1_pg2",
	"bW9uaXRvciBjb21tdW5pY2F0aW9ucw==": "ka7_pg4",
	"Y29udHJvbCBzY2hlZHVsZQ==": "ka3_pg4",
	"ZGV2ZWxvcCBwcm9qZWN0IGNoYXJ0ZXI=": "ka1_pg1",
	"cGxhbiBjb21tdW5pY2F0aW9ucyBtYW5hZ2VtZW50": "ka7_pg2",
	"ZGV2ZWxvcCB0ZWFt": "ka6_pg3",
	"bW9uaXRvciBzdGFrZWhvbGRlciBlbmdhZ2VtZW50": "ka10_pg4",
	"Y29sbGVjdCByZXF1aXJlbWVudHM=": "ka2_pg2",
	"Y29udHJvbCBwcm9jdXJlbWVudHM=": "ka9_pg4",
	"ZGlyZWN0IGFuZCBtYW5hZ2UgcHJvamVjdCB3b3Jr": "ka1_pg3"
};

function check_pg(which) {
	let value = document.getElementById(which).value;
	if (ProcessGroups[which] == btoa(value)) {
		document.getElementById(which + "_cell").innerHTML = atob(ProcessGroups[which]);
		if (!started) { protect_reload() }
		Counters.pg_correct++;

		// Focus on next if it's still available
		let num = which.replace(/\D/g, '');
		num++;
		if (document.getElementById("pg" + num)) {
			document.getElementById("pg" + num).focus();
		}
	} else {
		document.getElementById(which).className = "wrong_answer";
		Counters.pg_errors++;
	}
	draw_results();
	return false;
}

// And this is almost (almost) identical to the function above.  Is the copy/paste a best practice?
// Of course not, but for my purposes here it's the path of least resistance and it's not like there'll
// be multiple authors or heavy maintenance to be done.
function check_ka(which) {
	let value = document.getElementById(which).value;
	if (KnowledgeAreas[which] == btoa(value)) {
		document.getElementById(which + "_cell").innerHTML = atob(KnowledgeAreas[which]).replace(/ /g, "<br />");
		if (!started) { protect_reload() }
		Counters.ka_correct++;

		// Focus on next if it's still available
		let num = which.replace(/\D/g, '');
		num++;
		if (document.getElementById("ka" + num)) {
			document.getElementById("ka" + num).focus();
		}
	} else {
		document.getElementById(which).className = "wrong_answer";
		Counters.ka_errors++;
	}
	draw_results();
	return false;
}

function check_ka_pg(the_ka, the_pg) {
	let id_name = the_ka + "_" + the_pg;
	let value = document.getElementById(id_name).value;
	let check_hash = btoa(value.toLowerCase())
	if (Processes[check_hash] === id_name) {
		Processes[check_hash] = 'USED'; // prevent reuse
		let the_element = document.getElementById(id_name + "_cell");
		the_element.prepend(document.createElement("br"));
		the_element.prepend(ucfirst_all(value));
		let the_box = document.getElementById(id_name);
		the_box.classList.remove("wrong_answer");
		the_box.classList.remove("wrong_location");
		the_box.style.marginTop = "7px";
		the_box.value = "";
		the_box.focus();
		if (!started) { protect_reload() }
		Counters.pr_correct++;
	} else if (Processes[check_hash] && Processes[check_hash] != "USED") {
		document.getElementById(id_name).className = "wrong_location";
		Counters.pr_errors++;
	} else {
		document.getElementById(id_name).className = "wrong_answer";
		Counters.pr_errors++;
	}
	draw_results();
	return false;
}

function ucfirst_all(the_string) {
	let all_words = the_string.split(" ");
	for (let i = 0; i < all_words.length; i++) {
		all_words[i] = all_words[i][0].toUpperCase() + all_words[i].slice(1).toLowerCase();
	}
	return all_words.join(" ");
}

function protect_reload() {
	window.addEventListener('beforeunload', function(e) {
		e.preventDefault();
		e.returnValue = '';
	});
	started = 1;
}

function draw_results() {
	document.getElementById("pg_results").innerHTML = Counters.pg_correct + " of 5 (Errors: " + Counters.pg_errors + ")";
	document.getElementById("ka_results").innerHTML = Counters.ka_correct + " of 10 (Errors: " + Counters.ka_errors + ")";
	document.getElementById("pr_results").innerHTML = Counters.pr_correct + " of 49 (Errors: " + Counters.pr_errors + ")";

	if (Counters.pr_correct >= 49 && Counters.pg_correct >= 5 && Counters.ka_correct >= 10) {
		// Congratulations
		let mistakes = Counters.pg_errors + Counters.ka_errors + Counters.pr_errors;
		let s = (mistakes == 1) ? '' : 's';
		let total_time = Math.floor((Date.now() - start) / 1000);
		let elapsed = Math.floor(total_time / 60) + " minutes, " + total_time % 60 + " seconds";
		document.getElementById("congrats_text").innerHTML = "Congratulations! You finished in " + elapsed + " and made " + mistakes + " mistake" + s + ".";
		document.getElementById("congrats_text").style.display = "inline-block";

		// No need for text boxes now
		let all_inputs = document.getElementsByTagName("input");
		for (let i = 0; i < all_inputs.length; i++) {
			all_inputs[i].style.visibility = 'hidden';
		}
	}
}