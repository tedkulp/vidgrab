import { NextPage, NextPageContext } from 'next';
import Link from 'next/link';

// The component's props type
type PageProps = {
  bookmarklet?: string;
  jobs?: any[];
};

// extending the default next context type
type PageContext = NextPageContext & {
  query: PageProps;
};

// react component
const Page: NextPage<PageProps> = ({ bookmarklet, jobs }) => {
  return (
    <>
      <section className="section">
        <div className="container">
          <form method="POST" action="/getinfo">
            <div className="field is-grouped">
              <div className="control is-expanded">
                <input
                  className="input is-medium"
                  name="url"
                  placeholder="URL to Download"
                />
                <p className="help">
                  <Link href="/extractors">
                    * List of currently available services
                  </Link>
                </p>
              </div>
              <div className="control">
                <button
                  className="button is-primary is-medium"
                  id="form-submit"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <div className="container content has-text-centered">
        <p>Drag this to your bookmark bar!</p>
        <a
          className="bookmarklet"
          ref={(node) =>
            node && bookmarklet && node.setAttribute('href', bookmarklet)
          }
        >
          Vidgrab It!
        </a>
      </div>

      <section className="section">
        <div className="container">
          <h2 className="subtitle is-4 has-text-centered">Recent Downloads</h2>

          <table className="table is-striped is-hoverable is-fullwidth is-narrow">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>
                  <abbr title="Service">Svc</abbr>
                </th>
                <th>Title</th>
                <th>
                  <abbr title="Percent Downloaded">%</abbr>
                </th>
              </tr>
            </thead>
            <tbody>
              {jobs &&
                jobs.map((j) => (
                  <tr key={j.id}>
                    <td>{j.id}</td>
                    <td>{j.state}</td>
                    <td>{j.data.extractor}</td>
                    <td>
                      <a
                        href={j.data.url}
                        title={j.data.title}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {j.data.title}
                      </a>
                    </td>
                    <td>{j.progress}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

// assigning the initial props to the component's props
Page.getInitialProps = async ({ query }: PageContext) => {
  return {
    bookmarklet: query?.bookmarklet?.toString(),
    jobs: query?.jobs,
  };
};

export default Page;
