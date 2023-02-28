const Sidebar = {
  get: {
    favoriteAlbums: () => document.querySelector('a.dropdown-item[href="/favorites"]')
  },
  actions: {
    renameFavoriteAlbums: () => {
      const el = Sidebar.get.favoriteAlbums();
      if (el.textContent !== 'Избранные альбомы') {
        el.textContent = 'Избранные альбомы';
      }
    },
    injectFavoriteBands: () => {
      if (!!document.querySelector('.dropdown-item.favorite-bands')) {
        return;
      }
      const favoriteAlbums = Sidebar.get.favoriteAlbums();
      const favoriteBands = document.createElement('a');
      favoriteBands.href = FAVORITE_BANDS_LINK;
      favoriteBands.className = 'dropdown-item favorite-bands';
      favoriteBands.textContent = 'Избранные исполнители';
      favoriteBands.onclick = (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (window.location.href.endsWith('/favorites')) {
          window.location.reload();
        } else {
          window.location.href = FAVORITE_BANDS_LINK;
        }
      };

      favoriteAlbums.insertAdjacentElement('afterend', favoriteBands);
    },
    modifySidebar: () => {
      Sidebar.actions.renameFavoriteAlbums();
      Sidebar.actions.injectFavoriteBands();
    }
  }
};