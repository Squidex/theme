# Squidex Theme

## How to run it?

* Install Node.js

Then run

```
npm i
npm start
```

Go to http://localhost:3000.

If you change scss files it will be compiled automatically and the template page will be updated. Changes to the html file need a refresh.

## Icons

Icons are managed with icomoon: https://icomoon.io/app/#/select

### How it works:

1. Toggle the hamburger menu and go to `Manage projects`: https://icomoon.io/app/#/projects.
2. Import the `app/theme/icomoon/selection.json` file as a new project. Unfortunately it does not have a name.
3. Update the project by selecting or importing the icons we need.
4. Generate the font from the project and replace all files in the `app/theme/icomoon` folder.

### About it icons:

* Use predefined icons if possible, prefer Material icons.
* If a custom icon is needed it can be imported as SVG file. It is important to use a single path only with no strokes and no fill color.

## About the theme

The theme is a custom bootstrap theme.

Some rules about the theme:

1. Define the colors and common variables in `_vars.scss`.
2. Override bootstrap variables with variables from `_vars.scss`. Do not override bootstrap styling with custom css if not absolutely necessary.
3. Ensure that the theme has no warnings coming from sass-lint.
4. Follow the bootstrap naming patterns when defining custom components.
5. Make variants of bootstrap components if possible, e.g. for a custom tab styling.