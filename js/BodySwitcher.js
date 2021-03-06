(function(global, document) {
'use strict';

function BodySwitcher(bodiesElem, tester, bodyPaths) {
  bodiesElem.innerHTML = [
    '<ul>',
      '<li class="loading">Loading&hellip;</li>',
    '</ul>'
  ].join('\n');

  this.bodyContents = {};

  this.bodiesList = bodiesElem.querySelector('ul');
  this.tester = tester;

  this.bindEvents();
  this.downloadBodies(bodyPaths);
}

BodySwitcher.prototype.bindEvents = function bindEvents() {
  var selectNewBody = BodySwitcher.prototype.selectNewBody.bind(this);

  this.bodiesList.addEventListener('click', selectNewBody);
};

BodySwitcher.prototype.downloadBodies = function downloadBodies(bodyPaths) {
  Object.keys(bodyPaths).forEach(function(bodyName) {
    this.downloadBody(bodyName, bodyPaths[bodyName]);
  }, this);
};

BodySwitcher.prototype.downloadBody = function downloadBody(bodyName, bodyURL) {
  var req = new XMLHttpRequest();

  function receiveBody() {
    this.bodyContents[bodyName] = req.responseText;
    this.renderOptions();
  }

  req.addEventListener('load', receiveBody.bind(this));
  req.open('GET', bodyURL);
  req.send();
};

BodySwitcher.prototype.renderOptions = function renderOptions() {
  var outputFragment = document.createDocumentFragment();

  Object.keys(this.bodyContents).sort().forEach(function(bodyName) {
    var bodyButton = document.createElement('button'),
      bodyItem = document.createElement('li');

    bodyButton.type = 'button';
    bodyButton.textContent = bodyName;
    bodyButton._bodyName = bodyName;

    bodyItem.appendChild(bodyButton);
    outputFragment.appendChild(bodyItem);
  }, this);

  this.bodiesList.innerHTML = '';
  this.bodiesList.appendChild(outputFragment);
};

BodySwitcher.prototype.selectNewBody = function selectNewBody(ev) {
  var target;

  // Handle delegated click events, as explained in http://bit.ly/2lw996O
  ev = ev || global.event;
  target = ev.target || ev.srcElement;

  // Bail out unless it was a <button> click that got us here.
  if (target.tagName.toLowerCase() !== 'button') {
    return;
  }

  this.setBody(target._bodyName);
};

BodySwitcher.prototype.setBody = function setBody(bodyName) {
  var newBody = this.bodyContents[bodyName];
  this.tester.setText(newBody || ('Error loading ' + bodyName));
};

global.BodySwitcher = BodySwitcher;
}(this, this.document));
