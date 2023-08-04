import { AppButton } from "~/components/AppButton";

type Props = {
  isFirstPage: boolean;
  isLastPage: boolean;
  isLoading: boolean;
  currentPage: number;
  handleSetPage: (page: number) => void;
};

export const Pagination = ({
  isFirstPage,
  isLastPage,
  handleSetPage,
  currentPage,
  isLoading,
}: Props) => (
  <div className="flex mb-3">
    <div className="inline-block mx-auto">
      <AppButton
        disabled={isFirstPage || isLoading}
        onClick={() => handleSetPage(currentPage - 1)}
      >
        Previous
      </AppButton>
      <span className="mx-2">Current page: {currentPage}</span>
      <AppButton
        disabled={isLastPage || isLoading}
        onClick={() => handleSetPage(currentPage + 1)}
      >
        Next
      </AppButton>
    </div>
  </div>
);
