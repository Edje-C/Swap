export default (body, styles, initialState) => (`
  <!DOCTYPE html>
  <html>
    <head>
      <script>window.__APP_INITIAL_STATE__ = ${JSON.stringify(initialState)}</script>
      <title>Swap</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <link rel="shortcut icon" href="static/logo.png" type="image/x-icon"/>
      <link rel="stylesheet" href=https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;500;700&family=Montserrat+Alternates:wght@700&display=swap/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
      <style>
        html, body {
          width: 100%;
          height: 100%;
          color: #EFFFFF;
          font-family: Poppins, sans-serif;
          font-size: 20px;
          font-weight: 300;
        }

        * {
          outline: none;
          border: none;
          margin: 0px;
          box-sizing: border-box;
          text-decoration: none;
          color: inherit;
        }

        a, button {
          cursor: pointer;
        }

        img {
          width: 0px;
          height: 0px;
        }

        #root {
          height: 100%;
        }
      </style>
      ${styles}
    </head>
    
    <body>
      <div id="root">${body}</div>
    </body>
    
    <script src='vendor.js'></script>
    <script src='client.js'></script>
  </html>
`)