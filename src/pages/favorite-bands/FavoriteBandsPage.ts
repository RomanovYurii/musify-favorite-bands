import { getLocalStorageValue, tableHelpers } from '../../helpers';

const { makeRow, makeCell, makeTBody, makeHeaderCell } = tableHelpers;
import { STORAGE_KEY } from '../../consts';
import { Band } from '../../types';

enum DataManipulationButtonType {
  Export = 'export',
  Import = 'import',
}

const TABLE_TITLES = ['', 'Название/имя', 'Страна', 'Жанры', 'Добавлено', ''];
const PAGE_TITLE = 'Ваши избранные исполнители';

export class FavoriteBandsPage {
  static modifyPage() {
    if (window.location.href.endsWith('favorites#bands')) {
      FavoriteBandsPage.modifyTitle();
      FavoriteBandsPage.modifyTable();
      FavoriteBandsPage.injectDataManipulationButtons();
    }
  }

  static modifyTitle() {
    const header = document.querySelector('h1');
    if (header && header.textContent !== PAGE_TITLE) {
      header.textContent = PAGE_TITLE;
    }
  }

  static modifyTable(forceUpdate: boolean = false) {
    if (!this.table) {
      return;
    }

    if (!!document.querySelector('tbody.favorite-bands') && !forceUpdate) {
      return;
    }

    const tableHeaders = makeRow(
      TABLE_TITLES.map((header) => makeHeaderCell(header))
    );

    const r = (key: string) => {
      const a = getLocalStorageValue(STORAGE_KEY);
      delete a[key];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
    };

    const tableRows = (
      Object.values(getLocalStorageValue(STORAGE_KEY)) as Band[]
    ).map((band) => {
      const bandImageCell = `<div class='band-img' style='background-image: url(${band.img})'/>`;
      const bandNameCell = `<a href='${band.link}' class='band-name'">${band.name}</span>`;
      const bandCountryCell = `<div class='band-country'><i class='${band.country.class}'></i>${band.country.name}</div>`;
      const bandGenres = band.genres.map(
        (genre) =>
          `<a class='band-genre' href='${genre.link}'>${genre.name}</a>`
      );
      const bandAddedToFavoritesCell = new Date(
        band.timestamp
      ).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
      const bandActionsCell = `<div onclick='${r}'><i class='zmdi zmdi-hc-2x zmdi-delete'></i></div>`;

      return makeRow([
        makeCell(bandImageCell),
        makeCell(bandNameCell),
        makeCell(bandCountryCell),
        makeCell(bandGenres),
        makeCell(bandAddedToFavoritesCell),
        makeCell(bandActionsCell),
      ]);
    });

    this.table.innerHTML = makeTBody(
      [tableHeaders, ...tableRows],
      'class="favorite-bands"'
    );
  }

  static injectDataManipulationButtons() {
    if (
      !document.querySelector('.export-button') &&
      !document.querySelector('.import-button')
    ) {
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'data-manipulation-buttons';
      buttonsContainer.appendChild(
        this.getDataManipulationButton(DataManipulationButtonType.Export)
      );
      buttonsContainer.appendChild(
        this.getDataManipulationButton(DataManipulationButtonType.Import)
      );

      this.table?.insertAdjacentElement('afterend', buttonsContainer);
    }
  }

  static get table() {
    return document.querySelector('table.table.table-striped');
  }

  static getDataManipulationButton(type: DataManipulationButtonType) {
    const button = document.createElement('div');
    const icon = document.createElement('i');

    button.classList.add('btn', 'btn--icon-text');
    icon.classList.add('zmdi');

    switch (type) {
      case DataManipulationButtonType.Export:
        button.textContent = 'Скачать список';
        button.classList.add('export-button');
        button.onclick = FavoriteBandsPage.exportFavoriteBandsList;
        icon.classList.add('zmdi-download');
        break;
      case DataManipulationButtonType.Import:
        button.textContent = 'Загрузить список';
        button.classList.add('import-button');
        button.onclick = FavoriteBandsPage.importFavoriteBandsList;
        icon.classList.add('zmdi-upload');
        break;
    }

    button.prepend(icon);
    return button;
  }

  static exportFavoriteBandsList() {
    // Get the object from local storage
    const storedObject = getLocalStorageValue(STORAGE_KEY);

    // Create a new Blob object from the JSON data
    const jsonBlob = new Blob([JSON.stringify(storedObject)], {
      type: 'application/json',
    });

    // Create a new URL object from the Blob
    const jsonURL = URL.createObjectURL(jsonBlob);

    // Create a new link element to download the JSON file
    const downloadLink = document.createElement('a');
    downloadLink.href = jsonURL;
    downloadLink.download = `musify-favorite-bands-${Date.now()}.json`;

    // Append the link to the body and click it to start the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Clean up by removing the link and revoking the URL
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(jsonURL);
  }

  static importFavoriteBandsList() {
    const fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');

    fileInput.addEventListener('change', () => {
      // Get the selected file from the file input element
      const file = fileInput.files![0];

      // Create a FileReader object to read the contents of the file
      const reader = new FileReader();

      // Add a load event listener to the FileReader object
      reader.addEventListener('load', () => {
        // Parse the contents of the file as JSON
        const jsonData: { [key: string]: Band } = JSON.parse(
          reader.result as string
        );

        if (
          Object.values(jsonData).every(
            (band: Band) => !!band.name && !!band.link
          )
        ) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonData));
          FavoriteBandsPage.modifyTable(true);
        }
      });

      // Read the contents of the file as text
      reader.readAsText(file);
    });

    fileInput.click();
  }
}
