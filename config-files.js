import path from 'path';
export class ConfigFile {
  static brand(brand) {
    if (!brand) {
      console.error('Brand not defined');
      return;
    }

    const selector = `.${brand}`;

    return {
      source: [
        `figma/global-base/*.json`,
        `figma/brands/${brand}/*.json`,
        `figma/brands/patterns/*.json`
      ],
      platforms: {
        css: {
          buildPath: `dist/css/`,
          transformGroup: 'tokens-studio',
          transforms: ['name/kebab'],
          files: [
            {
              filter: (token) =>
                token.filePath.includes(`figma/brands/${brand}/foundation.json`),
              destination: `${brand}/base.css`,
              format: 'css/variables',
              options: {
                selector: selector
              }
            }
          ]
        },
        scss: {
          buildPath: `dist/scss/`,
          transformGroup: 'tokens-studio',
          transforms: ['name/kebab'],
          files: [
            {
              filter: (token) =>
                token.filePath.includes(`figma/brands/${brand}/foundation.json`),
              destination: `${brand}/base.scss`,
              format: 'scss/variables',
              options: {
                selector: selector
              }
            }
          ]
        }
      }
    };
  }

  static scheme(brand, theme, scheme) {
    return this.get(brand, theme, 'schemes', scheme);
  }

  static breakpoint(brand, theme, breakpoint) {
    return this.get(brand, theme, 'breakpoints', breakpoint);
  }

  static component(brand, theme, component) {
    return this.get(brand, theme, 'components', component);
  }

  static get(brand, theme, entityType, entityValue) {
    if (!brand) {
      console.error('Brand not defined');
      return;
    }

    const ENTITY_PATH = `figma/brands/${brand}/themes/${theme}/${entityType}`;

    const selector = this.generateSelector(
      brand,
      theme,
      entityType,
      entityValue
    );

    return {
      source: [
        `figma/global-base/*.json`,
        `figma/brands/${brand}/*.json`,
        `${ENTITY_PATH}/${entityValue}`,
        `figma/brands/patterns/*.json`
      ],
      platforms: {
        css: {
          buildPath: `dist/css/`,
          transformGroup: 'tokens-studio',
          transforms: ['name/kebab'],
          files: [
            {
              filter: (token) =>
                token.filePath.includes(`${ENTITY_PATH}/${entityValue}`),
              destination: `${brand}/themes/${theme}/${entityType}/${path.basename(entityValue, '.json')}.css`,
              format: 'css/variables',
              options: { selector }
            }
          ]
        },
        scss: {
          buildPath: `dist/scss/`,
          transformGroup: 'tokens-studio',
          transforms: ['name/kebab'],
          files: [
            {
              filter: (token) =>
                token.filePath.includes(`${ENTITY_PATH}/${entityValue}`),
              destination: `${brand}/themes/${theme}/${entityType}/${path.basename(entityValue, '.json')}.scss`,
              format: 'scss/variables',
              options: { selector }
            }
          ]
        }
      },
      // Para detalhar possiveis erros e colissões
      // log: {
      //   warnings: 'warn', // 'warn' | 'error' | 'disabled'
      //   verbosity: 'verbose', // 'default' | 'silent' | 'verbose'
      //   errors: {
      //     brokenReferences: 'throw' // 'throw' | 'console'
      //   }
      // }
    };
  }

  static generateSelector(brand, theme, entityType, entityValue) {
    switch (entityType) {
      case 'schemes':
        return `.${brand}.theme-${theme}.scheme-${path.basename(entityValue, '.json')}`;

      case 'breakpoints':
        return `.${brand}.theme-${theme}.breakpoint-${path.basename(entityValue, '.json')}`;

      case 'components':
        return `.${brand}.theme-${theme}`;
    }
  }
}
