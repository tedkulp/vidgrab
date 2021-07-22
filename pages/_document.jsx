import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"
          />
        </Head>
        <body>
          <div id="wrapper">
            <section className="section has-background-light">
              <div className="container">
                <nav className="level">
                  <h1 className="title is-1 level-item has-text-centered">
                    Vidgrab
                  </h1>
                </nav>
              </div>
            </section>

            <Main />
          </div>

          <footer id="footer" className="footer">
            <div className="content has-text-centered">
              <p>
                Code and "Design" by <a href="#">Ted Kulp</a>. Based on
                youtube-dl.
              </p>
            </div>
          </footer>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
