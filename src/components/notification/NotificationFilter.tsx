import { Button } from "@/components/ui/button";

interface NotificationFilterProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  unreadCount: number;
}

export function NotificationFilter({ selectedFilter, onFilterChange, unreadCount }: NotificationFilterProps) {
  return (
    <div className="flex space-x-2 mb-4">
      <Button 
        variant={selectedFilter === "TAT_CA" ? "default" : "outline"}
        onClick={() => onFilterChange("TAT_CA")}
        className="text-sm"
      >
        Tất cả
      </Button>
      <Button 
        variant={selectedFilter === "CHUA_DOC" ? "default" : "outline"}
        onClick={() => onFilterChange("CHUA_DOC")}
        className="text-sm flex items-center"
      >
        Chưa đọc
        {unreadCount > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
            {unreadCount}
          </span>
        )}
      </Button>
      <Button 
        variant={selectedFilter === "DA_DOC" ? "default" : "outline"}
        onClick={() => onFilterChange("DA_DOC")}
        className="text-sm"
      >
        Đã đọc
      </Button>
    </div>
  );
}