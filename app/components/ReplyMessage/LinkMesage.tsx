type Props = {
  link: string;
};

export const LinkMessage = ({ link }: Props) => (
  <a
    target="_blank"
    rel="noreferrer"
    className="text-blue-500 hover:underline"
    href={link}
  >
    {link}{" "}
  </a>
);
