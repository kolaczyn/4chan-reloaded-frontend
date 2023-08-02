type ChangelogItem = {
  version: `${number}.${number}.${number}`;
  date: `${number}.${number}.${number}`;
  changes: string;
};

const changelog: ChangelogItem[] = [
  {
    version: "0.0.8",
    date: "02.08.2023",
    changes: "make the website look slightly better",
  },
  {
    version: "0.0.7",
    date: "02.08.2023",
    changes: "add sort by bump order",
  },
  {
    version: "0.0.6",
    date: "02.08.2023",
    changes:
      "add sort by creation date and reply count and show loading indicator",
  },
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
    <div className="max-w-2xl mx-auto py-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-bold">Changelog</h1>
        <a className="text-blue-500 hover:underline" href="/">
          Back
        </a>
      </div>
      <ul className="list-disc list-inside text-lg">
        {changelog.map((x) => (
          <li key={x.version}>
            <b>{x.version}</b>, {x.date} - {x.changes}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChangelogPage;
