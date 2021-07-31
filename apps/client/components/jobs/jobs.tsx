import React from 'react';

import './jobs.module.css';

interface Props {
  jobs?: any[];
}

const Container: React.FC<Props> = ({ jobs }) => {
  return (
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
  );
};

export default Container;
