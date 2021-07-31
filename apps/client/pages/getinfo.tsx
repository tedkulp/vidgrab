import { NextPage, NextPageContext, GetServerSideProps } from 'next';
import React, { useState } from 'react';
import getRawBody from 'raw-body';
import { YtResponse } from 'youtube-dl-exec';

// The component's props type
type PageProps = {
  title: string;
  extractor: string;
  description: string;
  videoUrl: string;
  thumbnails: string;
  upload_date: string;
  duration: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formats: any[];
};

// extending the default next context type
type PageContext = NextPageContext & {
  query: PageProps;
};

// react component
const Page: NextPage<PageProps> = (props) => {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.SyntheticEvent) => {
    setSubmitted(true);
  };

  return (
    <>
      <section className="section">
        <div className="container">
          <form method="POST" action="/" onSubmit={onSubmit}>
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
                  className={`button is-primary ${submitted?'is-loading':''}`}
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

export const getServerSideProps: GetServerSideProps<YtResponse> = async ({ req }) => {
  let data: YtResponse;

  if (req.method == "POST") {
    const body = await getRawBody(req);

    const res = await fetch('http://localhost:3333/api/getinfo', {
      method: 'post',
      body: body.toString('utf-8'),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    data = await res.json();
  }

  return {
    props: {
      ...data,
    },
  };
};

export default Page;
