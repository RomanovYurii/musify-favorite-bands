import _uniqBy from 'lodash/uniqBy';
import _flattenDeep from 'lodash/flattenDeep';

import {
  ACTION_TYPES,
  BAND_IMAGE_PLACEHOLDER_URL,
  STORAGE_KEY,
  URLS,
} from '../../consts';
import { getLocalStorageValue } from '../../helpers';

export class BandPage {
  // Actions
  static injectFavoritesButton() {
    if (
      !window.location.href.startsWith(URLS.BAND_PREFIX) ||
      !!document.querySelector('.favorites-button')
    ) {
      return;
    }

    const followBtn = document.getElementById('follow_btn');
    const followBtnParent = followBtn?.parentNode;

    const favoritesBtn = document.createElement('div');
    const action = BandPage.actionType;
    favoritesBtn.className = `favorites-button ${action}`;
    favoritesBtn.onclick =
      action === ACTION_TYPES.ADD
        ? BandPage.onAddToFavorites
        : BandPage.onRemoveFromFavorites;
    favoritesBtn.innerHTML = `<i class='zmdi zmdi-favorite${
      action === ACTION_TYPES.ADD ? '-outline' : ''
    }'></i> ${
      action === ACTION_TYPES.ADD
        ? 'Добавить в избранное'
        : 'Удалить из избранного'
    }`;

    followBtnParent?.insertBefore(favoritesBtn, followBtn?.nextSibling || null);
  }

  static removeFavoritesButton() {
    document.querySelector('div.favorites-button')?.remove();
  }

  // Handlers
  static onRemoveFromFavorites() {
    const favorites = getLocalStorageValue(STORAGE_KEY) || {};

    delete favorites[BandPage.bandKey];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    BandPage.removeFavoritesButton();
    BandPage.injectFavoritesButton();
  }

  static onAddToFavorites() {
    const favoriteBands = getLocalStorageValue(STORAGE_KEY) || {};

    favoriteBands[BandPage.bandKey] = {
      link: window.location.href,
      name: BandPage.bandName,
      img: BandPage.bandImage,
      timestamp: new Date(),
      country: BandPage.bandCountry,
      genres: BandPage.bandGenres,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteBands));
    BandPage.removeFavoritesButton();
    BandPage.injectFavoritesButton();
  }

  // Getters
  static get bandName() {
    return document.querySelector('h1')?.textContent ?? '';
  }

  static get bandKey() {
    return BandPage.bandName.replace(/ /g, '_').toLowerCase();
  }

  static get bandImage() {
    return (
      document.querySelector('img.artist-img')?.getAttribute('src') ??
      BAND_IMAGE_PLACEHOLDER_URL
    );
  }

  static get bandCountry() {
    const countryFlagElement = document.querySelector(`i.flag-icon.shadow`);

    return {
      class: countryFlagElement?.className ?? '',
      name: countryFlagElement?.closest('li')?.textContent?.trim() ?? 'Unknown',
    };
  }

  static get bandGenres() {
    return _uniqBy(
      _flattenDeep(
        Array.from(document.querySelectorAll('.card-text.genre__labels')).map(
          (el) =>
            Array.from(el.children).map((genre) => ({
              name: genre.textContent ?? '-',
              link: genre.getAttribute('href') ?? '#',
            }))
        )
      ),
      'name'
    );
  }

  static get actionType() {
    return BandPage.bandKey
      ? !!getLocalStorageValue(STORAGE_KEY)[this.bandKey]
        ? ACTION_TYPES.REMOVE
        : ACTION_TYPES.ADD
      : ACTION_TYPES.ADD;
  }
}
