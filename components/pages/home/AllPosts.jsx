"use client";

import TanstackTableBody from "@/components/common/TanstackTableBody";
import TanstackTableHeader from "@/components/common/TanstackTableHeader";
import { getAllPosts } from "@/services/fullData.service";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { debounce } from "lodash";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useReducer } from "react";

const initialState = {
  page: 1,
  limit: 25,
  loading: true,
  totalPosts: 100,
  posts: [],
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
    case "SET_TOTAL_POSTS":
      return { ...state, totalPosts: action.payload };
    case "SET_POSTS":
      return { ...state, posts: action.payload };
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

const AllPosts = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { page, limit, loading, totalPosts, posts, isError, error } = state;

  const fetchPosts = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "RESET_ERROR" });

    try {
      const response = await getAllPosts(page);

      if (response?.items) {
        dispatch({ type: "SET_POSTS", payload: response?.items });
        dispatch({
          type: "SET_TOTAL_POSTS",
          payload: response?.pagination?.total_posts,
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
      fetchPosts();
    }, 500);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [fetchPosts]);

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
      accessorKey: "text",
      header: "Text",
      cell: ({ row }) => (
        <a
          href={row?.original?.post_url ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="max-w-[120px] block cursor-pointer text-blue-500 font-bold truncate"
        >
          {row?.original?.text ?? "-"}
        </a>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row.getValue("category"),
    },
    {
      accessorKey: "emotion",
      header: "Emotion",
      cell: ({ row }) => row.getValue("emotion"),
    },

    {
      accessorKey: "sentiment",
      header: "Sentiment",
      cell: ({ row }) => row.getValue("sentiment"),
    },
    {
      accessorKey: "comment_count",
      header: () => <div className="text-center">Comment Count</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("comment_count")}</div>
      ),
    },
    {
      accessorKey: "reaction_count",
      header: () => <div className="text-center">Reaction Count</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("reaction_count")}</div>
      ),
    },
  ];

  const table = useReactTable({
    data: posts,
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

  const lastPage = Math.ceil(totalPosts / limit);
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
                  data={posts}
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

export default AllPosts;
