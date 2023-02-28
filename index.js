// ==UserScript==
// @name         YR's Musify Favorites Extension
// @namespace    musify-favorites-extension
// ==/UserScript==

const modify = () => {
  document.querySelector('body').classList.add('musify-favorites-extension');

  FavoritesButton.actions.injectFavoritesButton();
  Sidebar.actions.modifySidebar();
  FavoritesPage.actions.modifyPage();
};

(function () {
  'use strict';
  GM_addStyle(GM_getResourceText('FLAGS_CSS'));
  GM_addStyle(GM_getResourceText('MUSIFY_FAVORITES_CSS'));

  modify();
  setInterval(() => {
    modify();
  }, 300);
})();
