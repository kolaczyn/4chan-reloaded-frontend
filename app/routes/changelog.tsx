type ChangelogItem = {
  version: `${number}.${number}.${number}`;
  date: `${number}.${number}.${number}`;
  changes: string;
};

const changelog: ChangelogItem[] = [
  {
    version: "0.0.5",
    date: "01.08.2023",
    changes: "add greentext",
  },
  {
    version: "0.0.4",
    date: "01.08.2023",
    changes: "creating boards no longer public",
  },
  {
    version: "0.0.3",
    date: "01.08.2023",
    changes: "added pagination for threads of a board",
  },
  // I missed 0.0.2, but whatever :p
  {
    version: "0.0.1",
    date: "31.07.2023",
    changes: "added dates",
  },
  {
    version: "0.0.0",
    date: "30.07.2023",
    changes:
      "initial version of the service - added boards, threads and replies with text only",
  },
];

const ChangelogPage = () => {
  return (
    <>
      <h1>Changelog</h1>
      <ul>
        {changelog.map((x) => (
          <li key={x.version}>
            <b>{x.version}</b>, {x.date} - {x.changes}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ChangelogPage;
