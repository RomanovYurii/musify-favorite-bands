const FavoritesPage = {
  actions: {
    modifyTitle: () => document.querySelector('h1').textContent = 'Ваши избранные исполнители',
    modifyTable: () => {
      if (!!document.querySelector('tbody.favorite-bands')) {
        return;
      }
      const { makeRow, makeCell, makeTBody, makeHeaderCell } = htmlHelpers;
      const table = document.querySelector('table.table.table-striped');
      table.innerHTML = '';

      const headers = ['', 'Название/имя', 'Страна', 'Жанры', 'Добавлено'];
      const data = Object.values(JSON.parse(localStorage.getItem(STORAGE_KEY)));

      table.innerHTML = makeTBody([
        makeRow(headers.map(header => makeHeaderCell(header))),
        ...data.map(band => makeRow([
          makeCell(`<div alt="${band.name}" class="band-img" style="background-image: url(${band.img})"/>`),
          makeCell(`<a href="${band.link}" class="band-name"">${band.name}</span>`),
          makeCell(`<div class="band-country"><i class="${band.country.class}"></i>${band.country.name}</div>`),
          makeCell(band.genres.map(genre => `<a class="band-genre" href="${genre.link}" alt="${genre.name}">${genre.name}</a>`)),
          makeCell(new Date(band.timestamp).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }))
        ]))
      ], 'class="favorite-bands"');
    },
    modifyPage: () => {
      if (window.location.href.endsWith('favorites#bands')) {
        const { actions } = FavoritesPage;
        actions.modifyTitle();
        actions.modifyTable();
      }
    }
  }
};