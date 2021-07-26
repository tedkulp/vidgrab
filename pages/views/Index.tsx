import { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Client from 'socket.io-client';

import Jobs from '../../src/react-components/Jobs';

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
  const [_socket, setSocket] = useState<any>();
  const [currentJobs, setCurrentJobs] = useState<any>(jobs);

  useEffect(() => {
    const newSocket = Client();
    setSocket(newSocket);

    newSocket.on('job.added', (payload: any) => {
      setCurrentJobs((current: any[]) => {
        return [payload.job, ...current.slice(0, -1)];
      });
    });

    newSocket.on('job.updated', (payload: any) => {
      setCurrentJobs((current: { id: any }[]) => {
        const foundIndex = current.findIndex(
          (cj: { id: any }) => cj.id == payload.job.id,
        );

        if (foundIndex > -1) {
          current[foundIndex] = payload.job;
        }

        return [...current];
      });
    });

    return () => {
      newSocket.disconnect();
      setSocket(undefined);
    };
  }, []);

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

          <Jobs jobs={currentJobs} />
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
