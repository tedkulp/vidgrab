import { NextPage, NextPageContext } from 'next';

// The component's props type
type PageProps = {
  title: string;
  extractor: string;
  description: string;
  videoUrl: string;
  thumbnails: string;
  upload_date: string;
  duration: number;
  formats: any[];
};

// extending the default next context type
type PageContext = NextPageContext & {
  query: PageProps;
};

// react component
const Page: NextPage<PageProps> = (props) => {
  return (
    <>
      <section className="section">
        <div className="container">
          <form method="POST" action="/queue">
            <div className="field is-grouped">
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select name="format">
                    {props.formats &&
                      props.formats.map((f) => (
                        <option key={f.format_id} value={f.format_id}>
                          {f.format} ({f.ext})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="control">
                <button
                  className="button is-primary"
                  id="form-submit"
                  type="submit"
                >
                  Queue Download
                </button>
              </div>
            </div>
            <input type="hidden" name="url" value={props.videoUrl} />
            <input type="hidden" name="title" value={props.title} />
            <input type="hidden" name="extractor" value={props.extractor} />
          </form>
        </div>
      </section>
    </>
  );
};

// assigning the initial props to the component's props
Page.getInitialProps = async ({ query }: PageContext) => {
  return {
    ...query,
  };
};

export default Page;
