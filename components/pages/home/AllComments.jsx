"use client";

import TanstackTableBody from "@/components/common/TanstackTableBody";
import TanstackTableHeader from "@/components/common/TanstackTableHeader";
import { getAllComments } from "@/services/fullData.service";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useReducer } from "react";

const initialState = {
  page: 1,
  limit: 25,
  loading: true,
  totalComments: 100,
  comments: [],
  isError: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_LIMIT":
      return { ...state, limit: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action?.payload };
    case "SET_TOTAL_COMMENTS":
      return { ...state, totalComments: action.payload };
    case "SET_COMMENTS":
      return { ...state, comments: action.payload };
    case "SET_ERROR":
      return { ...state, isError: true, error: action.payload };
    case "RESET_ERROR":
      return { ...state, isError: false, error: null };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    default:
      return state;
  }
};

const AllComments = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { page, limit, loading, totalComments, comments, isError, error } =
    state;

  const fetchComments = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "RESET_ERROR" });

    try {
      const response = await getAllComments(page);

      if (response?.items) {
        dispatch({ type: "SET_COMMENTS", payload: response?.items });
        dispatch({
          type: "SET_TOTAL_COMMENTS",
          payload: response?.pagination?.total_comments,
        });
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.message || "Failed to fetch users.",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [page, limit]);

  /**
   * debouncing fetch codes by useEffect
   */
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchComments();
    }, 500);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [fetchComments]);

  const columns = (pageIndex, pageSize) => [
    {
      id: "sl",
      header: "#",
      cell: ({ row }) => (
        <div className="max-w-[20px] block sm:max-w-xs truncate font-bold">
          {(pageIndex - 1) * pageSize + row.index + 1}
        </div>
      ),
    },
    {
      accessorKey: "comment_text",
      header: "Comment",
      cell: ({ row }) => (
        <a
          href={row?.original?.comment_url ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="max-w-[120px] block cursor-pointer text-blue-500 font-bold truncate"
        >
          {row?.original?.comment_text ?? "-"}
        </a>
      ),
    },
    {
      accessorKey: "comment_likes",
      header: () => <div className="text-center">Comment Likes</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("comment_likes")}</div>
      ),
    },
    {
      accessorKey: "comment_replies",
      header: () => <div className="text-center">Comment Replies</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("comment_replies")}</div>
      ),
    },
    {
      accessorKey: "comment_time",
      header: "Date",
      cell: ({ row }) =>
        row.getValue("comment_time")
          ? dayjs(row.getValue("comment_time")).format("DD MMM, YYYY")
          : "-",
    },
    {
      accessorKey: "virality_score",
      header: () => <div className="text-center">Virality Score</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("virality_score")}</div>
      ),
    },
  ];

  const table = useReactTable({
    data: comments,
    columns: columns(page, limit),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const lastPage = Math.ceil(totalComments / limit);
  /***
   * page change handler for react table
   * @param event
   * @param newPage
   */
  const handlePageChange = (newPage) => {
    if (newPage > lastPage || newPage === 0) return;
    dispatch({ type: "SET_PAGE", payload: Number(newPage) });
  };

  return (
    <div className="mt-3">
      <div className="space-y-2">
        <div className="relative">
          <div className="overflow-auto max-h-[50vh] sm:max-h-96 border rounded-lg">
            <table className="w-full">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-700 z-10">
                <TanstackTableHeader table={table} />
              </thead>
              <tbody>
                <TanstackTableBody
                  table={table}
                  data={comments}
                  loading={loading}
                  error={error}
                  isError={isError}
                  columns={columns(page, limit)}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {limit * (page - 1) + 1} to {limit * (page - 1) + 25} results
        </div>
        <div className="flex flex-row justify-center items-center">
          <button
            type="button"
            className="w-[36px] h-[36px] border border-[#B0B1B7] rounded-l-sm flex justify-center items-center text-[#0D3D4B] cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            className="w-[36px] h-[36px] border border-[#B0B1B7] rounded-r-sm border-l-0 flex justify-center text-[#0D3D4B] items-center cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === lastPage}
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllComments;
