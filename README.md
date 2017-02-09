# Welcome to the Ad Creator App

## Requirements
Node version 4.2.1 or higher

## Up and Running
First install all dependencies
`npm install`

Run the Server 
`gulp webserver`

After the Server is up, put the localhost:8080 in the web browser bar.

Have fun generating your own advert!

## Features
Core features are the generation of an advert banner. This ad will be rendered in
an iFrame, it demonstrates how the Advert will look like when it is embedded on another website.
An iFrame is necessary to prevent of style changes from out site.

Next to the rendered Preview is a box with the HTML for the generated advert. 
This code can be copied and used to place an advert on your own website.

The Generator comes with 2 different layouts for ads. One layout for only one product, ore a slider for many.
Choose your layout over the select field.

If you don't like the preselected colors and other styles of the advert, type in your own in the input fields.

## Testing

Run mocha tests
`npm test`

## Notes
this application has no build tools, because of the simplification and to keep it simple I avoided using scss and other preprocessor