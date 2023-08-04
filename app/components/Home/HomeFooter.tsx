type Props = {
  isJanny: boolean;
};

export const HomeFooter = ({ isJanny }: Props) => (
  <div className="space-x-3">
    <a className="text-blue-500 hover:underline" href="/changelog">
      See changelog
    </a>
    {isJanny && <a href="/janny">Go to panel</a>}
  </div>
);
