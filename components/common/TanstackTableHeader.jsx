import { flexRender } from "@tanstack/react-table";

const TanstackTableHeader = ({ table }) => {
  return (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="border-b">
          {headerGroup.headers.map((header, index) => (
            <th
              key={header.id}
              className={`${
                index === 0
                  ? "sticky left-0 bg-slate-50 dark:bg-slate-700 p-2 sm:p-3 text-left font-medium border-r z-20 w-[20px] whitespace-nowrap"
                  : "p-2 sm:p-3 text-left font-medium min-w-[100px] whitespace-nowrap"
              }`}
              style={{
                left: index === 0 ? 0 : undefined,
                zIndex: index === 0 ? 30 : 20,
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </th>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TanstackTableHeader;
