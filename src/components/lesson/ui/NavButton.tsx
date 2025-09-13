import { Button } from '@/components/ui/button';
interface NavButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

export function NavButton({ isActive, onClick, icon, label, count }: NavButtonProps) {
  return (
    <Button 
      onClick={onClick}
      variant="ghost"
      className={`flex items-center justify-between px-3 py-2 rounded-lg w-full text-left transition-colors mb-1 ${
        isActive 
          ? 'bg-white bg-opacity-20 text-white' 
          : 'text-blue-200 hover:bg-white hover:bg-opacity-10 hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center justify-center w-4 h-4 text-current">
          {icon}
        </span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </Button>
  );
}
