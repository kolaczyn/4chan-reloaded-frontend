type ChangelogItem = {
  version: `${number}.${number}.${number}`;
  date: `${number}.${number}.${number}`;
  changes: string;
};

const changelog: ChangelogItem[] = [
  {
    version: "0.0.15",
    date: "03.08.2023",
    changes: "make the background color a subtle gradient",
  },
  {
    version: "0.0.14",
    date: "03.08.2023",
    changes:
      "add refresh button to replies and show loading indicator on replies",
  },
  {
    version: "0.0.13",
    date: "03.08.2023",
    changes: "allow bold (for one word only)",
  },
  {
    version: "0.0.12",
    date: "03.08.2023",
    changes: "allow to show or hide youtube videos embed and show reply id",
  },
  {
    version: "0.0.12",
    date: "03.08.2023",
    changes: "embed youtube videos",
  },
  {
    version: "0.0.11",
    date: "03.08.2023",
    changes:
      "add images (single image per thread). Also fix crashing if a title is not provided",
  },
  {
    version: "0.0.10",
    date: "03.08.2023",
    changes: "add titles for threads",
  },
  {
    version: "0.0.9",
    date: "02.08.2023",
    changes: "urls in replies are now clickable",
  },
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
    <div className="max-w-3xl mx-auto py-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-bold">Changelog</h1>
        <a className="text-blue-500 hover:underline" href="/">
          Back
        </a>
      </div>
      <ul className="list-disc list-inside">
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
