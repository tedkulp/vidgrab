import { NextPage, NextPageContext } from 'next';

// The component's props type
type PageProps = {
  extractors?: string[];
};

// extending the default next context type
type PageContext = NextPageContext & {
  query: PageProps;
};

// react component
const Page: NextPage<PageProps> = ({ extractors }) => {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="content">
            <p>
              Here is the list of currently supported services. This is
              generated dynamically because youtube-dl adds new services all the
              time.
            </p>
            <ul>{extractors && extractors.map((e) => <li key={e}>{e}</li>)}</ul>
          </div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps({ query }: PageContext) {
  const res = await fetch('http://localhost:3333/api/extractors');

  return {
    props: await res?.json(),
  };
}

export default Page;
