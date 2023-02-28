export class BodyElement {
  static injectExtensionAttributes() {
    const body = document.querySelector('body');

    if (!body || body.classList.contains('musify-favorites-extension')) {
      return;
    }

    body.classList.add('musify-favorites-extension');
  }
}
