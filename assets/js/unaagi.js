(function () {
  'use strict';

  var article = document.querySelector('.unaagi-article');
  if (!article) return;

  var videos = article.querySelectorAll('video');
  Array.prototype.forEach.call(videos, function (video) {
    video.addEventListener('play', function () {
      Array.prototype.forEach.call(videos, function (other) {
        if (other !== video) other.pause();
      });
    });
  });

  var method = article.querySelector('#unaagi-method-video');
  var actions = article.querySelector('#unaagi-method-actions');
  if (!method || !actions) return;

  var start = actions.querySelector('[data-action="start"]');
  var reverse = actions.querySelector('[data-action="reverse"]');
  var status = actions.querySelector('[role="status"]');
  var pauseAtNoise = true;
  var stop = 4.3;
  actions.hidden = false;

  function play() {
    var request = method.play();
    if (request && request.catch) {
      request.catch(function () {
        status.textContent = 'Use the video controls to play the animation.';
      });
    }
  }

  start.addEventListener('click', function () {
    pauseAtNoise = true;
    reverse.disabled = true;
    method.currentTime = 0;
    status.textContent = 'Forward illustration: the side chain becomes noise.';
    play();
  });

  reverse.addEventListener('click', function () {
    pauseAtNoise = false;
    reverse.disabled = true;
    status.textContent = 'Reverse process: UNAAGI reconstructs a side chain.';
    play();
  });

  method.addEventListener('timeupdate', function () {
    if (pauseAtNoise && method.currentTime >= stop && !method.seeking) {
      pauseAtNoise = false;
      method.pause();
      reverse.disabled = false;
      status.textContent = 'Paused at noise. Choose “Run the reverse process” to continue.';
    }
  });

  method.addEventListener('ended', function () {
    status.textContent = 'Serine reconstructed. Choose “Replay from the start” to watch again.';
  });
})();
