var express = require('express');
var uuid = require('uuid');
var child_process = require('child_process');

function init_express() {
	var app = express();

	app.post('/create', function (req, res) {
		create_droplet()
		.then(function (droplet) {
			res.send(droplet);
		})
		.catch(function (err) {
			res.send({ error: err['stack'] });
		});
	});

	app.listen(3000);
}

function run_process(cmd) {
	return new Promise(function (resolve, reject) {
		child_process.exec(cmd, function (err, stdout, stderr) {
			if (err) {
				return reject(err);
			}

			resolve(stdout);
		});
	});
}

function create_droplet() {
	var name = uuid.v4();

	var clone_cmd = 'VBoxManage clonevm "FreeBSD" --register --name "' + name + '"';
	var start_cmd = 'VBoxManage startvm "' + name + '"';

	return run_process(clone_cmd)
		.then(function () {
			return run_process(start_cmd);
		})
		.then(function () {
			return {
				name: name
			};
		});
}