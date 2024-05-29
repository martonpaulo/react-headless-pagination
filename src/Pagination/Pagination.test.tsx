import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "./Pagination";
import { IPaginationProps } from "../types/types";

const setupPagination = ({
  currentPage = 5,
  setCurrentPage = () => {},
  className = "",
  truncableText = "...",
  truncableClassName = "",
  totalPages = 10,
  edgePageCount = 1,
  middlePagesSiblingCount = 2,
  children = (
    <>
      <Pagination.PrevButton dataTestId="prev">Previous</Pagination.PrevButton>

      <nav className="flex justify-center flex-grow">
        <ul className="flex items-center">
          <Pagination.PageButton
            dataTestIdActive="active-page-button"
            dataTestIdInactive="inactive-page-button"
            activeClassName=""
            inactiveClassName=""
            className=""
          />
        </ul>
      </nav>

      <Pagination.NextButton dataTestId="next">Next</Pagination.NextButton>
    </>
  ),
}: Partial<IPaginationProps>) =>
  render(
    <Pagination
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      className={className}
      truncableText={truncableText}
      truncableClassName={truncableClassName}
      totalPages={totalPages}
      edgePageCount={edgePageCount}
      middlePagesSiblingCount={middlePagesSiblingCount}
    >
      {children}
    </Pagination>,
  );

describe("Pagination", () => {
  it("renders correctly with basic setup of prevButton, pageButton and nextButton", () => {
    const { asFragment } = setupPagination({});

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correctly with different truncable text", () => {
    const { asFragment } = setupPagination({
      truncableText: "---",
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correctly with advanced setup of prevButton, pageButton and nextButton using Tailwind", () => {
    const { asFragment } = setupPagination({
      className: "flex items-center w-full h-10 text-sm select-none",
      truncableClassName: "w-10 px-0.5 text-center",
      children: (
        <>
          <Pagination.PrevButton className="flex items-center mr-2 text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none">
            <FiArrowLeft size={20} className="mr-3" />
            Previous
          </Pagination.PrevButton>

          <nav className="flex justify-center flex-grow">
            <ul className="flex items-center">
              <Pagination.PageButton
                activeClassName="bg-primary-50 dark:bg-opacity-0 text-primary-600 dark:text-white"
                inactiveClassName="text-gray-500"
                className={
                  "flex items-center justify-center h-10 w-10 rounded-full cursor-pointer"
                }
              />
            </ul>
          </nav>

          <Pagination.NextButton className="flex items-center mr-2 text-gray-500 opacity-50 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none">
            Next
            <FiArrowRight size={20} className="ml-3" />
          </Pagination.NextButton>
        </>
      ),
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correctly with custom page button", () => {
    const { asFragment } = setupPagination({
      children: (
        <>
          <Pagination.PrevButton>Previous</Pagination.PrevButton>

          <div className="flex items-center justify-center flex-grow">
            <Pagination.PageButton
              as={<span />}
              dataTestIdActive="page-button-custom"
            />
          </div>

          <Pagination.NextButton>Next</Pagination.NextButton>
        </>
      ),
    });

    expect(asFragment()).toMatchSnapshot();

    const headingElement = screen.getByTestId("page-button-custom");
    expect(headingElement.tagName.toLowerCase()).toEqual("span");
  });

  it("renders correctly with extra page button props", () => {
    const { asFragment } = setupPagination({
      children: (
        <>
          <Pagination.PrevButton>Previous</Pagination.PrevButton>

          <div className="flex items-center justify-center flex-grow">
            <Pagination.PageButton
              as={<span />}
              dataTestIdActive="page-button-extra-props"
              renderExtraProps={(page) => ({
                "aria-label": `Go to page ${page}`,
              })}
            />
          </div>

          <Pagination.NextButton>Next</Pagination.NextButton>
        </>
      ),
    });

    expect(asFragment()).toMatchSnapshot();

    const pageBtnElem = screen.getByTestId("page-button-extra-props");
    expect(pageBtnElem.getAttribute("aria-label")).toContain("Go to page");
  });

  it("clicking on previous calls mockSetCurrentPage with currentPage - 1", () => {
    const mockSetCurrentPage = jest.fn();

    setupPagination({
      currentPage: 4,
      totalPages: 5,
      setCurrentPage: mockSetCurrentPage,
    });

    expect(screen.getByTestId("active-page-button").textContent).toEqual("5");

    screen.getByTestId("prev").click();

    expect(mockSetCurrentPage).toHaveBeenCalledWith(3);
  });

  it("clicking on next calls mockSetCurrentPage with currentPage + 1", () => {
    const mockSetCurrentPage = jest.fn();

    setupPagination({
      currentPage: 1,
      totalPages: 5,
      setCurrentPage: mockSetCurrentPage,
    });

    expect(screen.getByTestId("active-page-button").textContent).toEqual("2");

    screen.getByTestId("next").click();

    expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
  });

  it("clicking on current page calls mockSetCurrentPage with currentPage", () => {
    const mockSetCurrentPage = jest.fn();

    setupPagination({
      currentPage: 5,
      totalPages: 10,
      setCurrentPage: mockSetCurrentPage,
    });

    expect(screen.getByTestId("active-page-button").textContent).toEqual("6");

    screen.getByTestId("inactive-page-button-10").click();

    expect(mockSetCurrentPage).toHaveBeenCalledWith(9);
  });

  it("pressing enter when focused on page button fires setCurrentPage", () => {
    const mockSetCurrentPage = jest.fn();

    setupPagination({
      currentPage: 5,
      totalPages: 10,
      setCurrentPage: mockSetCurrentPage,
    });

    const pageButton4 = screen.getByText("4");
    pageButton4.focus();

    fireEvent.keyPress(pageButton4, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });

    expect(mockSetCurrentPage).toHaveBeenCalledWith(3);
  });
});
