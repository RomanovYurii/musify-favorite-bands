import { FAVORITE_BANDS_LINK } from '../consts';

export class Sidebar {
  static injectFavoriteBandsSidebarItem() {
    if (!!document.querySelector('.dropdown-item.favorite-bands')) {
      return;
    }

    const favoriteBands = document.createElement('a');
    favoriteBands.href = FAVORITE_BANDS_LINK;
    favoriteBands.className = 'dropdown-item favorite-bands';
    favoriteBands.textContent = 'Избранные исполнители';
    favoriteBands.onclick = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      if (window.location.href.endsWith('/favorites')) {
        window.location.reload();
      } else {
        window.location.href = FAVORITE_BANDS_LINK;
      }
    };

    const favoriteAlbums = Sidebar.favoriteAlbums;
    favoriteAlbums?.insertAdjacentElement('afterend', favoriteBands);
  }

  static renameFavoriteAlbums() {
    const el = Sidebar.favoriteAlbums;
    if (el && el.textContent !== 'Избранные альбомы') {
      el.textContent = 'Избранные альбомы';
    }
  }

  static modifySidebar() {
    Sidebar.renameFavoriteAlbums();
    Sidebar.injectFavoriteBandsSidebarItem();
  }

  static get favoriteAlbums() {
    return document.querySelector('a.dropdown-item[href="/favorites"]');
  }
}
