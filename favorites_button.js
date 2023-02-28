const FavoritesButton = {
  get: {
    actionType: () => {
      const { get } = FavoritesButton;

      return !!JSON.parse(localStorage.getItem(STORAGE_KEY))[get.band.key()] ? ACTION_TYPES.REMOVE : ACTION_TYPES.ADD;
    },
    band: {
      key: () => FavoritesButton.get.band.name().replaceAll(' ', '_').toLowerCase(),
      name: () => document.querySelector('h1')?.textContent,
      image: () => document.querySelector('img.artist-img')?.src,
      country: () => {
        const countryFlagElement = document.querySelector(`i.flag-icon.shadow`);

        return countryFlagElement
          ? {
            class: countryFlagElement.className,
            name: countryFlagElement.closest('li').textContent.trim()
          }
          : null;
      },
      genres: () =>
        _.uniqBy(
          _.flattenDeep(
            Array.from(document.querySelectorAll('.card-text.genre__labels')).map(
              (el) =>
                Array.from(el.children).map((genre) => ({
                  name: genre.textContent,
                  link: genre.href
                }))
            )
          ),
          'name'
        )
    }
  },
  handlers: {
    onAddToFavorites: () => {
      const { get, actions } = FavoritesButton;
      const favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

      favorites[get.band.key()] = {
        link: window.location.href,
        name: get.band.name(),
        img: get.band.image(),
        timestamp: new Date(),
        country: get.band.country(),
        genres: get.band.genres()
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      actions.removeFavoritesButton();
      actions.injectFavoritesButton();
    },
    onRemoveFromFavorites: () => {
      const { get, actions } = FavoritesButton;
      const favorites = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

      delete favorites[get.band.key()];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      actions.removeFavoritesButton();
      actions.injectFavoritesButton();
    }
  },
  actions: {
    removeFavoritesButton: () => document.querySelector('div.favorites-button').remove(),
    injectFavoritesButton: () => {
      if (!window.location.href.startsWith('https://musify.club/artist/') || !!document.querySelector('.favorites-button')) {
        return;
      }

      const {
        get,
        handlers: { onAddToFavorites, onRemoveFromFavorites }
      } = FavoritesButton;

      const followBtn = document.getElementById('follow_btn');
      const followBtnParent = followBtn.parentNode;

      const favoritesBtn = document.createElement('div');
      const action = get.actionType();
      favoritesBtn.className = `favorites-button ${action}`;
      favoritesBtn.onclick =
        action === ACTION_TYPES.ADD ? onAddToFavorites : onRemoveFromFavorites;
      favoritesBtn.innerHTML = `<i class="zmdi zmdi-favorite${
        action === ACTION_TYPES.ADD ? '-outline' : ''
      }"></i> ${
        action === ACTION_TYPES.ADD
          ? 'Добавить в избранное'
          : 'Удалить из избранного'
      }`;

      followBtnParent.insertBefore(favoritesBtn, followBtn.nextSibling);
    }
  }
};