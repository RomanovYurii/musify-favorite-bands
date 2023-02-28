// ==UserScript==
// @name         YR's Musify Favorite Bands Extension
// @namespace    musify-favorite-bands-extension
// ==/UserScript==

import {
  BandPage,
  BodyElement,
  FavoriteBandsPage,
  Sidebar,
} from './src/elements';
import './src/styles/styles.scss';

const modify = () => {
  BodyElement.injectExtensionAttributes();
  BandPage.injectFavoritesButton();
  Sidebar.modifySidebar();
  FavoriteBandsPage.modifyPage();

  setInterval(() => {
    modify();
  }, 300);
};

(function () {
  'use strict';

  modify();
})();
